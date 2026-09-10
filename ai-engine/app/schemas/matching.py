from typing import List
from pydantic import BaseModel, Field


class MatchingRequest(BaseModel):
    problem: str = Field(
        min_length=10,
        max_length=5000,
        description="Citizen civic problem"
    )

    candidates: List[str] = Field(
        min_length=1,
        description="Potential HEIs, experts, industries or skills"
    )


class Match(BaseModel):
    candidate: str
    similarity_score: float = Field(
        ge=0,
        le=1,
        description="Semantic similarity score"
    )
    rank: int


class MatchingResult(BaseModel):
    problem: str
    matches: List[Match]