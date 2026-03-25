from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.settings import UserSettings
from app.models.audit_log import AuditLog
from app.models.user import User
from app.utils.dependencies import get_current_user
from pydantic import BaseModel

router = APIRouter()

class SettingsUpdate(BaseModel):
    identity_masking: bool
    zero_knowledge: bool
    bias_suppression: bool

@router.get("/preferences")
def get_preferences(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("/preferences")
def update_preferences(data: SettingsUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)
    settings.identity_masking = data.identity_masking
    settings.zero_knowledge = data.zero_knowledge
    settings.bias_suppression = data.bias_suppression
    db.commit()
    return {"message": "Preferences updated"}

@router.get("/logs")
def get_audit_logs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user), limit: int = 50):
    logs = db.query(AuditLog).filter(AuditLog.recruiter_id == current_user.id).order_by(AuditLog.timestamp.desc()).limit(limit).all()
    # Format into dict with MS
    return [
       {
           "timestamp": log.timestamp.strftime("%H:%M:%S.%f")[:-3],
           "event": log.action,
           "entity": log.entity_ref,
           "status": log.status
       } for log in logs
    ]
