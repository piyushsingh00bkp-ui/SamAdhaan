from google import genai

from app.config import settings


def get_gemini_client() -> genai.Client:
    """
    Create and return a Gemini client.
    """

    if not settings.GEMINI_API_KEY:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured. "
            "Add your Gemini API key to ai-engine/.env"
        )

    return genai.Client(
        api_key=settings.GEMINI_API_KEY
    )