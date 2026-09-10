
from fastapi import APIRouter

from app.schemas.trend import (
    TrendRequest,
    TrendResponse
)

from app.services.trend_detector import detect_trends


router = APIRouter(
    prefix="/api/v1/trends",
    tags=["AI Trend Detection"]
)


@router.post(
    "/detect",
    response_model=TrendResponse
)
async def detect_trends_api(
    data: TrendRequest
):

    current_complaints = [
        complaint.model_dump()
        for complaint in data.current_complaints
    ]

    previous_complaints = [
        complaint.model_dump()
        for complaint in data.previous_complaints
    ]

    result = detect_trends(
        current_complaints=current_complaints,
        previous_complaints=previous_complaints
    )

    return TrendResponse(
        emerging_issue=result["emerging_issue"],
        current_count=result["current_count"],
        previous_count=result["previous_count"],
        change_percentage=result["change_percentage"],
        trend_direction=result["trend_direction"],
        status=result["status"]
    )