from app.services.duplicate_detection.embedder import (
    generate_embedding
)

from app.services.duplicate_detection.similarity import (
    calculate_similarity
)


def match_heis(
    problem: str,
    heis: list[str]
):

    problem_embedding = generate_embedding(problem)

    results = []

    for hei in heis:

        hei_embedding = generate_embedding(hei)

        score = calculate_similarity(
            problem_embedding,
            hei_embedding
        )

        results.append({
            "candidate": hei,
            "similarity_score": score
        })

    results.sort(
        key=lambda x: x["similarity_score"],
        reverse=True
    )

    for index, result in enumerate(results, start=1):
        result["rank"] = index

    return results