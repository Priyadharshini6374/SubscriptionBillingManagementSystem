@echo off
title BillSphere SaaS Billing Platform
cd /d "%~dp0"
echo ============================================================
echo   Starting BillSphere SaaS Subscription & Billing System
echo ============================================================
echo.
echo Opening browser at http://localhost:3000 ...
start http://localhost:3000
echo Running Vite dev server...
npm run dev
pause
