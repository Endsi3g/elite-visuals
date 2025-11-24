# 📦 Guide de Mise à Jour des Dépendances - Elite Visuals

**Date:** 2025-11-24  
**Objectif:** Corriger les 27 vulnérabilités GitHub

---

## 🎯 Stratégie de Mise à Jour

### Approche Progressive

1. **Audit** - Identifier les vulnérabilités
2. **Prioriser** - Par sévérité et impact
3. **Tester** - Environnement de développement
4. **Déployer** - Après validation complète

---

## 🔍 Analyse des Vulnérabilités

### Commandes d'Audit

```bash
# Audit npm local
npm audit

# Audit avec détails JSON
npm audit --json > audit-report.json

# Audit production seulement
npm audit --production

# Vérifier les packages obsolètes
npm outdated
```

### Interpréter les Résultats

| Sévérité | Action | Délai |
|----------|--------|-------|
| **Critical** | Mise à jour immédiate | < 24h |
| **High** | Mise à jour prioritaire | < 1 semaine |
| **Moderate** | Mise à jour planifiée | < 1 mois |
| **Low** | Mise à jour opportuniste | Prochaine release |

---

## 🔄 Plan de Mise à Jour

### Phase 1: Dépendances Critiques

#### 1. Next.js

```bash
# Vérifier la version actuelle
npm list next

# Mettre à jour vers la dernière 15.x
npm install next@latest

# Ou version spécifique
npm install next@15.1.0
```

**Tests requis:**
- ✅ Build réussit
- ✅ Pages chargent correctement
- ✅ Middleware fonctionne
- ✅ API routes fonctionnent

#### 2. React & React-DOM

```bash
# Mise à jour synchronisée
npm install react@latest react-dom@latest

# Ou versions spécifiques
npm install react@18.3.2 react-dom@18.3.2
```

**Tests requis:**
- ✅ Composants s'affichent
- ✅ Hooks fonctionnent
- ✅ Tests unitaires passent
- ✅ Pas de warnings console

#### 3. Supabase

```bash
# Client Supabase
npm install @supabase/supabase-js@latest

# Auth helpers
npm install @supabase/auth-helpers-nextjs@latest
```

**Tests requis:**
- ✅ Authentification fonctionne
- ✅ Requêtes database OK
- ✅ Realtime fonctionne
- ✅ Storage accessible

#### 4. Axios

```bash
# Mise à jour Axios
npm install axios@latest
```

**Tests requis:**
- ✅ Requêtes API fonctionnent
- ✅ Interceptors OK
- ✅ Error handling correct

---

### Phase 2: Dépendances de Sécurité

#### TypeScript

```bash
npm install typescript@latest
```

#### ESLint

```bash
npm install eslint@latest eslint-config-next@latest
```

#### Testing Libraries

```bash
npm install @testing-library/react@latest @testing-library/jest-dom@latest
npm install @playwright/test@latest
```

---

### Phase 3: Dépendances UI/UX

#### Tailwind CSS

```bash
npm install tailwindcss@latest autoprefixer@latest postcss@latest
```

#### Radix UI

```bash
npm install @radix-ui/react-dialog@latest
npm install @radix-ui/react-dropdown-menu@latest
npm install @radix-ui/react-slot@latest
npm install @radix-ui/react-tabs@latest
npm install @radix-ui/react-toast@latest
```

#### Framer Motion

```bash
npm install framer-motion@latest
```

---

## 🧪 Procédure de Test

### 1. Avant la Mise à Jour

```bash
# Créer une branche
git checkout -b security/update-dependencies

# Sauvegarder package-lock.json
cp package-lock.json package-lock.json.backup

# Commit initial
git add .
git commit -m "chore: backup before dependency update"
```

### 2. Mise à Jour

```bash
# Option 1: Automatique (safe)
npm audit fix

# Option 2: Automatique (force)
npm audit fix --force

# Option 3: Manuelle
npm install <package>@latest

# Nettoyer node_modules
rm -rf node_modules package-lock.json
npm install
```

### 3. Tests Complets

```bash
# 1. Linting
npm run lint

# 2. Tests unitaires
npm test

# 3. Tests E2E
npm run test:e2e

# 4. Build
npm run build

# 5. Start production
npm run start
```

### 4. Vérification Manuelle

- [ ] Landing page charge
- [ ] Login fonctionne
- [ ] Dashboard accessible
- [ ] AI Tasks fonctionne
- [ ] Canvas board fonctionne
- [ ] Pas d'erreurs console
- [ ] Pas de warnings

### 5. Validation

