from fastapi import APIRouter, HTTPException

from app.schemas.matching import (
    MatchingRequest,
    MatchingResult
)

from app.services.matching.matcher import (
    match_candidates
)


router = APIRouter(
    prefix="/api/v1/matching",
    tags=["AI Matching Engine"]
)


@router.post(
    "/analyze",
    response_model=MatchingResult
)
def analyze_matching(
    request: MatchingRequest
):

    try:

        matches = match_candidates(
            problem=request.problem,
            candidates=request.candidates
        )

        return MatchingResult(
            problem=request.problem,
            matches=matches
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=422,
            detail=str(exc)
        ) from exc

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"AI matching failed: {exc}"
        ) from exc