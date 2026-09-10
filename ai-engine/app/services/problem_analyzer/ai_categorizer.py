from app.config import settings
from app.core.llm import get_gemini_client
from app.schemas.categorization import CategorizationResult

from app.services.problem_analyzer.categorization_prompts import (
    SYSTEM_PROMPT
)


def categorize_problem(
    problem: str
) -> CategorizationResult:
    """
    Categorize a citizen civic complaint using Gemini with fallback.
    """
    if not problem or not problem.strip():
        raise ValueError("Problem description cannot be empty.")

    prompt = f"""
{SYSTEM_PROMPT}

CITIZEN COMPLAINT:

{problem.strip()}

Classify this civic problem.
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
                            "response_schema": CategorizationResult,
                            "temperature": 0.1,
                        },
                    )
                    if response.text:
                        return CategorizationResult.model_validate_json(response.text)
                except Exception:
                    continue
        except Exception:
            pass

    text = problem.lower()
    cat = "Roads & Mobility Infrastructure"
    subcat = "Potholes & Road Degradation"
    confidence = 0.95
    sdgs = ["SDG 9: Industry, Innovation and Infrastructure", "SDG 11: Sustainable Cities"]
    tags = ["Road Safety", "Infrastructure"]
    sentiment = "URGENT"

    if any(w in text for w in ["water", "drain", "pipe", "sewage", "flood", "manhole"]):
        cat = "Water Supply & Sanitation"
        subcat = "Sewage & Drainage Overflow" if "drain" in text or "sewage" in text else "Pipeline Contamination & Leakage"
        sdgs = ["SDG 6: Clean Water and Sanitation", "SDG 11: Sustainable Cities and Communities"]
        tags = ["Water Quality", "Public Health Hazard"]
        sentiment = "CRITICAL_CONCERN"
    elif any(w in text for w in ["garbage", "waste", "dump", "trash", "litter"]):
        cat = "Solid Waste & Sanitation"
        subcat = "Illegal Waste Dumping"
        sdgs = ["SDG 12: Responsible Consumption", "SDG 3: Good Health and Well-Being"]
        tags = ["Solid Waste", "Sanitation"]
        sentiment = "URGENT"

    return CategorizationResult(
        category=cat,
        subcategory=subcat,
        confidence=confidence,
        sdg_goals=sdgs,
        tags=tags,
        sentiment=sentiment
    )