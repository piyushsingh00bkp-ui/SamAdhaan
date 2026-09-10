from sqlalchemy import Column, String, Text, Integer, Float, JSON

from app.database import Base


class ProjectModel(Base):

    __tablename__ = "projects"

    project_id = Column(
        String(100),
        primary_key=True,
        index=True
    )

    project_name = Column(
        String(255),
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    problem_statement = Column(
        Text,
        nullable=False
    )

    objectives = Column(
        JSON,
        default=list
    )

    technologies = Column(
        JSON,
        default=list
    )

    budget = Column(
        Float,
        default=0
    )

    status = Column(
        String(100),
        default="Planning"
    )

    progress = Column(
        Integer,
        default=0
    )

    team_size = Column(
        Integer,
        default=1
    )

    start_date = Column(
        String(50),
        default=""
    )

    target_date = Column(
        String(50),
        default=""
    )

    milestones = Column(
        JSON,
        default=list
    )