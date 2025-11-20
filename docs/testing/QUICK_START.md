# 🧪 Tests - Quick Start

## 🎯 Objectif
Couverture de tests > 80%

## 📊 État Actuel
- Tests: 0% ❌

## 🚀 Solution Rapide (2 semaines)

### Installation (Jour 1)
```bash
npm install -D @playwright/test
npx playwright install
```

### Configuration
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
  },
})
```

### Premier Test (Jour 2)
```typescript
// tests/e2e/board.spec.ts
import { test, expect } from '@playwright/test'

test('devrait afficher le board', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-testid="infinite-board"]')).toBeVisible()
})

test('devrait ajouter une note', async ({ page }) => {
  await page.goto('/')
  await page.click('[data-testid="add-note-button"]')
  await expect(page.locator('[data-testid="board-item"]')).toBeVisible()
})
```

### Lancer les Tests
```bash
npm run test:e2e
npm run test:e2e:ui  # Mode UI
```

## 📈 Plan
- Semaine 1: Tests Board + Kanban
- Semaine 2: Tests Exports + IA

## 📚 Documentation Complète
Voir `docs/testing/TESTING_GUIDE.md`