```bash
# Vérifier les vulnérabilités
npm audit

# Vérifier le build
npm run build

# Si OK, commit
git add package.json package-lock.json
git commit -m "security: update dependencies to fix vulnerabilities"

# Push et créer PR
git push origin security/update-dependencies
```

---

## 📋 Checklist de Mise à Jour

### Avant

- [ ] Créer une branche dédiée
- [ ] Sauvegarder package-lock.json
- [ ] Noter les versions actuelles
- [ ] Lire les changelogs
- [ ] Planifier les tests

### Pendant

- [ ] Mettre à jour par priorité
- [ ] Tester après chaque mise à jour
- [ ] Documenter les changements
- [ ] Résoudre les conflits
- [ ] Vérifier les breaking changes

### Après

- [ ] Tests complets passent
- [ ] Build réussit
- [ ] Audit npm propre
- [ ] Documentation mise à jour
- [ ] PR créée et reviewée
- [ ] Déploiement en staging
- [ ] Validation finale
- [ ] Merge vers main

---

## 🚨 Problèmes Courants

### 1. Breaking Changes

**Symptôme:** Code ne compile plus

**Solution:**
```bash
# Lire le changelog
npm view <package> versions
npm view <package>@<version> --json

# Revenir en arrière si nécessaire
npm install <package>@<old-version>
```

### 2. Peer Dependencies

**Symptôme:** Warnings peer dependencies

**Solution:**
```bash
# Installer avec legacy peer deps
npm install --legacy-peer-deps

# Ou forcer
npm install --force
```

### 3. Lock File Conflicts

**Symptôme:** Conflits dans package-lock.json

**Solution:**
```bash
# Supprimer et régénérer
rm package-lock.json
npm install
```

### 4. Cache Corrompu

**Symptôme:** Erreurs étranges après mise à jour

**Solution:**
```bash
# Nettoyer tout
rm -rf node_modules package-lock.json .next
npm cache clean --force
npm install
```

---

## 📊 Dépendances Actuelles

### Production

```json
{
  "next": "^15.0.3",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "@supabase/supabase-js": "^2.39.0",
  "axios": "^1.7.9",
  "typescript": "^5.5.4",
  "tailwindcss": "^3.4.9",
  "framer-motion": "^11.3.28"
}
```

### Développement

```json
{
  "@playwright/test": "^1.40.0",
  "jest": "^29.7.0",
  "eslint": "^9.39.1",
  "@testing-library/react": "^14.1.2"
}
```

---

## 🎯 Versions Cibles

### Recommandations

| Package | Actuel | Cible | Raison |
|---------|--------|-------|--------|
| **next** | 15.0.3 | 15.1.0 | Security fixes |
| **react** | 18.3.1 | 18.3.2 | Bug fixes |
| **@supabase/supabase-js** | 2.39.0 | 2.45.0 | Security |
| **axios** | 1.7.9 | 1.7.10 | CVE fixes |
| **typescript** | 5.5.4 | 5.6.3 | Latest stable |

---

## 🔧 Scripts Utiles

### Package.json

```json
{
  "scripts": {
    "deps:check": "npm outdated",
    "deps:update": "npm update",
    "deps:audit": "npm audit",
    "deps:fix": "npm audit fix",
    "deps:clean": "rm -rf node_modules package-lock.json && npm install"
  }
}
```

### Script PowerShell

```powershell
# update-dependencies.ps1
Write-Host "📦 Updating Dependencies..." -ForegroundColor Cyan

# Backup
Copy-Item package-lock.json package-lock.json.backup

# Update
npm update
npm audit fix

# Test
npm test
npm run build

# Report
npm audit
npm outdated

Write-Host "✅ Update complete!" -ForegroundColor Green
```

---

## 📚 Ressources

### Documentation

- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [npm update](https://docs.npmjs.com/cli/v8/commands/npm-update)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)

### Outils

- [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)
- [Snyk](https://snyk.io/)
- [Dependabot](https://github.com/dependabot)
- [Renovate](https://www.mend.io/free-developer-tools/renovate/)

---

## ✅ Résumé

**Pour mettre à jour les dépendances en toute sécurité:**

1. **Créer une branche** dédiée
2. **Sauvegarder** package-lock.json
3. **Mettre à jour** progressivement
4. **Tester** après chaque mise à jour
5. **Valider** avec tests complets
6. **Déployer** en staging
7. **Merger** après validation

**Commandes essentielles:**

```bash
# Audit
npm audit

# Mise à jour safe
npm audit fix

# Mise à jour manuelle
npm install <package>@latest

# Tests
npm test && npm run build

# Validation
npm audit
```

---

**Dernière mise à jour:** 2025-11-24  
**Version:** 1.0.0  
**Statut:** ✅ **PRÊT À UTILISER**
