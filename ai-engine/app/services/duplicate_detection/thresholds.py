DUPLICATE_THRESHOLD = 0.80
RELATED_THRESHOLD = 0.60


def classify_similarity(score: float) -> str:

    if score >= DUPLICATE_THRESHOLD:
        return "DUPLICATE"

    if score >= RELATED_THRESHOLD:
        return "RELATED"

    return "NEW"