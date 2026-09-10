import re
from app.config import settings
from app.core.llm import get_gemini_client

COPILOT_SYSTEM_PROMPT = """
You are the SAMADHAAN AI Copilot — an expert AI advisor for India's civic problem-solving, urban infrastructure, municipal escalation, university R&D, and CSR funding platform.

Your goals:
1. Provide helpful, actionable, and encouraging answers to citizens, municipal officers, university researchers, and CSR sponsors.
2. Explain civic grievance reporting, pothole repair protocols (cold-mix asphalt, geogrid), drainage & waterlogging solutions, and waste management.
3. Guide users on CSR grant opportunities (under Companies Act Section 135 & Schedule VII), university collaboration (e.g. COEP, IIT Bombay), and municipal SLA tracking.
4. Keep answers clear, structured with markdown bullet points, friendly, and concise.
5. If the user greets you (e.g. "hi", "hello", "hey"), greet them warmly and suggest 3 helpful things they can do on SAMADHAAN (Report a civic defect, match with CSR funds, or explore university research).
"""

def chat_with_copilot(message: str, history: list = None) -> dict:
    """
    Generate dynamic live response using Google Gemini.
    """
    user_msg = (message or "").strip()
    if not user_msg:
        return {
            "reply": "Hello! I am your **SAMADHAAN AI Copilot**. How can I help you today with civic problem reporting, municipal escalation, or CSR matching?",
            "answer": "Hello! I am your **SAMADHAAN AI Copilot**. How can I help you today?",
            "links": [
                {"title": "Report a Problem", "url": "/problems/new"},
                {"title": "Browse Problems", "url": "/problems"},
                {"title": "University Hub", "url": "/universities"}
            ]
        }

    # If Gemini is configured, use live LLM
    if settings.GEMINI_API_KEY:
        try:
            client = get_gemini_client()
            chat_context = f"{COPILOT_SYSTEM_PROMPT}\n\n"
            if history:
                for turn in history[-5:]:
                    role = turn.get("role", "user")
                    text = turn.get("content") or turn.get("text", "")
                    if text:
                        chat_context += f"{role.upper()}: {text}\n"

            chat_context += f"USER: {user_msg}\nASSISTANT:"

            for model_name in [settings.GEMINI_MODEL, "gemini-3.7-flash", "gemini-3.5-flash-lite"]:
                try:
                    res = client.models.generate_content(
                        model=model_name,
                        contents=chat_context,
                        config={"temperature": 0.4}
                    )
                    if res.text and res.text.strip():
                        reply_text = res.text.strip()
                        return {
                            "reply": reply_text,
                            "answer": reply_text,
                            "links": [
                                {"title": "Explore Open Issues", "url": "/problems"},
                                {"title": "University Research Hub", "url": "/universities"},
                                {"title": "CSR Grants Portal", "url": "/industry"}
                            ]
                        }
                except Exception:
                    continue
        except Exception:
            pass

    # Heuristic fallback
    return {
        "reply": f"Hello! I received your inquiry about: '{user_msg}'. You can use SAMADHAAN to report civic infrastructure defects, match with university research labs like COEP and IIT Bombay, or apply for CSR innovation grants.",
        "answer": f"Hello! I received your inquiry about: '{user_msg}'.",
        "links": [
            {"title": "Report Problem", "url": "/problems/new"},
            {"title": "Explore Solutions", "url": "/solutions"}
        ]
    }

def detect_action_type(question: str) -> str:
    """
    Detect what the user wants from SamAdhaan Copilot.
    """

    text = question.lower().strip()

    if any(word in text for word in [
        "roadmap",
        "road map",
        "milestone",
        "timeline"
    ]):
        return "ROADMAP"

    if any(word in text for word in [
        "technology",
        "technologies",
        "tech stack",
        "framework",
        "tools"
    ]):
        return "TECHNOLOGY"

    if any(word in text for word in [
        "budget",
        "cost",
        "₹",
        "rupees",
        "lakh",
        "crore"
    ]):
        return "BUDGET"

    if any(word in text for word in [
        "progress",
        "status",
        "summary",
        "summarize"
    ]):
        return "PROGRESS_SUMMARY"

    if any(word in text for word in [
        "next",
        "next step",
        "what should we do"
    ]):
        return "NEXT_ACTION"

    if any(word in text for word in [
        "proposal",
        "government proposal",
        "official proposal"
    ]):
        return "GOVERNMENT_PROPOSAL"

    return "GENERAL"


