"""Matching service - cosine similarity computation and candidate ranking."""

import re
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from app.config import settings
from app.services.nlp_processor import extract_skills, normalize_skill
from app.services.llm_ranker import rerank_with_llm

# --- Scoring weights ---
SEMANTIC_WEIGHT = 0.60   # cosine similarity (embedding-based)
SKILL_WEIGHT = 0.40      # skill match ratio (keyword-based)

# Cosine similarity from MiniLM rarely exceeds ~0.65 for real-world JD-to-Resume matches,
# so we rescale the raw score to a 0-1 range that feels intuitive.
# Scores below MIN are treated as 0; scores above MAX are treated as 1.
SIM_FLOOR = 0.20
SIM_CEIL = 0.65


def _normalize_sim(raw: float) -> float:
    """Rescale raw cosine similarity to a 0-1 range using floor/ceil."""
    clamped = max(SIM_FLOOR, min(raw, SIM_CEIL))
    return (clamped - SIM_FLOOR) / (SIM_CEIL - SIM_FLOOR)


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
    job_description: str | None = None,
) -> list[dict]:
    """
    Two-stage ranking of resumes against a job description.

    Stage 1 (embeddings + keywords): cheap local score computed for every resume.
    Stage 2 (Gemini re-rank): top-N from stage 1 are sent to the LLM in one
    batched call. The LLM understands proficiency levels (e.g., Codeforces
    ratings, CodeChef stars, problems-solved counts) that embeddings cannot.

    Final score blends the two when the LLM succeeds, or falls back to the
    embedding-only score if the LLM is unavailable.

    Args:
        job_embedding: The job description embedding vector.
        job_skills: List of required skills from the JD.
        resumes: List of dicts with keys: id, embedding, raw_text.
        job_description: The raw JD text (required for LLM re-rank).

    Returns:
        Sorted list of dicts with: resume_id, similarity_score, semantic_score,
        skill_matches, llm_score, llm_reason.
    """
    stage1 = []
    for resume in resumes:
        raw_sim = compute_similarity(job_embedding, resume["embedding"])
        skill_match = compute_skill_match(job_skills, resume["raw_text"])
        norm_sim = _normalize_sim(raw_sim)
        skill_ratio = skill_match["match_ratio"]

        if job_skills:
            combined = (SEMANTIC_WEIGHT * norm_sim) + (SKILL_WEIGHT * skill_ratio)
        else:
            combined = norm_sim

        embedding_score = combined ** 0.5

        stage1.append({
            "resume_id": resume["id"],
            "raw_text": resume["raw_text"],
            "semantic_score": round(norm_sim, 4),
            "embedding_score": round(embedding_score, 4),
            "skill_matches": skill_match,
        })

    # Stage 2: send top-N to Gemini for re-ranking
    stage1.sort(key=lambda x: x["embedding_score"], reverse=True)
    top_n = settings.LLM_RERANK_TOP_N
    shortlist = stage1[:top_n]

    llm_scores: dict[int, dict] = {}
    if job_description and shortlist:
        candidates_for_llm = [
            {"id": c["resume_id"], "raw_text": c["raw_text"]} for c in shortlist
        ]
        llm_scores = rerank_with_llm(job_description, job_skills, candidates_for_llm)

    results = []
    for entry in stage1:
        llm = llm_scores.get(entry["resume_id"])
        if llm:
            final = (
                settings.LLM_WEIGHT * llm["score"]
                + settings.EMBEDDING_WEIGHT * entry["embedding_score"]
            )
            llm_score = round(llm["score"], 4)
            llm_reason = llm["reason"]
        else:
            final = entry["embedding_score"]
            llm_score = None
            llm_reason = None

        results.append({
            "resume_id": entry["resume_id"],
            "similarity_score": round(final, 4),
            "semantic_score": entry["semantic_score"],
            "skill_matches": entry["skill_matches"],
            "llm_score": llm_score,
            "llm_reason": llm_reason,
        })

    results.sort(key=lambda x: x["similarity_score"], reverse=True)
    return results
