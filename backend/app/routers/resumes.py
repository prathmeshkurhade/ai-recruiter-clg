import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.config import settings
from app.schemas.resume import ResumeResponse, ResumePatchDecision, ResumePatchIntel
from app.models.resume import Resume
from app.models.job import JobDescription
from app.utils.dependencies import get_current_user
from app.models.user import User
from app.services.resume_parser import parse_resume
from app.services.nlp_processor import extract_skills
from app.services.embedding_service import generate_embedding
from app.models.audit_log import AuditLog
from app.models.match_result import MatchResult

router = APIRouter()


@router.post("/{job_id}/upload", response_model=list[ResumeResponse], status_code=status.HTTP_201_CREATED)
async def upload_resumes(
    job_id: int,
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upload one or more resume files (PDF/DOCX) for a specific job."""
    job = db.query(JobDescription).filter(
        JobDescription.id == job_id,
        JobDescription.recruiter_id == current_user.id,
    ).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    upload_dir = os.path.join(settings.UPLOAD_DIR, str(job_id))
    os.makedirs(upload_dir, exist_ok=True)

    created_resumes = []
    for file in files:
        file_path = os.path.join(upload_dir, file.filename)
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)

        # Parse resume and generate embedding
        parsed = parse_resume(file_path)
        raw_text = parsed["raw_text"]
        if not raw_text or len(raw_text.strip()) < 20:
            raise HTTPException(
                status_code=400,
                detail=f"Could not extract text from '{file.filename}'. Ensure the PDF is not image-based or corrupted.",
            )
        skills = extract_skills(raw_text)
        embedding = generate_embedding(raw_text)

        resume = Resume(
            job_id=job_id,
            file_name=file.filename,
            file_path=file_path,
            raw_text=raw_text,
            parsed_data={
                "email": parsed["email"],
                "phone": parsed["phone"],
                "skills": skills,
            },
            embedding=embedding,
        )
        db.add(resume)
        
        # Append permanent Real-Time Tracking row
        log = AuditLog(
            recruiter_id=current_user.id,
            action="Embeddings Generated",
            entity_ref=file.filename,
            status="CLEAN_PASS"
        )
        db.add(log)
        
        db.commit()
        db.refresh(resume)
        created_resumes.append(resume)

    return created_resumes


@router.get("/{job_id}", response_model=list[ResumeResponse])
def list_resumes(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all resumes uploaded for a job."""
    return db.query(Resume).filter(Resume.job_id == job_id).all()


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a specific resume."""
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Also verify the job belongs to user
    job = db.query(JobDescription).filter(JobDescription.id == resume.job_id).first()
    if not job or job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    from app.models.match_result import MatchResult
    db.query(MatchResult).filter(MatchResult.resume_id == resume_id).delete()

    db.delete(resume)
    
    # Append Deletion Log
    log = AuditLog(
        recruiter_id=current_user.id,
        action="PII Scrubber Triggered",
        entity_ref=f"RESUME_{resume_id}",
        status="REDACTED"
    )
    db.add(log)
    
    db.commit()
    return {"detail": "Resume deleted"}


@router.patch("/{resume_id}/decision", response_model=ResumeResponse)
def update_decision_node(
    resume_id: int,
    data: ResumePatchDecision,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    job = db.query(JobDescription).filter(JobDescription.id == resume.job_id).first()
    if not job or job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    resume.decision_node = data.decision_node
    db.commit()
    db.refresh(resume)
    return resume


@router.patch("/{resume_id}/intel", response_model=ResumeResponse)
def update_intel_notes(
    resume_id: int,
    data: ResumePatchIntel,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    job = db.query(JobDescription).filter(JobDescription.id == resume.job_id).first()
    if not job or job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    resume.intel_notes = data.intel_notes
    db.commit()
    db.refresh(resume)
    return resume
