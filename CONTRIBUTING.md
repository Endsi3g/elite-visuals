# 🤝 Guide de Contribution - Elite Visuals

Merci de votre intérêt pour contribuer à Elite Visuals ! Ce guide vous aidera à démarrer.

## 📋 Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Configuration de Développement](#configuration-de-développement)
- [Standards de Code](#standards-de-code)
- [Processus de Pull Request](#processus-de-pull-request)
- [Signaler des Bugs](#signaler-des-bugs)
- [Proposer des Fonctionnalités](#proposer-des-fonctionnalités)

## 🌟 Code de Conduite

En participant à ce projet, vous acceptez de maintenir un environnement respectueux et inclusif pour tous.

### Nos Engagements

- Utiliser un langage accueillant et inclusif
- Respecter les points de vue et expériences différents
- Accepter les critiques constructives avec grâce
- Se concentrer sur ce qui est meilleur pour la communauté

## 🚀 Comment Contribuer

### Types de Contributions

Nous acceptons plusieurs types de contributions :

1. **Corrections de bugs** 🐛
2. **Nouvelles fonctionnalités** ✨
3. **Améliorations de documentation** 📚
4. **Optimisations de performance** ⚡
5. **Tests** 🧪
6. **Traductions** 🌍

## 💻 Configuration de Développement

### Prérequis

- Node.js 18+ et npm
- Git
- Ollama (pour les fonctionnalités IA)
- Un compte Supabase (gratuit)

### Installation

1. **Fork le repository**
   ```bash
   # Cliquez sur "Fork" en haut à droite de la page GitHub
   ```

2. **Cloner votre fork**
   ```bash
   git clone https://github.com/VOTRE-USERNAME/elite-visuals.git
   cd elite-visuals
   ```

3. **Ajouter le repository upstream**
   ```bash
   git remote add upstream https://github.com/Endsi3g/elite-visuals.git
   ```

4. **Installer les dépendances**
   ```bash
   npm install
   ```

5. **Configurer l'environnement**
   ```bash
   cp .env.local.example .env.local
   # Éditer .env.local avec vos clés API
   ```

6. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

### Structure du Projet

```
elite-visuals/
├── app/                    # Pages Next.js (App Router)
├── components/             # Composants React
│   ├── board/             # Composants du board visuel
│   ├── kanban/            # Composants Kanban
│   ├── layout/            # Layout et navigation
│   └── ui/                # Composants UI réutilisables
├── lib/                   # Utilitaires et services
│   ├── ai/                # Services IA (Ollama, Claude, Luma)
│   └── supabase/          # Configuration et hooks Supabase
├── hooks/                 # Hooks React personnalisés
├── supabase/              # Schéma et migrations Supabase
└── public/                # Assets statiques
```

## 📝 Standards de Code

### TypeScript

- Utiliser TypeScript pour tout nouveau code
- Définir des types explicites (éviter `any`)
- Utiliser des interfaces pour les objets complexes

```typescript
// ✅ Bon
interface BoardItem {
  id: string
  type: 'text' | 'image' | 'video'
  x: number
  y: number
}

// ❌ Mauvais
const item: any = { ... }
```

### React

- Utiliser des composants fonctionnels avec hooks
- Préférer `const` pour les composants
- Utiliser la destructuration pour les props

```typescript
// ✅ Bon
export const BoardCard = ({ item, onUpdate }: BoardCardProps) => {
  return <div>...</div>
}

// ❌ Mauvais
export function BoardCard(props) {
  return <div>...</div>
}
```

### Styling

- Utiliser TailwindCSS pour le styling
- Respecter la palette de couleurs (blanc + orange #FF684A)
- Utiliser la fonction `cn()` pour combiner les classes

```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  "base-classes",
  isActive && "active-classes"
)} />
```

### Nommage

- **Fichiers** : kebab-case (`board-card.tsx`)
- **Composants** : PascalCase (`BoardCard`)
- **Fonctions** : camelCase (`generateScript`)
- **Constantes** : UPPER_SNAKE_CASE (`API_BASE_URL`)

### Commits

Utiliser le format Conventional Commits :

```bash
feat: ajouter génération vidéo Luma
fix: corriger le zoom du board
docs: mettre à jour le README
style: formater le code
refactor: restructurer les composants AI
test: ajouter tests pour BoardCard
chore: mettre à jour les dépendances
```

## 🔄 Processus de Pull Request

### Avant de Soumettre

1. **Synchroniser avec upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Créer une branche**
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```

3. **Faire vos modifications**
   - Écrire du code propre et testé
   - Ajouter des commentaires si nécessaire
   - Mettre à jour la documentation

4. **Tester localement**
   ```bash
   npm run dev
   npm run build
   npm run lint
   ```

5. **Commit et push**
   ```bash
   git add .
   git commit -m "feat: description de la fonctionnalité"
   git push origin feature/ma-nouvelle-fonctionnalite
   ```

### Soumettre la PR

1. Aller sur GitHub et créer une Pull Request
2. Remplir le template de PR :
   - Description claire des changements
   - Screenshots si applicable
   - Référence aux issues liées
   - Checklist complétée

### Template de PR

```markdown
## Description
Brève description des changements

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Tests
- [ ] Tests locaux passés
- [ ] Build production réussi
- [ ] Testé sur différents navigateurs

## Screenshots (si applicable)
[Ajouter des captures d'écran]

## Checklist
- [ ] Mon code suit les standards du projet
- [ ] J'ai commenté les parties complexes
- [ ] J'ai mis à jour la documentation
- [ ] Mes changements ne génèrent pas de warnings
- [ ] J'ai ajouté des tests si nécessaire
```

## 🐛 Signaler des Bugs

### Avant de Signaler

1. Vérifier que le bug n'a pas déjà été signalé
2. Vérifier que vous utilisez la dernière version
3. Tester avec une configuration minimale

### Template de Bug Report

```markdown
## Description du Bug
Description claire et concise du bug

## Reproduction
Étapes pour reproduire :
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

## Comportement Attendu
Ce qui devrait se passer

## Comportement Actuel
Ce qui se passe réellement

## Screenshots
[Ajouter des captures d'écran]

## Environnement
- OS: [e.g. Windows 11]
- Navigateur: [e.g. Chrome 120]
- Version Node: [e.g. 18.17.0]
- Version Elite Visuals: [e.g. 0.1.0]

## Logs d'Erreur
```
[Coller les logs ici]
```

## Contexte Additionnel
Toute autre information pertinente
```

## 💡 Proposer des Fonctionnalités

### Template de Feature Request

```markdown
## Problème à Résoudre
Quel problème cette fonctionnalité résout-elle ?

## Solution Proposée
Description de la solution que vous aimeriez

## Alternatives Considérées
Autres solutions envisagées

## Contexte Additionnel
Screenshots, mockups, exemples d'autres apps

## Impact
- Utilisateurs concernés: [nombre/type]
- Priorité: [basse/moyenne/haute]
- Complexité estimée: [simple/moyenne/complexe]
```

## 🧪 Tests

### Exécuter les Tests

```bash
# Tests unitaires (à venir)
npm run test

# Tests E2E (à venir)
npm run test:e2e

# Linting
npm run lint
```

### Écrire des Tests

Nous utiliserons Jest et React Testing Library :

```typescript
import { render, screen } from '@testing-library/react'
import { BoardCard } from './BoardCard'

describe('BoardCard', () => {
  it('renders card with title', () => {
    render(<BoardCard item={mockItem} />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })
})
```

## 📚 Documentation

### Mettre à Jour la Documentation

- **README.md** : Vue d'ensemble et installation
- **INSTALLATION.md** : Guide d'installation détaillé
- **Code comments** : Expliquer les parties complexes
- **JSDoc** : Documenter les fonctions publiques

```typescript
/**
 * Génère un script publicitaire avec l'IA
 * @param prompt - Le prompt pour la génération
 * @param options - Options de génération
 * @returns Le script généré
 */
export async function generateScript(
  prompt: string,
  options?: GenerationOptions
): Promise<string> {
  // ...
}
```

## 🎨 Design Guidelines

### Palette de Couleurs

- **Primary** : #FF684A (Orange Elite)
- **Background** : #FFFFFF (Blanc)
- **Text** : #1F2937 (Gris foncé)
- **Secondary** : #6B7280 (Gris moyen)

### Composants UI

- Utiliser shadcn/ui pour les composants de base
- Coins arrondis : 8px (standard), 12px (cards)
- Ombres : subtiles avec teinte orange
- Animations : smooth, 200-300ms

## 🔒 Sécurité

### Signaler une Vulnérabilité

Si vous découvrez une vulnérabilité de sécurité :

1. **NE PAS** créer une issue publique
2. Envoyer un email à : security@elitevisuals.com
3. Inclure une description détaillée
4. Attendre notre réponse avant de divulguer

## 📞 Questions ?

- **Discord** : [Elite Visuals Community](#)
- **Email** : dev@elitevisuals.com
- **Discussions GitHub** : [GitHub Discussions](#)

## 🙏 Remerciements

Merci à tous les contributeurs qui aident à améliorer Elite Visuals !

### Top Contributors

<!-- Liste automatiquement générée -->

---

**Fait avec ❤️ par la communauté Elite Visuals**
