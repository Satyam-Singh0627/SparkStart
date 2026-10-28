# SparkStart & SparkBuddy PowerShell Unified Launcher
[CmdletBinding()]
param(
    [switch]$SkipDesktop = $false,
    [switch]$NoBrowser = $false
)

$ErrorActionPreference = "Stop"
$rootDir = (Resolve-Path "$PSScriptRoot\..").Path
Set-Location $rootDir

Write-Host "============================================================" -ForegroundColor Green
Write-Host "  SparkStart + SparkBuddy -- Unified Launcher" -ForegroundColor Green
Write-Host "  Small steps. Real progress." -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""

# 1. Logs directory
$logDir = Join-Path $rootDir "logs"
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

# 2. Check .env
$envFile = Join-Path $rootDir ".env"
$envExample = Join-Path $rootDir ".env.example"
if (-not (Test-Path $envFile) -and (Test-Path $envExample)) {
    Write-Host "[*] Creating .env from .env.example..." -ForegroundColor Cyan
    Copy-Item $envExample $envFile
}

# 3. Check Python and Node
$pythonExe = Join-Path $rootDir ".venv\Scripts\python.exe"
if (-not (Test-Path $pythonExe)) {
    Write-Host "[ERROR] Python virtual environment not found at: $pythonExe" -ForegroundColor Red
    Write-Host "Please create the virtual environment (.venv) first." -ForegroundColor Red
    exit 1
}

$nodeCmd = Get-Command "node" -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
    Write-Host "[ERROR] Node.js is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

# 4. Helper function to test port response
function Test-HttpEndpoint {
    param([string]$Url, [int]$TimeoutSec = 2)
    try {
        $res = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec $TimeoutSec -ErrorAction Stop
        if ($res.StatusCode -eq 200) { return $true }
    } catch {
        return $false
    }
    return $false
}

# 5. Start / Check FastAPI Backend (Port 8000)
Write-Host "[*] Checking FastAPI Backend..." -ForegroundColor Cyan
$backendHealthy = Test-HttpEndpoint "http://127.0.0.1:8000/api/health"

if (-not $backendHealthy) {
    Write-Host "[*] Starting FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Cyan
    $apiLog = Join-Path $logDir "backend.log"
    $apiErrLog = Join-Path $logDir "backend_err.log"
    $backendProcess = Start-Process -FilePath $pythonExe `
        -ArgumentList "-m uvicorn services.api.main:app --host 127.0.0.1 --port 8000" `
        -WorkingDirectory $rootDir `
        -WindowStyle Hidden `
        -RedirectStandardOutput $apiLog `
        -RedirectStandardError $apiErrLog `
        -PassThru

    $attempts = 0
    $maxAttempts = 30
    while ($attempts -lt $maxAttempts) {
        Start-Sleep -Milliseconds 500
        if (Test-HttpEndpoint "http://127.0.0.1:8000/api/health") {
            $backendHealthy = $true
            break
        }
        $attempts++
    }

    if (-not $backendHealthy) {
        Write-Host "[!] Warning: Backend health check took longer than expected. Check logs\backend.log" -ForegroundColor Yellow
    } else {
        Write-Host "  -> FastAPI Backend is Ready at http://127.0.0.1:8000" -ForegroundColor Green
    }
} else {
    Write-Host "  -> FastAPI Backend is already running at http://127.0.0.1:8000" -ForegroundColor Green
}

# 6. Start / Check Web Dashboard (Vite on 5173 or 5174)
Write-Host "[*] Checking SparkStart Web Dashboard..." -ForegroundColor Cyan
$activeWebUrl = $null
if (Test-HttpEndpoint "http://localhost:5173/") { $activeWebUrl = "http://localhost:5173/" }
elseif (Test-HttpEndpoint "http://localhost:5174/") { $activeWebUrl = "http://localhost:5174/" }

