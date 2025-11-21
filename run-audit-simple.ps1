# Agent d'Audit Elite Visuals - Version Simple
# Execute l'audit complet du projet avec commit et push automatique

Write-Host "Elite Visuals - Agent d'Audit Automatique" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# Verifier que nous sommes dans le bon repertoire
if (-not (Test-Path "package.json")) {
    Write-Host "ERREUR: package.json non trouve" -ForegroundColor Red
    Write-Host "Assurez-vous d'etre dans le repertoire du projet" -ForegroundColor Yellow
    exit 1
}

# ETAPE 1: Analyser les fichiers Markdown
Write-Host ""
Write-Host "ETAPE 1/5: Analyse des fichiers Markdown" -ForegroundColor Green
Write-Host "----------------------------------------------------------" -ForegroundColor Gray

Write-Host "Recherche des fichiers Markdown redondants..." -ForegroundColor White

# Lister tous les fichiers MD
$mdFiles = Get-ChildItem -Path . -Filter "*.md" -Recurse -Exclude "node_modules", ".next", ".git" | 
    Where-Object { $_.DirectoryName -notmatch "node_modules|\.next|\.git" }

Write-Host "Trouve: $($mdFiles.Count) fichiers Markdown" -ForegroundColor Cyan

# Categoriser les fichiers
$essentialFiles = @("README.md", "CONTRIBUTING.md", "LICENSE", "SECURITY.md", "CHANGELOG.md")
$redundantKeywords = @("FIX", "FIXES", "APPLIED", "COMPLETED", "SUMMARY", "DEPLOY", "VERCEL", "BUILD", "SETUP")

$filesToKeep = @()
$filesToDelete = @()

foreach ($file in $mdFiles) {
    $fileName = $file.Name
    $isEssential = $essentialFiles -contains $fileName
    $isInDocs = $file.DirectoryName -match "\\docs\\"
    
    if ($isEssential -or $isInDocs) {
        $filesToKeep += $file
    }
    else {
        $isRedundant = $false
        foreach ($keyword in $redundantKeywords) {
            if ($fileName -match $keyword) {
                $isRedundant = $true
                break
            }
        }
        
        if ($isRedundant) {
            $filesToDelete += $file
        }
        else {
            $filesToKeep += $file
        }
    }
}

Write-Host "A conserver: $($filesToKeep.Count) fichiers" -ForegroundColor Green
Write-Host "A supprimer: $($filesToDelete.Count) fichiers" -ForegroundColor Yellow

# ETAPE 2: Creer un backup
Write-Host ""
Write-Host "ETAPE 2/5: Creation du backup" -ForegroundColor Green
Write-Host "----------------------------------------------------------" -ForegroundColor Gray

$backupDir = ".backup-md-files"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
    Write-Host "Dossier de backup cree: $backupDir" -ForegroundColor Cyan
}

foreach ($file in $filesToDelete) {
    $backupPath = Join-Path $backupDir $file.Name
    Copy-Item -Path $file.FullName -Destination $backupPath -Force
    Write-Host "Backup: $($file.Name)" -ForegroundColor Gray
}

Write-Host "Backup termine" -ForegroundColor Green

# ETAPE 3: Supprimer les fichiers redondants
Write-Host ""
Write-Host "ETAPE 3/5: Nettoyage des fichiers redondants" -ForegroundColor Green
Write-Host "----------------------------------------------------------" -ForegroundColor Gray

foreach ($file in $filesToDelete) {
    Remove-Item -Path $file.FullName -Force
    Write-Host "Supprime: $($file.Name)" -ForegroundColor Yellow
}

Write-Host "Nettoyage termine" -ForegroundColor Green

# ETAPE 4: Generer le rapport
Write-Host ""
Write-Host "ETAPE 4/5: Generation du rapport d'audit" -ForegroundColor Green
Write-Host "----------------------------------------------------------" -ForegroundColor Gray

