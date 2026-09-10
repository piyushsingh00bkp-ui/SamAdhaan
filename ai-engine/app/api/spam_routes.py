from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List

from app.schemas.spam import (
    SpamRequest,
    SpamResponse
)

from app.services.spam_detector import (
    analyze_submission
)

router = APIRouter(
    prefix="/api/v1/spam",
    tags=["AI Spam / Fake Detection"]
)

class ModerationSpamRequest(BaseModel):
    title: Optional[str] = ""
    description: Optional[str] = ""
    problem: Optional[str] = ""
    previous_complaints: Optional[List[str]] = []
    duplicate_account: Optional[bool] = False
    irrelevant_image: Optional[bool] = False

@router.post("/analyze", response_model=SpamResponse)
@router.post("/check")
async def analyze_spam(data: ModerationSpamRequest):
    combined_text = data.problem or f"{data.title} {data.description}".strip()
    result = analyze_submission(
        problem=combined_text,
        previous_complaints=data.previous_complaints or [],
        duplicate_account=data.duplicate_account or False,
        irrelevant_image=data.irrelevant_image or False
    )

    return SpamResponse(
        trust_score=result["trust_score"],
        status=result["status"],
        duplicate_account=result["duplicate_account"],
        repeated_complaint=result["repeated_complaint"],
        spam_text=result["spam_text"],
        irrelevant_image=result["irrelevant_image"],
        suspicious_submission=result["suspicious_submission"],
        human_verification_required=result["human_verification_required"]
    )