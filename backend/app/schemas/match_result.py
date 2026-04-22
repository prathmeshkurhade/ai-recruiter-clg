from pydantic import BaseModel
from datetime import datetime


class MatchResultResponse(BaseModel):
    id: int
    job_id: int
    resume_id: int
    similarity_score: float
    skill_matches: dict | None
    llm_score: float | None = None
    llm_reason: str | None = None
    candidate_name: str | None = None
    candidate_email: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
