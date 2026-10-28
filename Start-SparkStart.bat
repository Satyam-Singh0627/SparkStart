@echo off
title SparkStart Launcher
cd /d "%~dp0"

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\launch.ps1"

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Startup encountered an issue. See details above.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ============================================================
echo   SparkStart is running. Keep this window open.
echo   To shut down cleanly, run Stop-SparkStart.bat
echo ============================================================
pause
