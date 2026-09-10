from typing import List

from pydantic import BaseModel, Field


class CategorizationRequest(BaseModel):
    """
    Citizen problem submitted for automatic categorization.
    """

    problem: str = Field(
        min_length=10,
        max_length=5000,
        description="Citizen's civic problem description"
    )


class CategorizationResult(BaseModel):
    """
    AI-generated civic problem categorization.
    """

    domain: str = Field(
        description="Broad civic domain"
    )

    category: str = Field(
        description="Main civic category"
    )

    subcategory: str = Field(
        description="Specific civic problem type"
    )

    confidence: int = Field(
        ge=0,
        le=100,
        description="AI confidence from 0 to 100"
    )

    keywords: List[str] = Field(
        description="Important classification keywords"
    )

    reason: str = Field(
        description="Short explanation for the classification"
    )