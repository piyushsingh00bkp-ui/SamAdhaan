from app.config import settings
from app.core.llm import get_gemini_client
from app.schemas.problem import ProblemAnalysis

from app.services.problem_analyzer.prompts import SYSTEM_PROMPT


def analyze_problem(problem: str) -> ProblemAnalysis:
    """
    Analyze a citizen complaint using Gemini with multi-model retry and resilient fallback.
    """
    if not problem or not problem.strip():
        raise ValueError("Problem description cannot be empty.")

    prompt = f"""
{SYSTEM_PROMPT}

CITIZEN COMPLAINT:

{problem.strip()}

Analyze this complaint and return the structured result.
"""

    models_to_try = [
        settings.GEMINI_MODEL,
        "gemini-3.6-flash",
        "gemini-2.5-flash",
        "gemini-2.0-flash",
    ]

    # Try Gemini API if key configured
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
                            "response_schema": ProblemAnalysis,
                            "temperature": 0.1,
                        },
                    )
                    if response.text:
                        return ProblemAnalysis.model_validate_json(response.text)
                except Exception:
                    continue
        except Exception:
            pass

    # Resilient civic NLP fallback
    text = problem.lower()
    cat = "Roads & Mobility Infrastructure"
    subcat = "Potholes & Road Degradation"
    dept = "Municipal Roads & Highway Authority"
    sev = 6
    urg = "MEDIUM"
    health = "Low"
    pop = "Medium (~2,500 residents)"

    if any(w in text for w in ["water", "drain", "pipe", "sewage", "flood", "manhole"]):
        cat = "Water Supply & Sanitation"
        subcat = "Sewage & Drainage Overflow" if "drain" in text or "sewage" in text or "manhole" in text else "Water Pipeline Leakage"
        dept = "Municipal Water Supply and Sewerage Board"
        sev = 8
        urg = "HIGH"
        health = "High (Contamination Risk)"
        pop = "High (~5,000+ residents)"
    elif any(w in text for w in ["garbage", "waste", "dump", "trash", "litter"]):
        cat = "Solid Waste Management"
        subcat = "Illegal Garbage Dumping"
        dept = "Municipal Solid Waste Management Dept"
        sev = 7
        urg = "MEDIUM"
        health = "Medium (Vector-borne Risk)"
    elif any(w in text for w in ["electric", "wire", "light", "spark", "transformer"]):
        cat = "Electrical & Power Supply"
        subcat = "Exposed Wiring & Transformer Sparking"
        dept = "State Electricity Distribution Co. (MSEDCL)"
        sev = 9
        urg = "CRITICAL"
        health = "Critical (Electrocution Risk)"

    words = [w.strip(".,!?") for w in problem.split() if len(w) > 4][:5]

    return ProblemAnalysis(
        category=cat,
        subcategory=subcat,
        severity=sev,
        urgency=urg,
        affected_population=pop,
        health_impact=health,
        keywords=words or ["civic", "infrastructure", "complaint"],
        department=dept,
        summary=problem.strip()[:200]
    )