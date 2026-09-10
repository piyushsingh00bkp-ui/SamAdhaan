from fastapi import APIRouter

from app.schemas.copilot import (
    CopilotRequest,
    CopilotResponse,
    CopilotLink
)

from app.services.copilot_service import (
    chat_with_copilot,
    generate_copilot_response
)


router = APIRouter(
    prefix="/api/v1/copilot",
    tags=["SamAdhaan Project Copilot"]
)


@router.post(
    "/ask",
    response_model=CopilotResponse
)
@router.post(
    "/chat",
    response_model=CopilotResponse
)
async def ask_copilot(
    data: CopilotRequest
):
    query_text = (data.message or data.question or data.query or "").strip()

    # Generate real conversational response via Gemini
    chat_result = chat_with_copilot(
        message=query_text,
        history=data.history or []
    )

    reply_text = chat_result.get("reply") or chat_result.get("answer") or "I have processed your request."
    links = [CopilotLink(title=item["title"], url=item["url"]) for item in chat_result.get("links", [])]

    return CopilotResponse(
        project_id=data.project_id or "global",
        question=query_text,
        answer=reply_text,
        reply=reply_text,
        action_type="CONVERSATIONAL",
        confidence=96,
        links=links,
        suggestedFollowUps=[
            "How do I report a monsoon drainage issue?",
            "What CSR schemes fund solar water filtration?",
            "Which university labs work on asphalt durability?"
        ]
    )