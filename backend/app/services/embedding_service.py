"""Embedding generation service using Sentence-Transformers (MiniLM)."""

import re

from sentence_transformers import SentenceTransformer

from app.config import settings

_model = None


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


def generate_embedding(text: str) -> list[float]:
    """Generate a semantic embedding vector for the given text."""
    model = get_model()
    embedding = model.encode(_preprocess(text))
    return embedding.tolist()


def generate_embeddings_batch(texts: list[str]) -> list[list[float]]:
    """Generate embeddings for a batch of texts."""
    model = get_model()
    embeddings = model.encode(texts)
    return [e.tolist() for e in embeddings]
