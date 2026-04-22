from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class MatchResult(Base):
    __tablename__ = "match_results"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("job_descriptions.id"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)
    similarity_score = Column(Float, nullable=False)
    skill_matches = Column(JSON, nullable=True)  # {matched: [...], missing: [...]}
    llm_score = Column(Float, nullable=True)
    llm_reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    job = relationship("JobDescription", back_populates="match_results")
    resume = relationship("Resume", back_populates="match_results")
