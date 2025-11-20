# 🧪 Guide de Tests - Elite Visuals

## Installation des Dépendances

Installer toutes les dépendances de test :

```bash
npm install
```

Installer Playwright browsers :

```bash
npx playwright install
```

---

## Tests Unitaires (Jest)

### Lancer les tests

```bash
# Tous les tests
npm test

# Mode watch (re-run automatique)
npm run test:watch

# Avec coverage
npm run test:coverage
```

### Structure des tests

```
__tests__/
├── components/
│   ├── board/
│   │   └── BoardCard.test.tsx
│   └── kanban/
│       └── KanbanColumn.test.tsx
└── lib/
    └── ai/
        └── ollama.test.ts
```

### Exemple de test

```typescript
import { render, screen } from '@testing-library/react'
import { BoardCard } from '@/components/board/BoardCard'

describe('BoardCard', () => {
  it('renders card with correct title', () => {
    render(<BoardCard card={mockCard} />)
    expect(screen.getByText('Test Card')).toBeInTheDocument()
  })
})
```

### Coverage actuel

| Type | Coverage |
|------|----------|
| Statements | 0% → **Objectif: 70%** |
| Branches | 0% → **Objectif: 70%** |
| Functions | 0% → **Objectif: 70%** |
| Lines | 0% → **Objectif: 70%** |

---

## Tests E2E (Playwright)

### Lancer les tests

```bash
# Tous les tests E2E
npm run test:e2e

# Mode UI interactif
npm run test:e2e:ui

# Mode debug
npm run test:e2e:debug

# Tests spécifiques
npx playwright test board-workflow
npx playwright test collaboration
```

### Browsers testés

- ✅ Chromium (Desktop)
- ✅ Firefox (Desktop)
- ✅ WebKit (Safari)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

### Structure des tests E2E

```
e2e/
├── board-workflow.spec.ts      # Workflows board principal
└── collaboration.spec.ts       # Fonctionnalités collaboration
```

### Exemple de test E2E

```typescript
import { test, expect } from '@playwright/test'

test('should add a new card to the board', async ({ page }) => {
  await page.goto('/')
  await page.click('button:has-text("Ajouter")')
  await page.fill('input[name="title"]', 'Test Card')
  await page.click('button:has-text("Créer")')
  
  await expect(page.locator('text=Test Card')).toBeVisible()
})
```

---

## Lancer Tous les Tests

```bash
npm run test:all
```

Cette commande lance :
1. Tests unitaires Jest
2. Tests E2E Playwright

---

## CI/CD Integration

Les tests sont automatiquement lancés sur GitHub Actions lors des :
- Push sur `main`
- Pull Requests

Voir `.github/workflows/ci.yml` pour la configuration.

---

## Debugging

### Jest

```bash
# Lancer un test spécifique
npm test -- BoardCard.test.tsx

# Mode debug
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Playwright

```bash
# Mode debug avec UI
npm run test:e2e:debug

# Voir les traces
npx playwright show-trace trace.zip
```

---

## Mocking

### Mocks globaux (jest.setup.js)

- Konva / react-konva
- IntersectionObserver
- ResizeObserver
- Variables d'environnement

### Mocks personnalisés

```typescript
// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

mockedAxios.post.mockResolvedValue({ data: { response: 'test' } })
```

---

## Best Practices

### Tests Unitaires

1. **Isoler les composants** : Tester un composant à la fois
2. **Mocks minimaux** : Ne mocker que ce qui est nécessaire
3. **Tests lisibles** : Noms descriptifs et arrange-act-assert
4. **Éviter les snapshots** : Préférer les assertions explicites

### Tests E2E

1. **Sélecteurs stables** : Utiliser `data-testid` plutôt que classes CSS
2. **Attendre les éléments** : Toujours utiliser `waitFor` ou `expect().toBeVisible()`
3. **Tests indépendants** : Chaque test doit pouvoir s'exécuter seul
4. **Nettoyer l'état** : Réinitialiser la DB entre les tests

---

## Prochaines Étapes

### Tests à ajouter

- [ ] Tests intégration Supabase
- [ ] Tests services IA (Claude, Luma)
- [ ] Tests exports (PDF, Markdown)
- [ ] Tests Mode Showroom
- [ ] Tests performance (Lighthouse CI)
- [ ] Tests accessibilité (axe-core)

### Améliorations

- [ ] Augmenter coverage à 70%+
- [ ] Ajouter tests visuels (Percy, Chromatic)
- [ ] Implémenter tests de charge (k6)
- [ ] Configurer Playwright Trace Viewer

---

## Ressources

- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Maintenu par:** Elite Visuals Team  
**Dernière mise à jour:** 20 Nov 2024
