@echo off
title SAMADHAAN Full Stack Launcher
echo ========================================================
echo   🏛️ Launching SAMADHAAN Full-Stack Platform
echo   1. AI Engine     -> http://localhost:8000/docs
echo   2. Backend API   -> http://localhost:5000/api/docs
echo   3. Frontend App  -> http://localhost:5173
echo ========================================================

start "SAMADHAAN AI Engine (8000)" cmd /k "%~dp0start-ai-engine.bat"
timeout /t 2 /nobreak >nul

start "SAMADHAAN Backend (5000)" cmd /k "%~dp0start-backend.bat"
timeout /t 2 /nobreak >nul

start "SAMADHAAN Frontend (5173)" cmd /k "%~dp0start-frontend.bat"

echo All services launched!
