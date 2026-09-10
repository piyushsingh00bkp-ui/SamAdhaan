from typing import List, Optional
from pydantic import BaseModel, Field

class SolutionItem(BaseModel):
    title: str = Field(description="Name or title of proposed solution")
    description: str = Field(description="Actionable technical and implementation details")
    approach_type: str = Field(description="e.g. Rapid Remediation, Sustainable Long-Term, Community-Driven")
    estimated_cost: str = Field(description="Budget estimation in INR, e.g. ₹2,50,000")
    timeline: str = Field(description="Expected time to deploy, e.g. 7-14 Days")
    feasibility_score: int = Field(default=85, description="Feasibility score 0-100")
    key_steps: List[str] = Field(default_factory=list, description="Step by step execution roadmap")
    required_stakeholders: List[str] = Field(default_factory=list, description="e.g. Municipal PWD, University Lab, CSR Partner")

class SolutionRequest(BaseModel):
    problem: str = Field(min_length=5, description="Citizen civic problem description")
    category: Optional[str] = Field(default="Infrastructure", description="Civic category")
    location: Optional[str] = Field(default="Pune, Maharashtra", description="Location name")
    gemini_api_key: Optional[str] = Field(default=None, description="Optional custom Gemini key")

class SolutionResponse(BaseModel):
    problem: str
    category: str
    solutions: List[SolutionItem]
    generated_at: Optional[str] = None
