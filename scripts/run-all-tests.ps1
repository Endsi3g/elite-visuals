# Script PowerShell pour exécuter tous les tests
# Usage: .\scripts\run-all-tests.ps1

Write-Host "🧪 Elite Visuals - Suite de Tests Complète" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"
$testsPassed = 0
$testsFailed = 0

# Fonction pour afficher les résultats
function Show-TestResult {
    param($name, $success)
    if ($success) {
        Write-Host "✅ $name - PASSED" -ForegroundColor Green
        $script:testsPassed++
    } else {
        Write-Host "❌ $name - FAILED" -ForegroundColor Red
        $script:testsFailed++
    }
}

# 1. Tests Unitaires
Write-Host "📦 Running Unit Tests..." -ForegroundColor Yellow
npm test -- --passWithNoTests
Show-TestResult "Unit Tests" ($LASTEXITCODE -eq 0)
Write-Host ""

# 2. Tests E2E
Write-Host "🌐 Running E2E Tests..." -ForegroundColor Yellow
npm run test:e2e
Show-TestResult "E2E Tests" ($LASTEXITCODE -eq 0)
Write-Host ""

# 3. Tests d'Accessibilité
Write-Host "♿ Running Accessibility Tests..." -ForegroundColor Yellow
npm run test:accessibility
Show-TestResult "Accessibility Tests" ($LASTEXITCODE -eq 0)
Write-Host ""

# 4. Linting
Write-Host "🔍 Running Linter..." -ForegroundColor Yellow
npm run lint
Show-TestResult "Linting" ($LASTEXITCODE -eq 0)
Write-Host ""

# 5. Build Test
Write-Host "🏗️ Testing Production Build..." -ForegroundColor Yellow
npm run build
Show-TestResult "Production Build" ($LASTEXITCODE -eq 0)
Write-Host ""

# Résumé
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "📊 Test Summary" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ Passed: $testsPassed" -ForegroundColor Green
Write-Host "❌ Failed: $testsFailed" -ForegroundColor Red
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "🎉 All tests passed!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "⚠️ Some tests failed. Please review the output above." -ForegroundColor Yellow
    exit 1
}
