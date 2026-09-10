from enum import Enum
from typing import List

from pydantic import BaseModel, Field, ConfigDict


class Urgency(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class ProblemRequest(BaseModel):
    """
    Input received from the citizen complaint form.
    """

    model_config = ConfigDict(
        str_strip_whitespace=True
    )

    problem: str = Field(
        min_length=10,
        max_length=5000,
        description="Citizen's civic problem description"
    )


class ProblemAnalysis(BaseModel):
    """
    Structured AI analysis of a civic complaint.

    This schema is intentionally kept Gemini-compatible.
    """

    category: str = Field(
        description="Main civic problem category"
    )

    subcategory: str = Field(
        description="Specific problem type"
    )

    severity: int = Field(
        ge=0,
        le=10,
        description="Severity score from 0 to 10"
    )

    urgency: Urgency = Field(
        description="Urgency level"
    )

    affected_population: str = Field(
        description="Estimated affected population level"
    )

    health_impact: str = Field(
        description="Health impact level"
    )

    keywords: List[str] = Field(
        description="Important keywords extracted from complaint"
    )

    department: str = Field(
        description="Likely responsible government department"
    )

    summary: str = Field(
        description="Short factual summary of the problem"
    )