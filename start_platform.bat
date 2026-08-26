@echo off
title AI Risk Manager Startup Utility
echo ===================================================
echo   🛡️  AI RISK MANAGER - STARTUP UTILITY
echo ===================================================
echo.

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/ and try again.
    pause
    exit /b
)

:: Check if node_modules exist, if not, install them
if not exist "node_modules\" (
    echo [INFO] First time run detected. Installing dependencies...
    call npm run postinstall
)

:: Ask if user wants to seed the database
echo [?] Do you want to seed the database before starting? (y/n)
set /p seed_choice="> "
if /I "%seed_choice%"=="y" (
    echo Seeding database...
    call npm run seed
)

echo.
echo Starting Backend API Server...
start "AI Risk Manager Backend" cmd /c "npm run dev --prefix server"

echo Starting Frontend Dev Server...
start "AI Risk Manager Frontend" cmd /c "npm run dev --prefix client"

echo Waiting for servers to initialize...
timeout /t 4 /nobreak >nul

echo Launching browser...
start http://localhost:3000

echo.
echo ===================================================
echo   🚀  AI Risk Manager is now running!
echo   👉  Frontend: http://localhost:3000
echo   👉  Backend:  http://localhost:5000/api
echo ===================================================
echo.
echo To stop the servers, close the command prompt windows that popped up.
pause
