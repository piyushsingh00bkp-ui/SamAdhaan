from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class CopilotRequest(BaseModel):
    project_id: Optional[str] = "global"
    question: Optional[str] = ""
    message: Optional[str] = ""
    query: Optional[str] = ""
    history: Optional[List[Dict[str, Any]]] = []


class CopilotLink(BaseModel):
    title: str
    url: str


class CopilotResponse(BaseModel):
    project_id: Optional[str] = "global"
    question: Optional[str] = ""
    answer: str
    reply: Optional[str] = None
    action_type: Optional[str] = "GENERAL"
    confidence: Optional[int] = 95
    links: Optional[List[CopilotLink]] = []
    suggestedFollowUps: Optional[List[str]] = []