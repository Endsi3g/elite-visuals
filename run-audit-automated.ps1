# 🤖 Script PowerShell - Agent d'Audit Elite Visuals
# Exécute l'audit complet du projet avec commit et push automatique

Write-Host "🤖 Elite Visuals - Agent d'Audit Automatique" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erreur: package.json non trouvé" -ForegroundColor Red
    Write-Host "   Assurez-vous d'être dans le répertoire du projet" -ForegroundColor Yellow
    exit 1
}

# Fonction pour afficher les étapes
function Write-Step {
    param($Number, $Total, $Message)
    Write-Host ""
    Write-Host "📍 ÉTAPE $Number/$Total: $Message" -ForegroundColor Green
    Write-Host "-" * 60 -ForegroundColor Gray
}

# Fonction pour exécuter une commande avec gestion d'erreur
function Invoke-SafeCommand {
    param($Command, $ErrorMessage)
    try {
        Invoke-Expression $Command
        if ($LASTEXITCODE -ne 0) {
            Write-Host "⚠️  Avertissement: $ErrorMessage" -ForegroundColor Yellow
            return $false
        }
        return $true
    }
    catch {
        Write-Host "⚠️  Avertissement: $ErrorMessage" -ForegroundColor Yellow
        Write-Host "   Détails: $_" -ForegroundColor Gray
        return $false
    }
}

# ÉTAPE 1: Analyser les fichiers Markdown
Write-Step 1 5 "Analyse des fichiers Markdown"

Write-Host "📄 Recherche des fichiers Markdown redondants..." -ForegroundColor White

# Lister tous les fichiers MD
$mdFiles = Get-ChildItem -Path . -Filter "*.md" -Recurse -Exclude "node_modules", ".next", ".git" | 
    Where-Object { $_.DirectoryName -notmatch "node_modules|\.next|\.git" }

Write-Host "   Trouvé: $($mdFiles.Count) fichiers Markdown" -ForegroundColor Cyan

# Catégoriser les fichiers
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

Write-Host "   ✅ À conserver: $($filesToKeep.Count) fichiers" -ForegroundColor Green
Write-Host "   🗑️  À supprimer: $($filesToDelete.Count) fichiers" -ForegroundColor Yellow

# ÉTAPE 2: Créer un backup
Write-Step 2 5 "Création du backup"

$backupDir = ".backup-md-files"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
    Write-Host "   📦 Dossier de backup créé: $backupDir" -ForegroundColor Cyan
}

foreach ($file in $filesToDelete) {
    $backupPath = Join-Path $backupDir $file.Name
    Copy-Item -Path $file.FullName -Destination $backupPath -Force
    Write-Host "   💾 Backup: $($file.Name)" -ForegroundColor Gray
}

Write-Host "   ✅ Backup terminé" -ForegroundColor Green

# ÉTAPE 3: Supprimer les fichiers redondants
Write-Step 3 5 "Nettoyage des fichiers redondants"

foreach ($file in $filesToDelete) {
    Remove-Item -Path $file.FullName -Force
    Write-Host "   🗑️  Supprimé: $($file.Name)" -ForegroundColor Yellow
}

Write-Host "   ✅ Nettoyage terminé" -ForegroundColor Green

# ÉTAPE 4: Générer le rapport
Write-Step 4 5 "Génération du rapport d'audit"

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
Write-Host "   📊 Rapport généré: $reportPath" -ForegroundColor Cyan
Write-Host "   ✅ Génération terminée" -ForegroundColor Green

# ÉTAPE 5: Git commit et push
Write-Step 5 5 "Commit et push sur GitHub"

# Vérifier si c'est un repo git
if (-not (Test-Path ".git")) {
    Write-Host "   ⚠️  Pas un dépôt Git, skip du commit" -ForegroundColor Yellow
}
else {
    Write-Host "   📦 Git add..." -ForegroundColor White
    git add .
    
    Write-Host "   💾 Git commit..." -ForegroundColor White
    $commitMessage = "🤖 Audit automatique: Nettoyage de $($filesToDelete.Count) fichiers MD redondants"
    git commit -m $commitMessage
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   🚀 Git push..." -ForegroundColor White
        git push origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Changements poussés sur GitHub avec succès!" -ForegroundColor Green
        }
        else {
            Write-Host "   ⚠️  Erreur lors du push - Faites-le manuellement" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "   ℹ️  Rien à commit (aucun changement)" -ForegroundColor Cyan
    }
}

# RÉSUMÉ FINAL
Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "✅ AUDIT COMPLET TERMINÉ AVEC SUCCÈS!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

Write-Host "📊 RÉSUMÉ:" -ForegroundColor Cyan
Write-Host "   📄 Fichiers analysés: $($mdFiles.Count)" -ForegroundColor White
Write-Host "   ✅ Fichiers conservés: $($filesToKeep.Count)" -ForegroundColor Green
Write-Host "   🗑️  Fichiers supprimés: $($filesToDelete.Count)" -ForegroundColor Yellow
Write-Host "   📦 Backup créé: $backupDir" -ForegroundColor Cyan
Write-Host "   📊 Rapport: $reportPath" -ForegroundColor Cyan
Write-Host ""

Write-Host "📚 PROCHAINES ÉTAPES:" -ForegroundColor Cyan
Write-Host "   1. Consulter le rapport: $reportPath" -ForegroundColor White
Write-Host "   2. Vérifier les changements: git status" -ForegroundColor White
Write-Host "   3. Tester l'application: npm run dev" -ForegroundColor White
Write-Host "   4. Exécuter les tests: npm run test:all" -ForegroundColor White
Write-Host ""

Write-Host "🎉 Projet nettoyé et prêt pour le développement!" -ForegroundColor Green
Write-Host ""
