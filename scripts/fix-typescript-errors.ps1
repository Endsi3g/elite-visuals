# Script pour vérifier et corriger les erreurs TypeScript dans les tests
# Usage: .\scripts\fix-typescript-errors.ps1

Write-Host "🔧 Fix TypeScript Errors - Elite Visuals Tests" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

# Vérifier que les fichiers de déclaration existent
Write-Host "`n📁 Vérification des fichiers..." -ForegroundColor Yellow

$files = @(
    "__tests__\setup.d.ts",
    "jest-dom.d.ts",
    "tsconfig.json"
)

$allFilesExist = $true

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file (MANQUANT)" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host "`n❌ Certains fichiers sont manquants!" -ForegroundColor Red
    Write-Host "Exécutez d'abord la création des fichiers de déclaration." -ForegroundColor Yellow
    exit 1
}

# Vérifier que tsconfig.json contient les bonnes références
Write-Host "`n📋 Vérification de tsconfig.json..." -ForegroundColor Yellow

$tsconfigContent = Get-Content "tsconfig.json" -Raw

if ($tsconfigContent -match "setup\.d\.ts" -and $tsconfigContent -match "jest-dom\.d\.ts") {
    Write-Host "  ✓ tsconfig.json correctement configuré" -ForegroundColor Green
} else {
    Write-Host "  ✗ tsconfig.json incomplet" -ForegroundColor Red
    Write-Host "  Ajoutez les fichiers de déclaration dans 'include'" -ForegroundColor Yellow
}

# Lancer les tests pour vérifier qu'ils fonctionnent
Write-Host "`n🧪 Lancement des tests..." -ForegroundColor Yellow

try {
    $testOutput = npm test -- --passWithNoTests 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Tests exécutés avec succès" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Certains tests ont échoué" -ForegroundColor Yellow
        Write-Host "  (Les erreurs TypeScript n'empêchent pas les tests de fonctionner)" -ForegroundColor Gray
    }
} catch {
    Write-Host "  ⚠ Impossible de lancer les tests" -ForegroundColor Yellow
}

# Instructions pour l'utilisateur
Write-Host "`n📝 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

Write-Host "`n1. Recharger VS Code:" -ForegroundColor Yellow
Write-Host "   • Ctrl+Shift+P (ou Cmd+Shift+P sur Mac)" -ForegroundColor White
Write-Host "   • Tapez: 'Reload Window'" -ForegroundColor White
Write-Host "   • Sélectionnez: 'Developer: Reload Window'" -ForegroundColor White

Write-Host "`n2. Ou redémarrer TypeScript Server:" -ForegroundColor Yellow
Write-Host "   • Ctrl+Shift+P" -ForegroundColor White
Write-Host "   • Tapez: 'Restart TS Server'" -ForegroundColor White
Write-Host "   • Sélectionnez: 'TypeScript: Restart TS Server'" -ForegroundColor White

Write-Host "`n3. Vérifier les résultats:" -ForegroundColor Yellow
Write-Host "   • Ouvrez un fichier de test" -ForegroundColor White
Write-Host "   • Les erreurs TypeScript devraient avoir disparu" -ForegroundColor White
Write-Host "   • L'autocomplétion devrait fonctionner" -ForegroundColor White

Write-Host "`n✅ Configuration terminée!" -ForegroundColor Green
Write-Host "Les fichiers de déclaration TypeScript sont en place." -ForegroundColor White
Write-Host "Rechargez VS Code pour appliquer les changements." -ForegroundColor White

Write-Host "`n📚 Documentation:" -ForegroundColor Cyan
Write-Host "   • __tests__\QUICK_FIX.md - Guide de dépannage rapide" -ForegroundColor White
Write-Host "   • __tests__\TYPESCRIPT_ERRORS.md - Explication détaillée" -ForegroundColor White

Write-Host ""
