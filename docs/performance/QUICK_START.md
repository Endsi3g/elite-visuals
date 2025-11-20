# ⚡ Performance - Quick Start

## 🎯 Objectif
Passer de 15 FPS à 45+ FPS avec 1000 éléments

## 📊 Problème Actuel
- 100 éléments: 60 FPS ✅
- 500 éléments: 30 FPS ⚠️
- 1000 éléments: 15 FPS ❌

## 🚀 Solution Rapide (2 semaines)

### Semaine 1

#### Jour 1-2: Virtualisation Canvas
```typescript
// hooks/use-virtualization.ts
export function useVirtualization(items, position, scale) {
  return useMemo(() => {
    const viewport = {
      x: -position.x / scale,
      y: -position.y / scale,
      width: window.innerWidth / scale,
      height: window.innerHeight / scale,
    }
    
    return items.filter(item => 
      isInViewport(item, viewport)
    )
  }, [items, position, scale])
}
```

**Impact:** -70% CPU, support 5000+ éléments

#### Jour 3-4: Lazy Loading
```typescript
// components/board/LazyImage.tsx
const [image, setImage] = useState(null)

useEffect(() => {
  const img = new Image()
  img.src = src
  img.onload = () => setImage(img)
}, [src])
```

**Impact:** -60% temps chargement

#### Jour 5: Optimisation Konva
```typescript
<Stage
  listening={!isDragging}
  pixelRatio={1}
>
  <Layer
    imageSmoothingEnabled={false}
    hitGraphEnabled={false}
  />
</Stage>
```

**Impact:** +40% FPS

### Semaine 2

#### Jour 1: Debouncing
```typescript
const debouncedSave = useDebouncedCallback(
  (items) => saveToSupabase(items),
  1000
)
```

#### Jour 2-5: Tests & Optimisation

## 📈 Résultat Attendu
- 1000 éléments: 45+ FPS ✅
- 5000 éléments: 30+ FPS ✅

## 🛠️ Outils
```bash
npm install web-vitals
npm install -D @next/bundle-analyzer
```

## 📚 Documentation Complète
Voir `docs/performance/OPTIMIZATION_GUIDE.md`
