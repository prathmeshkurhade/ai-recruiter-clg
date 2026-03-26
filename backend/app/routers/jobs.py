from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.job import JobCreate, JobUpdate, JobResponse
from app.models.job import JobDescription
from app.utils.dependencies import get_current_user
from app.models.user import User

router = APIRouter()


@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    job_data: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from app.services.embedding_service import generate_job_embedding
    from app.services.nlp_processor import extract_skills

    job = JobDescription(recruiter_id=current_user.id, **job_data.model_dump())

    # Auto-extract skills from description if none were provided
    if not job.required_skills:
        job.required_skills = extract_skills(job_data.description)

    job.embedding = generate_job_embedding(job_data.description, job.required_skills)
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.get("/", response_model=list[JobResponse])
def list_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(JobDescription).filter(JobDescription.recruiter_id == current_user.id).all()


@router.get("/{job_id}", response_model=JobResponse)
def get_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(JobDescription).filter(
        JobDescription.id == job_id,
        JobDescription.recruiter_id == current_user.id,
    ).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    job_data: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(JobDescription).filter(
        JobDescription.id == job_id,
        JobDescription.recruiter_id == current_user.id,
    ).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    for field, value in job_data.model_dump(exclude_unset=True).items():
        setattr(job, field, value)

    db.commit()
    db.refresh(job)
    return job


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(JobDescription).filter(
        JobDescription.id == job_id,
        JobDescription.recruiter_id == current_user.id,
    ).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    db.delete(job)
    db.commit()
