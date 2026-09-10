from fastapi import APIRouter, HTTPException

from app.schemas.vision import (
    VisionRequest,
    VisionResult
)

from app.services.vision.image_analyzer import (
    analyze_image
)


router = APIRouter(
    prefix="/api/v1/vision",
    tags=["AI Vision"]
)


@router.post(
    "/analyze",
    response_model=VisionResult
)
def analyze_vision(
    request: VisionRequest
):
    try:
        image_data = request.image or request.image_path
        if not image_data:
            raise ValueError("No image data provided.")

        return analyze_image(
            image_input=image_data,
            title=request.title or "",
            description=request.description or "",
            mime_type=request.mime_type or "image/jpeg"
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc)
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"AI vision analysis failed: {exc}"
        ) from exc