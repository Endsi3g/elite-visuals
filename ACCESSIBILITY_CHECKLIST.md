# ✅ Checklist Accessibilité & Responsive - Elite Visuals

## 🎯 Checklist Globale

### 🔴 Critique - À corriger immédiatement

#### Navigation Clavier
- [ ] Ajouter `tabIndex={0}` sur tous les éléments interactifs
- [ ] Implémenter `onKeyDown` handlers pour Enter/Space
- [ ] Ajouter focus visible styles (ring-2 ring-primary)
- [ ] Créer raccourcis clavier (Ctrl+Z, Delete, Arrow keys)
- [ ] Implémenter focus trap dans modales
- [ ] Tester navigation complète au clavier uniquement

#### ARIA & Sémantique
- [ ] Ajouter `role` sur tous les composants custom
- [ ] Ajouter `aria-label` sur tous les boutons icon-only
- [ ] Ajouter `aria-expanded` sur toggles
- [ ] Ajouter `aria-live` regions pour notifications
- [ ] Créer alternative DOM pour canvas Konva
- [ ] Ajouter `aria-describedby` pour descriptions

#### Contraste Couleurs
- [ ] Remplacer #FF684A par #E85535 (ratio 4.52:1)
- [ ] Vérifier tous les textes sur fond orange
- [ ] Ajouter mode haute visibilité
- [ ] Tester avec simulateurs daltonisme
- [ ] Documenter palette accessible

#### Responsive Design
- [ ] Définir breakpoints complets (xs, sm, md, lg, xl, 2xl)
- [ ] Adapter InfiniteBoard pour mobile
- [ ] Créer menu hamburger mobile
- [ ] Rendre KanbanSidebar collapsible
- [ ] Tester sur iPhone SE (375px)
- [ ] Tester sur iPad (768px)

#### Support Tactile
- [ ] Augmenter taille boutons à 44x44px minimum
- [ ] Implémenter pinch-to-zoom sur canvas
- [ ] Ajouter support drag tactile (@dnd-kit TouchSensor)
- [ ] Tester sur appareils tactiles réels
- [ ] Ajouter feedback visuel au touch

### ⚠️ Important - À corriger rapidement

#### Lecteurs d'Écran
- [ ] Tester avec NVDA (Windows)
- [ ] Tester avec JAWS (Windows)
- [ ] Tester avec VoiceOver (Mac/iOS)
- [ ] Ajouter skip links
- [ ] Structurer headings (h1, h2, h3)

#### Formulaires & Inputs
- [ ] Ajouter `<label>` sur tous les inputs
- [ ] Ajouter messages d'erreur accessibles
- [ ] Implémenter validation accessible
- [ ] Ajouter `autocomplete` attributes

#### Performance
- [ ] Optimiser virtualisation canvas
- [ ] Lazy load images
- [ ] Code splitting par route
- [ ] Optimiser bundle size

### 💡 Améliorations - Nice to have

#### Préférences Utilisateur
- [ ] Respecter `prefers-reduced-motion`
- [ ] Respecter `prefers-color-scheme`
- [ ] Respecter `prefers-contrast`
- [ ] Sauvegarder préférences accessibilité

#### Documentation
- [ ] Guide accessibilité utilisateur
- [ ] Guide développeur ARIA
- [ ] Vidéos tutoriels accessibles
- [ ] FAQ accessibilité

---

## 📝 Checklist par Composant

### InfiniteBoard.tsx

