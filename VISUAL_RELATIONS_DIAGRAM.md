# 🎨 Elite Visuals - Diagrammes des Relations Visuelles

> **Documentation Visuelle Complète**  
> Schémas interactifs, animations et connexions entre éléments

---

## 📐 Architecture Visuelle du Board Infini

### Canvas Konva - Structure Hiérarchique

```
Stage (Conteneur principal)
│
├─ Layer (Couche de rendu)
│  │
│  ├─ OptimizedGrid (Grille de fond)
│  │  └─ Lines[] (Lignes horizontales/verticales)
│  │
│  ├─ BoardCard[] (Cartes médias)
│  │  │
│  │  ├─ Group (Conteneur carte)
│  │  │  ├─ Rect (Background blanc)
│  │  │  ├─ Text (Titre)
│  │  │  ├─ Text (Contenu)
│  │  │  ├─ Rect (Badge type)
│  │  │  └─ Text (Label type)
│  │  │
│  │  └─ Interactions
│  │     ├─ onDragStart
│  │     ├─ onDragMove
│  │     └─ onDragEnd
│  │
│  ├─ ConnectionLines[] (Liens entre cartes)
│  │  └─ Line (Bezier curves)
│  │
│  └─ CommentMarkers[] (Points de commentaire)
│     └─ Circle (Marqueur orange)
│
└─ Events
   ├─ onWheel (Zoom)
   ├─ onDragStart (Pan)
   └─ onDragEnd (Update position)
```

---

## 🔗 Types de Relations Visuelles

### 1. Relations Sémantiques (Clustering)

```
┌─────────────────────────────────────────────────────────┐
│  Cluster: "Campagne Orange"                             │
│  ┌───────────────────────────────────────────────────┐  │
│  │                                                    │  │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐   │  │
│  │  │  Image   │    │  Video   │    │  Text    │   │  │
│  │  │  Logo    │    │  Teaser  │    │  Script  │   │  │
│  │  └──────────┘    └──────────┘    └──────────┘   │  │
│  │                                                    │  │
│  │  metadata: { cluster_id: "cluster-123" }          │  │
│  └───────────────────────────────────────────────────┘  │
│  Background: rgba(255, 104, 74, 0.1)                   │
└─────────────────────────────────────────────────────────┘
```

**Implémentation**:
```typescript
// SmartCluster détecte proximité sémantique
const cluster = {
  id: 'cluster-123',
  name: 'Campagne Orange',
  itemIds: ['item-1', 'item-2', 'item-3'],
  color: '#FF684A',
  bounds: {
    x: Math.min(...items.map(i => i.x)),
    y: Math.min(...items.map(i => i.y)),
    width: Math.max(...items.map(i => i.x + i.width)),
    height: Math.max(...items.map(i => i.y + i.height))
  }
}

// Rendu visuel
<Rect
  x={cluster.bounds.x - 20}
  y={cluster.bounds.y - 20}
  width={cluster.bounds.width + 40}
  height={cluster.bounds.height + 40}
  fill={`${cluster.color}10`}
  stroke={cluster.color}
  strokeWidth={2}
  dash={[10, 5]}
  cornerRadius={16}
/>
```

### 2. Relations de Workflow (Input → Output)

```
┌──────────────────────────────────────────────────────────┐
│  Workflow: Génération Luma AI                            │
│                                                           │
│  ┌─────────────┐                    ┌─────────────┐     │
│  │   INPUT     │                    │   OUTPUT    │     │
│  │             │                    │             │     │
│  │  Prompt:    │  ════════════════► │  Video:     │     │
│  │  "Sunset    │   Luma API         │  [Player]   │     │
│  │   over      │                    │             │     │
│  │   ocean"    │   Status: ✅       │  Duration:  │     │
│  │             │                    │  5s         │     │
│  │  🔄 Pending │                    │  ✅ Ready   │     │
│  └─────────────┘                    └─────────────┘     │
│   x: 100, y: 100                     x: 500, y: 100     │
│                                                           │
│  metadata.connected_to: ['output-uuid']                 │
│  metadata.connection_type: 'ai-generation'              │
└──────────────────────────────────────────────────────────┘
```

