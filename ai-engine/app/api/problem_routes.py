from fastapi import APIRouter, HTTPException

from app.schemas.problem import (
    ProblemRequest,
    ProblemAnalysis
)

from app.services.problem_analyzer.analyzer import (
    analyze_problem
)


router = APIRouter(
    prefix="/api/v1/problems",
    tags=["Problem Analyzer"]
)


@router.post(
    "/analyze",
    response_model=ProblemAnalysis
)
def analyze(
    request: ProblemRequest
):
    """
    Analyze a citizen civic complaint using AI.
    """

    try:

        result = analyze_problem(
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
            detail=f"AI analysis failed: {exc}"
        ) from exc