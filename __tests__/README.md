# 🧪 Tests Unitaires - Elite Visuals

Ce dossier contient tous les tests unitaires de l'application Elite Visuals.

## 📁 Structure

```
__tests__/
├── components/
│   ├── landing/          # Tests des composants landing page
│   ├── ui/               # Tests des composants UI (shadcn)
│   ├── ai/               # Tests des composants IA
│   ├── dashboard/        # Tests du dashboard
│   ├── board/            # Tests du canvas board
│   └── kanban/           # Tests du kanban
└── lib/
    ├── ai/               # Tests des services IA
    ├── supabase/         # Tests Supabase (à venir)
    └── utils.test.ts     # Tests des utilitaires
```

## 🚀 Exécution

### Tous les tests
```bash
npm test
```

### Mode watch (développement)
```bash
npm run test:watch
```

### Avec couverture
```bash
npm run test:coverage
```

### Test spécifique
```bash
npm test Button.test.tsx
```

## 📊 Couverture

Objectif: **≥ 70%** pour toutes les métriques

- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## ✍️ Écrire un Test

### Template de base

```typescript
import { render, screen } from '@testing-library/react'
import { ComponentName } from '@/components/path/ComponentName'

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />)
    
    const element = screen.getByRole('...')
    expect(element).toBeInTheDocument()
  })
})
```

### Best Practices

1. **Nommage descriptif**
   ```typescript
   it('should display error when form is invalid')
   ```

2. **AAA Pattern**
   - Arrange: Setup
   - Act: Action
   - Assert: Vérification

3. **Test d'accessibilité**
   ```typescript
   expect(screen.getByRole('button')).toBeInTheDocument()
   ```

4. **Isolation**
   - Chaque test doit être indépendant
   - Utiliser `beforeEach` pour le setup

## 🔧 Configuration

- **Framework:** Jest 29.7.0
- **Testing Library:** @testing-library/react 14.1.2
- **Environment:** jsdom
- **Setup:** jest.setup.js

## 📚 Ressources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [TESTING_STRATEGY.md](../TESTING_STRATEGY.md)
