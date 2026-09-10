from typing import Optional, List
from pydantic import BaseModel, Field

class TranslationRequest(BaseModel):
    text: str = Field(min_length=1, description="Text to translate")
    target_language: str = Field(default="hi", description="Target language code: 'hi' (Hindi), 'bn' (Bengali), 'mr' (Marathi), 'en' (English)")
    source_language: Optional[str] = Field(default="auto", description="Source language")
    gemini_api_key: Optional[str] = Field(default=None, description="Optional custom Gemini key")

class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    source_language: str
    target_language: str
    confidence: float = 0.96
    dialect_notes: Optional[str] = None
