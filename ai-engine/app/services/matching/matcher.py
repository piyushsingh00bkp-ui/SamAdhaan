from app.services.duplicate_detection.embedder import (
    generate_embedding
)

from app.services.duplicate_detection.similarity import (
    calculate_similarity
)

from app.services.matching.ranking import (
    rank_matches
)


def match_candidates(
    problem: str,
    candidates: list[str]
):

    if not problem or not problem.strip():
        raise ValueError("Problem description cannot be empty.")

    if not candidates:
        raise ValueError("Candidates cannot be empty.")

    problem_embedding = generate_embedding(problem)

    matches = []

    for candidate in candidates:

        candidate_embedding = generate_embedding(
            candidate
        )

        score = calculate_similarity(
            problem_embedding,
            candidate_embedding
        )

        matches.append({
            "candidate": candidate,
            "similarity_score": score
        })

    return rank_matches(matches)