**Implémentation**:
```typescript
// Ligne de connexion animée
<Line
  points={[
    inputCard.x + inputCard.width,
    inputCard.y + inputCard.height / 2,
    outputCard.x,
    outputCard.y + outputCard.height / 2
  ]}
  stroke="#FF684A"
  strokeWidth={3}
  lineCap="round"
  dash={[10, 5]}
  dashEnabled={true}
  // Animation du dash
  dashOffset={dashOffset}
  listening={false}
/>

// Animation
useEffect(() => {
  const anim = new Konva.Animation((frame) => {
    setDashOffset(-frame.time / 20)
  }, layer)
  anim.start()
  return () => anim.stop()
}, [])
```

### 3. Relations de Commentaire

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│  ┌──────────────────┐                                   │
│  │  Video Card      │                                   │
│  │                  │  ●  "Ajouter musique ici"         │
│  │  [Thumbnail]     │  │  @user - 2min ago              │
│  │                  │  │                                 │
│  │                  │  └─► Comment (x: 250, y: 150)     │
│  └──────────────────┘                                   │
│   item_id: 'video-123'                                  │
│                                                          │
│  Comment marker: Orange circle with pulse animation     │
└─────────────────────────────────────────────────────────┘
```

**Implémentation**:
```typescript
// Marqueur de commentaire
<Group x={comment.x} y={comment.y}>
  <Circle
    radius={8}
    fill="#FF684A"
    shadowColor="#FF684A"
    shadowBlur={10}
    shadowOpacity={0.5}
  />
  <Circle
    radius={8}
    stroke="#FF684A"
    strokeWidth={2}
    // Animation pulse
    scaleX={pulseScale}
    scaleY={pulseScale}
    opacity={1 - pulseScale / 2}
  />
</Group>

// Tooltip au hover
{showTooltip && (
  <Label x={comment.x + 15} y={comment.y - 10}>
    <Tag fill="white" cornerRadius={4} />
    <Text
      text={comment.content}
      padding={8}
      fontSize={12}
    />
  </Label>
)}
```

---

## 🎭 Animations & Micro-interactions

### 1. Glow Effect Orange (Luma Style)

```css
/* globals.css */
.glow-orange {
  box-shadow: 
    0 0 10px rgba(255, 104, 74, 0.3),
    0 0 20px rgba(255, 104, 74, 0.2),
    0 0 30px rgba(255, 104, 74, 0.1);
  transition: box-shadow 0.3s ease;
}

.glow-orange:hover {
  box-shadow: 
    0 0 15px rgba(255, 104, 74, 0.5),
    0 0 30px rgba(255, 104, 74, 0.3),
    0 0 45px rgba(255, 104, 74, 0.2);
}
```

**Konva Implementation**:
```typescript
<Rect
  shadowColor="#FF684A"
  shadowBlur={10}
  shadowOffset={{ x: 0, y: 4 }}
  shadowOpacity={0.3}
  // Hover state
  onMouseEnter={() => {
    setShadowBlur(20)
    setShadowOpacity(0.5)
  }}
  onMouseLeave={() => {
    setShadowBlur(10)
    setShadowOpacity(0.3)
  }}
/>
```

### 2. Drag & Drop Animation

```typescript
// BoardCard.tsx
<Group
  draggable
  onDragStart={(e) => {
    // Lift effect
    e.target.to({
      scaleX: 1.05,
      scaleY: 1.05,
      shadowBlur: 20,
      duration: 0.1
    })
  }}
  onDragEnd={(e) => {
    // Drop effect
    e.target.to({
      scaleX: 1,
      scaleY: 1,
      shadowBlur: 10,
      duration: 0.2
    })
    
    // Update position in DB
    updateItemPosition(item.id, {
      x: e.target.x(),
      y: e.target.y()
    })
  }}
/>
```

### 3. Loading Spinner (Génération IA)

```typescript
// Spinner animé sur carte en cours de génération
<Group x={item.x + item.width / 2} y={item.y + item.height / 2}>
  <Circle
    radius={20}
    stroke="#FF684A"
    strokeWidth={3}
    dash={[10, 5]}
    rotation={rotation}
  />
  <Text
    text="Génération..."
    fontSize={12}
    fill="#6b7280"
    y={30}
    align="center"
    width={100}
    x={-50}
  />
</Group>

// Animation
useEffect(() => {
  const anim = new Konva.Animation((frame) => {
    setRotation(frame.time / 10)
  }, layer)
  anim.start()
  return () => anim.stop()
}, [])
```

### 4. Fade In (Nouvelle carte)

```typescript
// Apparition progressive
const newCard = new Konva.Group({
  x: 100,
  y: 100,
  opacity: 0,
  scaleX: 0.8,
  scaleY: 0.8
})

layer.add(newCard)

// Animation d'entrée
newCard.to({
  opacity: 1,
  scaleX: 1,
  scaleY: 1,
  duration: 0.3,
  easing: Konva.Easings.EaseOut
})
```

---

## 🎨 Design System - Spécifications Visuelles

### Palette de Couleurs

```typescript
const colors = {
  // Primaire
  primary: '#FF684A',        // Orange Elite
  primaryLight: '#FF8A6B',
  primaryDark: '#E55A3C',
  
  // Neutrals
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray600: '#6B7280',
  gray900: '#1F2937',
  
  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // AI Providers
  openai: '#10A37F',
  claude: '#8B5CF6',
  luma: '#FF684A',
  ollama: '#3B82F6'
}
```

### Typographie

```typescript
const typography = {
  fontFamily: 'Inter, system-ui, sans-serif',
  
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 20,
    '2xl': 24
  },
  
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
}
```

### Espacements

```typescript
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32
}
```

### Coins Arrondis

```typescript
const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999
}
```

### Ombres

```typescript
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  orange: '0 0 20px rgba(255, 104, 74, 0.3)'
}
```

---

## 📱 Composants Visuels Détaillés

### BoardCard - Carte Média

```
┌─────────────────────────────────────────┐
│  ┌─────────────────────────────┬─────┐  │
│  │  Title                      │ VID │  │ ← Badge type
│  ├─────────────────────────────┴─────┤  │
│  │                                    │  │
│  │  [Content Area]                    │  │
│  │  • Text                            │  │
│  │  • Image/Video thumbnail           │  │
│  │  • AI generation status            │  │
│  │                                    │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│  Shadow: Orange glow on hover           │
│  Corner radius: 12px                    │
│  Border: 2px transparent → orange       │
└─────────────────────────────────────────┘

Dimensions:
- Default: 200x200px
- Video: 400x300px
- Text: 250x150px
- AI-generated: 300x200px
```

**Code**:
```typescript
<Group x={item.x} y={item.y} draggable>
  {/* Background */}
  <Rect
    width={item.width}
    height={item.height}
    fill="white"
    cornerRadius={12}
    shadowColor="rgba(255, 104, 74, 0.2)"
    shadowBlur={10}
    shadowOffset={{ x: 0, y: 4 }}
    shadowOpacity={0.3}
    stroke={isHovered ? '#FF684A' : 'transparent'}
    strokeWidth={2}
  />
  
  {/* Title */}
  <Text
    text={item.title}
    x={12}
    y={12}
    fontSize={14}
    fontFamily="Inter"
    fontStyle="bold"
    fill="#1f2937"
    width={item.width - 60}
  />
  
  {/* Type Badge */}
  <Rect
    x={item.width - 48}
    y={8}
    width={40}
    height={20}
    fill="#FF684A"
    cornerRadius={4}
  />
  <Text
    text={item.type.substring(0, 3).toUpperCase()}
    x={item.width - 46}
    y={12}
    fontSize={10}
    fontFamily="Inter"
    fontStyle="bold"
    fill="white"
  />
  
  {/* Content */}
  {renderContent(item)}
</Group>
```

### Grille Dynamique

```
┌─────────────────────────────────────────────────────────┐
│  • • • • • • • • • • • • • • • • • • • • • • • • • • •  │
│  •                                                   •  │
│  •                                                   •  │
│  •     [Board Items]                                •  │
│  •                                                   •  │
│  •                                                   •  │
│  • • • • • • • • • • • • • • • • • • • • • • • • • • •  │
└─────────────────────────────────────────────────────────┘

Specs:
- Grid size: 100px
- Dot size: 2px
- Color: #E5E7EB (gray-200)
- Opacity: 10%
- Only visible dots rendered (virtualization)
```

**Code**:
```typescript
// OptimizedGrid.tsx
export function OptimizedGrid({ viewport, gridSize, color }) {
  const dots = useMemo(() => {
    const result = []
    const startX = Math.floor(viewport.x / gridSize) * gridSize
    const startY = Math.floor(viewport.y / gridSize) * gridSize
    const endX = startX + viewport.width + gridSize
    const endY = startY + viewport.height + gridSize
    
    for (let x = startX; x < endX; x += gridSize) {
      for (let y = startY; y < endY; y += gridSize) {
        result.push({ x, y })
      }
    }
    return result
  }, [viewport, gridSize])
  
  return (
    <>
      {dots.map((dot, i) => (
        <Circle
          key={i}
          x={dot.x}
          y={dot.y}
          radius={1}
          fill={color}
          opacity={0.1}
          listening={false}
        />
      ))}
    </>
  )
}
```

---

## 🔄 États & Transitions

### États d'une Carte

```
┌──────────────────────────────────────────────────────┐
│  États possibles d'un BoardItem                      │
└──────────────────────────────────────────────────────┘

1. IDLE (Au repos)
   └─► Border: transparent
   └─► Shadow: normal (10px blur)
   └─► Scale: 1.0

2. HOVER (Survol)
   └─► Border: #FF684A (2px)
   └─► Shadow: enhanced (20px blur)
   └─► Cursor: move
   └─► Transition: 0.2s ease

3. DRAGGING (En déplacement)
   └─► Scale: 1.05
   └─► Shadow: strong (30px blur)
   └─► Opacity: 0.9
   └─► Z-index: +1000

4. SELECTED (Sélectionné)
   └─► Border: #FF684A (3px solid)
   └─► Shadow: orange glow
   └─► Corner indicators visible

5. LOADING (Génération en cours)
   └─► Spinner overlay
   └─► Opacity: 0.7
   └─► Pointer-events: none

6. ERROR (Erreur)
   └─► Border: #EF4444 (red)
   └─► Icon: ⚠️
   └─► Shake animation
```

### Machine à États - Génération Luma

```
┌─────────────────────────────────────────────────────────┐
│  État: IDLE                                             │
│  └─► User clicks "Generate"                             │
│      └─► État: CREATING_INPUT_CARD                      │
│          └─► boardItems.create()                        │
│              └─► État: CALLING_LUMA_API                 │
│                  └─► luma.generateVideo()               │
│                      └─► État: POLLING                  │
│                          └─► Check status every 5s      │
│                              ├─► completed              │
│                              │   └─► État: CREATING_OUTPUT │
│                              │       └─► boardItems.create() │
│                              │           └─► État: COMPLETED │
│                              │                              │
│                              ├─► processing              │
│                              │   └─► Continue polling    │
│                              │                           │
│                              └─► failed                  │
│                                  └─► État: ERROR         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎬 Scénarios d'Interaction Complets

### Scénario 1: Créer une Vidéo Luma

```
1. User Action: Click bouton "Wand" (Magic)
   └─► UI: MagicPrompt modal s'ouvre
       └─► Animation: Fade in + scale up (0.3s)

2. User Action: Saisit "Cinematic sunset over ocean"
   └─► UI: Suggestions rapides apparaissent
       └─► Bouton "Générer" devient actif (orange)

3. User Action: Click "Générer"
   └─► UI: Bouton → Loading spinner
   └─► Board: Nouvelle carte apparaît (fade in)
       └─► Type: ai-generated
       └─► Status: "🔄 Génération en cours..."
       └─► Position: Centre du viewport
       └─► Animation: Pulse orange

4. Backend: Luma API call
   └─► Response: generation_id
   └─► DB: ai_generations.create()
   └─► Board: Carte mise à jour avec generation_id

5. Polling Loop (5s interval)
   └─► UI: Spinner continue de tourner
   └─► Status check: "processing"
   └─► Continue...

6. Luma: Génération terminée
   └─► Response: { status: 'completed', videoUrl: '...' }
   └─► Board: Nouvelle carte "Output" apparaît
       └─► Position: À droite de la carte Input
       └─► Animation: Slide in from right
       └─► Type: video
       └─► Content: Video player avec thumbnail

7. Visual Connection
   └─► Line animée apparaît entre Input et Output
       └─► Animation: Dash offset (flowing)
       └─► Color: Orange (#FF684A)

8. Notification
   └─► Toast: "✅ Vidéo générée avec succès"
   └─► Realtime: Autres users voient la nouvelle carte
```

### Scénario 2: Smart Clustering

```
1. User Action: Click "Smart Cluster" button
   └─► UI: Panel slide in from bottom-right
       └─► Animation: Slide up + fade in

2. User Action: Click "Analyser"
   └─► UI: Button → Loading spinner
   └─► Backend: AI analyze semantic proximity
       └─► Ollama/Claude: Analyse des items
       └─► Response: Clusters suggérés

3. AI Response: 2 clusters détectés
   └─► UI: Suggestions apparaissent
       └─► "Cluster Inspiration 80s" (3 items)
       └─► "Cluster Brief Client" (2 items)
       └─► Animation: Stagger (0.1s delay each)

4. User Action: Click "Créer le cluster"
   └─► Board: Rectangle de cluster apparaît
       └─► Position: Englobe les items
       └─► Color: Orange avec alpha 10%
       └─► Border: Dashed orange
       └─► Animation: Scale from center

5. Items Update
   └─► metadata.cluster_id ajouté
   └─► Visual: Items ont maintenant un badge cluster
   └─► DB: boardItems.update() en batch
```

---

## 📊 Métriques de Performance

### Rendu Canvas

```typescript
// Métriques cibles
const performanceTargets = {
  fps: 60,                    // 60 FPS constant
  itemsRendered: 1000,        // Max items sans lag
  zoomLevels: [0.1, 10],     // Range de zoom
  panSpeed: 'smooth',         // Pas de jank
  
  // Virtualisation
  bufferZone: 500,            // 500px buffer
  renderDelay: 16,            // 16ms (60fps)
  
  // Animations
  transitionDuration: 300,    // 0.3s
  easing: 'ease-out'
}
```

### Optimisations Appliquées

```typescript
// 1. Virtualisation des items
const visibleItems = items.filter(item => 
  isInViewport(item, viewport, buffer)
)

// 2. Memoization
const gridDots = useMemo(() => 
  calculateVisibleDots(viewport, gridSize),
  [viewport, gridSize]
)

// 3. Debounce des updates
const debouncedUpdate = useDebouncedCallback(
  (newPosition) => updateItemPosition(newPosition),
  300
)

// 4. RequestAnimationFrame pour animations
useEffect(() => {
  let rafId
  const animate = () => {
    // Update animations
    rafId = requestAnimationFrame(animate)
  }
  animate()
  return () => cancelAnimationFrame(rafId)
}, [])
```

---

## 🎯 Checklist d'Implémentation

### Phase 1: Structure de Base ✅
- [x] Canvas Konva avec zoom/pan
- [x] BoardCard component
- [x] Grille dynamique
- [x] Drag & drop fichiers

### Phase 2: Relations Visuelles ✅
- [x] Connexions entre cartes
- [x] Smart clustering
- [x] Système de commentaires
- [x] Annotations visuelles

### Phase 3: Luma AI Integration ✅
- [x] MagicPrompt modal
- [x] Luma API service
- [x] Polling mechanism
- [x] Input → Output flow
- [x] Visual connections

### Phase 4: Animations 🚧
- [x] Glow effects
- [x] Drag animations
- [x] Loading spinners
- [ ] Advanced transitions
- [ ] Micro-interactions

### Phase 5: Performance 🚧
- [x] Virtualisation
- [x] Memoization
- [ ] Web Workers
- [ ] Canvas caching

---

**Document créé le**: 20 Nov 2024  
**Version**: 1.0  
**Auteur**: Elite Visuals Team