if (-not $activeWebUrl) {
    Write-Host "[*] Starting Vite Web Dashboard..." -ForegroundColor Cyan
    $webLog = Join-Path $logDir "web.log"
    $webErrLog = Join-Path $logDir "web_err.log"
    $webProcess = Start-Process -FilePath "cmd.exe" `
        -ArgumentList "/c npm run dev:web" `
        -WorkingDirectory $rootDir `
        -WindowStyle Hidden `
        -RedirectStandardOutput $webLog `
        -RedirectStandardError $webErrLog `
        -PassThru

    $attempts = 0
    $maxAttempts = 40
    while ($attempts -lt $maxAttempts) {
        Start-Sleep -Milliseconds 500
        if (Test-HttpEndpoint "http://localhost:5173/") {
            $activeWebUrl = "http://localhost:5173/"
            break
        }
        if (Test-HttpEndpoint "http://localhost:5174/") {
            $activeWebUrl = "http://localhost:5174/"
            break
        }
        $attempts++
    }

    if (-not $activeWebUrl) {
        $activeWebUrl = "http://localhost:5173/"
        Write-Host "[!] Web dashboard startup took longer than expected. Check logs\web.log" -ForegroundColor Yellow
    } else {
        Write-Host "  -> SparkStart Web Dashboard is Ready at $activeWebUrl" -ForegroundColor Green
    }
} else {
    Write-Host "  -> SparkStart Web Dashboard is already running at $activeWebUrl" -ForegroundColor Green
}

# 6b. Start Port 5174 Redirector (so reload on localhost:5174 instantly routes to 5173)
$redirectScript = Join-Path $rootDir "scripts\redirect-5174.cjs"
if (Test-Path $redirectScript) {
    try {
        Start-Process -FilePath "node.exe" `
            -ArgumentList "`"$redirectScript`"" `
            -WorkingDirectory $rootDir `
            -WindowStyle Hidden
    } catch {}
}

# 7. Open Browser
if (-not $NoBrowser -and $activeWebUrl) {
    Write-Host "[*] Opening $activeWebUrl in your default browser..." -ForegroundColor Cyan
    try {
        Start-Process $activeWebUrl
    } catch {
        Write-Host "[!] Could not open browser automatically. Please open: $activeWebUrl" -ForegroundColor Yellow
    }
}

# 8. Launch SparkBuddy Desktop Companion
if (-not $SkipDesktop) {
    Write-Host "[*] Launching SparkBuddy Desktop Companion..." -ForegroundColor Cyan
    $desktopDir = Join-Path $rootDir "apps\desktop"
    $desktopLog = Join-Path $logDir "desktop.log"
    $desktopErrLog = Join-Path $logDir "desktop_err.log"
    
    try {
        Start-Process -FilePath "node.exe" `
            -ArgumentList "launch-electron.cjs" `
            -WorkingDirectory $desktopDir `
            -WindowStyle Hidden `
            -RedirectStandardOutput $desktopLog `
            -RedirectStandardError $desktopErrLog
        Write-Host "  -> SparkBuddy companion started." -ForegroundColor Green
    } catch {
        Write-Host "[!] Desktop companion launch skipped or requires desktop session." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  SparkStart Application is Live!" -ForegroundColor Green
Write-Host ""
Write-Host "  - Web Dashboard:     $activeWebUrl" -ForegroundColor White
Write-Host "  - FastAPI Backend:   http://127.0.0.1:8000" -ForegroundColor White
Write-Host "  - API Documentation: http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host "  - Chrome Extension:  apps/extension (Load unpacked in chrome://extensions)" -ForegroundColor White
Write-Host ""
Write-Host "  Press Ctrl+C or run Stop-SparkStart.bat to shut down." -ForegroundColor DarkGray
Write-Host "============================================================" -ForegroundColor Green

# 9. Keep processes alive and monitor
Write-Host "[*] Services are actively running in background. Monitoring..." -ForegroundColor Cyan
try {
    while ($true) {
        Start-Sleep -Seconds 2
    }
} finally {
    Write-Host "[*] Shutting down services..." -ForegroundColor Yellow
    if ($backendProcess -and -not $backendProcess.HasExited) { Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue }
    if ($webProcess -and -not $webProcess.HasExited) { Stop-Process -Id $webProcess.Id -Force -ErrorAction SilentlyContinue }
}
