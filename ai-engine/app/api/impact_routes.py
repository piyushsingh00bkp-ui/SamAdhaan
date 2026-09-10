from fastapi import APIRouter

from app.schemas.impact import (
    ImpactRequest,
    ImpactResponse
)

from app.services.impact_predictor import predict_impact


router = APIRouter(
    prefix="/api/v1/impact",
    tags=["AI Impact Predictor"]
)


@router.post(
    "/predict",
    response_model=ImpactResponse
)
async def predict_impact_api(
    data: ImpactRequest
):

    result = predict_impact(
        problem=data.problem,
        category=data.category,
        people_affected=data.people_affected
    )

    return ImpactResponse(
        problem=result["problem"],
        category=result["category"],
        people_affected=result["people_affected"],
        economic_impact=result["economic_impact"],
        health_impact=result["health_impact"],
        environmental_impact=result["environmental_impact"],
        projected_impact=result["projected_impact"],
        impact_level=result["impact_level"]
    )