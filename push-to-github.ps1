# Script PowerShell pour push Elite Visuals vers GitHub
# Usage: .\push-to-github.ps1

Write-Host "🚀 Elite Visuals - Push vers GitHub" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Git est installé
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git n'est pas installé. Installez-le depuis https://git-scm.com/" -ForegroundColor Red
    exit 1
}

# Vérifier si c'est déjà un repo Git
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initialisation du repository Git..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Repository Git initialisé" -ForegroundColor Green
} else {
    Write-Host "✅ Repository Git déjà initialisé" -ForegroundColor Green
}

# Configurer Git (si pas déjà fait)
$gitUser = git config user.name
if (-not $gitUser) {
    Write-Host ""
    Write-Host "⚙️ Configuration Git requise" -ForegroundColor Yellow
    $userName = Read-Host "Entrez votre nom GitHub"
    $userEmail = Read-Host "Entrez votre email GitHub"
    git config user.name "$userName"
    git config user.email "$userEmail"
    Write-Host "✅ Git configuré" -ForegroundColor Green
}

# Ajouter tous les fichiers
Write-Host ""
Write-Host "📝 Ajout des fichiers..." -ForegroundColor Yellow
git add .

# Commit
Write-Host ""
$commitMessage = Read-Host "Message de commit (Enter pour 'Initial commit - Elite Visuals MVP')"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Initial commit - Elite Visuals MVP"
}

git commit -m "$commitMessage"
Write-Host "✅ Commit créé" -ForegroundColor Green

# Vérifier si le remote existe
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Host ""
    Write-Host "🔗 Configuration du remote GitHub..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Créez d'abord un repository sur GitHub :" -ForegroundColor Cyan
    Write-Host "  1. Allez sur https://github.com/new" -ForegroundColor White
    Write-Host "  2. Nom du repo : elite-visuals" -ForegroundColor White
    Write-Host "  3. Description : Premier OS Créatif Collaboratif pour agences francophones" -ForegroundColor White
    Write-Host "  4. Public ou Private (votre choix)" -ForegroundColor White
    Write-Host "  5. NE PAS initialiser avec README (on a déjà les fichiers)" -ForegroundColor White
    Write-Host ""
    
    $repoUrl = Read-Host "Entrez l'URL du repository GitHub (ex: https://github.com/Endsi3g/elite-visuals.git)"
    
    if ([string]::IsNullOrWhiteSpace($repoUrl)) {
        Write-Host "❌ URL du repository requise" -ForegroundColor Red
        exit 1
    }
    
    git remote add origin $repoUrl
    Write-Host "✅ Remote configuré" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "✅ Remote déjà configuré : $remoteUrl" -ForegroundColor Green
}

# Push vers GitHub
Write-Host ""
Write-Host "🚀 Push vers GitHub..." -ForegroundColor Yellow

# Vérifier la branche actuelle
$currentBranch = git branch --show-current
if ([string]::IsNullOrWhiteSpace($currentBranch)) {
    $currentBranch = "main"
    git branch -M main
}

# Push
try {
    git push -u origin $currentBranch
    Write-Host ""
    Write-Host "✅ ✅ ✅ Push réussi ! ✅ ✅ ✅" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Elite Visuals est maintenant sur GitHub !" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📝 Prochaines étapes :" -ForegroundColor Yellow
    Write-Host "  1. Vérifiez votre repository sur GitHub" -ForegroundColor White
    Write-Host "  2. Configurez les secrets pour CI/CD (si nécessaire)" -ForegroundColor White
    Write-Host "  3. Déployez sur Vercel/Netlify (voir DEPLOY.md)" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "❌ Erreur lors du push" -ForegroundColor Red
    Write-Host "Vérifiez :" -ForegroundColor Yellow
    Write-Host "  - Que le repository existe sur GitHub" -ForegroundColor White
    Write-Host "  - Que vous avez les droits d'accès" -ForegroundColor White
    Write-Host "  - Que l'URL du remote est correcte" -ForegroundColor White
    Write-Host ""
    Write-Host "Pour forcer le push (si le repo existe déjà) :" -ForegroundColor Yellow
    Write-Host "  git push -u origin $currentBranch --force" -ForegroundColor White
    Write-Host ""
}
