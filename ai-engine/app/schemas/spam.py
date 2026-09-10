from pydantic import BaseModel, Field


class SpamRequest(BaseModel):

    problem: str = Field(
        description="Citizen's complaint text"
    )

    previous_complaints: list[str] = Field(
        default=[],
        description="Previous complaints submitted by the user"
    )

    duplicate_account: bool = Field(
        default=False,
        description="Whether the account appears duplicated"
    )

    irrelevant_image: bool = Field(
        default=False,
        description="Whether the attached image appears irrelevant"
    )


class SpamResponse(BaseModel):

    trust_score: int
    status: str

    duplicate_account: bool
    repeated_complaint: bool
    spam_text: bool
    irrelevant_image: bool

    suspicious_submission: bool
    human_verification_required: bool