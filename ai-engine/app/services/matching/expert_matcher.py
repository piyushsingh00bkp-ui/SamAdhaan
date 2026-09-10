from app.services.duplicate_detection.embedder import (
    generate_embedding
)

from app.services.duplicate_detection.similarity import (
    calculate_similarity
)


def match_experts(
    problem: str,
    experts: list[str]
):

    problem_embedding = generate_embedding(problem)

    results = []

    for expert in experts:

        expert_embedding = generate_embedding(expert)

        score = calculate_similarity(
            problem_embedding,
            expert_embedding
        )

        results.append({
            "candidate": expert,
            "similarity_score": score
        })

    results.sort(
        key=lambda x: x["similarity_score"],
        reverse=True
    )

    for index, result in enumerate(results, start=1):
        result["rank"] = index

    return results