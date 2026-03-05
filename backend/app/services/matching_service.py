"""Matching service - cosine similarity computation and candidate ranking."""

import re
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from app.services.nlp_processor import extract_skills, normalize_skill


def compute_similarity(job_embedding: list[float], resume_embedding: list[float]) -> float:
    """Compute cosine similarity between a job and resume embedding."""
    job_vec = np.array(job_embedding).reshape(1, -1)
    resume_vec = np.array(resume_embedding).reshape(1, -1)
    score = cosine_similarity(job_vec, resume_vec)[0][0]
    return float(score)


def compute_skill_match(job_skills: list[str], resume_text: str) -> dict:
    """Compare job-required skills against skills found in a resume.

    Uses three strategies:
    1. Normalize both JD skills and resume skills to canonical forms, then compare
    2. Direct substring search — check if the JD skill text appears in the resume
    3. Word boundary regex — catch exact mentions even if not in the skill database
    """
    resume_text_lower = resume_text.lower()

    # Extract skills from resume (variant-aware)
    resume_skills_canonical = set(extract_skills(resume_text))

    matched = []
    missing = []

    for skill in job_skills:
        skill_display = skill.strip()
        skill_lower = skill_display.lower()
        canonical = normalize_skill(skill_lower)

        found = False

        # Strategy 1: canonical form match
        if canonical in resume_skills_canonical:
            found = True

        # Strategy 2: direct substring search of the original skill text
        if not found and skill_lower in resume_text_lower:
            found = True

        # Strategy 3: word boundary regex for the skill as typed
        if not found:
            try:
                pattern = r'\b' + re.escape(skill_lower) + r'\b'
                if re.search(pattern, resume_text_lower):
                    found = True
            except re.error:
                pass

        if found:
            matched.append(skill_display)
        else:
            missing.append(skill_display)

    return {
        "matched": matched,
        "missing": missing,
        "resume_skills": list(resume_skills_canonical),
        "match_ratio": len(matched) / len(job_skills) if job_skills else 0.0,
    }


def rank_candidates(
    job_embedding: list[float],
    job_skills: list[str],
    resumes: list[dict],
) -> list[dict]:
    """
    Rank resumes against a job description.

    Args:
        job_embedding: The job description embedding vector.
        job_skills: List of required skills from the JD.
        resumes: List of dicts with keys: id, embedding, raw_text.

    Returns:
        Sorted list of dicts with: resume_id, similarity_score, skill_matches.
    """
    results = []
    for resume in resumes:
        sim_score = compute_similarity(job_embedding, resume["embedding"])
        skill_match = compute_skill_match(job_skills, resume["raw_text"])

        results.append({
            "resume_id": resume["id"],
            "similarity_score": round(sim_score, 4),
            "skill_matches": skill_match,
        })

    results.sort(key=lambda x: x["similarity_score"], reverse=True)
    return results
