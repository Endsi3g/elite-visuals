# 🔧 Dépannage Jest - Elite Visuals

**Problème:** `Error: Cannot find module './route'`

---

## 🎯 Cause

Le `require-hook` de Next.js interfère avec Jest, causant des conflits de modules.

---

## ✅ Solutions

### Solution 1: Utiliser la Configuration Simplifiée (Recommandé)

```powershell
# Utiliser la config Jest sans next/jest
npm run test:simple
```

Cette commande utilise `jest.config.simple.js` qui évite le conflit.

### Solution 2: Nettoyer et Réinstaller

```powershell
# Nettoyer le cache
npm cache clean --force

# Supprimer node_modules
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Réinstaller
npm install

# Tester
npm run test:simple
```

### Solution 3: Utiliser la Configuration Standard avec NODE_OPTIONS

```powershell
# Avec les options Node.js
npm test
```

Le script `test` dans `package.json` inclut maintenant `NODE_OPTIONS=--experimental-vm-modules`.

---

## 📋 Commandes de Test Disponibles

```bash
# Configuration simplifiée (sans next/jest)
npm run test:simple

# Configuration standard (avec next/jest)
npm test

# Mode watch
npm run test:watch

# Avec couverture
npm run test:coverage

# Tests E2E (Playwright)
npm run test:e2e
```

---

## 🔍 Vérification

### 1. Vérifier que @swc/jest est installé

```powershell
npm list @swc/jest
```

### 2. Vérifier que identity-obj-proxy est installé

```powershell
npm list identity-obj-proxy
```

### 3. Tester avec la config simple

```powershell
npm run test:simple
```

---

## 📝 Configurations Disponibles

### jest.config.js (Standard)
- Utilise `next/jest`
- Intégration complète avec Next.js
- Peut causer des conflits

### jest.config.simple.js (Simplifié)
- Utilise `@swc/jest`
- Pas de dépendance à Next.js
- Plus stable, moins de conflits

---

## 🐛 Autres Erreurs Courantes

### "Cannot find module '@testing-library/react'"

```powershell
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### "Cannot find module 'identity-obj-proxy'"

```powershell
npm install --save-dev identity-obj-proxy
```

### "Cannot find module '@swc/jest'"

```powershell
npm install --save-dev @swc/jest
```

### Tests qui timeout

Augmenter le timeout dans `jest.setup.js`:

```javascript
jest.setTimeout(10000) // 10 secondes
```

---

## ✨ Recommandation

**Utilisez `npm run test:simple` pour éviter les conflits avec Next.js.**

Cette configuration est plus stable et fonctionne de manière fiable.

---

## 📚 Ressources

- [Jest Documentation](https://jestjs.io/)
- [SWC Jest](https://swc.rs/docs/usage/jest)
- [Next.js Testing](https://nextjs.org/docs/testing)

---

**Dernière mise à jour:** 2025-11-24