#### Corrections Critiques
```tsx
// ✅ TODO 1: Ajouter import manquant
import { useState, useRef, useCallback, useEffect } from "react"

// ✅ TODO 2: Rendre responsive
const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })

useEffect(() => {
  const updateDimensions = () => {
    const sidebarWidth = window.innerWidth < 768 ? 0 : 384
    setDimensions({
      width: window.innerWidth - sidebarWidth,
      height: window.innerHeight - 64
    })
  }
  updateDimensions()
  window.addEventListener('resize', updateDimensions)
  return () => window.removeEventListener('resize', updateDimensions)
}, [])

// ✅ TODO 3: Ajouter navigation clavier
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Delete' && selectedItem) {
    deleteItem(selectedItem)
  }
  if (e.key === 'ArrowUp' && selectedItem) {
    moveItem(selectedItem, 0, -10)
  }
  // ... autres touches
}

useEffect(() => {
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [selectedItem])

// ✅ TODO 4: Alternative accessible au canvas
<div role="application" aria-label="Board visuel infini Elite Visuals">
  <Stage aria-hidden="true">
    {/* Canvas visuel */}
  </Stage>
  
  {/* Alternative accessible */}
  <div className="sr-only">
    <h2>Éléments du board ({items.length})</h2>
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <button
            onClick={() => selectItem(item.id)}
            aria-label={`${item.type}: ${item.title || 'Sans titre'}`}
          >
            {item.title || item.type}
          </button>
        </li>
      ))}
    </ul>
  </div>
</div>

// ✅ TODO 5: Support tactile
import { useGesture } from '@use-gesture/react'

const bind = useGesture({
  onPinch: ({ offset: [scale] }) => {
    setScale(Math.max(0.1, Math.min(3, scale)))
  },
  onDrag: ({ offset: [x, y], pinching }) => {
    if (!pinching) {
      setPosition({ x, y })
    }
  }
})

// ✅ TODO 6: Boutons accessibles
<Button
  onClick={addTextCard}
  className="bg-primary hover:bg-primary/90 glow-orange shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
  size="icon"
  aria-label="Ajouter une nouvelle carte texte"
>
  <Plus className="h-5 w-5" aria-hidden="true" />
</Button>
```

### BoardCard.tsx

```tsx
// ✅ TODO 1: Rendre accessible
<Group
  x={item.x}
  y={item.y}
  draggable
  onDragEnd={(e) => {
    onUpdatePosition(item.id, e.target.x(), e.target.y())
  }}
  // Ajouter metadata pour alternative DOM
  name={`card-${item.id}`}
  id={item.id}
>
  {/* ... */}
</Group>

// ✅ TODO 2: Créer version DOM accessible
// Dans InfiniteBoard, ajouter:
<div className="sr-only">
  {items.map(item => (
    <div
      key={item.id}
      role="article"
      aria-label={`Carte ${item.type}: ${item.title}`}
      tabIndex={0}
      onKeyDown={(e) => handleCardKeyDown(e, item.id)}
    >
      <h3>{item.title}</h3>
      <p>{item.content}</p>
      <button onClick={() => deleteItem(item.id)}>Supprimer</button>
    </div>
  ))}
</div>

// ✅ TODO 3: Corriger contraste badge
<Rect
  x={item.width - 40}
  y={8}
  width={32}
  height={20}
  fill="#E85535"  // Au lieu de #FF684A
  cornerRadius={4}
/>
```

### Header.tsx

```tsx
// ✅ TODO 1: Menu mobile responsive
const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

<header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 md:px-6 shadow-sm">
  {/* Logo */}
  <div className="flex items-center gap-2 md:gap-3">
    {/* ... */}
  </div>

  {/* Mobile menu button */}
  <button
    className="md:hidden p-2"
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
    aria-expanded={mobileMenuOpen}
  >
    {mobileMenuOpen ? <X /> : <Menu />}
  </button>

  {/* Desktop actions */}
  <div className="hidden md:flex items-center gap-2">
    {/* ... */}
  </div>
</header>

{/* Mobile menu */}
{mobileMenuOpen && (
  <div className="md:hidden border-b border-gray-200 bg-white p-4">
    {/* Menu items */}
  </div>
)}

// ✅ TODO 2: Boutons accessibles
<Button 
  variant="ghost" 
  size="sm" 
  className="text-gray-600"
  aria-label="Inviter des collaborateurs"
>
  <Users className="w-4 h-4 mr-2" aria-hidden="true" />
  <span>Inviter</span>
</Button>

<Button 
  variant="outline" 
  size="sm"
  aria-label="Exporter le board"
>
  <Download className="w-4 h-4 mr-2" aria-hidden="true" />
  <span className="hidden sm:inline">Exporter</span>
</Button>

// ✅ TODO 3: Avatars accessibles
<div 
  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-600 border-2 border-white flex items-center justify-center text-white text-xs font-semibold active-user-indicator"
  role="img"
  aria-label={`Utilisateur ${i} actif`}
>
  U{i}
</div>
```

### KanbanSidebar.tsx

```tsx
// ✅ TODO 1: Responsive
<div className="h-full flex flex-col bg-white w-full md:w-96">
  {/* ... */}
</div>

// ✅ TODO 2: Drag-and-drop accessible
import { DndContext, TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core'

const sensors = useSensors(
  useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  }),
  useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  })
)

<DndContext sensors={sensors}>
  {/* Kanban columns */}
</DndContext>

// ✅ TODO 3: Tâches accessibles
<div
  role="article"
  aria-label={`Tâche: ${task.title}`}
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      // Ouvrir détails
    }
  }}
  className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer group focus-visible:ring-2 focus-visible:ring-primary"
>
  {/* ... */}
</div>
```

