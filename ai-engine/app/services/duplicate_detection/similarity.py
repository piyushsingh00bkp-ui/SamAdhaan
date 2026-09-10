try:
    import numpy as np
    from sklearn.metrics.pairwise import cosine_similarity
except ImportError:
    np = None
    cosine_similarity = None

import math


def calculate_similarity(
    embedding_a,
    embedding_b
) -> float:
    if cosine_similarity is not None and np is not None:
        ea = np.array(embedding_a).reshape(1, -1)
        eb = np.array(embedding_b).reshape(1, -1)
        score = cosine_similarity(ea, eb)[0][0]
    else:
        dot = sum(float(a) * float(b) for a, b in zip(embedding_a, embedding_b))
        na = math.sqrt(sum(float(a) * float(a) for a in embedding_a)) or 1.0
        nb = math.sqrt(sum(float(b) * float(b) for b in embedding_b)) or 1.0
        score = dot / (na * nb)

    # Convert cosine similarity from [-1, 1] to [0, 1]
    normalized_score = (float(score) + 1.0) / 2.0

    # Protect against floating-point edge cases
    normalized_score = max(
        0.0,
        min(1.0, normalized_score)
    )

    return round(normalized_score, 4)