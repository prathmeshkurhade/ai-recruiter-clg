"""LLM-based candidate re-ranker using Groq (Llama 3.3 70B).

Takes a shortlist of candidates (pre-filtered by embedding similarity) and asks
the LLM to rank them holistically — reasoning about quantities, ratings, and
proficiency levels that embedding models cannot capture.
"""

import json
import logging
import re

from groq import Groq

from app.config import settings

logger = logging.getLogger(__name__)

_client: Groq | None = None


def _get_client() -> Groq:
    global _client
    if _client is None:
        if not settings.GROQ_API_KEY:
            raise RuntimeError("GROQ_API_KEY is not set")
        _client = Groq(api_key=settings.GROQ_API_KEY)
    return _client


def _build_prompt(job_description: str, job_skills: list[str], candidates: list[dict]) -> str:
    skills_line = ", ".join(job_skills) if job_skills else "(none specified)"

    candidate_blocks = []
    for c in candidates:
        text = (c.get("raw_text") or "").strip()
        if len(text) > 6000:
            text = text[:6000] + "\n...[truncated]"
        candidate_blocks.append(
            f"--- CANDIDATE id={c['id']} ---\n{text}\n--- END CANDIDATE {c['id']} ---"
        )
    candidates_text = "\n\n".join(candidate_blocks)

    return f"""You are an expert technical recruiter. Rank the following candidates strictly against the job description.

JOB DESCRIPTION:
{job_description}

REQUIRED SKILLS: {skills_line}

CANDIDATES:
{candidates_text}

RANKING RULES — READ CAREFULLY:

1. IDENTIFY THE CORE REQUIREMENT first. If the JD asks for "competitive programmer", the ONLY thing that matters is competitive programming strength. Web dev / backend / internships / other projects are IRRELEVANT for ranking — do NOT let them influence scores.

2. SCAN THE ENTIRE RESUME for CP signals — including the Achievements section at the bottom, not just the profile summary. A candidate who puts CP achievements at the end is NOT weaker than one who puts them at the top. Raw numbers beat framing.

3. For COMPETITIVE PROGRAMMING roles, use this EXACT hierarchy (higher = better):
   - Codeforces: Grandmaster > Candidate Master > Expert > Specialist > Pupil > Newbie > (no rating)
   - CodeChef stars: 7★ > 6★ > 5★ > 4★ > 3★ > 2★ > 1★ > (no rating)
   - Leetcode: Guardian > Knight > (no badge)
   - Problems solved: more is better (1000+ > 500+ > 300+ > 100+)
   - Contest finalist / ICPC / Codemania wins = bonus
   Compare candidates axis-by-axis. The candidate with the highest ratings across the MOST axes wins.

4. IGNORE resume aesthetics, profile summaries, tech stack keywords, and internship titles when the JD is purely CP-focused. A "Software Engineer Intern" with Codeforces Specialist + Leetcode Knight + 3-Star CodeChef + Knight(1861) BEATS a "Full-stack developer" with only 2-Star CodeChef and no Codeforces — regardless of how the profiles are framed.

5. Do NOT penalize a candidate just because CP is mentioned briefly. Read the numbers.

6. Return ONLY valid JSON. No markdown, no code fences, no prose.

OUTPUT FORMAT (strict JSON):
{{
  "rankings": [
    {{"id": <candidate_id>, "score": <0-100 integer>, "reason": "<one short sentence citing the specific CP credentials that drove the score>"}}
  ]
}}

Include every candidate. Sort by score descending. Be decisive — if one candidate has clearly stronger CP credentials on raw numbers, they get the top score even if their resume is framed around other topics."""


def _extract_json(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError(f"No JSON object found in LLM response: {text[:200]}")
    return json.loads(match.group(0))


def rerank_with_llm(
    job_description: str,
    job_skills: list[str],
    candidates: list[dict],
) -> dict[int, dict]:
    """Call Groq to rank candidates. Returns dict keyed by candidate id.

    Each value: {"score": 0-1 float, "reason": str}.
    On any failure, returns an empty dict so the caller can fall back to embeddings.
    """
    if not candidates:
        return {}

    try:
        client = _get_client()
    except RuntimeError as e:
        logger.warning("LLM rerank skipped: %s", e)
        return {}

    prompt = _build_prompt(job_description, job_skills, candidates)

    try:
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": "You are an expert technical recruiter. Always respond with valid JSON only."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
            response_format={"type": "json_object"},
        )
        raw = response.choices[0].message.content or ""
        data = _extract_json(raw)
    except Exception as e:
        logger.exception("LLM rerank failed: %s", e)
        return {}

    out: dict[int, dict] = {}
    for entry in data.get("rankings", []):
        try:
            cid = int(entry["id"])
            score = float(entry["score"]) / 100.0
            score = max(0.0, min(1.0, score))
            out[cid] = {"score": score, "reason": str(entry.get("reason", ""))[:500]}
        except (KeyError, TypeError, ValueError):
            continue
    return out
