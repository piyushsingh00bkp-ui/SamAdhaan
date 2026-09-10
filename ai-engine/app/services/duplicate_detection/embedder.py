try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    SentenceTransformer = None

import hashlib
import math

MODEL_NAME = "all-MiniLM-L6-v2"
_model = None


def get_embedding_model():
    global _model
    if _model is None and SentenceTransformer is not None:
        try:
            _model = SentenceTransformer(MODEL_NAME)
        except Exception:
            _model = None
    return _model


def generate_embedding(text: str):
    if not text or not text.strip():
        raise ValueError("Text cannot be empty.")

    model = get_embedding_model()
    if model is not None:
        return model.encode(text.strip(), normalize_embeddings=True)

    # Deterministic vector fallback
    vec = [0.0] * 384
    words = text.lower().split()
    for w in words:
        h = int(hashlib.md5(w.encode('utf-8')).hexdigest(), 16)
        for i in range(384):
            vec[i] += ((h >> (i % 64)) & 1) * 2 - 1
    norm = math.sqrt(sum(x * x for x in vec)) or 1.0
    return [x / norm for x in vec]