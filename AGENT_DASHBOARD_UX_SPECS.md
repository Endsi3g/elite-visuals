# 🎨 Agent Dashboard & Menu UX - Spécifications Complètes

## 📋 Vue d'Ensemble

Système de tableau de bord agent et barre d'outils latérale pour Elite Visuals, intégrant mindmap dynamique, cards interactives, et menu flottant avec animations Luma-style.

---

## 🎯 1. Layout Global du Dashboard

### Structure Principale

```
┌─────────────────────────────────────────────────────────────┐
│  Header (64px) - Logo, Users, Actions                      │
├─────┬───────────────────────────────────────────────┬───────┤
│     │                                               │       │
│  T  │         Canvas Infini (Board)                 │   K   │
│  o  │    - Mindmap dynamique                        │   a   │
│  o  │    - Cards interactives                       │   n   │
│  l  │    - Connexions visuelles                     │   b   │
│  b  │    - Grille subtile                           │   a   │
│  a  │                                               │   n   │
│  r  │                                               │       │
│     │                                               │  384px│
│ 72px│                                               │       │
│     │                                               │       │
└─────┴───────────────────────────────────────────────┴───────┘
```

### Dimensions
- **Header**: 64px hauteur fixe
- **Toolbar Verticale**: 72px largeur, flottante à gauche
- **Canvas Board**: Flex-1 (responsive)
- **Kanban Sidebar**: 384px largeur, toggle-able

---

## 🎨 2. Toolbar Verticale Flottante

### Design

**Position**: Flottante à gauche, 16px du bord, 80px du haut
**Dimensions**: 72px × auto
**Style**: Blanc, ombre portée orange, coins arrondis 16px

### Structure

```tsx
<FloatingToolbar>
  <ToolSection label="Créer">
    <ToolButton icon={Plus} label="Note" />
    <ToolButton icon={Image} label="Image" />
    <ToolButton icon={Video} label="Vidéo" />
  </ToolSection>
  
  <Divider />
  
  <ToolSection label="IA">
    <ToolButton icon={Wand2} label="Générer" glow />
    <ToolButton icon={Brain} label="Analyser" />
    <ToolButton icon={Sparkles} label="Mindmap" />
  </ToolSection>
  
  <Divider />
  
  <ToolSection label="Actions">
    <ToolButton icon={Link} label="Connecter" />
    <ToolButton icon={Group} label="Cluster" />
    <ToolButton icon={MessageSquare} label="Commenter" />
  </ToolSection>
  
  <Divider />
  
  <ToolSection label="Export">
    <ToolButton icon={Download} label="Exporter" />
    <ToolButton icon={Eye} label="Showroom" />
  </ToolSection>
</FloatingToolbar>
```

### États des Boutons

#### Inactif
```css
background: white
border: 1px solid #e5e7eb
color: #6b7280
shadow: 0 2px 8px rgba(0,0,0,0.08)
```

#### Hover
```css
background: #fff5f2
border: 1px solid #FF684A
color: #FF684A
shadow: 0 4px 16px rgba(255,104,74,0.2)
transform: translateY(-2px)
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
```

#### Active
```css
background: #FF684A
border: 1px solid #FF684A
color: white
shadow: 0 0 24px rgba(255,104,74,0.5)
animation: glow 2s ease-in-out infinite
```

#### Disabled
```css
background: #f9fafb
border: 1px solid #e5e7eb
color: #d1d5db
opacity: 0.5
cursor: not-allowed
```

---

## 🧠 3. Mindmap Dynamique sur Board

### Concept

Mindmap interactive avec nœuds connectés par des lignes courbes orange, zoom/pan fluide, double-clic pour expansion.

### Structure de Nœud

```tsx
interface MindMapNode {
  id: string
  x: number
  y: number
  width: number
  height: number
  title: string
  content: string
  type: 'root' | 'branch' | 'leaf'
  parentId?: string
  children: string[]
  color: string
  aiGenerated: boolean
}
```

