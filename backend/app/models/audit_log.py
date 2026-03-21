from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    action = Column(String, nullable=False)
    entity_ref = Column(String, nullable=False)
    status = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
