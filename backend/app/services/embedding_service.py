"""Embedding generation service using Sentence-Transformers."""

import re

import numpy as np
from sentence_transformers import SentenceTransformer

from app.config import settings

_model = None

# mpnet-base supports up to 384 tokens, but we chunk at ~200 words
# to ensure no information is lost from long resumes.
CHUNK_WORD_LIMIT = 200


def get_model() -> SentenceTransformer:
    """Lazy-load the sentence transformer model."""
    global _model
    if _model is None:
        _model = SentenceTransformer(settings.EMBEDDING_MODEL)
    return _model


def _preprocess(text: str) -> str:
    """Strip noise (emails, URLs, phone numbers, extra whitespace) before embedding."""
    text = re.sub(r"http\S+|www\.\S+", " ", text)
    text = re.sub(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", " ", text)
    text = re.sub(r"[\+]?[\d\s\-\(\)]{7,15}", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def _extract_sections(text: str) -> str:
    """Reorder text to prioritize key resume sections (skills, experience, education).

    Moves important sections to the front so they aren't lost if the text
    is long. Falls back to the original text if no sections are detected.
    """
    section_patterns = [
        r"(?i)(skills?|technical skills?|core competenc(?:ies|y))[\s:]*(.+?)(?=\n[A-Z]|\Z)",
        r"(?i)(experience|work experience|professional experience)[\s:]*(.+?)(?=\n[A-Z]|\Z)",
        r"(?i)(education|academic|qualifications?)[\s:]*(.+?)(?=\n[A-Z]|\Z)",
    ]

    prioritized = []
    for pattern in section_patterns:
        matches = re.findall(pattern, text, re.DOTALL)
        for match in matches:
            prioritized.append(match[1].strip())

    if prioritized:
        # Put key sections first, then the full text
        return " ".join(prioritized) + " " + text

    return text


def _chunk_text(text: str) -> list[str]:
    """Split text into overlapping chunks to avoid truncation.

    Each chunk is roughly CHUNK_WORD_LIMIT words, with a 20% overlap
    so context isn't lost at chunk boundaries.
    """
    words = text.split()

    if len(words) <= CHUNK_WORD_LIMIT:
        return [text]

    chunks = []
    overlap = CHUNK_WORD_LIMIT // 5  # 20% overlap
    start = 0

    while start < len(words):
        end = start + CHUNK_WORD_LIMIT
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start = end - overlap

    return chunks


def generate_embedding(text: str) -> list[float]:
    """Generate a semantic embedding vector for the given text.

    For long texts, splits into overlapping chunks and averages the
    embeddings so no information is lost to truncation.
    """
    model = get_model()
    cleaned = _preprocess(text)
    enhanced = _extract_sections(cleaned)
    chunks = _chunk_text(enhanced)

    if len(chunks) == 1:
        embedding = model.encode(chunks[0])
        return embedding.tolist()

    # Encode all chunks and average
    chunk_embeddings = model.encode(chunks)
    avg_embedding = np.mean(chunk_embeddings, axis=0)
    # Normalize to unit vector (important for cosine similarity)
    norm = np.linalg.norm(avg_embedding)
    if norm > 0:
        avg_embedding = avg_embedding / norm
    return avg_embedding.tolist()


def generate_embeddings_batch(texts: list[str]) -> list[list[float]]:
    """Generate embeddings for a batch of texts."""
    return [generate_embedding(t) for t in texts]
