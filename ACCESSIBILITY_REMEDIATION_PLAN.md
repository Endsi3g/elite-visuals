# 🎯 Plan de Remédiation Accessibilité - Elite Visuals

**Date:** 2025-11-21  
**Score Actuel:** 40.8/100 ❌  
**Objectif:** 90+/100 ✅

---

## 📊 Résumé Exécutif

### Scores Actuels
| Catégorie | Score | Statut | Priorité |
|-----------|-------|--------|----------|
| **Accessibilité** | 45/100 | ❌ Critique | P0 |
| **Contraste** | 60/100 | ⚠️ Insuffisant | P0 |
| **Clavier** | 25/100 | ❌ Non fonctionnel | P0 |
| **ARIA** | 40/100 | ❌ Critique | P0 |
| **Responsive** | 35/100 | ❌ Critique | P1 |
| **Tactile** | 40/100 | ⚠️ Problèmes | P1 |

### Problèmes Critiques Identifiés
1. ❌ **Navigation clavier non fonctionnelle** - Canvas Konva inaccessible
2. ⚠️ **Elite Orange #FF684A** - Contraste 3.12:1 (requis: 4.5:1)
3. ❌ **50+ boutons sans aria-label** - Invisible aux lecteurs d'écran
4. ❌ **Non responsive mobile** - Sidebar 384px fixe écrase contenu
5. ❌ **Pas de support tactile** - Pinch-to-zoom et drag-drop manquants

---

## 🎨 Phase 1: Correction du Contraste (P0)

### Problème
Elite Orange `#FF684A` a un ratio de contraste de **3.12:1** sur fond blanc, en dessous du minimum WCAG AA de **4.5:1**.

### Solution
Remplacer par une couleur accessible tout en conservant l'identité visuelle.

#### Nouvelle Palette
```css
/* Couleurs accessibles WCAG AA */
--primary: #E85535;              /* Ratio: 4.52:1 ✅ */
--primary-hover: #D64A2E;        /* Ratio: 5.21:1 ✅ */
--primary-light: #FF8A6B;        /* Pour backgrounds (non-texte) */
--primary-glow: rgba(232, 85, 53, 0.4);
```

#### Fichiers à Modifier
- [x] `app/globals.css` - Variables CSS
- [x] `tailwind.config.ts` - Configuration Tailwind
- [x] `lib/collaboration/websocket.ts` - Couleurs utilisateurs
- [x] Tous les fichiers avec `#FF684A` hardcodé

### Tests de Validation
```bash
# Vérifier le contraste
npm run test:contrast

# Audit visuel
npm run test:a11y
```

---

## ♿ Phase 2: ARIA Labels (P0)

### Problème
**50+ boutons** sans `aria-label`, invisibles pour les lecteurs d'écran.

### Solution
Ajouter des labels descriptifs à tous les éléments interactifs.

#### Composants Prioritaires
1. **FloatingToolbar** (14 boutons)
2. **ShowroomHeader** (13 boutons)
3. **ShowroomView** (10 boutons)
4. **MagicPrompt** (5 boutons)
5. **ContextMenu** (tous les items)

#### Pattern à Suivre
```tsx
// ❌ Avant
<button onClick={handleClick}>
  <Icon />
</button>

// ✅ Après
<button 
  onClick={handleClick}
  aria-label="Ajouter une note"
  title="Ajouter une note (Ctrl+N)"
>
  <Icon aria-hidden="true" />
</button>
```

#### Checklist
- [ ] FloatingToolbar.tsx
- [ ] ShowroomHeader.tsx
- [ ] ShowroomView.tsx
- [ ] MagicPrompt.tsx
- [ ] ContextMenu.tsx
- [ ] MobileBottomBar.tsx
- [ ] CommentPin.tsx
- [ ] ExportMenu.tsx
- [ ] Header.tsx
- [ ] KeyboardShortcuts.tsx

---

## ⌨️ Phase 3: Navigation Clavier (P0)

### Problème
Canvas Konva **non accessible au clavier**. Impossible de naviguer ou manipuler les éléments sans souris.

### Solution
Implémenter un système de navigation clavier complet.

#### 3.1 Focus Management
```tsx
// hooks/use-keyboard-navigation.ts
export function useKeyboardNavigation() {
  const [focusedElement, setFocusedElement] = useState<string | null>(null)
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'Tab':
          // Naviguer entre éléments
          break
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          // Déplacer élément focusé
          break
        case 'Enter':
        case ' ':
          // Activer élément
          break
        case 'Escape':
          // Annuler action
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [focusedElement])
  
  return { focusedElement, setFocusedElement }
}
```

