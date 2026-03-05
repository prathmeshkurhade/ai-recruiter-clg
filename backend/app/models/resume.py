from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("job_descriptions.id"), nullable=False)
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    raw_text = Column(Text, nullable=True)
    parsed_data = Column(JSON, nullable=True)  # {name, email, phone, skills, education, experience}
    embedding = Column(JSON, nullable=True)  # stored as list of floats
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    job = relationship("JobDescription", back_populates="resumes")
    match_results = relationship("MatchResult", back_populates="resume")
