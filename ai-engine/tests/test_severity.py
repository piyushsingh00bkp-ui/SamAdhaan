from app.services.problem_analyzer.severity_engine import (
    calculate_priority,
    get_priority_level
)


def test_priority_calculation():

    score = calculate_priority(
        severity=92,
        population=95,
        urgency=89,
        health_economic=91,
        feasibility=82
    )

    assert score == 91


def test_priority_level():

    assert get_priority_level(91) == "CRITICAL"
    assert get_priority_level(75) == "HIGH"
    assert get_priority_level(55) == "MEDIUM"
    assert get_priority_level(30) == "LOW"