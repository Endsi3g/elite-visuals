# 🤖 Script d'Audit Automatique - Elite Visuals

## 📋 Description

Script PowerShell automatisé pour auditer, nettoyer et optimiser le projet Elite Visuals. Il analyse les fichiers Markdown redondants, crée des backups, génère des rapports et commit automatiquement les changements sur GitHub.

## 🚀 Utilisation

### Méthode 1: Exécution Simple

```powershell
powershell -ExecutionPolicy Bypass -File run-audit-automated.ps1
```

### Méthode 2: Depuis PowerShell

```powershell
# Ouvrir PowerShell dans le répertoire du projet
cd C:\Users\quebe\Downloads\elite-visuals-main\elite-visuals-main

# Exécuter le script
.\run-audit-automated.ps1
```

### Méthode 3: Double-clic (Windows)

1. Clic droit sur `run-audit-automated.ps1`
2. Sélectionner "Exécuter avec PowerShell"

## 📊 Fonctionnalités

### 1. **Analyse des Fichiers Markdown**
- ✅ Scanne tous les fichiers `.md` du projet
- ✅ Identifie les fichiers essentiels (README, CONTRIBUTING, etc.)
- ✅ Détecte les fichiers redondants (FIXES, DEPLOY, BUILD, etc.)
- ✅ Préserve la documentation dans `/docs`

### 2. **Backup Automatique**
- ✅ Crée un dossier `.backup-md-files/`
- ✅ Sauvegarde tous les fichiers avant suppression
- ✅ Permet une restauration facile si nécessaire

### 3. **Nettoyage Intelligent**
- ✅ Supprime uniquement les fichiers redondants
- ✅ Conserve les fichiers essentiels
- ✅ Respecte la structure du projet

### 4. **Génération de Rapport**
- ✅ Crée `PROJECT_AUDIT_REPORT.md`
- ✅ Liste tous les fichiers analysés
- ✅ Détaille les actions effectuées
- ✅ Fournit des recommandations

### 5. **Git Automatique**
- ✅ Commit automatique des changements
- ✅ Push sur GitHub (branche main)
- ✅ Message de commit descriptif

## 📁 Structure des Fichiers

```
elite-visuals/
├── run-audit-automated.ps1     # Script principal
├── .backup-md-files/            # Backup des fichiers supprimés
│   ├── FIXES_APPLIED.md
│   ├── DEPLOY_NOW.md
│   └── ...
├── PROJECT_AUDIT_REPORT.md      # Rapport généré
└── ...
```

## 🎯 Critères de Nettoyage

### Fichiers Conservés
- ✅ `README.md`
- ✅ `CONTRIBUTING.md`
- ✅ `LICENSE`
- ✅ `SECURITY.md`
- ✅ `CHANGELOG.md`
- ✅ Tous les fichiers dans `/docs`
- ✅ Fichiers de documentation importants

### Fichiers Supprimés
- ❌ Fichiers contenant "FIX", "FIXES"
- ❌ Fichiers contenant "APPLIED", "COMPLETED"
- ❌ Fichiers contenant "DEPLOY", "VERCEL", "BUILD"
- ❌ Fichiers contenant "SETUP", "SUMMARY"
- ❌ Fichiers redondants ou obsolètes

## 📝 Exemple de Sortie

```
🤖 Elite Visuals - Agent d'Audit Automatique
============================================================

📍 ÉTAPE 1/5: Analyse des fichiers Markdown
------------------------------------------------------------
📄 Recherche des fichiers Markdown redondants...
   Trouvé: 45 fichiers Markdown
   ✅ À conserver: 32 fichiers
   🗑️  À supprimer: 13 fichiers

📍 ÉTAPE 2/5: Création du backup
------------------------------------------------------------
   📦 Dossier de backup créé: .backup-md-files
   💾 Backup: FIXES_APPLIED.md
   💾 Backup: DEPLOY_NOW.md
   ...
   ✅ Backup terminé

📍 ÉTAPE 3/5: Nettoyage des fichiers redondants
------------------------------------------------------------
   🗑️  Supprimé: FIXES_APPLIED.md
   🗑️  Supprimé: DEPLOY_NOW.md
   ...
   ✅ Nettoyage terminé

📍 ÉTAPE 4/5: Génération du rapport d'audit
------------------------------------------------------------
   📊 Rapport généré: PROJECT_AUDIT_REPORT.md
   ✅ Génération terminée

📍 ÉTAPE 5/5: Commit et push sur GitHub
------------------------------------------------------------
   📦 Git add...
   💾 Git commit...
   🚀 Git push...
   ✅ Changements poussés sur GitHub avec succès!

============================================================
✅ AUDIT COMPLET TERMINÉ AVEC SUCCÈS!
============================================================

📊 RÉSUMÉ:
   📄 Fichiers analysés: 45
   ✅ Fichiers conservés: 32
   🗑️  Fichiers supprimés: 13
   📦 Backup créé: .backup-md-files
   📊 Rapport: PROJECT_AUDIT_REPORT.md

📚 PROCHAINES ÉTAPES:
   1. Consulter le rapport: PROJECT_AUDIT_REPORT.md
   2. Vérifier les changements: git status
   3. Tester l'application: npm run dev
   4. Exécuter les tests: npm run test:all

🎉 Projet nettoyé et prêt pour le développement!
```

## 🔧 Configuration

### Personnaliser les Critères

Modifiez les variables dans le script :