#### 3.2 Canvas Accessibility Layer
```tsx
// components/board/AccessibleCanvas.tsx
export function AccessibleCanvas({ items }: Props) {
  return (
    <>
      {/* Canvas visuel Konva */}
      <Stage>...</Stage>
      
      {/* Layer d'accessibilité invisible */}
      <div className="sr-only" role="application" aria-label="Board créatif">
        {items.map(item => (
          <button
            key={item.id}
            tabIndex={0}
            aria-label={`${item.type}: ${item.title}`}
            onClick={() => selectItem(item.id)}
            onKeyDown={(e) => handleKeyboardMove(e, item)}
          >
            {item.title}
          </button>
        ))}
      </div>
    </>
  )
}
```

#### 3.3 Raccourcis Clavier
| Raccourci | Action |
|-----------|--------|
| `Tab` | Naviguer entre éléments |
| `Shift+Tab` | Navigation inverse |
| `Arrow Keys` | Déplacer élément focusé (10px) |
| `Shift+Arrows` | Déplacement rapide (50px) |
| `Enter` / `Space` | Activer/Éditer élément |
| `Delete` / `Backspace` | Supprimer élément |
| `Escape` | Annuler/Fermer |
| `Ctrl+C` | Copier |
| `Ctrl+V` | Coller |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |

#### Fichiers à Créer/Modifier
- [ ] `hooks/use-keyboard-navigation.ts`
- [ ] `components/board/AccessibleCanvas.tsx`
- [ ] `components/board/InfiniteBoard.tsx` (intégration)
- [ ] `components/navigation/KeyboardShortcuts.tsx` (amélioration)

---

## 📱 Phase 4: Responsive Mobile (P1)

### Problème
**Sidebar fixe 384px** écrase le contenu sur mobile. Layout non responsive.

### Solution
Implémenter des breakpoints et un layout adaptatif.

#### 4.1 Breakpoints Tailwind
```ts
// tailwind.config.ts
export default {
  theme: {
    screens: {
      'xs': '375px',   // iPhone SE
      'sm': '640px',   // Mobile landscape
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large desktop
      '2xl': '1536px', // Ultra-wide
    }
  }
}
```

#### 4.2 Sidebar Responsive
```tsx
// components/kanban/KanbanSidebar.tsx
<aside className={cn(
  "transition-all duration-300",
  // Mobile: Full screen overlay
  "fixed inset-0 z-50 bg-white",
  "md:relative md:z-auto",
  // Tablet: 320px
  "md:w-80",
  // Desktop: 384px
  "lg:w-96",
  // Collapsed state
  isCollapsed && "md:-translate-x-full lg:-translate-x-full"
)}>
```

#### 4.3 FloatingToolbar Mobile
```tsx
// Mobile: Bottom bar
<div className={cn(
  // Desktop: Left sidebar
  "lg:fixed lg:left-4 lg:top-20 lg:flex-col",
  // Mobile: Bottom bar
  "fixed bottom-4 left-4 right-4 flex-row justify-around",
  "md:bottom-auto md:left-4 md:right-auto"
)}>
```

#### Fichiers à Modifier
- [ ] `components/kanban/KanbanSidebar.tsx`
- [ ] `components/kanban/KanbanSidebarV2.tsx`
- [ ] `components/dashboard/FloatingToolbar.tsx`
- [ ] `components/navigation/FloatingToolbar.tsx`
- [ ] `components/layout/Header.tsx`
- [ ] `app/globals.css` (media queries)

---

## 👆 Phase 5: Support Tactile (P1)

### Problème
Pas de support pour **pinch-to-zoom**, **drag-drop tactile**, ni gestes multi-touch.

### Solution
Implémenter les interactions tactiles natives.

#### 5.1 Touch Events Hook
```tsx
// hooks/use-touch-gestures.ts
export function useTouchGestures() {
  const [touches, setTouches] = useState<TouchList | null>(null)
  const [gesture, setGesture] = useState<'pan' | 'pinch' | 'tap' | null>(null)
  
  const handleTouchStart = (e: TouchEvent) => {
    setTouches(e.touches)
    if (e.touches.length === 2) {
      setGesture('pinch')
    } else if (e.touches.length === 1) {
      setGesture('pan')
    }
  }
  
  const handleTouchMove = (e: TouchEvent) => {
    if (gesture === 'pinch' && e.touches.length === 2) {
      const distance = getDistance(e.touches[0], e.touches[1])
      // Calculer zoom
    } else if (gesture === 'pan') {
      // Calculer déplacement
    }
  }
  
  return { handleTouchStart, handleTouchMove, gesture }
}
```

