from fastapi import APIRouter, HTTPException
from app.schemas.solution import SolutionRequest, SolutionResponse
from app.services.solution_generator.generator import generate_solutions

router = APIRouter(
    prefix="/api/v1/solutions",
    tags=["AI Solution Generator"]
)

@router.post("/generate", response_model=SolutionResponse)
def generate(request: SolutionRequest):
    """
    Generate 3 high-impact civic engineering & GovTech solutions using Gemini with multi-approach fallback.
    """
    try:
        return generate_solutions(
            problem=request.problem,
            category=request.category or "Infrastructure",
            location=request.location or "Pune, Maharashtra",
            gemini_api_key=request.gemini_api_key
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Solution generation failed: {exc}") from exc
