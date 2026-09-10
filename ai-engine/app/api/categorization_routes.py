from fastapi import APIRouter, HTTPException

from app.schemas.categorization import (
    CategorizationRequest,
    CategorizationResult
)

from app.services.problem_analyzer.ai_categorizer import (
    categorize_problem
)


router = APIRouter(
    prefix="/api/v1/categorization",
    tags=["AI Auto Categorization"]
)


@router.post(
    "/analyze",
    response_model=CategorizationResult
)
def categorize(
    request: CategorizationRequest
):
    """
    Automatically categorize a citizen civic complaint.
    """

    try:

        result = categorize_problem(
            request.problem
        )

        return result

    except ValueError as exc:

        raise HTTPException(
            status_code=422,
            detail=str(exc)
        ) from exc

    except RuntimeError as exc:

        raise HTTPException(
            status_code=500,
            detail=str(exc)
        ) from exc

    except Exception as exc:

        raise HTTPException(
            status_code=502,
            detail=f"AI categorization failed: {exc}"
        ) from exc