### Design de Nœud

#### Root Node (Nœud Principal)
```css
width: 280px
height: 120px
background: linear-gradient(135deg, #FF684A 0%, #ff8c6b 100%)
border-radius: 16px
shadow: 0 8px 32px rgba(255,104,74,0.3)
color: white
font-size: 18px
font-weight: bold
```

#### Branch Node (Nœud Branche)
```css
width: 240px
height: 100px
background: white
border: 2px solid #FF684A
border-radius: 12px
shadow: 0 4px 16px rgba(255,104,74,0.15)
color: #1f2937
font-size: 16px
```

#### Leaf Node (Nœud Feuille)
```css
width: 200px
height: 80px
background: white
border: 1px solid #e5e7eb
border-radius: 8px
shadow: 0 2px 8px rgba(0,0,0,0.08)
color: #6b7280
font-size: 14px
```

### Connexions

```tsx
<Line
  points={[x1, y1, cpx1, cpy1, cpx2, cpy2, x2, y2]}
  stroke="#FF684A"
  strokeWidth={2}
  lineCap="round"
  bezier
  opacity={0.6}
  shadowColor="rgba(255,104,74,0.3)"
  shadowBlur={8}
/>
```

### Interactions

1. **Double-clic**: Génère 3 nœuds enfants suggérés par IA
2. **Drag**: Déplace le nœud et ses connexions
3. **Hover**: Glow orange + élévation
4. **Clic droit**: Menu contextuel (Éditer, Supprimer, Générer enfants)

---

## 📇 4. Cards Interactives Déplaçables

### Types de Cards

#### Text Card
```tsx
<Card type="text">
  <CardHeader>
    <Badge>TXT</Badge>
    <Title>Note rapide</Title>
  </CardHeader>
  <CardContent>
    <TextArea editable />
  </CardContent>
  <CardFooter>
    <Timestamp />
    <Author />
  </CardFooter>
</Card>
```

#### Image Card
```tsx
<Card type="image">
  <CardHeader>
    <Badge>IMG</Badge>
    <Title>Moodboard</Title>
  </CardHeader>
  <CardContent>
    <Image src={url} />
  </CardContent>
  <CardFooter>
    <Dimensions />
    <Actions />
  </CardFooter>
</Card>
```

#### AI Card
```tsx
<Card type="ai-generated">
  <CardHeader>
    <Badge glow>🤖 IA</Badge>
    <Title>Script généré</Title>
  </CardHeader>
  <CardContent>
    <AIContent />
    <RegenerateButton />
  </CardContent>
  <CardFooter>
    <Model>Claude 3.5</Model>
    <Timestamp />
  </CardFooter>
</Card>
```

### Design de Card

```css
/* Base */
width: 300px
min-height: 200px
background: white
border-radius: 12px
border: 1px solid #e5e7eb
shadow: 0 4px 12px rgba(0,0,0,0.08)
padding: 16px
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)

/* Hover */
border-color: #FF684A
shadow: 0 8px 24px rgba(255,104,74,0.2)
transform: translateY(-4px)

/* Selected */
border: 2px solid #FF684A
shadow: 0 0 0 4px rgba(255,104,74,0.1)
```

### Connexions entre Cards

```tsx
<Arrow
  points={[x1, y1, x2, y2]}
  stroke="#FF684A"
  strokeWidth={2}
  pointerLength={10}
  pointerWidth={10}
  dash={[5, 5]}
  opacity={0.7}
/>
```

---

## 🎯 5. Header Actions

### Structure

```tsx
<Header>
  <Left>
    <Logo />
    <BoardTitle editable />
  </Left>
  
  <Center>
    <ActiveUsers>
      <Avatar user={user1} active />
      <Avatar user={user2} />
      <Avatar user={user3} />
      <InviteButton />
    </ActiveUsers>
  </Center>
  
  <Right>
    <SearchButton />
    <ViewToggle options={['Board', 'Kanban', 'Both']} />
    <ExportMenu />
    <SettingsButton />
  </Right>
</Header>
```

