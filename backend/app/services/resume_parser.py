"""Resume parsing service - extracts text and structured data from PDF/DOCX files."""

import re
import pdfplumber
from docx import Document


def extract_text_from_pdf(file_path: str) -> str:
    """Extract raw text from a PDF file."""
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()


def extract_text_from_docx(file_path: str) -> str:
    """Extract raw text from a DOCX file."""
    doc = Document(file_path)
    return "\n".join(para.text for para in doc.paragraphs if para.text.strip())


def extract_text(file_path: str) -> str:
    """Extract text from a resume file based on its extension."""
    if file_path.lower().endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    elif file_path.lower().endswith((".docx", ".doc")):
        return extract_text_from_docx(file_path)
    else:
        raise ValueError(f"Unsupported file format: {file_path}")


def extract_email(text: str) -> str | None:
    """Extract email address from text."""
    match = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
    return match.group(0) if match else None


def extract_phone(text: str) -> str | None:
    """Extract phone number from text."""
    match = re.search(r"[\+]?[\d\s\-\(\)]{10,15}", text)
    return match.group(0).strip() if match else None


def parse_resume(file_path: str) -> dict:
    """Parse a resume file and extract structured data."""
    raw_text = extract_text(file_path)
    return {
        "raw_text": raw_text,
        "email": extract_email(raw_text),
        "phone": extract_phone(raw_text),
        # TODO: add NLP-based skill extraction, name extraction, education, experience
    }
