# Script de configuration automatique de l'environnement
# Usage: .\setup-environment.ps1

Write-Host "🚀 Elite Visuals - Configuration de l'environnement" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Vérifier la politique d'exécution
Write-Host "📋 Vérification de la politique d'exécution..." -ForegroundColor Yellow
$currentPolicy = Get-ExecutionPolicy -Scope CurrentUser
Write-Host "Politique actuelle: $currentPolicy" -ForegroundColor Cyan

if ($currentPolicy -eq "Restricted" -or $currentPolicy -eq "Undefined") {
    Write-Host "⚠️ Politique trop restrictive. Configuration..." -ForegroundColor Yellow
    try {
        Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
        Write-Host "✅ Politique d'exécution configurée" -ForegroundColor Green
    } catch {
        Write-Host "❌ Impossible de changer la politique. Exécutez ce script en tant qu'administrateur." -ForegroundColor Red
        Write-Host "Ou exécutez manuellement: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✅ Politique d'exécution OK" -ForegroundColor Green
}
Write-Host ""

# 2. Vérifier Node.js et npm
Write-Host "📦 Vérification de Node.js et npm..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js ou npm n'est pas installé!" -ForegroundColor Red
    Write-Host "Téléchargez Node.js depuis: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# 3. Vérifier si node_modules existe
Write-Host "📁 Vérification de node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "⚠️ node_modules existe déjà" -ForegroundColor Yellow
    $response = Read-Host "Voulez-vous réinstaller? (O/N)"
    if ($response -eq "O" -or $response -eq "o") {
        Write-Host "🗑️ Suppression de node_modules..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force node_modules
        Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
        Write-Host "✅ Nettoyage terminé" -ForegroundColor Green
    }
} else {
    Write-Host "ℹ️ node_modules n'existe pas" -ForegroundColor Cyan
}
Write-Host ""

# 4. Installer les dépendances
Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
Write-Host "Cela peut prendre quelques minutes..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dépendances installées avec succès!" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 5. Vérifier les packages critiques
Write-Host "🔍 Vérification des packages critiques..." -ForegroundColor Yellow
$criticalPackages = @(
    "@testing-library/react",
    "@types/jest",
    "jest",
    "@playwright/test",
    "next",
    "react",
    "typescript"
)

$allInstalled = $true
foreach ($package in $criticalPackages) {
    npm list $package --depth=0 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $package" -ForegroundColor Green
    } else {
        Write-Host "❌ $package manquant" -ForegroundColor Red
        $allInstalled = $false
    }
}
Write-Host ""

# 6. Vérifier TypeScript
Write-Host "🔧 Vérification de TypeScript..." -ForegroundColor Yellow
if (Test-Path "node_modules\typescript\lib\tsserver.js") {
    Write-Host "✅ TypeScript installé correctement" -ForegroundColor Green
} else {
    Write-Host "⚠️ TypeScript non trouvé, réinstallation..." -ForegroundColor Yellow
    npm install typescript --save-dev
}
Write-Host ""

# 7. Résumé
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "📊 Résumé de la configuration" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

if ($allInstalled) {
    Write-Host "✅ Tous les packages critiques sont installés" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Configuration terminée avec succès!" -ForegroundColor Green
    Write-Host ""
    Write-Host "💡 Prochaines étapes:" -ForegroundColor Cyan
    Write-Host "  1. Redémarrer VS Code pour que TypeScript fonctionne" -ForegroundColor White
    Write-Host "  2. Exécuter 'npm test' pour lancer les tests" -ForegroundColor White
    Write-Host "  3. Exécuter 'npm run dev' pour démarrer le serveur" -ForegroundColor White
    Write-Host ""
    Write-Host "📚 Documentation: README.md" -ForegroundColor Cyan
} else {
    Write-Host "⚠️ Certains packages sont manquants" -ForegroundColor Yellow
    Write-Host "Essayez de réexécuter: npm install" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✨ Script terminé!" -ForegroundColor Green
