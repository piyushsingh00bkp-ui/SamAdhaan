from pydantic import BaseModel, Field


class Project(BaseModel):

    project_id: str = Field(
        description="Unique project identifier"
    )

    project_name: str = Field(
        description="Project name"
    )

    description: str = Field(
        description="Project description"
    )

    problem_statement: str = Field(
        description="Problem the project aims to solve"
    )

    objectives: list[str] = Field(
        default=[],
        description="Project objectives"
    )

    technologies: list[str] = Field(
        default=[],
        description="Technologies used in the project"
    )

    budget: float = Field(
        default=0,
        ge=0,
        description="Project budget in INR"
    )

    status: str = Field(
        default="Planning",
        description="Current project status"
    )

    progress: int = Field(
        default=0,
        ge=0,
        le=100,
        description="Project completion percentage"
    )

    team_size: int = Field(
        default=1,
        ge=1,
        description="Number of project team members"
    )

    start_date: str = Field(
        default="",
        description="Project start date"
    )

    target_date: str = Field(
        default="",
        description="Expected completion date"
    )

    milestones: list[str] = Field(
        default=[],
        description="Project milestones"
    )