def generate_roadmap() -> str:

    return """
Project Roadmap

Phase 1: Requirement Analysis
• Identify the project's primary objectives
• Define target users and stakeholders
• Document functional requirements

Phase 2: System Design
• Design system architecture
• Define database structure
• Define API requirements
• Prepare security and access-control strategy

Phase 3: Development
• Develop core backend services
• Develop frontend modules
• Integrate required AI services
• Implement database connectivity

Phase 4: Testing
• Functional testing
• API testing
• Security testing
• Performance testing
• User acceptance testing

Phase 5: Deployment
• Production infrastructure setup
• Database deployment
• Monitoring and logging
• Security verification

Phase 6: Monitoring & Improvement
• Monitor system performance
• Collect user feedback
• Track project KPIs
• Continuously improve the solution
""".strip()


def generate_technology_recommendation() -> str:

    return """
Recommended Technology Stack

Frontend:
• React
• HTML5
• CSS3
• JavaScript / TypeScript

Backend:
• Python
• FastAPI
• REST APIs

AI:
• Gemini
• Python AI services
• Retrieval-Augmented Generation (RAG)

Database:
• PostgreSQL

Infrastructure:
• Docker
• Git
• CI/CD pipeline

Security:
• Firebase Authentication
• Role-based access control
• API validation
• Secure environment variables

This stack provides a scalable foundation for an AI-powered civic platform.
""".strip()


def generate_budget() -> str:

    return """
Illustrative ₹10 Lakh Project Budget

1. Software Development       ₹3,00,000
2. AI & Machine Learning      ₹2,00,000
3. Cloud Infrastructure       ₹1,25,000
4. Database & Storage         ₹75,000
5. Security & Testing         ₹75,000
6. UI/UX & Accessibility      ₹50,000
7. Monitoring & Maintenance   ₹75,000
8. Contingency                ₹1,00,000

Total                         ₹10,00,000

Note:
This is an illustrative planning estimate. Actual government project
costs should be prepared using current procurement rates, staffing
requirements, infrastructure requirements and applicable policies.
""".strip()


def generate_progress_summary() -> str:

    return """
Project Progress Summary

The project should be evaluated across five major dimensions:

1. Product Development
   • Core features implemented
   • Frontend and backend integration

2. AI Development
   • AI models and services integrated
   • Classification and analysis capabilities

3. Infrastructure
   • Database availability
   • API reliability
   • Deployment readiness

4. Testing
   • Functional tests completed
   • Security and performance tests completed

5. Deployment
   • Production environment configured
   • Monitoring and logging enabled

The next progress review should identify incomplete milestones,
technical blockers and deployment risks.
""".strip()


def generate_next_actions() -> str:

    return """
Recommended Next Actions

1. Review the current project milestone status.
2. Identify the highest-priority unfinished feature.
3. Validate backend and database integration.
4. Test AI outputs against realistic project data.
5. Complete security and access-control checks.
6. Perform end-to-end testing.
7. Prepare the deployment environment.
8. Define measurable project KPIs.

Priority should be given to blockers that prevent the project
from reaching production readiness.
""".strip()


def generate_government_proposal() -> str:

    return """
Government Project Proposal Structure

1. Executive Summary
   Explain the civic problem and the proposed solution.

2. Problem Statement
   Describe the existing challenges faced by citizens and authorities.

3. Proposed Solution
   Explain how the SamAdhaan platform addresses these challenges.

4. AI Capabilities
   Describe classification, prioritization, routing, analytics
   and decision-support capabilities.

5. Implementation Plan
   Define development, testing, deployment and monitoring phases.

6. Expected Impact
   Describe expected improvements in response time, transparency,
   citizen participation and administrative efficiency.

7. Budget
   Provide an itemized implementation and operational estimate.

8. Monitoring & Evaluation
   Define KPIs and reporting mechanisms.

9. Sustainability
   Explain long-term maintenance, scalability and governance.

10. Conclusion
    Summarize the expected public value of the project.
""".strip()


def generate_general_answer(question: str) -> str:

    return (
        "SamAdhaan Project Copilot received your request. "
        "The project context should be retrieved from the project's "
        "database and knowledge base before generating a final "
        "project-specific recommendation."
    )


def generate_copilot_response(
    project_id: str,
    question: str
) -> dict:

    action_type = detect_action_type(question)

    if action_type == "ROADMAP":
        answer = generate_roadmap()

    elif action_type == "TECHNOLOGY":
        answer = generate_technology_recommendation()

    elif action_type == "BUDGET":
        answer = generate_budget()

    elif action_type == "PROGRESS_SUMMARY":
        answer = generate_progress_summary()

    elif action_type == "NEXT_ACTION":
        answer = generate_next_actions()

    elif action_type == "GOVERNMENT_PROPOSAL":
        answer = generate_government_proposal()

    else:
        answer = generate_general_answer(question)

    return {
        "project_id": project_id,
        "question": question,
        "answer": answer,
        "action_type": action_type,
        "confidence": 75
    }
    