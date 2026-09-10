from pydantic import BaseModel


class Complaint(BaseModel):
    category: str


class TrendRequest(BaseModel):
    current_complaints: list[Complaint]
    previous_complaints: list[Complaint]


class TrendResponse(BaseModel):
    emerging_issue: str
    current_count: int
    previous_count: int
    change_percentage: float
    trend_direction: str
    status: str