# 🌐 Tests E2E - Elite Visuals

Ce dossier contient tous les tests end-to-end de l'application Elite Visuals utilisant Playwright.

## 📁 Structure

```
e2e/
├── landing.spec.ts          # Tests de la landing page
├── ai-tasks.spec.ts         # Tests de la page AI Tasks
├── performance.spec.ts      # Tests de performance
├── accessibility.spec.ts    # Tests d'accessibilité
├── board.spec.ts            # Tests du board
├── board-workflow.spec.ts   # Tests du workflow board
└── collaboration.spec.ts    # Tests de collaboration
```

## 🚀 Exécution

### Tous les tests E2E
```bash
npm run test:e2e
```

### Mode UI interactif
```bash
npm run test:e2e:ui
```

### Mode debug
```bash
npm run test:e2e:debug
```

### Tests spécifiques
```bash
npm run test:landing
npm run test:ai-tasks
npm run test:performance
npm run test:accessibility
```

### Par navigateur
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 🌍 Navigateurs Testés

- ✅ **Chromium** (Desktop Chrome)
- ✅ **Firefox** (Desktop Firefox)
- ✅ **WebKit** (Desktop Safari)
- ✅ **Mobile Chrome** (Pixel 5)
- ✅ **Mobile Safari** (iPhone 12)

## ✍️ Écrire un Test

### Template de base

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/path')
  })

  test('should do something', async ({ page }) => {
    // Arrange
    const element = page.locator('selector')
    
    // Act
    await element.click()
    
    // Assert
    await expect(element).toBeVisible()
  })
})
```

### Best Practices

1. **Sélecteurs robustes**
   ```typescript
   // ✅ Bon
   page.getByRole('button', { name: 'Submit' })
   page.getByTestId('submit-btn')
   
   // ❌ Éviter
   page.locator('.btn-primary')
   ```

2. **Attentes explicites**
   ```typescript
   await expect(page.locator('h1')).toBeVisible()
   // Mieux que:
   await page.waitForTimeout(1000)
   ```

3. **Page Object Model**
   ```typescript
   class LoginPage {
     constructor(private page: Page) {}
     
     async login(email: string, password: string) {
       await this.page.fill('[name="email"]', email)
       await this.page.fill('[name="password"]', password)
       await this.page.click('button[type="submit"]')
     }
   }
   ```

## 📊 Rapports

### Voir le rapport
```bash
npx playwright show-report
```

### Voir les traces
```bash
npx playwright show-trace trace.zip
```

## 🔧 Configuration

- **Framework:** Playwright 1.40.0
- **Navigateurs:** Chromium, Firefox, WebKit
- **Base URL:** http://localhost:3000
- **Retries:** 2 (CI only)
- **Screenshots:** On failure
- **Traces:** On first retry

## 🐛 Debugging

### Mode debug
```bash
npm run test:e2e:debug
```

### Avec traces
```bash
npx playwright test --trace on
```

### Headed mode
```bash
npx playwright test --headed
```

### Slow motion
```bash
npx playwright test --slow-mo=1000
```

## 📚 Ressources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [TESTING_STRATEGY.md](../TESTING_STRATEGY.md)
