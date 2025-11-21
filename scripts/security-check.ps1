# Script de Vérification de Sécurité - Elite Visuals
# Ce script vérifie les vulnérabilités de sécurité dans les dépendances

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Vérification de Sécurité - Elite Visuals" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que npm est installé
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Erreur: npm n'est pas installé" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Vérification des dépendances..." -ForegroundColor Yellow
Write-Host ""

# Exécuter npm audit
Write-Host "🔍 Exécution de npm audit..." -ForegroundColor Yellow
npm audit --json | Out-File -FilePath "security-audit.json" -Encoding UTF8

# Lire le résultat
$auditResult = Get-Content "security-audit.json" | ConvertFrom-Json

# Afficher les statistiques
Write-Host ""
Write-Host "📊 Résultats de l'audit:" -ForegroundColor Cyan
Write-Host "  - Critiques: $($auditResult.metadata.vulnerabilities.critical)" -ForegroundColor $(if ($auditResult.metadata.vulnerabilities.critical -gt 0) { "Red" } else { "Green" })
Write-Host "  - Élevées: $($auditResult.metadata.vulnerabilities.high)" -ForegroundColor $(if ($auditResult.metadata.vulnerabilities.high -gt 0) { "Red" } else { "Green" })
Write-Host "  - Modérées: $($auditResult.metadata.vulnerabilities.moderate)" -ForegroundColor $(if ($auditResult.metadata.vulnerabilities.moderate -gt 0) { "Yellow" } else { "Green" })
Write-Host "  - Faibles: $($auditResult.metadata.vulnerabilities.low)" -ForegroundColor $(if ($auditResult.metadata.vulnerabilities.low -gt 0) { "Yellow" } else { "Green" })
Write-Host ""

# Vérifier les vulnérabilités critiques ou élevées
$criticalOrHigh = $auditResult.metadata.vulnerabilities.critical + $auditResult.metadata.vulnerabilities.high

if ($criticalOrHigh -gt 0) {
    Write-Host "⚠️  ATTENTION: $criticalOrHigh vulnérabilité(s) critique(s) ou élevée(s) détectée(s)!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Exécutez 'npm audit' pour plus de détails" -ForegroundColor Yellow
    Write-Host "Exécutez 'npm audit fix' pour tenter de les corriger automatiquement" -ForegroundColor Yellow
    Write-Host ""
    exit 1
} else {
    Write-Host "✅ Aucune vulnérabilité critique ou élevée détectée" -ForegroundColor Green
    Write-Host ""
    
    if ($auditResult.metadata.vulnerabilities.moderate -gt 0) {
        Write-Host "ℹ️  Note: $($auditResult.metadata.vulnerabilities.moderate) vulnérabilité(s) modérée(s) détectée(s)" -ForegroundColor Yellow
        Write-Host "   Consultez le fichier SECURITY_FIXES.md pour plus d'informations" -ForegroundColor Yellow
    }
    
    Write-Host ""
    exit 0
}
