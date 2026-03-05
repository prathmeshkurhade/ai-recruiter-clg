from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    required_skills = Column(JSON, default=list)
    experience_level = Column(String, nullable=True)
    qualifications = Column(Text, nullable=True)
    embedding = Column(JSON, nullable=True)  # stored as list of floats
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    recruiter = relationship("User", back_populates="jobs")
    resumes = relationship("Resume", back_populates="job")
    match_results = relationship("MatchResult", back_populates="job")
