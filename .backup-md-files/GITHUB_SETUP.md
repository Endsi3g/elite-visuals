# 🚀 Guide de Publication sur GitHub

Ce guide vous aide à publier **Elite Visuals** sur GitHub.

## 📋 Prérequis

- [x] Git installé sur votre machine
- [x] Compte GitHub créé
- [x] Repository GitHub créé (vide ou avec README)

## 🔗 URL du Repository GitHub

**Repository Elite Visuals** : https://github.com/Endsi3g/elite-visuals

## 📝 Étapes de Publication

### 1. Ouvrir PowerShell dans le Dossier du Projet

```powershell
cd c:\Users\Kael\CascadeProjects\windsurf-project\elite-visuals
```

### 2. Vérifier que Git est Installé

```powershell
git --version
```

Si Git n'est pas installé, téléchargez-le depuis : https://git-scm.com/download/win

### 3. Configurer Git (Si Première Utilisation)

```powershell
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

### 4. Initialiser le Repository Git

```powershell
# Initialiser Git (si pas déjà fait)
git init

# Vérifier le statut
git status
```

### 5. Ajouter Tous les Fichiers

```powershell
# Ajouter tous les fichiers au staging
git add .

# Vérifier les fichiers ajoutés
git status
```

### 6. Créer le Premier Commit

```powershell
git commit -m "feat: initial commit - Elite Visuals MVP v0.1.0

- Board visuel infini avec Konva.js
- Intégration Ollama (Llama 3, Mistral, LLaVA)
- Kanban avec agents IA autonomes
- Collaboration temps réel avec Supabase
- Documentation complète
- Templates GitHub (Issues, PRs, CI/CD)
"
```

### 7. Ajouter le Remote GitHub

```powershell
# Ajouter le repository distant
git remote add origin https://github.com/Endsi3g/elite-visuals.git

# Vérifier le remote
git remote -v
```

### 8. Pousser sur GitHub

```powershell
# Créer et pousser sur la branche main
git branch -M main
git push -u origin main
```

## 🔐 Authentification GitHub

### Option 1 : Personal Access Token (Recommandé)

1. Aller sur GitHub : https://github.com/settings/tokens
2. Cliquer sur "Generate new token" > "Generate new token (classic)"
3. Donner un nom : "Elite Visuals Dev"
4. Sélectionner les scopes : `repo`, `workflow`
5. Générer et copier le token
6. Lors du push, utiliser le token comme mot de passe

### Option 2 : GitHub CLI

```powershell
# Installer GitHub CLI
winget install --id GitHub.cli

# Se connecter
gh auth login

# Pousser
git push -u origin main
```

## 📦 Fichiers Importants Créés

### Documentation
- ✅ `README.md` - Vue d'ensemble complète
- ✅ `CONTRIBUTING.md` - Guide de contribution
- ✅ `CHANGELOG.md` - Historique des versions
- ✅ `SECURITY.md` - Politique de sécurité
- ✅ `LICENSE` - Licence MIT
- ✅ `INSTALLATION.md` - Guide d'installation détaillé
- ✅ `OLLAMA_SETUP.md` - Configuration Ollama
- ✅ `SUPABASE_SETUP.md` - Configuration Supabase

### GitHub Templates
- ✅ `.github/workflows/ci.yml` - CI/CD automatique
- ✅ `.github/PULL_REQUEST_TEMPLATE.md` - Template PRs
- ✅ `.github/ISSUE_TEMPLATE/bug_report.md` - Template bugs
- ✅ `.github/ISSUE_TEMPLATE/feature_request.md` - Template features

### Configuration
- ✅ `.gitignore` - Fichiers à ignorer
- ✅ `.env.local.example` - Variables d'environnement
- ✅ `package.json` - Dépendances
- ✅ `tsconfig.json` - Configuration TypeScript
- ✅ `tailwind.config.ts` - Configuration TailwindCSS

## 🎯 Après la Publication

### 1. Configurer les GitHub Secrets

Pour que le CI/CD fonctionne, ajoutez ces secrets dans GitHub :

1. Aller sur : https://github.com/Endsi3g/elite-visuals/settings/secrets/actions
2. Cliquer sur "New repository secret"
3. Ajouter :
   - `NEXT_PUBLIC_SUPABASE_URL` : Votre URL Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Votre clé anonyme Supabase

### 2. Activer GitHub Pages (Optionnel)

1. Aller sur : https://github.com/Endsi3g/elite-visuals/settings/pages
2. Sélectionner la source : "GitHub Actions"
3. La documentation sera accessible via GitHub Pages

### 3. Ajouter des Topics

1. Aller sur : https://github.com/Endsi3g/elite-visuals
2. Cliquer sur l'icône ⚙️ à côté de "About"
3. Ajouter des topics :
   - `nextjs`
   - `react`
   - `typescript`
   - `supabase`
   - `ai`
   - `ollama`
   - `kanban`
   - `collaboration`
   - `konva`
   - `tailwindcss`

### 4. Créer une Release

```powershell
# Créer un tag pour la version 0.1.0
git tag -a v0.1.0 -m "Release v0.1.0 - Elite Visuals MVP"
git push origin v0.1.0
```

Puis sur GitHub :
1. Aller sur : https://github.com/Endsi3g/elite-visuals/releases
2. Cliquer sur "Draft a new release"
3. Sélectionner le tag `v0.1.0`
4. Titre : "Elite Visuals v0.1.0 - MVP"
5. Description : Copier depuis `CHANGELOG.md`
6. Publier

## 🌟 Améliorer la Visibilité

### README Badges

Ajoutez ces badges en haut du README.md :

```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-green)](https://supabase.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
```

### Social Preview

1. Créer une image 1280x640px avec le logo Elite Visuals
2. Aller sur : https://github.com/Endsi3g/elite-visuals/settings
3. Section "Social preview" > Upload image

## 🔧 Commandes Git Utiles

### Vérifier l'État

```powershell
git status
git log --oneline
```

### Créer une Nouvelle Branche

```powershell
git checkout -b feature/nouvelle-fonctionnalite
```

### Mettre à Jour depuis GitHub

```powershell
git pull origin main
```

### Annuler des Changements

```powershell
# Annuler les changements non commités
git restore .

# Annuler le dernier commit (garder les changements)
git reset --soft HEAD~1
```

## 📞 Support

Si vous rencontrez des problèmes :

1. **Erreur d'authentification** : Utilisez un Personal Access Token
2. **Erreur de push** : Vérifiez que le repository distant existe
3. **Conflits** : Faites `git pull` avant de push

## 🎉 Félicitations !

Votre projet **Elite Visuals** est maintenant sur GitHub !

**Lien du repository** : https://github.com/Endsi3g/elite-visuals

Partagez-le avec votre équipe et la communauté ! 🚀

---

**Dernière mise à jour** : 19 novembre 2024
