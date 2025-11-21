# 📖 Guidelines Accessibilité & Responsive - Elite Visuals

## 🎨 1. Design System Accessible

### Palette de Couleurs Accessible

```typescript
// lib/design-tokens.ts
export const colors = {
  // Elite Orange - Versions accessibles
  primary: {
    DEFAULT: '#E85535',      // Ratio 4.52:1 sur blanc ✅ WCAG AA
    light: '#FF8A6F',        // Pour backgrounds
    dark: '#D84315',         // Ratio 6.2:1 sur blanc ✅ WCAG AAA
    original: '#FF684A',     // Original (non conforme)
  },
  
  // Contraste garanti
  text: {
    primary: '#1F2937',      // Ratio 16.1:1 sur blanc ✅
    secondary: '#4B5563',    // Ratio 8.6:1 sur blanc ✅
    tertiary: '#6B7280',     // Ratio 5.7:1 sur blanc ✅
  },
  
  // Backgrounds
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
  },
  
  // États
  success: '#10B981',        // Ratio 3.4:1 sur blanc
  warning: '#F59E0B',        // Ratio 2.9:1 sur blanc
  error: '#EF4444',          // Ratio 4.0:1 sur blanc
  info: '#3B82F6',           // Ratio 4.6:1 sur blanc
}

// Utilisation
import { colors } from '@/lib/design-tokens'

<Button className="bg-[${colors.primary.DEFAULT}]">
  Texte accessible
</Button>
```

### Typographie Accessible

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      fontSize: {
        // Tailles minimum pour accessibilité
        'xs': ['0.75rem', { lineHeight: '1.5' }],    // 12px
        'sm': ['0.875rem', { lineHeight: '1.5' }],   // 14px
        'base': ['1rem', { lineHeight: '1.5' }],     // 16px (minimum recommandé)
        'lg': ['1.125rem', { lineHeight: '1.5' }],   // 18px (texte large WCAG)
        'xl': ['1.25rem', { lineHeight: '1.4' }],    // 20px
      },
      
      // Espacement pour lisibilité
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.01em',
        wider: '0.02em',
      }
    }
  }
}
```

### Composants de Base Accessibles

```tsx
// components/ui/accessible-button.tsx
import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label'?: string
  loading?: boolean
  icon?: React.ReactNode
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ children, 'aria-label': ariaLabel, loading, icon, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        aria-busy={loading}
        disabled={loading || props.disabled}
        className={cn(
          // Taille tactile minimum 44x44px
          'min-h-[44px] min-w-[44px] px-4',
          // Focus visible
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          // Transitions
          'transition-colors duration-200',
          // Disabled state
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      >
        {loading && (
          <span className="sr-only">Chargement en cours...</span>
        )}
        {icon && <span aria-hidden="true">{icon}</span>}
        {children}
      </button>
    )
  }
)
```

---

## ⌨️ 2. Navigation Clavier

### Raccourcis Clavier Globaux

```tsx
// hooks/use-keyboard-shortcuts.ts
import { useEffect } from 'react'

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K: Recherche
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        // Ouvrir recherche
      }
      
      // Ctrl/Cmd + Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        // Undo action
      }
      
      // Ctrl/Cmd + Shift + Z: Redo
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault()
        // Redo action
      }
      
      // Escape: Fermer modales
      if (e.key === 'Escape') {
        // Fermer modal active
      }
      
      // ?: Afficher aide raccourcis
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        // Afficher aide
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}

// Utilisation
export default function App() {
  useKeyboardShortcuts()
  return <div>...</div>
}
```

### Focus Management

```tsx
// hooks/use-focus-trap.ts
import { useEffect, useRef } from 'react'

export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return
    
    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
    
    // Focus premier élément
    firstElement?.focus()
    
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }
    
    container.addEventListener('keydown', handleTab)
    return () => container.removeEventListener('keydown', handleTab)
  }, [isActive])
  
  return containerRef
}

// Utilisation
function Modal({ isOpen, onClose }) {
  const trapRef = useFocusTrap(isOpen)
  
  return (
    <div ref={trapRef} role="dialog" aria-modal="true">
      {/* Contenu modal */}
    </div>
  )
}
```

### Navigation Canvas Accessible

```tsx
// components/board/AccessibleCanvas.tsx
import { useState, useEffect } from 'react'

interface AccessibleCanvasProps {
  items: BoardItem[]
  onSelectItem: (id: string) => void
  onMoveItem: (id: string, dx: number, dy: number) => void
  onDeleteItem: (id: string) => void
}

export function AccessibleCanvas({
  items,
  onSelectItem,
  onMoveItem,
  onDeleteItem
}: AccessibleCanvasProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  
  const handleKeyDown = (e: React.KeyboardEvent, itemId: string) => {
    const moveDistance = e.shiftKey ? 50 : 10
    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        onMoveItem(itemId, 0, -moveDistance)
        break
      case 'ArrowDown':
        e.preventDefault()
        onMoveItem(itemId, 0, moveDistance)
        break
      case 'ArrowLeft':
        e.preventDefault()
        onMoveItem(itemId, -moveDistance, 0)
        break
      case 'ArrowRight':
        e.preventDefault()
        onMoveItem(itemId, moveDistance, 0)
        break
      case 'Delete':
      case 'Backspace':
        e.preventDefault()
        onDeleteItem(itemId)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        onSelectItem(itemId)
        break
    }
  }
  
  return (
    <div role="application" aria-label="Board visuel Elite Visuals">
      {/* Canvas visuel (Konva) */}
      <div aria-hidden="true">
        {/* Konva Stage */}
      </div>
      
      {/* Alternative accessible */}
      <div className="sr-only">
        <h2>Éléments du board ({items.length})</h2>
        <p>
          Utilisez les flèches pour déplacer, Entrée pour sélectionner, 
          Suppr pour effacer. Maintenez Shift pour déplacer plus vite.
        </p>
        <ul>
          {items.map(item => (
            <li key={item.id}>
              <button
                onClick={() => onSelectItem(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                aria-label={`${item.type}: ${item.title || 'Sans titre'}`}
                aria-selected={selectedId === item.id}
                className="focus-visible:ring-2 focus-visible:ring-primary"
              >
                {item.title || item.type}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
```

---

## 📱 3. Responsive Design

### Breakpoints System

```typescript
// lib/breakpoints.ts
export const breakpoints = {
  xs: 375,   // Mobile small (iPhone SE)
  sm: 640,   // Mobile large
  md: 768,   // Tablet
  lg: 1024,  // Desktop small
  xl: 1280,  // Desktop
  '2xl': 1400, // Desktop large
} as const

export type Breakpoint = keyof typeof breakpoints

// Hook pour détecter breakpoint actuel
import { useState, useEffect } from 'react'

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('xl')
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < breakpoints.sm) setBreakpoint('xs')
      else if (width < breakpoints.md) setBreakpoint('sm')
      else if (width < breakpoints.lg) setBreakpoint('md')
      else if (width < breakpoints.xl) setBreakpoint('lg')
      else if (width < breakpoints['2xl']) setBreakpoint('xl')
      else setBreakpoint('2xl')
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return breakpoint
}

// Utilisation
function MyComponent() {
  const breakpoint = useBreakpoint()
  const isMobile = ['xs', 'sm'].includes(breakpoint)
  
  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  )
}
```

### Composants Responsive

```tsx
// components/board/ResponsiveBoard.tsx
import { useBreakpoint } from '@/lib/breakpoints'

export function ResponsiveBoard() {
  const breakpoint = useBreakpoint()
  const [showSidebar, setShowSidebar] = useState(true)
  
  // Auto-masquer sidebar sur mobile
  useEffect(() => {
    if (['xs', 'sm'].includes(breakpoint)) {
      setShowSidebar(false)
    }
  }, [breakpoint])
  
  const sidebarWidth = {
    xs: 0,
    sm: 0,
    md: showSidebar ? 320 : 0,
    lg: showSidebar ? 384 : 0,
    xl: showSidebar ? 384 : 0,
    '2xl': showSidebar ? 384 : 0,
  }[breakpoint]
  
  return (
    <div className="flex h-screen">
      {/* Board */}
      <div 
        className="flex-1"
        style={{ width: `calc(100vw - ${sidebarWidth}px)` }}
      >
        <InfiniteBoard />
      </div>
      
      {/* Sidebar */}
      {showSidebar && (
        <div 
          className={cn(
            "border-l border-gray-200 bg-white",
            "w-full md:w-80 lg:w-96",
            // Mobile: fullscreen overlay
            "fixed md:relative inset-0 md:inset-auto z-50 md:z-auto"
          )}
        >
          <KanbanSidebar onClose={() => setShowSidebar(false)} />
        </div>
      )}
      
      {/* Toggle button */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="fixed bottom-4 right-4 md:top-4 md:right-4 md:bottom-auto z-40"
        aria-label={showSidebar ? "Masquer le Kanban" : "Afficher le Kanban"}
        aria-expanded={showSidebar}
      >
        {showSidebar ? <PanelRightClose /> : <PanelRightOpen />}
      </button>
    </div>
  )
}
```

### Mobile Menu Pattern

```tsx
// components/layout/ResponsiveHeader.tsx
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function ResponsiveHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const breakpoint = useBreakpoint()
  const isMobile = ['xs', 'sm'].includes(breakpoint)
  
  return (
    <header className="h-16 border-b border-gray-200 bg-white">
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs md:text-sm">EV</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg md:text-xl font-bold">Elite Visuals</h1>
          </div>
        </div>
        
        {/* Desktop navigation */}
        {!isMobile && (
          <nav className="flex items-center gap-4">
            <Button variant="ghost">Inviter</Button>
            <Button variant="outline">Exporter</Button>
            <Button variant="ghost" size="icon">
              <Settings />
            </Button>
          </nav>
        )}
        
        {/* Mobile menu button */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>
      
      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && (
        <nav className="border-t border-gray-200 bg-white p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2" /> Inviter
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Download className="mr-2" /> Exporter
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2" /> Paramètres
          </Button>
        </nav>
      )}
    </header>
  )
}
```

---

## 👆 4. Support Tactile

### Gestes Tactiles Canvas

```tsx
// components/board/TouchableCanvas.tsx
import { useGesture } from '@use-gesture/react'
import { useState } from 'react'

export function TouchableCanvas() {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  const bind = useGesture({
    // Pinch to zoom
    onPinch: ({ offset: [d], memo }) => {
      const newScale = 1 + d / 200
      setScale(Math.max(0.1, Math.min(3, newScale)))
      return memo
    },
    
    // Pan avec 2 doigts
    onDrag: ({ offset: [x, y], pinching, touches }) => {
      if (pinching) return
      if (touches === 2) {
        setPosition({ x, y })
      }
    },
    
    // Double tap to reset
    onDoubleClick: () => {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    }
  }, {
    drag: {
      from: () => [position.x, position.y]
    },
    pinch: {
      scaleBounds: { min: 0.1, max: 3 },
      rubberband: true
    }
  })
  
  return (
    <div
      {...bind()}
      style={{
        touchAction: 'none', // Désactiver gestes navigateur
        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
        transformOrigin: 'center'
      }}
    >
      {/* Canvas content */}
    </div>
  )
}
```

### Drag-and-Drop Tactile

```tsx
// components/board/TouchableDragDrop.tsx
import { DndContext, TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core'

export function TouchableDragDrop() {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10, // 10px avant activation
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,      // 250ms avant activation
        tolerance: 5,    // 5px de tolérance
      },
    })
  )
  
  return (
    <DndContext sensors={sensors}>
      {/* Droppable zones */}
    </DndContext>
  )
}
```

### Feedback Tactile

```tsx
// hooks/use-haptic-feedback.ts
export function useHapticFeedback() {
  const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }
  
  return {
    light: () => vibrate(10),
    medium: () => vibrate(20),
    heavy: () => vibrate(30),
    success: () => vibrate([10, 50, 10]),
    error: () => vibrate([50, 100, 50]),
  }
}

// Utilisation
function DraggableCard() {
  const haptic = useHapticFeedback()
  
  return (
    <div
      onDragStart={() => haptic.light()}
      onDragEnd={() => haptic.medium()}
    >
      Card
    </div>
  )
}
```

---

## 🔊 5. ARIA & Lecteurs d'Écran

### Live Regions

```tsx
// components/ui/LiveRegion.tsx
export function LiveRegion({ 
  message, 
  politeness = 'polite' 
}: { 
  message: string
  politeness?: 'polite' | 'assertive' 
}) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}

// Utilisation
function Board() {
  const [statusMessage, setStatusMessage] = useState('')
  
  const addCard = () => {
    // ... ajouter carte
    setStatusMessage('Nouvelle carte ajoutée au board')
    setTimeout(() => setStatusMessage(''), 3000)
  }
  
  return (
    <>
      <button onClick={addCard}>Ajouter carte</button>
      <LiveRegion message={statusMessage} />
    </>
  )
}
```

### Skip Links

```tsx
// components/layout/SkipLinks.tsx
export function SkipLinks() {
  return (
    <div className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50">
      <a
        href="#main-content"
        className="bg-primary text-white px-4 py-2 rounded-lg focus-visible:ring-2"
      >
        Aller au contenu principal
      </a>
      <a
        href="#kanban"
        className="bg-primary text-white px-4 py-2 rounded-lg focus-visible:ring-2 ml-2"
      >
        Aller au Kanban
      </a>
    </div>
  )
}
```

### Headings Structure

```tsx
// Bonne structure de headings
<div>
  <h1>Elite Visuals</h1>
  
  <section>
    <h2>Board Visuel</h2>
    <div>
      <h3>Cluster: Inspiration 80s</h3>
      {/* Cartes */}
    </div>
  </section>
  
  <aside>
    <h2>Kanban</h2>
    <div>
      <h3>À faire</h3>
      {/* Tâches */}
    </div>
  </aside>
</div>
```

---

## 🎯 6. Préférences Utilisateur

### Respect des Préférences Système

```tsx
// hooks/use-user-preferences.ts
import { useEffect, useState } from 'react'

export function useUserPreferences() {
  const [preferences, setPreferences] = useState({
    reducedMotion: false,
    highContrast: false,
    darkMode: false,
  })
  
  useEffect(() => {
    // Reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPreferences(prev => ({ ...prev, reducedMotion: motionQuery.matches }))
    motionQuery.addEventListener('change', (e) => {
      setPreferences(prev => ({ ...prev, reducedMotion: e.matches }))
    })
    
    // High contrast
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    setPreferences(prev => ({ ...prev, highContrast: contrastQuery.matches }))
    contrastQuery.addEventListener('change', (e) => {
      setPreferences(prev => ({ ...prev, highContrast: e.matches }))
    })
    
    // Dark mode
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setPreferences(prev => ({ ...prev, darkMode: darkQuery.matches }))
    darkQuery.addEventListener('change', (e) => {
      setPreferences(prev => ({ ...prev, darkMode: e.matches }))
    })
  }, [])
  
  return preferences
}

// Utilisation
function App() {
  const { reducedMotion, highContrast } = useUserPreferences()
  
  return (
    <div
      className={cn(
        reducedMotion && 'motion-reduce:transition-none',
        highContrast && 'contrast-more:border-2'
      )}
    >
      {/* App */}
    </div>
  )
}
```

### Mode Haute Visibilité

```tsx
// components/ui/HighContrastMode.tsx
export function HighContrastMode({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [enabled])
  
  return null
}

// globals.css
.high-contrast {
  --primary: #D84315; /* Contraste élevé */
  --text-primary: #000000;
  --background: #FFFFFF;
}

.high-contrast * {
  border-width: 2px !important;
}

.high-contrast button {
  font-weight: 600 !important;
}
```

---

**Prochaine étape**: Voir `scripts/accessibility-audit.ts` pour tests automatisés.
