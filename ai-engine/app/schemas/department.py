from pydantic import BaseModel


class DepartmentRequest(BaseModel):
    problem: str
    category: str = ""


class DepartmentResponse(BaseModel):
    problem: str
    category: str
    department: str
    routing_method: str