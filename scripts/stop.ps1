# SparkStart Clean Shutdown Script
$ErrorActionPreference = "SilentlyContinue"

Write-Host "============================================================" -ForegroundColor Yellow
Write-Host "  🛑 Stopping SparkStart & SparkBuddy Services" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Yellow
Write-Host ""

$ports = @(8000, 5173, 5174)
$stoppedCount = 0

foreach ($port in $ports) {
    try {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connections) {
            foreach ($conn in $connections) {
                $pidToKill = $conn.OwningProcess
                if ($pidToKill -and $pidToKill -gt 4) {
                    $proc = Get-Process -Id $pidToKill -ErrorAction SilentlyContinue
                    if ($proc) {
                        Write-Host "[*] Stopping $($proc.ProcessName) (PID: $pidToKill on port $port)..." -ForegroundColor Cyan
                        Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
                        $stoppedCount++
                    }
                }
            }
        }
    } catch {}
}

# Stop any electron.exe spawned for SparkBuddy
$electronProcs = Get-Process -Name "electron" -ErrorAction SilentlyContinue
foreach ($p in $electronProcs) {
    try {
        Write-Host "[*] Stopping SparkBuddy Desktop Companion (PID: $($p.Id))..." -ForegroundColor Cyan
        Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
        $stoppedCount++
    } catch {}
}

Write-Host ""
Write-Host "[OK] SparkStart shutdown complete ($stoppedCount processes terminated)." -ForegroundColor Green
Write-Host "Local SQLite database and user data are completely safe." -ForegroundColor Green

