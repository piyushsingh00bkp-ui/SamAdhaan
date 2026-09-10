from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

from app.api.problem_routes import router as problem_router
from app.api.solution_routes import router as solution_router
from app.api.multilingual_routes import router as multilingual_router
from app.api.categorization_routes import router as categorization_router
from app.api.severity_routes import router as severity_router
from app.api.duplicate_routes import router as duplicate_router
from app.api.matching_routes import router as matching_router
from app.api.vision_routes import router as vision_router
from app.api.voice_routes import router as voice_router
from app.api.department_routes import router as department_router
from app.api.impact_routes import router as impact_router
from app.api.trend_routes import router as trend_router
from app.api.spam_routes import router as spam_router
from app.api.report_routes import router as report_router
from app.api.copilot_routes import router as copilot_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "AI services powering the SamAdhaan "
        "civic problem-solving platform."
    )
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# API ROUTES
# --------------------------------------------------

app.include_router(problem_router)
app.include_router(solution_router)
app.include_router(multilingual_router)
app.include_router(categorization_router)
app.include_router(severity_router)
app.include_router(duplicate_router)
app.include_router(matching_router)
app.include_router(vision_router)
app.include_router(voice_router)
app.include_router(department_router)
app.include_router(impact_router)
app.include_router(trend_router)
app.include_router(spam_router)
app.include_router(report_router)
app.include_router(copilot_router)
# --------------------------------------------------
# ROOT
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "online"
    }


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }