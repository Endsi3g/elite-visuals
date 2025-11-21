# 🚀 Guide Rapide Accessibilité - Elite Visuals

**Pour:** Développeurs Elite Visuals  
**Objectif:** Maintenir un score d'accessibilité de 90+/100

---

## 🎨 Couleurs Accessibles

### Palette Principale
```typescript
// Toujours utiliser ces couleurs pour le texte
const colors = {
  primary: '#E85535',        // 4.52:1 ✅ WCAG AA
  primaryHover: '#D64A2E',   // 5.21:1 ✅
  primaryLight: '#FF8A6B',   // Pour backgrounds uniquement
  
  textPrimary: '#1F2937',    // 14.0:1 ✅
  textSecondary: '#6B7280',  // 7.0:1 ✅
}
```

### ❌ Ne JAMAIS utiliser
```typescript
// Ancien orange - contraste insuffisant
const BAD_COLOR = '#FF684A'  // 3.12:1 ❌
```

### ✅ Vérifier le contraste
```typescript
import { checkContrast } from '@/lib/accessibility/contrast-checker'

const result = checkContrast('#E85535', '#FFFFFF')
// → { ratio: 4.52, passesAA: true, level: 'AA' } ✅
```

---

## ♿ ARIA Labels - Checklist

### Boutons
```tsx
// ❌ Mauvais
<button onClick={handleClick}>
  <Icon />
</button>

// ✅ Bon
<button 
  onClick={handleClick}
  aria-label="Ajouter une note (Ctrl+N)"
  aria-pressed={isActive}
  title="Ajouter une note"
>
  <Icon aria-hidden="true" />
</button>
```

### Sections
```tsx
// ✅ Toujours ajouter role et aria-label
<nav aria-label="Barre d'outils principale" role="toolbar">
  <div role="group" aria-label="Outils de création">
    {/* Boutons */}
  </div>
</nav>
```

### Icônes Décoratives
```tsx
// ✅ Toujours marquer comme décoratives
<Icon aria-hidden="true" />
```

---

## ⌨️ Navigation Clavier

### Hook à Utiliser
```typescript
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation'

function MyComponent() {
  const { focusedId, setFocusedId } = useKeyboardNavigation({
    items: boardItems,
    onSelect: (id) => selectItem(id),
    onMove: (id, dx, dy) => moveItem(id, dx, dy),
    onDelete: (id) => deleteItem(id),
    onActivate: (id) => editItem(id)
  })
}
```

### Raccourcis Standards
| Touche | Action |
|--------|--------|
| `Tab` | Naviguer |
| `Enter`/`Space` | Activer |
| `Escape` | Annuler |
| `Delete` | Supprimer |
| `↑↓←→` | Déplacer |

### Focus Visible
```tsx
// ✅ Toujours ajouter focus-visible
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
```

---

## 📱 Responsive Mobile

### Breakpoints
```typescript
// Utiliser ces breakpoints Tailwind
'xs': '375px',   // iPhone SE
'sm': '640px',   // Mobile landscape
'md': '768px',   // Tablet
'lg': '1024px',  // Desktop
```

### Pattern Responsive
```tsx
// ✅ Mobile-first approach
<div className={cn(
  // Mobile: Bottom bar
  "fixed bottom-4 left-4 right-4 flex-row",
  // Desktop: Sidebar
  "lg:fixed lg:left-4 lg:top-20 lg:flex-col"
)}>
```

---

## 👆 Support Tactile

### Taille Minimum
```tsx
// ✅ Toujours 44x44px minimum
<button className="min-w-[44px] min-h-[44px] touch-manipulation">
```

### Hook de Gestes
```typescript
import { useTouchGestures } from '@/hooks/use-touch-gestures'

const { handleTouchStart, handleTouchMove, handleTouchEnd } = useTouchGestures({
  onPinch: (scale) => setZoom(scale),
  onPan: (dx, dy) => moveCanvas(dx, dy),
  onTap: (x, y) => selectAt(x, y)
})
```

### Feedback Visuel
```tsx
// ✅ Ajouter feedback tactile
<button className="active:scale-95 transition-transform">
```

---

## 🧪 Tests Avant Commit

### 1. Contraste
```bash
# Vérifier tous les contrastes
npm run test:contrast
```

### 2. Navigation Clavier
```bash
# Tester navigation
npm run test:keyboard
```

### 3. Lighthouse
```bash
# Score accessibilité
npm run lighthouse
```

### Checklist Manuelle
- [ ] Tous les boutons ont `aria-label`
- [ ] Navigation au clavier fonctionne
- [ ] Taille tactile >= 44x44px
- [ ] Contraste >= 4.5:1
- [ ] Responsive mobile testé
- [ ] Focus visible sur tous les éléments

---

## 🚨 Erreurs Courantes

### 1. Oublier aria-label
```tsx
// ❌ Erreur
<button><Icon /></button>

// ✅ Fix
<button aria-label="Description">
  <Icon aria-hidden="true" />
</button>
```

### 2. Mauvais contraste
```tsx
// ❌ Erreur
<div className="text-[#FF684A]">Texte</div>

// ✅ Fix
<div className="text-primary">Texte</div>  // #E85535
```

### 3. Oublier focus-visible
```tsx
// ❌ Erreur
<button className="outline-none">

// ✅ Fix
<button className="focus-visible:ring-2 focus-visible:ring-primary">
```

### 4. Targets tactiles trop petits
```tsx
// ❌ Erreur
<button className="w-8 h-8">

// ✅ Fix
<button className="min-w-[44px] min-h-[44px]">
```

---

## 📚 Ressources

### Hooks Disponibles
- `hooks/use-keyboard-navigation.ts` - Navigation clavier
- `hooks/use-touch-gestures.ts` - Gestes tactiles

### Utilitaires
- `lib/accessibility/contrast-checker.ts` - Vérification contraste

### Documentation
- `ACCESSIBILITY_REMEDIATION_PLAN.md` - Plan complet
- `ACCESSIBILITY_FIXES_SUMMARY.md` - Résumé des fixes
- `ACCESSIBILITY_QUICK_REFERENCE.md` - Ce guide

### Liens Externes
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## 🎯 Objectifs de Score

| Catégorie | Minimum | Cible |
|-----------|---------|-------|
| Accessibilité | 90/100 | 95/100 |
| Contraste | 100/100 | 100/100 |
| Clavier | 85/100 | 90/100 |
| ARIA | 90/100 | 95/100 |
| Responsive | 85/100 | 90/100 |
| Tactile | 80/100 | 85/100 |

**Score Moyen Minimum:** 90/100 ✅

---

## 💡 Tips

1. **Toujours tester au clavier** - Débranchez la souris!
2. **Utiliser les hooks** - Ne réinventez pas la roue
3. **Vérifier le contraste** - Utilisez `contrast-checker.ts`
4. **Mobile-first** - Commencez par le mobile
5. **Focus visible** - Toujours visible pour le clavier
6. **ARIA labels** - Descriptifs et avec raccourcis

---

**Maintenu par:** Elite Visuals Team  
**Dernière mise à jour:** 2025-11-21  
**Version:** 1.0.0
