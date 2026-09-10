import time

from app.config import settings
from app.core.llm import get_gemini_client

from app.schemas.severity import (
    SeverityAssessment,
    SeverityResult
)

from app.services.problem_analyzer.severity_prompts import (
    SYSTEM_PROMPT
)


def calculate_priority(
    severity: int,
    population: int,
    urgency: int,
    health_economic: int,
    feasibility: int
) -> int:
    """
    Calculate the SamAdhaan Priority Score.

    Formula:
    30% Severity
    25% Population Impact
    20% Urgency
    15% Health/Economic Impact
    10% Feasibility
    """

    score = (
        0.30 * severity
        + 0.25 * population
        + 0.20 * urgency
        + 0.15 * health_economic
        + 0.10 * feasibility
    )

    return round(score)


def get_priority_level(score: int) -> str:
    """
    Convert numeric priority score into a priority level.
    """

    if score >= 85:
        return "CRITICAL"

    if score >= 70:
        return "HIGH"

    if score >= 50:
        return "MEDIUM"

    return "LOW"


def assess_severity(
    problem: str
) -> SeverityResult:
    """
    Analyze a civic problem and calculate the SamAdhaan Priority Score.
    """
    if not problem or not problem.strip():
        raise ValueError("Problem description cannot be empty.")

    prompt = f"""
{SYSTEM_PROMPT}

CITIZEN COMPLAINT:

{problem.strip()}

Assess the severity factors for this civic problem.
Return ONLY the required structured JSON response.
"""

    models_to_try = [
        settings.GEMINI_MODEL,
        "gemini-3.6-flash",
        "gemini-2.5-flash",
        "gemini-2.0-flash",
    ]

    if settings.GEMINI_API_KEY:
        try:
            client = get_gemini_client()
            for model_name in models_to_try:
                try:
                    response = client.models.generate_content(
                        model=model_name,
                        contents=prompt,
                        config={
                            "response_mime_type": "application/json",
                            "response_schema": SeverityAssessment,
                            "temperature": 0.1,
                        },
                    )
                    if response and response.text:
                        assessment = SeverityAssessment.model_validate_json(response.text)
                        priority_score = calculate_priority(
                            severity=assessment.severity,
                            population=assessment.population_impact,
                            urgency=assessment.urgency,
                            health_economic=assessment.health_economic_impact,
                            feasibility=assessment.feasibility
                        )
                        priority_level = get_priority_level(priority_score)
                        return SeverityResult(
                            severity=assessment.severity,
                            urgency=assessment.urgency,
                            population_impact=assessment.population_impact,
                            health_economic_impact=assessment.health_economic_impact,
                            feasibility=assessment.feasibility,
                            priority_score=priority_score,
                            priority_level=priority_level,
                            reasoning=assessment.reasoning
                        )
                except Exception:
                    continue
        except Exception:
            pass

    # Heuristic fallback
    text = problem.lower()
    sev = 75
    pop = 70
    urg = 80
    health_econ = 65
    feas = 85

    if any(w in text for w in ["collapse", "danger", "electrocution", "accident", "overflow"]):
        sev = 92
        urg = 95
        health_econ = 88
        pop = 85
    elif any(w in text for w in ["burst", "broken", "huge", "toxic", "heavy"]):
        sev = 82
        urg = 85
        health_econ = 75
        pop = 75

    score = calculate_priority(sev, pop, urg, health_econ, feas)
    level = get_priority_level(score)

    return SeverityResult(
        severity=sev,
        urgency=urg,
        population_impact=pop,
        health_economic_impact=health_econ,
        feasibility=feas,
        priority_score=score,
        priority_level=level,
        reasoning=f"Automated evaluation assigned {level} priority based on civic impact and urgency indicators."
    )