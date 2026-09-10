from app.services.duplicate_detection.embedder import (
    generate_embedding
)

from app.services.duplicate_detection.similarity import (
    calculate_similarity
)

from app.services.duplicate_detection.thresholds import (
    classify_similarity
)


def detect_duplicates(
    problem: str,
    existing_problems: list[str]
):

    if not problem or not problem.strip():
        raise ValueError("Problem description cannot be empty.")

    if not existing_problems:
        raise ValueError(
            "At least one existing complaint is required."
        )

    new_embedding = generate_embedding(problem)

    matches = []

    for existing_problem in existing_problems:

        existing_embedding = generate_embedding(
            existing_problem
        )

        score = calculate_similarity(
            new_embedding,
            existing_embedding
        )

        match_type = classify_similarity(score)

        matches.append({
            "complaint": existing_problem,
            "similarity_score": score,
            "match_type": match_type
        })

    matches.sort(
        key=lambda x: x["similarity_score"],
        reverse=True
    )

    best = matches[0]

    return {
        "is_duplicate": (
            best["match_type"] == "DUPLICATE"
        ),
        "best_match": best["complaint"],
        "similarity_score": best["similarity_score"],
        "match_type": best["match_type"],
        "matches": matches
    }
    