"""Embedding generation service using Sentence-Transformers."""

import re

import numpy as np
from sentence_transformers import SentenceTransformer

from app.config import settings

_model = None

# mpnet-base supports up to 384 tokens; we chunk at ~200 words
# to ensure no information is lost from long resumes.
CHUNK_WORD_LIMIT = 200


def get_model() -> SentenceTransformer:
    """Lazy-load the sentence transformer model."""
    global _model
    if _model is None:
        _model = SentenceTransformer(settings.EMBEDDING_MODEL)
    return _model


def _preprocess(text: str) -> str:
    """Strip noise (emails, URLs) before embedding.

    Keeps numbers intact — values like '1000+ problems' or '9.09 CGPA'
    carry meaningful signal for ranking.
    """
    text = re.sub(r"http\S+|www\.\S+", " ", text)
    text = re.sub(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", " ", text)
    # Only strip standalone phone-like patterns (10+ digits with separators)
    text = re.sub(r"(?<!\w)[\+]?\d[\d\s\-\(\)]{9,14}\d(?!\w)", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


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


def _embed_chunks(chunks: list[str]) -> list[float]:
    """Encode chunks and return a single normalized averaged embedding."""
    model = get_model()

    if len(chunks) == 1:
        embedding = model.encode(chunks[0])
        return embedding.tolist()

    chunk_embeddings = model.encode(chunks)
    avg_embedding = np.mean(chunk_embeddings, axis=0)
    # Normalize to unit vector (important for cosine similarity)
    norm = np.linalg.norm(avg_embedding)
    if norm > 0:
        avg_embedding = avg_embedding / norm
    return avg_embedding.tolist()


def generate_embedding(text: str) -> list[float]:
    """Generate a semantic embedding for resume or generic text."""
    cleaned = _preprocess(text)
    chunks = _chunk_text(cleaned)
    return _embed_chunks(chunks)


def generate_job_embedding(description: str, required_skills: list[str] | None = None) -> list[float]:
    """Generate embedding for a job description.

    Prepends required skills to the description so the embedding
    captures what the job actually needs — not just the prose.
    """
    parts = []
    if required_skills:
        parts.append("Required skills: " + ", ".join(required_skills))
    parts.append(description)
    combined = " ".join(parts)
    cleaned = _preprocess(combined)
    chunks = _chunk_text(cleaned)
    return _embed_chunks(chunks)


def generate_embeddings_batch(texts: list[str]) -> list[list[float]]:
    """Generate embeddings for a batch of texts."""
    return [generate_embedding(t) for t in texts]
