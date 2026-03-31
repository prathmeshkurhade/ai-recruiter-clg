import sys
import os

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine
from sqlalchemy import text

def add_columns():
    with engine.begin() as conn:
        try:
            conn.execute(text("ALTER TABLE resumes ADD COLUMN decision_node VARCHAR DEFAULT 'AWAITING_REVIEW';"))
            print("Successfully added 'decision_node' column to production DB.")
        except Exception as e:
            msg = str(e)
            if "already exists" in msg.lower():
                print("'decision_node' already exists. Skipping.")
            else:
                print("Error on decision_node:", getattr(e, "orig", e))

        try:
            conn.execute(text("ALTER TABLE resumes ADD COLUMN intel_notes TEXT;"))
            print("Successfully added 'intel_notes' column to production DB.")
        except Exception as e:
            msg = str(e)
            if "already exists" in msg.lower():
                print("'intel_notes' already exists. Skipping.")
            else:
                print("Error on intel_notes:", getattr(e, "orig", e))

if __name__ == "__main__":
    add_columns()
