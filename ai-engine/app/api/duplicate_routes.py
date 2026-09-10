from fastapi import APIRouter, HTTPException

from app.schemas.duplicate import (
    DuplicateRequest,
    DuplicateResult
)

from app.services.duplicate_detection.duplicate_detector import (
    detect_duplicates
)


router = APIRouter(
    prefix="/api/v1/duplicates",
    tags=["AI Duplicate Detection"]
)


@router.post(
    "/analyze",
    response_model=DuplicateResult
)
def analyze_duplicates(
    request: DuplicateRequest
):

    try:

        result = detect_duplicates(
            problem=request.problem,
            existing_problems=request.existing_problems
        )

        return result

    except ValueError as exc:

        raise HTTPException(
            status_code=422,
            detail=str(exc)
        ) from exc

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"Duplicate detection failed: {exc}"
        ) from exc