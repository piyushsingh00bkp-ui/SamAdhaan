from fastapi import APIRouter, HTTPException
from app.schemas.multilingual import TranslationRequest, TranslationResponse
from app.services.multilingual_translator import translate_civic_text

router = APIRouter(
    prefix="/api/v1/multilingual",
    tags=["AI Multilingual Translation"]
)

@router.post("/translate", response_model=TranslationResponse)
def translate(request: TranslationRequest):
    """
    Translate citizen complaints and municipal briefings across English, Hindi, Bengali, Marathi.
    """
    try:
        return translate_civic_text(
            text=request.text,
            target_lang=request.target_language,
            source_lang=request.source_language or "auto",
            gemini_api_key=request.gemini_api_key
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Translation failed: {exc}") from exc
