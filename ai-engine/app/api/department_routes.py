from fastapi import APIRouter

from app.schemas.department import (
    DepartmentRequest,
    DepartmentResponse
)

from app.services.department_router import route_department


router = APIRouter(
    prefix="/api/v1/department",
    tags=["Government Department Router"]
)


@router.post(
    "/route",
    response_model=DepartmentResponse
)
async def route_department_api(data: DepartmentRequest):

    result = route_department(
        problem=data.problem,
        category=data.category
    )

    return DepartmentResponse(
        problem=data.problem,
        category=data.category or "Other",
        department=result["department"],
        routing_method=result["routing_method"]
    )