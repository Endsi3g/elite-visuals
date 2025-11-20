# Script PowerShell simplifie pour push Elite Visuals vers GitHub

Write-Host "Elite Visuals - Push vers GitHub" -ForegroundColor Cyan
Write-Host ""

# Verifier si Git est installe
$gitExists = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitExists) {
    Write-Host "Git n'est pas installe. Installez-le depuis https://git-scm.com/" -ForegroundColor Red
    exit 1
}

# Initialiser Git si necessaire
if (-not (Test-Path ".git")) {
    Write-Host "Initialisation du repository Git..." -ForegroundColor Yellow
    git init
    Write-Host "Repository Git initialise" -ForegroundColor Green
}

# Configurer Git si necessaire
$gitUser = git config user.name
if (-not $gitUser) {
    Write-Host ""
    Write-Host "Configuration Git requise" -ForegroundColor Yellow
    $userName = Read-Host "Entrez votre nom GitHub"
    $userEmail = Read-Host "Entrez votre email GitHub"
    git config user.name "$userName"
    git config user.email "$userEmail"
    Write-Host "Git configure" -ForegroundColor Green
}

# Ajouter tous les fichiers
Write-Host ""
Write-Host "Ajout des fichiers..." -ForegroundColor Yellow
git add .

# Commit
Write-Host ""
$commitMessage = Read-Host "Message de commit (Enter pour 'Initial commit - Elite Visuals MVP')"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Initial commit - Elite Visuals MVP"
}

git commit -m "$commitMessage"
Write-Host "Commit cree" -ForegroundColor Green

# Verifier si le remote existe
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Host ""
    Write-Host "Configuration du remote GitHub..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Creez d'abord un repository sur GitHub :" -ForegroundColor Cyan
    Write-Host "  1. Allez sur https://github.com/new" -ForegroundColor White
    Write-Host "  2. Nom du repo : elite-visuals" -ForegroundColor White
    Write-Host "  3. NE PAS initialiser avec README" -ForegroundColor White
    Write-Host ""
    
    $repoUrl = Read-Host "Entrez l'URL du repository GitHub"
    
    if ([string]::IsNullOrWhiteSpace($repoUrl)) {
        Write-Host "URL du repository requise" -ForegroundColor Red
        exit 1
    }
    
    git remote add origin $repoUrl
    Write-Host "Remote configure" -ForegroundColor Green
}

# Push vers GitHub
Write-Host ""
Write-Host "Push vers GitHub..." -ForegroundColor Yellow

$currentBranch = git branch --show-current
if ([string]::IsNullOrWhiteSpace($currentBranch)) {
    $currentBranch = "main"
    git branch -M main
}

git push -u origin $currentBranch

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Push reussi !" -ForegroundColor Green
    Write-Host "Elite Visuals est maintenant sur GitHub !" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Erreur lors du push" -ForegroundColor Red
    Write-Host "Verifiez que le repository existe sur GitHub" -ForegroundColor Yellow
}
