def rank_matches(matches: list[dict]) -> list[dict]:

    matches = sorted(
        matches,
        key=lambda x: x["similarity_score"],
        reverse=True
    )

    for index, match in enumerate(matches, start=1):
        match["rank"] = index

    return matches