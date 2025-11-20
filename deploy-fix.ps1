# Script de déploiement rapide - Elite Visuals
# Corrige le problème Konva SSR et déploie sur Vercel

Write-Host "🚀 Elite Visuals - Déploiement des Corrections Konva SSR" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si on est dans un repo git
if (-not (Test-Path ".git")) {
    Write-Host "❌ Erreur: Pas dans un dépôt Git" -ForegroundColor Red
    Write-Host "   Assurez-vous d'être dans le dossier elite-visuals" -ForegroundColor Yellow
    exit 1
}

# Afficher le statut
Write-Host "📊 Statut Git:" -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "📝 Fichiers critiques à vérifier:" -ForegroundColor Yellow

# Vérifier les fichiers critiques
$criticalFiles = @(
    "next.config.js",
    "components\board\KonvaWrapper.tsx",
    "components\board\InfiniteBoard.tsx",
    "app\showroom\[id]\page.tsx"
)

$allFilesExist = $true
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file (MANQUANT)" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host ""
    Write-Host "❌ Certains fichiers critiques sont manquants!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔍 Vérification de la configuration webpack..." -ForegroundColor Yellow

# Vérifier que next.config.js contient la config webpack
$nextConfigContent = Get-Content "next.config.js" -Raw
if ($nextConfigContent -match "config.externals.*canvas.*konva") {
    Write-Host "   ✅ Configuration webpack présente" -ForegroundColor Green
} else {
    Write-Host "   ❌ Configuration webpack manquante ou incorrecte" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Ajout des fichiers au commit..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "💾 Création du commit..." -ForegroundColor Yellow
$commitMessage = @"
fix: Resolve Konva SSR issue for Vercel deployment

- Add KonvaWrapper with dynamic imports (ssr: false)
- Update next.config.js webpack configuration
- Exclude canvas/konva from server bundle
- Force browser version of Konva
- Update InfiniteBoard and Showroom to use dynamic imports
- Fix TypeScript type mismatches
- Add accessibility attributes to buttons
"@

git commit -m $commitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "⚠️  Aucun changement à commiter ou erreur de commit" -ForegroundColor Yellow
    Write-Host "   Vérifiez si les fichiers ont déjà été commités" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🌐 Push vers GitHub..." -ForegroundColor Yellow
Write-Host "   Branche: main" -ForegroundColor Cyan

git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Erreur lors du push" -ForegroundColor Red
    Write-Host "   Essayez manuellement: git push origin main" -ForegroundColor Yellow
    Write-Host "   Ou si votre branche est 'master': git push origin master" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✅ Push réussi!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "   1. Aller sur https://vercel.com/dashboard" -ForegroundColor White
Write-Host "   2. Vérifier que le nouveau déploiement démarre" -ForegroundColor White
Write-Host "   3. Suivre les logs de build" -ForegroundColor White
Write-Host "   4. Le build devrait réussir cette fois!" -ForegroundColor White
Write-Host ""
Write-Host "📊 Commit Hash:" -ForegroundColor Yellow
git log --oneline -1
Write-Host ""
Write-Host "🎉 Déploiement lancé avec succès!" -ForegroundColor Green
Write-Host ""
