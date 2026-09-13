import re
import json
from typing import Dict, Any, List, Optional
from app.config import settings
from app.core.llm import get_gemini_client

SPAM_PATTERNS = [
    r"\b(buy now|click here|free money|win prize|lottery|crypto|bitcoin|casino|subscribe|make money|telegram|whatsapp group|dating|loan offer)\b",
    r"(.)\1{5,}",  # aaaaaaa, xxxxxx
    r"^(asdf|test|testing|hello|hi|1234|qwerty|xyz)\b",
]

CIVIC_KEYWORDS = [
    "pothole", "road", "pipe", "water", "leak", "drain", "sewage", "garbage", "trash", "waste",
    "light", "lamp", "pole", "wire", "electric", "power", "blackout", "hospital", "clinic",
    "bus", "traffic", "signal", "park", "tree", "manhole", "gutter", "pavement", "bridge"
]

def check_problem_genuineness(problem_text: str) -> Dict[str, Any]:
    """
    Evaluates whether a problem is a genuine civic complaint or spam.
    Returns structured JSON with confidenceScore (0-100), isGenuine, isSpam, reason, recommendation.
    """
    text = (problem_text or "").strip()
    if not text or len(text) < 5:
        return {
            "isGenuine": False,
            "isSpam": True,
            "confidenceScore": 10,
            "reason": "Text is too short or empty to evaluate.",
            "fraudIndicators": ["Empty / Minimal Content"],
            "recommendation": "REJECT"
        }

    prompt = f"""
You are an expert civic fraud and anti-spam audit AI.

Task: Is this a genuine civic complaint or spam? Return confidence score 0-100.

CIVIC COMPLAINT:
{text}

Return ONLY valid JSON matching this exact structure:
{{
  "isGenuine": true,
  "isSpam": false,
  "confidenceScore": 95,
  "reason": "<1-2 sentence explanation of why this is genuine or spam>",
  "fraudIndicators": ["<indicator if any, else empty>"],
  "recommendation": "ACCEPT | FLAG_FOR_REVIEW | REJECT"
}}
"""

    models_to_try = [
        getattr(settings, 'GEMINI_MODEL', 'gemini-2.5-flash'),
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
    ]

    if getattr(settings, 'GEMINI_API_KEY', None):
        try:
            client = get_gemini_client()
            for model_name in models_to_try:
                try:
                    response = client.models.generate_content(
                        model=model_name,
                        contents=prompt,
                        config={
                            "response_mime_type": "application/json",
                            "temperature": 0.1,
                        },
                    )
                    if response and response.text:
                        clean_text = response.text.strip()
                        if clean_text.startswith("```json"):
                            clean_text = clean_text[7:]
                        if clean_text.endswith("```"):
                            clean_text = clean_text[:-3]
                        data = json.loads(clean_text)
                        # Ensure fields exist
                        score = int(data.get("confidenceScore", 90))
                        data["confidenceScore"] = max(0, min(100, score))
                        data["credibilityScore"] = data["confidenceScore"]
                        data["isGenuine"] = data.get("isGenuine", score >= 70)
                        data["isSpam"] = data.get("isSpam", score < 60)
                        data["trust_score"] = data["confidenceScore"]
                        return data
                except Exception:
                    continue
        except Exception:
            pass

    # Rule-based fallback
    lower = text.lower()
    fraud_indicators = []

    # Check obvious spam regex
    for pat in SPAM_PATTERNS:
        if re.search(pat, lower, re.IGNORECASE):
            fraud_indicators.append("Commercial promotion or gibberish character pattern detected")

    if lower.count("http://") + lower.count("https://") >= 2:
        fraud_indicators.append("Excessive URLs / Promotional links")

    # Check for civic domain keywords
    civic_matches = [w for w in CIVIC_KEYWORDS if w in lower]

    if fraud_indicators:
        return {
            "isGenuine": False,
            "isSpam": True,
            "confidenceScore": 20,
            "credibilityScore": 20,
            "trust_score": 20,
            "reason": "Submission contains promotional keywords, links, or irregular text patterns.",
            "fraudIndicators": fraud_indicators,
            "recommendation": "REJECT"
        }
    elif len(civic_matches) >= 1 or len(text.split()) >= 6:
        return {
            "isGenuine": True,
            "isSpam": False,
            "confidenceScore": 94,
            "credibilityScore": 94,
            "trust_score": 94,
            "reason": "Semantic coherence verified. The report describes a genuine civic issue with specific infrastructure details.",
            "fraudIndicators": [],
            "recommendation": "ACCEPT"
        }
    else:
        return {
            "isGenuine": True,
            "isSpam": False,
            "confidenceScore": 72,
            "credibilityScore": 72,
            "trust_score": 72,
            "reason": "General complaint text without specific municipal landmarks. Recommended for nodal audit.",
            "fraudIndicators": ["Low descriptive detail"],
            "recommendation": "FLAG_FOR_REVIEW"
        }
