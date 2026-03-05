from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, jobs, resumes, matching

app = FastAPI(
    title="AI Resume Screener",
    description="AI-powered resume screening and job matching system",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Job Descriptions"])
app.include_router(resumes.router, prefix="/api/resumes", tags=["Resumes"])
app.include_router(matching.router, prefix="/api/matching", tags=["Matching"])


@app.get("/")
def root():
    return {"message": "AI Resume Screener API is running"}
