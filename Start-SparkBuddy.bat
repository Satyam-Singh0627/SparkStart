@echo off
title SparkBuddy Desktop Companion
cd /d "%~dp0apps\desktop"
echo [*] Launching SparkBuddy...
set ELECTRON_RUN_AS_NODE=
npx electron .
if %ERRORLEVEL% neq 0 (
    echo.
    echo [*] Ensuring renderer build is up to date...
    npm run build
    npx electron .
)