### ShowroomView.tsx

```tsx
// ✅ TODO 1: Responsive zoom
const [zoom, setZoom] = useState(1)
const [pan, setPan] = useState({ x: 0, y: 0 })

// Adapter pour mobile
useEffect(() => {
  if (window.innerWidth < 768) {
    setZoom(0.5) // Zoom out par défaut sur mobile
  }
}, [])

// ✅ TODO 2: Commentaires accessibles
<button
  onClick={onClick}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
    isSelected || isHovered
      ? 'bg-orange-500 shadow-lg scale-110'
      : 'bg-orange-400 shadow-md'
  }`}
  aria-label={`Commentaire de ${comment.author}: ${comment.text.substring(0, 50)}...`}
  aria-expanded={isSelected}
>
  <MessageCircle size={20} className="text-white" aria-hidden="true" />
</button>

// ✅ TODO 3: Textarea accessible
<label htmlFor="new-comment" className="sr-only">
  Nouveau commentaire
</label>
<textarea
  id="new-comment"
  className="w-full border border-gray-300 rounded p-2 text-sm"
  placeholder="Votre commentaire..."
  rows={3}
  autoFocus
  aria-label="Saisir un nouveau commentaire"
  onKeyDown={(e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      addComment(e.currentTarget.value)
    }
    if (e.key === 'Escape') {
      setNewCommentPos(null)
      setIsAddingComment(false)
    }
  }}
/>
```

### Button.tsx (UI Component)

```tsx
// ✅ TODO 1: Tailles tactiles
size: {
  default: "h-11 px-4 py-2",  // 44px
  sm: "h-11 rounded-md px-3",  // 44px
  lg: "h-12 rounded-md px-8",  // 48px
  icon: "h-11 w-11",  // 44px
}

// ✅ TODO 2: Focus visible
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  // ...
)
```

---

## 🧪 Tests à Effectuer

### Tests Manuels

#### Navigation Clavier
- [ ] Naviguer tout le site avec Tab uniquement
- [ ] Tester tous les raccourcis clavier
- [ ] Vérifier focus visible sur tous les éléments
- [ ] Tester focus trap dans modales
- [ ] Vérifier ordre de focus logique

#### Lecteurs d'Écran
- [ ] NVDA: Lire toute la page
- [ ] JAWS: Naviguer par headings
- [ ] VoiceOver: Tester sur iOS
- [ ] Vérifier annonces live regions
- [ ] Tester formulaires

#### Responsive
- [ ] iPhone SE (375x667)
- [ ] iPhone 12 Pro (390x844)
- [ ] iPad (768x1024)
- [ ] iPad Pro (1024x1366)
- [ ] Desktop 1920x1080
- [ ] Desktop 2560x1440

#### Tactile
- [ ] Pinch-to-zoom sur canvas
- [ ] Drag-and-drop cartes
- [ ] Scroll Kanban
- [ ] Tap tous les boutons
- [ ] Swipe gestures

#### Contraste
- [ ] Vérifier avec Color Contrast Analyzer
- [ ] Tester avec simulateur daltonisme
- [ ] Mode haute visibilité
- [ ] Dark mode (si implémenté)

### Tests Automatisés

#### Lighthouse
```bash
# Objectif: Score 95+
npm run lighthouse
```

#### axe-core
```bash
# Objectif: 0 erreurs
npm run axe
```

#### Pa11y
```bash
# Objectif: 0 erreurs WCAG AA
npm run pa11y
```

#### Playwright Accessibility
```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('should not have accessibility violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})
```

---

## 📚 Ressources

### Standards
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [RGAA 4.1](https://www.numerique.gouv.fr/publications/rgaa-accessibilite/)

### Outils
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)
- [NVDA Screen Reader](https://www.nvaccess.org/)

### Librairies
- [@use-gesture/react](https://use-gesture.netlify.app/) - Gestes tactiles
- [@dnd-kit/core](https://dndkit.com/) - Drag-and-drop accessible
- [@radix-ui](https://www.radix-ui.com/) - Composants accessibles
- [@axe-core/react](https://github.com/dequelabs/axe-core-npm) - Tests auto

---

**Prochaine étape**: Voir `ACCESSIBILITY_GUIDELINES.md` pour guides d'implémentation détaillés.