$reportPath = "PROJECT_AUDIT_REPORT.md"
$reportContent = "# Rapport d'Audit du Projet Elite Visuals`n`n"
$reportContent += "**Date:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n"
$reportContent += "**Genere par:** Agent d'Audit Automatise PowerShell`n`n"
$reportContent += "---`n`n"
$reportContent += "## Analyse des Fichiers Markdown`n`n"
$reportContent += "**Total:** $($mdFiles.Count) fichiers`n"
$reportContent += "**A conserver:** $($filesToKeep.Count) fichiers`n"
$reportContent += "**A supprimer:** $($filesToDelete.Count) fichiers`n`n"
$reportContent += "### Fichiers Conserves ($($filesToKeep.Count))`n`n"
foreach ($file in $filesToKeep) {
    $reportContent += "- ``$($file.FullName.Replace($PWD.Path, ''))```n"
}
$reportContent += "`n### Fichiers Supprimes ($($filesToDelete.Count))`n`n"
foreach ($file in $filesToDelete) {
    $reportContent += "- ``$($file.Name)`` - Redondant/Obsolete`n"
}
$reportContent += "`n---`n`n"
$reportContent += "## Recommandations`n`n"
$reportContent += "1. Consolider la documentation dans le dossier /docs`n"
$reportContent += "2. Verifier que tous les composants sont bien connectes`n"
$reportContent += "3. Executer les tests: ``npm run test:all```n"
$reportContent += "4. Mettre a jour le README.md avec la structure finale`n`n"
$reportContent += "---`n`n"
$reportContent += "## Actions Effectuees`n`n"
$reportContent += "- Analyse de $($mdFiles.Count) fichiers Markdown`n"
$reportContent += "- Backup de $($filesToDelete.Count) fichiers dans ``.backup-md-files/```n"
$reportContent += "- Suppression de $($filesToDelete.Count) fichiers redondants`n"
$reportContent += "- Generation du rapport d'audit`n`n"
$reportContent += "---`n`n"
$reportContent += "**Rapport genere automatiquement - Elite Visuals 2024**`n"

Set-Content -Path $reportPath -Value $reportContent -Encoding UTF8
Write-Host "Rapport genere: $reportPath" -ForegroundColor Cyan
Write-Host "Generation terminee" -ForegroundColor Green

# ETAPE 5: Git commit et push
Write-Host ""
Write-Host "ETAPE 5/5: Commit et push sur GitHub" -ForegroundColor Green
Write-Host "----------------------------------------------------------" -ForegroundColor Gray

# Verifier si c'est un repo git
if (-not (Test-Path ".git")) {
    Write-Host "Pas un depot Git, skip du commit" -ForegroundColor Yellow
}
else {
    Write-Host "Git add..." -ForegroundColor White
    git add .
    
    Write-Host "Git commit..." -ForegroundColor White
    $commitMessage = "Audit automatique: Nettoyage de $($filesToDelete.Count) fichiers MD redondants"
    git commit -m $commitMessage
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Git push..." -ForegroundColor White
        git push origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Changements pousses sur GitHub avec succes!" -ForegroundColor Green
        }
        else {
            Write-Host "Erreur lors du push - Faites-le manuellement" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "Rien a commit (aucun changement)" -ForegroundColor Cyan
    }
}

# RESUME FINAL
Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "AUDIT COMPLET TERMINE AVEC SUCCES!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "RESUME:" -ForegroundColor Cyan
Write-Host "Fichiers analyses: $($mdFiles.Count)" -ForegroundColor White
Write-Host "Fichiers conserves: $($filesToKeep.Count)" -ForegroundColor Green
Write-Host "Fichiers supprimes: $($filesToDelete.Count)" -ForegroundColor Yellow
Write-Host "Backup cree: $backupDir" -ForegroundColor Cyan
Write-Host "Rapport: $reportPath" -ForegroundColor Cyan
Write-Host ""

Write-Host "PROCHAINES ETAPES:" -ForegroundColor Cyan
Write-Host "1. Consulter le rapport: $reportPath" -ForegroundColor White
Write-Host "2. Verifier les changements: git status" -ForegroundColor White
Write-Host "3. Tester l'application: npm run dev" -ForegroundColor White
Write-Host "4. Executer les tests: npm run test:all" -ForegroundColor White
Write-Host ""

Write-Host "Projet nettoye et pret pour le developpement!" -ForegroundColor Green
Write-Host ""
