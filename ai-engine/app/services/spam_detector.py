import re
import json
from difflib import SequenceMatcher
from app.config import settings
from app.core.llm import get_gemini_client


SPAM_KEYWORDS = [
    "buy now",
    "click here",
    "free money",
    "win prize",
    "lottery",
    "bitcoin",
    "crypto",
    "casino",
    "subscribe",
    "visit my website",
    "make money",
]


def normalize_text(text: str) -> str:
    """Clean text for comparison and analysis."""

    if not text:
        return ""

    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    text = text.strip()

    return text


def detect_spam_text(problem: str) -> bool:
    """Detect obvious spam patterns."""

    text = normalize_text(problem)

    if not text:
        return True

    # Check spam keywords
    for keyword in SPAM_KEYWORDS:
        if keyword in text:
            return True

    # Excessive repeated characters
    if re.search(r"(.)\1{6,}", text):
        return True

    # Excessive links
    if text.count("http://") + text.count("https://") >= 2:
        return True

    return False


def detect_repeated_complaint(
    problem: str,
    previous_complaints: list[str]
) -> bool:
    """Check whether a complaint is very similar to an earlier complaint."""

    current_text = normalize_text(problem)

    if not current_text:
        return True

    for previous in previous_complaints:

        previous_text = normalize_text(previous)

        if not previous_text:
            continue

        similarity = SequenceMatcher(
            None,
            current_text,
            previous_text
        ).ratio()

        if similarity >= 0.90:
            return True

    return False


def calculate_trust_score(
    spam_text: bool,
    repeated_complaint: bool,
    duplicate_account: bool,
    irrelevant_image: bool
) -> int:
    """Calculate a transparent trust score."""

    score = 100

    if spam_text:
        score -= 35

    if repeated_complaint:
        score -= 20

    if duplicate_account:
        score -= 30

    if irrelevant_image:
        score -= 15

    score = max(0, min(100, score))

    return score


def get_risk_status(trust_score: int) -> str:
    """Convert trust score into a risk status."""

    if trust_score >= 70:
        return "LOW RISK"

    if trust_score >= 40:
        return "MEDIUM RISK"

    return "HIGH RISK"


def analyze_submission(
    problem: str,
    previous_complaints: list[str] | None = None,
    duplicate_account: bool = False,
    irrelevant_image: bool = False
) -> dict:

    if previous_complaints is None:
        previous_complaints = []

    spam_text = detect_spam_text(problem)

    repeated_complaint = detect_repeated_complaint(
        problem,
        previous_complaints
    )

    trust_score = calculate_trust_score(
        spam_text=spam_text,
        repeated_complaint=repeated_complaint,
        duplicate_account=duplicate_account,
        irrelevant_image=irrelevant_image
    )

    # If Gemini API key is available, perform deep semantic credibility assessment
    if settings.GEMINI_API_KEY and problem and len(problem.strip()) > 5:
        try:
            client = get_gemini_client()
            prompt = f"""
You are an expert AI civic moderation system. Analyze this citizen complaint for credibility, realism, and spam/trolling.
Citizen Text: "{problem.strip()}"

Determine:
1. Is it a legitimate civic complaint (about roads, water, electricity, sanitation, corruption, safety, infrastructure)?
2. Is it spam, advertising, promo, random gibberish, abusive trolling, or a prank?
3. Calculate a credibility trust score from 0 to 100 (100 = highly authentic, detailed real complaint; 0 = pure spam/fake).

Return ONLY valid JSON in this exact structure:
{{
  "is_spam": false,
  "trust_score": 95,
  "reason": "Authentic citizen report detailing road hazard."
}}
"""
            for model_name in [settings.GEMINI_MODEL, "gemini-3.7-flash", "gemini-3.5-flash-lite"]:
                try:
                    res = client.models.generate_content(
                        model=model_name,
                        contents=prompt,
                        config={"response_mime_type": "application/json", "temperature": 0.1}
                    )
                    if res.text:
                        data = json.loads(res.text)
                        ai_spam = bool(data.get("is_spam", False))
                        ai_trust = int(data.get("trust_score", trust_score))
                        spam_text = spam_text or ai_spam
                        trust_score = min(trust_score, ai_trust) if ai_spam else max(trust_score, ai_trust)
                        break
                except Exception:
                    continue
        except Exception:
            pass

    status = get_risk_status(trust_score)
    suspicious_submission = trust_score < 40
    human_verification_required = trust_score < 60

    return {
        "trust_score": trust_score,
        "status": status,
        "duplicate_account": duplicate_account,
        "repeated_complaint": repeated_complaint,
        "spam_text": spam_text,
        "irrelevant_image": irrelevant_image,
        "suspicious_submission": suspicious_submission,
        "human_verification_required": human_verification_required
    }