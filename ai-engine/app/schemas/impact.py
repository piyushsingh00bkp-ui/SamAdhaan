from pydantic import BaseModel, Field


class ImpactRequest(BaseModel):
    problem: str = Field(
        description="Description of the civic problem"
    )

    category: str = Field(
        default="Other",
        description="Problem category"
    )

    people_affected: int = Field(
        ge=0,
        description="Estimated number of people affected"
    )


class ImpactResponse(BaseModel):
    problem: str
    category: str
    people_affected: int
    economic_impact: str
    health_impact: str
    environmental_impact: str
    projected_impact: int
    impact_level: str