from pydantic import BaseModel
from datetime import datetime


class ResumeResponse(BaseModel):
    id: int
    job_id: int
    file_name: str
    parsed_data: dict | None
    created_at: datetime

    class Config:
        from_attributes = True
