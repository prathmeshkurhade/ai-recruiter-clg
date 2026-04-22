from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.match_result import MatchResultResponse
from app.models.match_result import MatchResult
from app.models.job import JobDescription
from app.models.resume import Resume
from app.utils.dependencies import get_current_user
from app.models.user import User
from app.models.audit_log import AuditLog
from app.services.matching_service import rank_candidates
from app.services.embedding_service import generate_embedding
from app.models.settings import UserSettings
from app.utils.masking import apply_identity_mask

router = APIRouter()


@router.post("/{job_id}/run", response_model=list[MatchResultResponse])
def run_matching(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Trigger matching for all resumes against a job description."""
    job = db.query(JobDescription).filter(
        JobDescription.id == job_id,
        JobDescription.recruiter_id == current_user.id,
    ).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Generate JD embedding if missing
    if not job.embedding:
        job.embedding = generate_embedding(job.description)
        db.commit()

    # Get all resumes with embeddings for this job
    resumes = db.query(Resume).filter(Resume.job_id == job_id, Resume.embedding.isnot(None)).all()
    if not resumes:
        raise HTTPException(status_code=400, detail="No parsed resumes found. Upload resumes first.")

    resume_data = [
        {"id": r.id, "embedding": r.embedding, "raw_text": r.raw_text or ""}
        for r in resumes
    ]

    # Run ranking (stage 1: embeddings, stage 2: Gemini re-rank)
    ranked = rank_candidates(
        job.embedding,
        job.required_skills or [],
        resume_data,
        job_description=job.description,
    )

    # Clear old results for this job and save new ones
    db.query(MatchResult).filter(MatchResult.job_id == job_id).delete()

    results = []
    for entry in ranked:
        resume = next(r for r in resumes if r.id == entry["resume_id"])
        match = MatchResult(
            job_id=job_id,
            resume_id=entry["resume_id"],
            similarity_score=entry["similarity_score"],
            skill_matches=entry["skill_matches"],
            llm_score=entry.get("llm_score"),
            llm_reason=entry.get("llm_reason"),
        )
        db.add(match)

        log = AuditLog(
            recruiter_id=current_user.id,
            action="Job Model Updated",
            entity_ref=f"RESUME_{entry['resume_id']}",
            status="SYNCED"
        )
        db.add(log)

        db.commit()
        db.refresh(match)

        # Attach candidate info for response
        match.candidate_name = resume.parsed_data.get("name") if resume.parsed_data else None
        match.candidate_email = resume.parsed_data.get("email") if resume.parsed_data else None
        results.append(match)

    return results


@router.get("/{job_id}/results", response_model=list[MatchResultResponse])
def get_results(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get ranked match results for a job."""
    results = db.query(MatchResult).filter(MatchResult.job_id == job_id).order_by(
        MatchResult.similarity_score.desc()
    ).all()

    # Check ethical settings
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    masking_enabled = settings and settings.identity_masking

    # Attach candidate info
    for result in results:
        resume = db.query(Resume).filter(Resume.id == result.resume_id).first()
        if resume and resume.parsed_data:
            is_fast_tracked = resume.decision_node == "ENGAGE_FAST_TRACK"
            if masking_enabled and not is_fast_tracked:
                masked_data, _ = apply_identity_mask(resume.parsed_data, "")
                result.candidate_name = masked_data.get("name")
                result.candidate_email = masked_data.get("email")
            else:
                result.candidate_name = resume.parsed_data.get("name")
                result.candidate_email = resume.parsed_data.get("email")

    return results
