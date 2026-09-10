from app.services.duplicate_detection.embedder import (
    generate_embedding
)

from app.services.duplicate_detection.similarity import (
    calculate_similarity
)


def match_industries(
    problem: str,
    industries: list[str]
):

    problem_embedding = generate_embedding(problem)

    results = []

    for industry in industries:

        industry_embedding = generate_embedding(industry)

        score = calculate_similarity(
            problem_embedding,
            industry_embedding
        )

        results.append({
            "candidate": industry,
            "similarity_score": score
        })

    results.sort(
        key=lambda x: x["similarity_score"],
        reverse=True
    )

    for index, result in enumerate(results, start=1):
        result["rank"] = index

    return results