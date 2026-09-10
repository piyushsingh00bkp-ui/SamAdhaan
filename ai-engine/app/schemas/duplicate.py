from typing import List
from pydantic import BaseModel, Field


class DuplicateRequest(BaseModel):
    problem: str = Field(
        min_length=10,
        max_length=5000,
        description="New citizen complaint"
    )

    existing_problems: List[str] = Field(
        min_length=1,
        description="Previously submitted complaints"
    )


class DuplicateMatch(BaseModel):
    complaint: str
    similarity_score: float = Field(
        ge=0,
        le=1,
        description="Semantic similarity score"
    )
    match_type: str = Field(
        description="NEW, RELATED, or DUPLICATE"
    )


class DuplicateResult(BaseModel):
    is_duplicate: bool
    best_match: str
    similarity_score: float = Field(
        ge=0,
        le=1
    )
    match_type: str
    matches: List[DuplicateMatch]