```powershell
# Fichiers essentiels à toujours conserver
$essentialFiles = @("README.md", "CONTRIBUTING.md", "LICENSE", "SECURITY.md", "CHANGELOG.md")

# Mots-clés pour identifier les fichiers redondants
$redundantKeywords = @("FIX", "FIXES", "APPLIED", "COMPLETED", "SUMMARY", "DEPLOY", "VERCEL", "BUILD", "SETUP")
```

### Changer le Dossier de Backup

```powershell
$backupDir = ".backup-md-files"  # Modifier ici
```

### Modifier le Message de Commit

```powershell
$commitMessage = "🤖 Audit automatique: Nettoyage de $($filesToDelete.Count) fichiers MD redondants"
```

## ⚠️ Précautions

### Avant d'Exécuter

1. **Vérifier le répertoire**
   ```powershell
   pwd  # Doit être dans le répertoire du projet
   ```

2. **Vérifier Git**
   ```powershell
   git status  # Doit être un repo git valide
   ```

3. **Sauvegarder manuellement** (optionnel)
   ```powershell
   git commit -am "Backup avant audit"
   ```

### Pendant l'Exécution

- ✅ Le script crée automatiquement un backup
- ✅ Aucune action manuelle requise
- ✅ Les erreurs sont gérées gracieusement

### Après l'Exécution

1. **Vérifier le rapport**
   ```powershell
   cat PROJECT_AUDIT_REPORT.md
   ```

2. **Vérifier les changements**
   ```powershell
   git log -1
   git diff HEAD~1
   ```

3. **Restaurer si nécessaire**
   ```powershell
   # Restaurer un fichier depuis le backup
   cp .backup-md-files/FICHIER.md .
   ```

## 🐛 Dépannage

### Erreur: "package.json non trouvé"

**Cause:** Vous n'êtes pas dans le bon répertoire

**Solution:**
```powershell
cd C:\Users\quebe\Downloads\elite-visuals-main\elite-visuals-main
```

### Erreur: "Execution Policy"

**Cause:** PowerShell bloque l'exécution de scripts

**Solution:**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\run-audit-automated.ps1
```

### Erreur: "Git push failed"

**Cause:** Problème d'authentification ou de connexion

**Solution:**
```powershell
# Vérifier l'authentification
git remote -v

# Push manuel
git push origin main
```

### Aucun Fichier Supprimé

**Cause:** Aucun fichier redondant trouvé

**Solution:** C'est normal! Le projet est déjà propre.

## 📚 Commandes Utiles

### Voir les Fichiers Markdown

```powershell
Get-ChildItem -Path . -Filter "*.md" -Recurse | Select-Object Name, DirectoryName
```

### Restaurer un Fichier

```powershell
# Restaurer depuis le backup
Copy-Item -Path .backup-md-files/FICHIER.md -Destination . -Force
```

### Annuler le Dernier Commit

```powershell
git reset --soft HEAD~1
```

### Voir le Rapport

```powershell
# Windows
notepad PROJECT_AUDIT_REPORT.md

# PowerShell
cat PROJECT_AUDIT_REPORT.md
```

## 🔄 Automatisation

### Exécuter Périodiquement

Créer une tâche planifiée Windows :

```powershell
# Créer une tâche qui s'exécute tous les lundis à 9h
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File C:\path\to\run-audit-automated.ps1"
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At 9am
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "Elite Visuals Audit" -Description "Audit automatique hebdomadaire"
```

### Intégrer dans CI/CD

Ajouter dans `.github/workflows/audit.yml` :

```yaml
name: Weekly Audit
on:
  schedule:
    - cron: '0 9 * * 1'  # Tous les lundis à 9h
jobs:
  audit:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Audit
        run: powershell -ExecutionPolicy Bypass -File run-audit-automated.ps1
```

## 📊 Métriques

Le script génère des métriques dans le rapport :

- **Fichiers analysés** - Nombre total de fichiers `.md`
- **Fichiers conservés** - Fichiers essentiels gardés
- **Fichiers supprimés** - Fichiers redondants nettoyés
- **Taille économisée** - Espace disque libéré
- **Temps d'exécution** - Durée de l'audit

## 🎓 Bonnes Pratiques

1. **Exécuter régulièrement** - Tous les lundis ou après un sprint
2. **Vérifier le rapport** - Toujours consulter `PROJECT_AUDIT_REPORT.md`
3. **Tester après** - Exécuter `npm run test:all`
4. **Commit séparé** - Ne pas mélanger avec d'autres changements
5. **Backup manuel** - Faire un commit avant l'audit

## 🚀 Prochaines Améliorations

- [ ] Analyse de la taille des fichiers
- [ ] Détection des doublons
- [ ] Vérification des liens cassés
- [ ] Analyse de la qualité du code
- [ ] Génération de statistiques
- [ ] Export en JSON/CSV
- [ ] Notifications par email
- [ ] Dashboard web

## 📞 Support

En cas de problème :

1. Consulter la section **Dépannage**
2. Vérifier les logs dans le terminal
3. Consulter `PROJECT_AUDIT_REPORT.md`
4. Restaurer depuis `.backup-md-files/`

## 📄 Licence

Ce script fait partie du projet Elite Visuals et suit la même licence.

---

**Créé le:** 2025-11-21  
**Version:** 1.0.0  
**Auteur:** Elite Visuals Team  
**Statut:** ✅ Production Ready
