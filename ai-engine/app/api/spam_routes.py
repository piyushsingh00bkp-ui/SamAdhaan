from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from app.services.spam_detector import check_problem_genuineness

router = APIRouter(
    tags=["Anti-Spam & Genuineness Auditor"]
)

class SpamCheckRequest(BaseModel):
    problem: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None

class SpamCheckResponse(BaseModel):
    isGenuine: bool
    isSpam: bool
    confidenceScore: int
    credibilityScore: int
    trust_score: int
    reason: str
    fraudIndicators: List[str]
    recommendation: str

@router.post("/ai/spam-check", response_model=SpamCheckResponse)
@router.post("/api/v1/spam/check", response_model=SpamCheckResponse)
@router.post("/api/v1/spam/analyze", response_model=SpamCheckResponse)
def spam_check_endpoint(data: SpamCheckRequest):
    """
    Check if a problem is a genuine civic complaint or spam.
    Returns confidence score 0-100.
    """
    combined = data.problem or f"{data.title or ''} {data.description or ''}".strip()
    try:
        result = check_problem_genuineness(combined)
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Spam check failed: {exc}") from exc
