# ⚡ Guide Rapide des Tests - Elite Visuals

**Pour les développeurs pressés** 🚀

---

## 🎯 Commandes Essentielles

### Tests Rapides (< 1 min)
```bash
npm test                    # Tests unitaires
npm run lint                # Linting
```

### Tests Complets (3-5 min)
```bash
npm run test:all-local      # Tous les tests + build
```

### Tests Spécifiques
```bash
npm run test:landing        # Landing page
npm run test:ai-tasks       # AI Tasks
npm run test:accessibility  # Accessibilité
npm run test:performance    # Performance
```

---

## 📋 Checklist Avant Commit

```bash
# 1. Tests unitaires
npm test

# 2. Linting
npm run lint

# 3. Build
npm run build
```

**Tout passe ?** ✅ Vous pouvez commit !

---

## 🐛 Debugging Rapide

### Test unitaire qui échoue
```bash
# Mode watch pour voir les changements
npm run test:watch

# Test spécifique
npm test ComponentName.test.tsx
```

### Test E2E qui échoue
```bash
# Mode UI pour voir visuellement
npm run test:e2e:ui

# Mode debug avec pause
npm run test:e2e:debug
```

---

## 📊 Voir les Rapports

```bash
# Couverture des tests
start coverage/lcov-report/index.html

# Rapport Playwright
npx playwright show-report

# Lighthouse
start .lighthouseci/*.html
```

---

## ✍️ Créer un Nouveau Test

### Test Unitaire
```typescript
// __tests__/components/MyComponent.test.tsx
import { render, screen } from '@testing-library/react'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render', () => {
    render(<MyComponent />)
    expect(screen.getByRole('...')).toBeInTheDocument()
  })
})
```

### Test E2E
```typescript
// e2e/my-feature.spec.ts
import { test, expect } from '@playwright/test'

test('should work', async ({ page }) => {
  await page.goto('/my-feature')
  await expect(page.locator('h1')).toBeVisible()
})
```

---

## 🚨 Erreurs Courantes

### "Cannot find module"
```bash
npm install
```

### "Port 3000 already in use"
```bash
# Tuer le processus sur le port 3000
npx kill-port 3000
```

### "Tests timeout"
```bash
# Augmenter le timeout dans le test
test('...', async ({ page }) => {
  test.setTimeout(60000) // 60 secondes
})
```

---

## 📚 Documentation Complète

- **Guide complet:** [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
- **Résumé:** [TESTS_IMPLEMENTATION_SUMMARY.md](./TESTS_IMPLEMENTATION_SUMMARY.md)
- **Tests unitaires:** [__tests__/README.md](./__tests__/README.md)
- **Tests E2E:** [e2e/README.md](./e2e/README.md)

---

## 🎉 C'est Tout !

**Questions ?** Consultez [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)

**Bon test !** 🧪
