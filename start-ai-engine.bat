@echo off
title SAMADHAAN - AI Engine (Port 8000)
cd /d "%~dp0ai-engine"
echo ========================================================
echo  Starting SAMADHAAN AI Engine (FastAPI) on Port 8000
echo ========================================================
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
