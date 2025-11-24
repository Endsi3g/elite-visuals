# Script PowerShell pour exécuter Lighthouse CI
# Usage: .\scripts\lighthouse-ci.ps1

Write-Host "🔦 Lighthouse CI - Performance Audit" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si lhci est installé
$lhciInstalled = Get-Command lhci -ErrorAction SilentlyContinue

if (-not $lhciInstalled) {
    Write-Host "📦 Installing Lighthouse CI..." -ForegroundColor Yellow
    npm install -g @lhci/cli@0.12.x
}

# Build l'application
Write-Host "🏗️ Building application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Démarrer le serveur en arrière-plan
Write-Host "🚀 Starting server..." -ForegroundColor Yellow
$serverProcess = Start-Process -FilePath "npm" -ArgumentList "run", "start" -PassThru -NoNewWindow

# Attendre que le serveur démarre
Write-Host "⏳ Waiting for server to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

try {
    # Exécuter Lighthouse CI
    Write-Host "🔦 Running Lighthouse audits..." -ForegroundColor Yellow
    lhci autorun
    
    $exitCode = $LASTEXITCODE
    
    if ($exitCode -eq 0) {
        Write-Host "✅ Lighthouse CI completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Results saved in .lighthouseci/ directory" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️ Lighthouse CI completed with warnings" -ForegroundColor Yellow
    }
} finally {
    # Arrêter le serveur
    Write-Host "🛑 Stopping server..." -ForegroundColor Yellow
    Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "✨ Done!" -ForegroundColor Green
