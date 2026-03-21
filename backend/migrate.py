import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import Base, engine
from app.models.user import User
from app.models.job import JobDescription
from app.models.resume import Resume
from app.models.match_result import MatchResult
from app.models.settings import UserSettings
from app.models.audit_log import AuditLog

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully.")
