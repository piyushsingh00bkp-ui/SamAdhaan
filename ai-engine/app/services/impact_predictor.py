from app.services.impact_analyzer import analyze_impacts


def predict_impact(
    problem: str,
    category: str,
    people_affected: int
) -> dict:
    """
    Predict the projected impact of a civic problem.

    The impact factors are automatically estimated from
    the complaint using the impact analyzer.

    This is a transparent prototype scoring model.
    It is not a scientifically validated prediction model.
    """

    problem = (problem or "").strip()
    category = (category or "Other").strip()

    people_affected = max(0, people_affected)

    # Automatically analyze the complaint.
    impacts = analyze_impacts(
        problem=problem,
        category=category
    )

    economic_score = impacts["economic_score"]
    health_score = impacts["health_score"]
    environmental_score = impacts["environmental_score"]

    # People affected score.
    people_score = min(
        100,
        (people_affected / 1000) * 100
    )

    # Weighted projected impact.
    projected_impact = (
        people_score * 0.40
        + economic_score * 0.20
        + health_score * 0.20
        + environmental_score * 0.20
    )

    projected_impact = round(projected_impact)

    # Determine overall impact level.
    if projected_impact >= 81:
        impact_level = "Critical"
    elif projected_impact >= 61:
        impact_level = "High"
    elif projected_impact >= 41:
        impact_level = "Medium"
    else:
        impact_level = "Low"

    return {
        "problem": problem,
        "category": category,
        "people_affected": people_affected,
        "economic_impact": impacts["economic_impact"],
        "health_impact": impacts["health_impact"],
        "environmental_impact": impacts["environmental_impact"],
        "projected_impact": projected_impact,
        "impact_level": impact_level
    }