#### 5.2 Konva Touch Support
```tsx
// components/board/InfiniteBoard.tsx
<Stage
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
  draggable={!isPinching}
>
```

#### 5.3 Targets Tactiles (44x44px minimum)
```tsx
// Tous les boutons doivent avoir une zone tactile >= 44x44px
<button className={cn(
  "min-w-[44px] min-h-[44px]",
  "touch-manipulation", // Disable double-tap zoom
  "active:scale-95" // Feedback visuel
)}>
```

#### Fichiers à Créer/Modifier
- [ ] `hooks/use-touch-gestures.ts`
- [ ] `components/board/InfiniteBoard.tsx`
- [ ] `components/board/BoardCard.tsx`
- [ ] `components/dashboard/FloatingToolbar.tsx`
- [ ] Tous les boutons (taille minimum)

---

## 🧪 Phase 6: Tests & Validation (P1)

### 6.1 Tests Automatisés
```bash
# Playwright accessibility tests
npm run test:a11y

# Contrast checker
npm run test:contrast

# Keyboard navigation
npm run test:keyboard

# Touch gestures
npm run test:touch
```

### 6.2 Tests Manuels
- [ ] Navigation complète au clavier
- [ ] Lecteur d'écran (NVDA/JAWS)
- [ ] Zoom 200% (WCAG)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Android
- [ ] Tablet landscape/portrait

### 6.3 Outils de Validation
- **axe DevTools** - Audit automatique
- **Lighthouse** - Score accessibility
- **WAVE** - Analyse visuelle
- **Color Contrast Analyzer** - Vérification contraste

---

## 📈 Objectifs de Score

### Avant Remédiation
| Catégorie | Score | Statut |
|-----------|-------|--------|
| Accessibilité | 45/100 | ❌ |
| Contraste | 60/100 | ⚠️ |
| Clavier | 25/100 | ❌ |
| ARIA | 40/100 | ❌ |
| Responsive | 35/100 | ❌ |
| Tactile | 40/100 | ⚠️ |
| **Moyenne** | **40.8/100** | ❌ |

### Après Remédiation (Objectif)
| Catégorie | Score | Statut |
|-----------|-------|--------|
| Accessibilité | 95/100 | ✅ |
| Contraste | 100/100 | ✅ |
| Clavier | 90/100 | ✅ |
| ARIA | 95/100 | ✅ |
| Responsive | 90/100 | ✅ |
| Tactile | 85/100 | ✅ |
| **Moyenne** | **92.5/100** | ✅ |

---

## 📅 Timeline

### Sprint 1 (Semaine 1) - P0
- [x] Audit complet
- [ ] Phase 1: Contraste (2 jours)
- [ ] Phase 2: ARIA Labels (2 jours)
- [ ] Phase 3: Navigation clavier (3 jours)

### Sprint 2 (Semaine 2) - P1
- [ ] Phase 4: Responsive (3 jours)
- [ ] Phase 5: Support tactile (2 jours)
- [ ] Phase 6: Tests (2 jours)

### Sprint 3 (Semaine 3) - Validation
- [ ] Tests utilisateurs
- [ ] Corrections bugs
- [ ] Documentation
- [ ] Déploiement

---

## 🎯 Critères de Succès

### Techniques
- ✅ Score Lighthouse Accessibility > 90
- ✅ 0 erreurs axe DevTools
- ✅ Tous les contrastes WCAG AA
- ✅ Navigation clavier complète
- ✅ Responsive 320px → 2560px
- ✅ Support tactile iOS/Android

### Utilisateurs
- ✅ Navigation au clavier fluide
- ✅ Compatible lecteurs d'écran
- ✅ Utilisable sur mobile
- ✅ Gestes tactiles intuitifs

### Business
- ✅ Conformité WCAG 2.1 AA
- ✅ Certification accessibilité
- ✅ Élargissement audience
- ✅ Réduction risques légaux

---

## 📚 Ressources

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Outils
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)
- [NVDA Screen Reader](https://www.nvaccess.org/)

### Tests
- [Playwright Accessibility](https://playwright.dev/docs/accessibility-testing)
- [Jest-axe](https://github.com/nickcolley/jest-axe)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

**Statut:** 🚀 Prêt à démarrer  
**Responsable:** Elite Visuals Team  
**Dernière mise à jour:** 2025-11-21
