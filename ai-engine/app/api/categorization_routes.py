from typing import Optional, List
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from app.services.problem_analyzer.ai_categorizer import classify_civic_problem

router = APIRouter(
    tags=["NLP Categorization Engine"]
)

class ClassifyRequest(BaseModel):
    problem: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None

class ClassifyResponse(BaseModel):
    category: str
    subcategory: str
    confidence: int
    department: str
    slaHours: int
    urgency: str
    keywords: List[str]
    summary: str

@router.post("/ai/classify", response_model=ClassifyResponse)
@router.post("/api/v1/categorization/classify", response_model=ClassifyResponse)
@router.post("/api/v1/problems/classify", response_model=ClassifyResponse)
def classify_endpoint(request: ClassifyRequest):
    """
    Classify a civic problem into one of: Water, Road, Sanitation, Energy, Transport.
    """
    text = request.problem or f"{request.title or ''} {request.description or ''}".strip()
    try:
        res = classify_civic_problem(text)
        return res
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Categorization error: {exc}") from exc
