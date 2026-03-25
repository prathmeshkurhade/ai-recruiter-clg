from sqlalchemy import Column, Integer, ForeignKey, Boolean
from app.database import Base

class UserSettings(Base):
    __tablename__ = "user_settings"
    
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    identity_masking = Column(Boolean, default=True)
    zero_knowledge = Column(Boolean, default=True)
    bias_suppression = Column(Boolean, default=True)
    stringency_level = Column(Integer, default=70)
