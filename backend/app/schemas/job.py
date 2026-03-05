from pydantic import BaseModel
from datetime import datetime


class JobCreate(BaseModel):
    title: str
    description: str
    required_skills: list[str] = []
    experience_level: str | None = None
    qualifications: str | None = None


class JobUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    required_skills: list[str] | None = None
    experience_level: str | None = None
    qualifications: str | None = None


class JobResponse(BaseModel):
    id: int
    recruiter_id: int
    title: str
    description: str
    required_skills: list[str]
    experience_level: str | None
    qualifications: str | None
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True