### Active User Avatar

```css
/* Base */
width: 40px
height: 40px
border-radius: 50%
border: 2px solid white
background: gradient

/* Active */
border: 3px solid #FF684A
box-shadow: 0 0 0 2px rgba(255,104,74,0.2)
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite
```

---

## 📊 6. Zone Tâches/Kanban

### Layout Kanban

```
┌─────────────────────────────────┐
│  Kanban IA        [+] Tâche     │
├─────────────────────────────────┤
│  📊 Stats                       │
│  ○ 5 À faire                    │
│  ⏱ 3 En cours                   │
│  ✓ 12 Terminé                   │
├─────────────────────────────────┤
│                                 │
│  [À faire]                      │
│  ┌─────────────────────┐        │
│  │ 🤖 Script pub       │        │
│  │ Assigné: OpenAI     │        │
│  └─────────────────────┘        │
│                                 │
│  [En cours]                     │
│  ┌─────────────────────┐        │
│  │ 🎨 Moodboard        │        │
│  │ Assigné: Luma       │        │
│  │ ⏱ 45% complété      │        │
│  └─────────────────────┘        │
│                                 │
│  [Terminé]                      │
│  ┌─────────────────────┐        │
│  │ ✓ Analyse marché    │        │
│  │ Assigné: Claude     │        │
│  └─────────────────────┘        │
│                                 │
├─────────────────────────────────┤
│  🤖 Agents actifs: 3            │
└─────────────────────────────────┘
```

### Task Card Design

```css
/* Base */
background: white
border-radius: 8px
border-left: 4px solid [agent-color]
padding: 12px
shadow: 0 2px 8px rgba(0,0,0,0.06)
margin-bottom: 8px

/* Agent Colors */
OpenAI: #10a37f
Claude: #cc785c
Luma: #FF684A
Human: #6b7280

/* Hover */
shadow: 0 4px 12px rgba(0,0,0,0.1)
transform: translateX(4px)
```

---

## 🎬 7. Animations Luma-Style

### Glow Effect

```css
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 104, 74, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 104, 74, 0.6);
  }
}

.glow-orange {
  animation: glow 2s ease-in-out infinite;
}
```

### Light Sweep

```css
@keyframes light-sweep {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

.light-sweep {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 104, 74, 0.3) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: light-sweep 3s ease-in-out infinite;
}
```

### Pulse

```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}
```

### Smooth Transitions

```css
.smooth-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.smooth-transition-slow {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 📱 8. Responsive Design

### Desktop (> 1024px)
- Toolbar: Visible, 72px
- Board: Flex-1
- Kanban: 384px, toggle-able

### Tablet (768px - 1024px)
- Toolbar: Collapsed, icons only, 56px
- Board: Flex-1
- Kanban: Overlay modal

### Mobile (< 768px)
- Toolbar: Bottom bar, horizontal
- Board: Full screen
- Kanban: Full screen modal
- Header: Compact, 56px

---

## 🎨 9. Design Tokens

### Colors

```css
--primary: #FF684A
--primary-light: #ff8c6b
--primary-dark: #ff5535
--background: #FFFFFF
--surface: #f9fafb
--border: #e5e7eb
--text-primary: #1f2937
--text-secondary: #6b7280
--text-tertiary: #9ca3af
```

### Shadows

```css
--shadow-sm: 0 2px 8px rgba(0,0,0,0.08)
--shadow-md: 0 4px 16px rgba(0,0,0,0.1)
--shadow-lg: 0 8px 32px rgba(0,0,0,0.12)
--shadow-glow: 0 0 24px rgba(255,104,74,0.4)
```

### Spacing

```css
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-6: 24px
--space-8: 32px
--space-12: 48px
```

### Border Radius

```css
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-full: 9999px
```

---

## 🔄 10. États et Variantes

### Loading State

```tsx
<Card loading>
  <Skeleton />
  <PulseAnimation />
</Card>
```

### Error State

```tsx
<Card error>
  <ErrorIcon />
  <ErrorMessage />
  <RetryButton />
</Card>
```

### Empty State

```tsx
<EmptyState>
  <Icon size="large" />
  <Title>Aucun élément</Title>
  <Description>Commencez par créer une note</Description>
  <CreateButton />
</EmptyState>
```

### Success State

```tsx
<Toast success>
  <CheckIcon />
  <Message>Élément créé avec succès</Message>
</Toast>
```

---

## 🎯 11. Interactions Clés

### Drag & Drop

1. **Pickup**: Scale 1.05, shadow-lg, cursor grabbing
2. **Dragging**: Opacity 0.8, trail effect
3. **Drop**: Bounce animation, success feedback

### Zoom/Pan

1. **Wheel**: Zoom centré sur curseur
2. **Pinch**: Zoom multi-touch (mobile)
3. **Pan**: Drag canvas, cursor grab

### Sélection Multiple

1. **Shift+Click**: Ajouter à sélection
2. **Cmd+A**: Tout sélectionner
3. **Drag Area**: Rectangle de sélection

---

## 📐 12. Wireframes ASCII

### Vue Board Complète

```
┌──────────────────────────────────────────────────────────────────┐
│ [≡] Elite Visuals    [@][@][@] [+]    [🔍][⊞][↓][⚙]            │
├──┬───────────────────────────────────────────────────────────┬───┤
│  │                                                           │ K │
│ T│    ┌─────────┐                                           │ a │
│ o│    │  Root   │────┐                                      │ n │
│ o│    │  Node   │    │                                      │ b │
│ l│    └─────────┘    │                                      │ a │
│ b│         │         ↓                                      │ n │
│ a│    ┌────┴────┐  ┌─────┐                                 │   │
│ r│    │ Branch  │  │Card │                                 │ S │
│  │    └─────────┘  └─────┘                                 │ i │
│ [│                                                          │ d │
│ +│         ┌─────┐     ┌─────┐                             │ e │
│ ]│         │Card │     │Card │                             │ b │
│  │         └─────┘     └─────┘                             │ a │
│ [│                                                          │ r │
│ ✨│                                                          │   │
│ ]│    ┌─────────────────────────────┐                      │ 3 │
│  │    │  Comment Point ●            │                      │ 8 │
│ [│    └─────────────────────────────┘                      │ 4 │
│ ↓│                                                          │ p │
│ ]│                                                          │ x │
│  │  Zoom: 100% | Items: 12 (8 visibles) | Clusters: 2     │   │
└──┴───────────────────────────────────────────────────────────┴───┘
```

---

## ✅ Checklist d'Implémentation

### Phase 1: Structure
- [ ] Créer FloatingToolbar component
- [ ] Créer AgentDashboard layout
- [ ] Intégrer dans page.tsx
- [ ] Responsive breakpoints

### Phase 2: Mindmap
- [ ] MindMapNode component
- [ ] Connexions courbes
- [ ] Double-clic expansion
- [ ] IA suggestions

### Phase 3: Cards
- [ ] Card base component
- [ ] Variantes (text, image, ai)
- [ ] Drag & drop
- [ ] Connexions

### Phase 4: Animations
- [ ] Glow effect
- [ ] Light sweep
- [ ] Transitions fluides
- [ ] Micro-interactions

### Phase 5: Kanban
- [ ] Intégration dashboard
- [ ] Agent indicators
- [ ] Progress tracking
- [ ] Real-time updates

---

**Version**: 1.0.0  
**Date**: 20 Novembre 2024  
**Status**: ✅ SPECS COMPLÈTES
