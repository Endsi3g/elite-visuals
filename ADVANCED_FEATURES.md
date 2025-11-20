# 🚀 Fonctionnalités Avancées - Elite Visuals

Documentation complète des fonctionnalités avancées implémentées dans Elite Visuals.

## 📋 Table des Matières

1. [SmartCluster Integration](#smartcluster-integration)
2. [Mode Showroom](#mode-showroom)
3. [Exports Avancés](#exports-avancés)
4. [Collaboration Temps Réel](#collaboration-temps-réel)
5. [Tests E2E](#tests-e2e)
6. [Mind-Mapping Dynamique](#mind-mapping-dynamique)
7. [Chat Contextuel](#chat-contextuel)
8. [Recherche IA](#recherche-ia)
9. [Sécurité](#sécurité)

---

## 1. SmartCluster Integration

### Description
Le SmartCluster utilise l'IA pour détecter automatiquement les groupes sémantiques dans vos éléments de board.

### Fichiers
- `components/board/SmartCluster.tsx`
- `components/board/InfiniteBoard.tsx` (intégration)

### Utilisation

```typescript
import SmartCluster from "@/components/board/SmartCluster"

<SmartCluster 
  items={boardItems} 
  onCluster={(clusterName, itemIds) => {
    // Créer un nouveau cluster
    handleCluster(clusterName, itemIds)
  }}
/>
```

### Fonctionnalités
- ✅ Analyse de proximité sémantique
- ✅ Suggestions de clusters automatiques
- ✅ Création de clusters en un clic
- ✅ Visualisation des raisons de regroupement

### API IA
En production, connecter à OpenAI ou Claude pour l'analyse sémantique :

```typescript
const analyzeProximity = async (items: BoardItem[]) => {
  const response = await fetch('/api/ai/cluster', {
    method: 'POST',
    body: JSON.stringify({ items }),
  })
  return response.json()
}
```

---

## 2. Mode Showroom

### Description
Mode de présentation client avec interface épurée, lecture seule et watermarks Elite Visuals.

### Fichiers
- `components/board/ShowroomMode.tsx`
- `app/showroom/[id]/page.tsx`

### Utilisation

```typescript
import ShowroomMode from "@/components/board/ShowroomMode"

<ShowroomMode 
  isActive={showroomActive}
  onToggle={() => setShowroomActive(!showroomActive)}
  boardId="board-123"
/>
```

### Fonctionnalités
- ✅ Interface lecture seule
- ✅ Watermark Elite Visuals
- ✅ Génération de lien de partage
- ✅ Design épuré pour clients
- ✅ Pas d'outils d'édition visibles

### URL de Partage
```
https://elitevisuals.com/showroom/[board-id]
```

---

## 3. Exports Avancés

### Description
Exportation du board en différents formats avec préservation de la structure.

### Formats Supportés
- **Markdown** : Export structuré avec clusters
- **PDF** : Export vectoriel (en développement)
- **Vidéo** : Enregistrement de session (roadmap)

### Utilisation

```typescript
// Export Markdown
const exportToMarkdown = () => {
  let markdown = `# Elite Visuals Board Export\n\n`
  markdown += `**Date:** ${new Date().toLocaleDateString()}\n\n`
  
  clusters.forEach(cluster => {
    markdown += `## ${cluster.name}\n\n`
    // ... ajouter items
  })
  
  // Télécharger le fichier
  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `board-${Date.now()}.md`
  a.click()
}
```

### Roadmap PDF
Utiliser `jspdf` pour l'export PDF :

```typescript
import jsPDF from 'jspdf'

const exportToPDF = async () => {
  const doc = new jsPDF()
  // Ajouter contenu
  doc.save(`board-${Date.now()}.pdf`)
}
```

---

## 4. Collaboration Temps Réel

### Description
Collaboration multi-utilisateurs avec WebSockets via Supabase Realtime.

### Fichiers
- `lib/collaboration/websocket.ts`

### Utilisation

```typescript
import CollaborationService from '@/lib/collaboration/websocket'

const collaboration = new CollaborationService(boardId, userId)

// Connexion
await collaboration.connect()

// Écouter les mises à jour
collaboration.onUpdate((update) => {
  console.log('Board updated:', update)
})

// Écouter les utilisateurs
collaboration.onUsersChange((users) => {
  console.log('Active users:', users)
})

// Broadcaster une mise à jour
collaboration.broadcastUpdate({
  type: 'item_added',
  data: newItem,
})

// Mettre à jour le curseur
collaboration.updateCursor(x, y)

// Déconnexion
await collaboration.disconnect()
```

### Fonctionnalités
- ✅ Présence en temps réel
- ✅ Curseurs collaboratifs
- ✅ Synchronisation des modifications
- ✅ Notifications d'événements
- ✅ Gestion des utilisateurs actifs

### Configuration Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 5. Tests E2E

### Description
Tests end-to-end avec Playwright pour garantir la qualité.

### Fichiers
- `playwright.config.ts`
- `e2e/board.spec.ts`

### Commandes

```bash
# Lancer tous les tests E2E
npm run test:e2e

# Mode UI interactif
npm run test:e2e:ui

# Mode debug
npm run test:e2e:debug

# Tests + E2E
npm run test:all
```

### Tests Implémentés

#### Board Tests
- ✅ Chargement du board
- ✅ Ajout de cartes texte
- ✅ Zoom in/out
- ✅ Menu d'export
- ✅ Smart Cluster
- ✅ Génération IA
- ✅ Drag & Drop

#### Showroom Tests
- ✅ Chargement showroom
- ✅ Watermark visible
- ✅ Mode lecture seule

#### Collaboration Tests
- ✅ Initialisation du service

### Exemple de Test

```typescript
test('should add a text card', async ({ page }) => {
  const addButton = page.locator('button').filter({ hasText: /Plus/ }).first()
  await addButton.click()
  
  await page.waitForTimeout(500)
  
  const infoBar = page.locator('text=/Items:/')
  await expect(infoBar).toContainText('Items: 1')
})
```

---

## 6. Mind-Mapping Dynamique

### Description
Création de mind maps avec génération automatique de nœuds enfants par IA.

### Fichiers
- `components/board/MindMap.tsx`

### Utilisation

```typescript
import MindMap, { MindMapToolbar } from "@/components/board/MindMap"

<MindMap 
  onGenerateChildren={async (nodeId, nodeLabel) => {
    // Appeler IA pour générer suggestions
    const suggestions = await generateAISuggestions(nodeLabel)
    return suggestions
  }}
/>

<MindMapToolbar 
  onAddNode={() => addNode()}
  onGenerateAI={() => generateAI()}
/>
```

### Fonctionnalités
- ✅ Nœuds draggables
- ✅ Connexions automatiques
- ✅ Double-clic pour générer enfants IA
- ✅ Couleurs personnalisables
- ✅ Sélection de nœuds

### Génération IA

```typescript
const generateAISuggestions = async (topic: string) => {
  const response = await fetch('/api/ai/mindmap', {
    method: 'POST',
    body: JSON.stringify({ topic }),
  })
  const { suggestions } = await response.json()
  return suggestions // ["Idée 1", "Idée 2", "Idée 3"]
}
```

---

## 7. Chat Contextuel

### Description
Assistant IA contextuel qui comprend le contenu du board.

### Fichiers
- `components/chat/ContextualChat.tsx`

### Utilisation

```typescript
import ContextualChat from "@/components/chat/ContextualChat"

<ContextualChat 
  boardContext={{
    items: boardItems,
    clusters: clusters,
  }}
  onAIResponse={(message) => {
    console.log('AI response:', message)
  }}
/>
```

### Fonctionnalités
- ✅ Chat flottant
- ✅ Contexte du board
- ✅ Réponses intelligentes
- ✅ Historique des messages
- ✅ Indicateur de frappe

### Exemples de Requêtes
- "Combien d'éléments sur le board ?"
- "Fais-moi un résumé"
- "Donne-moi des idées"
- "Analyse ce contenu"

### Intégration IA

```typescript
const getAIResponse = async (query: string, context: any) => {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ query, context }),
  })
  return response.json()
}
```

---

## 8. Recherche IA

### Description
Recherche sémantique intelligente sur le board avec filtres avancés.

### Fichiers
- `components/board/AISearch.tsx`

### Utilisation

```typescript
import AISearch from "@/components/board/AISearch"

<AISearch 
  items={boardItems}
  onSelectItem={(itemId) => {
    // Naviguer vers l'item
    focusOnItem(itemId)
  }}
/>
```

### Fonctionnalités
- ✅ Recherche sémantique
- ✅ Filtres par type
- ✅ Score de pertinence
- ✅ Résultats en temps réel
- ✅ Interface intuitive

### Filtres Disponibles
- Type de contenu (texte, image, vidéo, etc.)
- Pertinence minimale (0-100%)

### API de Recherche

```typescript
const searchWithAI = async (query: string, filters: any) => {
  const response = await fetch('/api/ai/search', {
    method: 'POST',
    body: JSON.stringify({ query, filters }),
  })
  return response.json()
}
```

---

## 9. Sécurité

### Description
Système de sécurité complet avec rate limiting et validation.

### Fichiers
- `lib/security/rate-limiter.ts`
- `lib/security/cors.ts`
- `lib/security/file-validator.ts`

### Rate Limiting

```typescript
import { aiRateLimiter, getClientIdentifier } from '@/lib/security/rate-limiter'

export async function POST(req: Request) {
  const identifier = getClientIdentifier(req)
  const { allowed, remaining, resetTime } = aiRateLimiter.check(identifier)
  
  if (!allowed) {
    return new Response('Rate limit exceeded', { 
      status: 429,
      headers: {
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': resetTime.toString(),
      }
    })
  }
  
  // Traiter la requête
}
```

### Limites Configurées
- **IA**: 10 requêtes/minute
- **Upload**: 5 uploads/minute
- **Général**: 100 requêtes/minute

### Validation de Fichiers

```typescript
import { validateFile } from '@/lib/security/file-validator'

const isValid = validateFile(file, {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/png', 'image/jpeg'],
})
```

### CORS

```typescript
import { corsHeaders } from '@/lib/security/cors'

export async function OPTIONS(req: Request) {
  return new Response(null, { headers: corsHeaders })
}
```

---

## 🔧 Configuration

### Variables d'Environnement

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# IA APIs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
OLLAMA_BASE_URL=http://localhost:11434

# Security
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW_MINUTES=1
```

### Installation des Dépendances

```bash
npm install
```

Toutes les dépendances nécessaires sont déjà dans `package.json`.

---

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
npm run deploy
```

### Configuration Supabase

1. Créer un projet Supabase
2. Activer Realtime
3. Configurer les tables (voir `supabase/migrations/`)
4. Ajouter les variables d'environnement

---

## 📊 Métriques & Monitoring

### KPIs à Suivre
- Temps de réponse IA
- Taux d'utilisation des clusters
- Nombre de collaborateurs actifs
- Exports générés
- Recherches effectuées

### Logging

```typescript
console.log('[SmartCluster] Analyzing proximity...')
console.log('[Collaboration] User joined:', userId)
console.log('[Export] Markdown generated:', filename)
```

---

## 🐛 Debugging

### Problèmes Courants

#### WebSocket ne se connecte pas
```typescript
// Vérifier la configuration Supabase
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
```

#### Rate Limiting trop strict
```typescript
// Ajuster dans rate-limiter.ts
export const aiRateLimiter = new RateLimiter(20, 1) // 20 req/min
```

#### Tests E2E échouent
```bash
# Vérifier que le serveur dev tourne
npm run dev

# Lancer les tests
npm run test:e2e:debug
```

---

## 🎯 Roadmap

### Phase 3 - Optimisations
- [ ] Cache Redis pour performances
- [ ] CDN pour médias
- [ ] Virtualisation Konva
- [ ] PWA support
- [ ] Internationalisation (i18n)
- [ ] Mode mobile responsive
- [ ] OCR automatique
- [ ] Intégration Figma

### Phase 4 - Enterprise
- [ ] SSO/SAML
- [ ] Audit logs
- [ ] Permissions granulaires
- [ ] White-labeling
- [ ] API publique

---

## 📚 Ressources

- [Documentation Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Playwright Documentation](https://playwright.dev/)
- [Konva.js Guide](https://konvajs.org/docs/)
- [Next.js App Router](https://nextjs.org/docs/app)

---

## 🤝 Contribution

Pour contribuer aux fonctionnalités avancées :

1. Fork le projet
2. Créer une branche feature
3. Ajouter des tests E2E
4. Documenter les changements
5. Soumettre une PR

---

**Fait avec ❤️ par Elite Visuals**
