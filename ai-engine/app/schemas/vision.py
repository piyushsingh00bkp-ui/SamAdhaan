from typing import List, Optional, Any
from pydantic import BaseModel, Field


class VisionRequest(BaseModel):
    image: Optional[str] = Field(default=None, description="Base64 data or image path")
    image_path: Optional[str] = Field(default=None, description="Local path to image")
    mime_type: Optional[str] = Field(default="image/jpeg", description="MIME type")
    title: Optional[str] = Field(default="", description="Reported problem title")
    description: Optional[str] = Field(default="", description="Reported problem description")
    category: Optional[str] = Field(default="", description="Selected category")


class AuthenticityResult(BaseModel):
    status: str = Field(description="AUTHENTIC, FAKE_OR_UNRELATED, or UNCERTAIN")
    confidence: int = Field(ge=0, le=100, description="Authenticity confidence percentage")
    is_authentic: bool = Field(default=True, description="Whether the image is genuine civic evidence")
    matches_description: bool = Field(default=True, description="Whether the image matches the title & description")
    indicators: List[str] = Field(default=[], description="Visual evidence indicators")
    reasoning: Optional[str] = Field(default="", description="Detailed authenticity rationale")


class DetectedIssue(BaseModel):
    issue: str
    confidence: int = Field(default=90, ge=0, le=100)
    severity: int = Field(default=80, ge=0, le=100)
    description: str = ""
    affected_objects: List[str] = []


class VisionResult(BaseModel):
    image_description: str
    is_authentic: bool = True
    authenticity_score: int = 90
    matches_description: bool = True
    match_explanation: str = "Image visually confirms the reported civic defect."
    is_prioritized: bool = True
    warning_message: Optional[str] = None
    
    authenticity: Optional[AuthenticityResult] = None
    defects: List[str] = []
    issues: List[DetectedIssue] = []
    primary_issue: str = "Infrastructure Defect"
    category: str = "Infrastructure"
    suggested_category: str = "Infrastructure"
    severity: int = Field(default=80, ge=0, le=100)
    damage_severity: str = "High (80%)"
    recommendation: str = "Deploy municipal road/drainage repair crew."