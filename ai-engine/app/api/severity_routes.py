from fastapi import APIRouter, HTTPException
from typing import List

from app.schemas.severity import (
    SeverityRequest,
    SeverityResult,
    BatchSeverityRequest,
    BatchSeverityResult
)

from app.services.problem_analyzer.severity_engine import (
    assess_severity
)


router = APIRouter(
    prefix="/api/v1/severity",
    tags=["AI Severity & Priority"]
)


@router.post(
    "/analyze",
    response_model=SeverityResult
)
def analyze_severity(
    request: SeverityRequest
):
    """
    Assess a single civic problem.
    """

    try:

        result = assess_severity(
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
            detail=f"AI severity analysis failed: {exc}"
        ) from exc


@router.post(
    "/analyze/batch",
    response_model=List[BatchSeverityResult]
)
def analyze_severity_batch(
    request: BatchSeverityRequest
):
    """
    Analyze multiple civic problems and rank them
    from highest priority to lowest priority.
    """

    analyzed_results = []

    for item in request.problems:

        try:

            result = assess_severity(
                item.problem
            )

            # assess_severity returns a SeverityResult object
            analyzed_results.append({
                "problem": item.problem,
                "severity": result.severity,
                "urgency": result.urgency,
                "population_impact": result.population_impact,
                "health_economic_impact": result.health_economic_impact,
                "feasibility": result.feasibility,
                "priority_score": result.priority_score,
                "priority_level": result.priority_level,
                "reasoning": result.reasoning
            })

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
                detail=f"AI severity analysis failed: {exc}"
            ) from exc


    # ==========================================
    # SAMADHAAN PRIORITY RANKING SYSTEM
    # ==========================================
    #
    # 1. Higher Priority Score
    # 2. Higher Severity
    # 3. Higher Urgency
    # 4. Higher Population Impact
    #
    # All sorted from HIGH -> LOW
    # ==========================================

    analyzed_results.sort(
        key=lambda x: (
            x["priority_score"],
            x["severity"],
            x["urgency"],
            x["population_impact"]
        ),
        reverse=True
    )


    # Add rank numbers

    ranked_results = []

    for rank, result in enumerate(
        analyzed_results,
        start=1
    ):

        ranked_results.append(
            BatchSeverityResult(
                rank=rank,
                **result
            )
        )


    return ranked_results