import json
import logging
from app.services.llm_ranker import _get_client
from app.config import settings

logger = logging.getLogger(__name__)

def chat_with_resume(raw_text: str, user_prompt: str) -> str:
    """Chat with a candidate's resume using Groq."""
    if not raw_text:
        return "No resume text available for this candidate."
        
    try:
        client = _get_client()
    except RuntimeError as e:
        logger.warning("LLM chat skipped: %s", e)
        return "Chat feature is currently unavailable (API key missing)."
        
    system_prompt = f"""You are an AI recruitment assistant. You are answering questions from a recruiter about a candidate's resume.
Be concise, helpful, and reference specific facts from the resume. If the answer is not in the resume, clearly state that.

--- CANDIDATE RESUME ---
{raw_text[:8000]}
------------------------"""

    try:
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": "You are a helpful recruitment assistant."},
                {"role": "user", "content": system_prompt + f"\n\nRecruiter Question: {user_prompt}"},
            ],
            temperature=0.3,
            max_tokens=500
        )
        return response.choices[0].message.content or "No response generated."
    except Exception as e:
        logger.exception("LLM chat failed: %s", e)
        return f"Error communicating with AI: {str(e)}"


def draft_candidate_email(candidate_name: str, job_title: str, decision_node: str, llm_reason: str) -> dict:
    """Draft an automated email to a candidate based on their decision node."""
    try:
        client = _get_client()
    except RuntimeError as e:
        logger.warning("LLM email drafting skipped: %s", e)
        return {"subject": "Update on your application", "body": "Could not generate email."}

    context = ""
    if decision_node == "ENGAGE_FAST_TRACK":
        context = "We are very impressed and want to invite them to a final interview. Tone: enthusiastic."
    elif decision_node == "TECHNICAL_ASSESS":
        context = "We want them to complete a technical assessment next. Tone: encouraging and professional."
    elif decision_node == "ARCHIVE_VECTOR" or decision_node == "REJECTED":
        context = "We are rejecting them for this role but keeping them on file. Tone: polite and constructive."
    else:
        context = "We are still reviewing their application. Tone: polite and informative."

    prompt = f"""You are drafting an email from the hiring team for the '{job_title}' role to the candidate named '{candidate_name}'.

Decision Context: {context}
AI Evaluation Reason: {llm_reason}

Draft a highly personalized, professional email. Do not use placeholders like [Your Name]. Sign off as "The Hiring Team". 
If the decision is a rejection, use the AI Evaluation Reason constructively. If it's a fast-track, highlight what impressed us from the reason.

Return ONLY a JSON object with this exact structure:
{{
  "subject": "The email subject line",
  "body": "The full email body text with appropriate line breaks"
}}
"""

    try:
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": "You are an expert HR communicator. Always respond with valid JSON only."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.4,
            response_format={"type": "json_object"}
        )
        raw = response.choices[0].message.content or "{}"
        data = json.loads(raw)
        return {
            "subject": data.get("subject", "Application Update"),
            "body": data.get("body", "Please contact us for an update on your application.")
        }
    except Exception as e:
        logger.exception("LLM email drafting failed: %s", e)
        return {"subject": "Application Update", "body": f"Error generating email: {str(e)}"}
