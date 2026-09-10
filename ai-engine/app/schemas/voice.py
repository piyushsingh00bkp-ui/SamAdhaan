from pydantic import BaseModel
from typing import Optional, Dict, Any

class VoiceTranscribeRequest(BaseModel):
    audioData: Optional[str] = None
    language: Optional[str] = "en"
    promptHint: Optional[str] = None

class VoiceAnalysisResponse(BaseModel):
    language: str
    transcription: str
    translated_text: str
    problem: str
    category: str
    severity: int
    department: str