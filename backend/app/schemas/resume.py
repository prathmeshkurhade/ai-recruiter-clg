from pydantic import BaseModel
from datetime import datetime


class ResumeResponse(BaseModel):
    id: int
    job_id: int
    file_name: str
    parsed_data: dict | None
    raw_text: str | None
    decision_node: str | None
    intel_notes: str | None
    created_at: datetime

    class Config:
        from_attributes = True

class ResumePatchDecision(BaseModel):
    decision_node: str

class ResumePatchIntel(BaseModel):
    intel_notes: str
