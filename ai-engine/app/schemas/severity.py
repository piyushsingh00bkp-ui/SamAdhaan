from pydantic import BaseModel, Field
from typing import List


class SeverityRequest(BaseModel):
    """
    Citizen problem submitted for severity and priority assessment.
    """

    problem: str = Field(
        min_length=10,
        max_length=5000,
        description="Citizen's civic problem description"
    )


class SeverityAssessment(BaseModel):
    """
    Individual AI-assessed severity factors.
    """

    severity: int = Field(
        ge=0,
        le=100,
        description="Overall seriousness of the problem"
    )

    urgency: int = Field(
        ge=0,
        le=100,
        description="How quickly the problem requires action"
    )

    population_impact: int = Field(
        ge=0,
        le=100,
        description="Estimated scale of population affected"
    )

    health_economic_impact: int = Field(
        ge=0,
        le=100,
        description="Potential health or economic consequences"
    )

    feasibility: int = Field(
        ge=0,
        le=100,
        description="Practical feasibility of addressing the problem"
    )

    reasoning: str = Field(
        description="Short factual explanation of the assessment"
    )


class SeverityResult(BaseModel):
    """
    Final SamAdhaan priority assessment.
    """

    severity: int = Field(ge=0, le=100)

    urgency: int = Field(ge=0, le=100)

    population_impact: int = Field(ge=0, le=100)

    health_economic_impact: int = Field(ge=0, le=100)

    feasibility: int = Field(ge=0, le=100)

    priority_score: int = Field(
        ge=0,
        le=100,
        description="Final SamAdhaan Priority Score"
    )

    priority_level: str = Field(
        description="Overall priority classification"
    )

    reasoning: str


class BatchSeverityRequest(BaseModel):
    """
    Multiple civic problems submitted for batch severity analysis.
    """

    problems: List[SeverityRequest] = Field(
        min_length=1,
        max_length=50,
        description="List of civic problems"
    )


class BatchSeverityResult(BaseModel):
    """
    Ranked severity result for a civic problem.
    """

    rank: int = Field(
        ge=1,
        description="Priority ranking. 1 is highest priority."
    )

    problem: str

    severity: int = Field(ge=0, le=100)

    urgency: int = Field(ge=0, le=100)

    population_impact: int = Field(ge=0, le=100)

    health_economic_impact: int = Field(ge=0, le=100)

    feasibility: int = Field(ge=0, le=100)

    priority_score: int = Field(ge=0, le=100)

    priority_level: str

    reasoning: str