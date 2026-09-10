from pydantic import BaseModel, Field


class ReportRequest(BaseModel):

    total_problems: int = Field(
        ge=0,
        description="Total number of civic problems"
    )

    high_priority: int = Field(
        ge=0,
        description="Number of high-priority problems"
    )

    projects_active: int = Field(
        ge=0,
        description="Number of active projects"
    )

    solutions_deployed: int = Field(
        ge=0,
        description="Number of deployed solutions"
    )

    citizens_impacted: int = Field(
        ge=0,
        description="Estimated citizens impacted"
    )

    top_category: str = Field(
        default="Other",
        description="Top civic problem category"
    )


class ReportResponse(BaseModel):

    message: str
    report_title: str
    total_problems: int
    high_priority: int
    projects_active: int
    solutions_deployed: int
    citizens_impacted: int
    top_category: str