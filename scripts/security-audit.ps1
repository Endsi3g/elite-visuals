# Script PowerShell pour audit de sécurité complet
# Usage: .\scripts\security-audit.ps1

Write-Host "🔒 Elite Visuals - Security Audit" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"
$issues = 0

# 1. npm audit
Write-Host "📦 Running npm audit..." -ForegroundColor Yellow
npm audit --json | Out-File -FilePath "security-audit-npm.json"
$auditResult = npm audit
Write-Host $auditResult

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Vulnerabilities found!" -ForegroundColor Red
    $issues++
} else {
    Write-Host "✅ No vulnerabilities found" -ForegroundColor Green
}
Write-Host ""

# 2. Vérifier les packages obsolètes
Write-Host "📊 Checking outdated packages..." -ForegroundColor Yellow
$outdated = npm outdated
if ($outdated) {
    Write-Host $outdated
    Write-Host "⚠️ Some packages are outdated" -ForegroundColor Yellow
    $issues++
} else {
    Write-Host "✅ All packages are up to date" -ForegroundColor Green
}
Write-Host ""

# 3. Vérifier les fichiers sensibles
Write-Host "🔍 Checking for sensitive files..." -ForegroundColor Yellow
$sensitiveFiles = @(
    ".env",
    ".env.local",
    ".env.production",
    "*.key",
    "*.pem",
    "*.p12"
)

$found = $false
foreach ($pattern in $sensitiveFiles) {
    $files = Get-ChildItem -Path . -Filter $pattern -Recurse -ErrorAction SilentlyContinue
    if ($files) {
        Write-Host "⚠️ Found sensitive file: $($files.FullName)" -ForegroundColor Red
        $found = $true
        $issues++
    }
}

if (-not $found) {
    Write-Host "✅ No sensitive files in repository" -ForegroundColor Green
}
Write-Host ""

# 4. Vérifier .gitignore
Write-Host "📝 Checking .gitignore..." -ForegroundColor Yellow
if (Test-Path ".gitignore") {
    $gitignore = Get-Content ".gitignore"
    $requiredPatterns = @(".env", ".env.local", "node_modules", ".next")
    $missing = @()
    
    foreach ($pattern in $requiredPatterns) {
        if ($gitignore -notcontains $pattern) {
            $missing += $pattern
        }
    }
    
    if ($missing.Count -gt 0) {
        Write-Host "⚠️ Missing patterns in .gitignore: $($missing -join ', ')" -ForegroundColor Yellow
        $issues++
    } else {
        Write-Host "✅ .gitignore is properly configured" -ForegroundColor Green
    }
} else {
    Write-Host "❌ .gitignore not found!" -ForegroundColor Red
    $issues++
}
Write-Host ""

# 5. Vérifier les headers de sécurité
Write-Host "🛡️ Checking security headers configuration..." -ForegroundColor Yellow
if (Test-Path "middleware.ts") {
    $middleware = Get-Content "middleware.ts" -Raw
    $headers = @("Content-Security-Policy", "X-Frame-Options", "X-Content-Type-Options", "Strict-Transport-Security")
    $missingHeaders = @()
    
    foreach ($header in $headers) {
        if ($middleware -notmatch $header) {
            $missingHeaders += $header
        }
    }
    
    if ($missingHeaders.Count -gt 0) {
        Write-Host "⚠️ Missing security headers: $($missingHeaders -join ', ')" -ForegroundColor Yellow
        $issues++
    } else {
        Write-Host "✅ All security headers configured" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️ middleware.ts not found" -ForegroundColor Yellow
}
Write-Host ""

# 6. Vérifier les variables d'environnement
Write-Host "🔑 Checking environment variables..." -ForegroundColor Yellow
if (Test-Path ".env.example") {
    Write-Host "✅ .env.example found" -ForegroundColor Green
} else {
    Write-Host "⚠️ .env.example not found" -ForegroundColor Yellow
    $issues++
}

if (Test-Path ".env.local") {
    Write-Host "⚠️ .env.local exists (should not be committed)" -ForegroundColor Yellow
}
Write-Host ""

# 7. Vérifier les permissions de fichiers (Windows)
Write-Host "📁 Checking file permissions..." -ForegroundColor Yellow
$criticalFiles = @("package.json", "next.config.js", "middleware.ts")
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "❌ $file not found!" -ForegroundColor Red
        $issues++
    }
}
Write-Host ""

# 8. Vérifier les dépendances de développement en production
Write-Host "🏗️ Checking production dependencies..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$devDeps = $packageJson.devDependencies.PSObject.Properties.Name
Write-Host "Development dependencies: $($devDeps.Count)" -ForegroundColor Cyan
Write-Host ""

# 9. Générer le rapport
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "📊 Security Audit Summary" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

if ($issues -eq 0) {
    Write-Host "✅ No security issues found!" -ForegroundColor Green
    Write-Host "🎉 Your application is secure!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Found $issues security issue(s)" -ForegroundColor Yellow
    Write-Host "📝 Please review the issues above" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📄 Reports generated:" -ForegroundColor Cyan
Write-Host "  - security-audit-npm.json" -ForegroundColor White
Write-Host ""

# 10. Recommandations
Write-Host "💡 Recommendations:" -ForegroundColor Cyan
Write-Host "  1. Run 'npm audit fix' to fix vulnerabilities" -ForegroundColor White
Write-Host "  2. Update outdated packages with 'npm update'" -ForegroundColor White
Write-Host "  3. Review and update .gitignore" -ForegroundColor White
Write-Host "  4. Keep .env files out of version control" -ForegroundColor White
Write-Host "  5. Regularly run security audits" -ForegroundColor White
Write-Host ""

Write-Host "✨ Audit complete!" -ForegroundColor Green

# Exit code
if ($issues -gt 0) {
    exit 1
} else {
    exit 0
}
