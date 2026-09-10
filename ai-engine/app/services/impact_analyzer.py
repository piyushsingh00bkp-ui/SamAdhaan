def analyze_impacts(
    problem: str,
    category: str
) -> dict:
    """
    Automatically estimate economic, health, and environmental
    impact from a civic complaint.

    This is a prototype rule-based analyzer.
    It is not a scientifically validated AI model.
    """

    text = f"{problem} {category}".lower()

    economic_score = 25
    health_score = 25
    environmental_score = 25

    # -------------------------
    # HEALTH IMPACT
    # -------------------------

    health_keywords = [
        "drinking water",
        "contaminated water",
        "disease",
        "hospital",
        "medical",
        "health",
        "sewage",
        "garbage",
        "pollution",
        "accident",
        "injury",
        "fire",
        "flood"
    ]

    for keyword in health_keywords:
        if keyword in text:
            health_score += 15

    # -------------------------
    # ECONOMIC IMPACT
    # -------------------------

    economic_keywords = [
        "business",
        "market",
        "shop",
        "factory",
        "farmer",
        "crop",
        "traffic",
        "road blocked",
        "transport",
        "income",
        "job",
        "livelihood",
        "damaged",
        "closed"
    ]

    for keyword in economic_keywords:
        if keyword in text:
            economic_score += 15

    # -------------------------
    # ENVIRONMENTAL IMPACT
    # -------------------------

    environmental_keywords = [
        "pollution",
        "waste",
        "garbage",
        "sewage",
        "chemical",
        "smoke",
        "forest",
        "tree",
        "water pollution",
        "air pollution",
        "flood",
        "waterlogging"
    ]

    for keyword in environmental_keywords:
        if keyword in text:
            environmental_score += 15

    # -------------------------
    # CATEGORY BOOST
    # -------------------------

    category_lower = category.lower()

    if "health" in category_lower:
        health_score += 20

    if "water" in category_lower:
        health_score += 10
        environmental_score += 10

    if "waste" in category_lower:
        health_score += 10
        environmental_score += 20

    if "environment" in category_lower:
        environmental_score += 20

    if "road" in category_lower:
        economic_score += 10

    if "agriculture" in category_lower:
        economic_score += 15
        environmental_score += 10

    # Keep every score between 0 and 100.
    economic_score = min(100, economic_score)
    health_score = min(100, health_score)
    environmental_score = min(100, environmental_score)

    # Convert numerical scores into impact levels.
    def get_level(score: int) -> str:
        if score >= 81:
            return "Critical"
        elif score >= 61:
            return "High"
        elif score >= 41:
            return "Medium"
        else:
            return "Low"

    return {
        "economic_impact": get_level(economic_score),
        "health_impact": get_level(health_score),
        "environmental_impact": get_level(environmental_score),
        "economic_score": economic_score,
        "health_score": health_score,
        "environmental_score": environmental_score
    }