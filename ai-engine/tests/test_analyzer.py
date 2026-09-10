from app.schemas.problem import (
    ProblemAnalysis,
    Urgency
)


def test_problem_analysis_schema():

    result = ProblemAnalysis(

        category="Water & Sanitation",

        subcategory="Drinking Water",

        severity=9,

        urgency=Urgency.HIGH,

        affected_population="High",

        health_impact="High",

        keywords=[
            "drinking water",
            "health",
            "village"
        ],

        department="Drinking Water & Sanitation",

        summary=(
            "A village lacks clean drinking water "
            "and residents are reporting frequent illness."
        )
    )

    assert result.severity == 9

    assert result.urgency == Urgency.HIGH

    assert result.category == "Water & Sanitation"