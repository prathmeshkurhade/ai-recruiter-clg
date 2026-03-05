import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.config import settings
from app.schemas.resume import ResumeResponse
from app.models.resume import Resume
from app.models.job import JobDescription
from app.utils.dependencies import get_current_user
from app.models.user import User
from app.services.resume_parser import parse_resume
from app.services.nlp_processor import extract_skills
from app.services.embedding_service import generate_embedding

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
