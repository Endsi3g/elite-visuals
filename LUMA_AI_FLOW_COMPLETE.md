# 🎬 Elite Visuals - Flow Complet Luma AI

> **Documentation Technique Détaillée**  
> De l'Input Utilisateur à la Vidéo Générée

---

## 🔄 Flow Simplifié

```
User Input → Carte Input → Luma API → Polling → Carte Output → Affichage
```

---

## 📝 Étapes Principales

### 1. Création Carte Input
```typescript
const inputCard = await boardItems.create({
  type: 'ai-generated',
  content: { prompt, status: 'pending' },
  metadata: { luma_status: 'pending' }
})
```

### 2. Appel Luma API
```typescript
const result = await generateVideo({ prompt })
// Response: { generationId, status: 'pending' }
```

### 3. Enregistrement DB
```typescript
await aiGenerations.create({
  ai_provider: 'luma',
  prompt,
  result: { generation_id: result.generationId }
})
```

### 4. Polling Status
```typescript
setInterval(async () => {
  const status = await checkGenerationStatus(generationId)
  if (status === 'completed') {
    createOutputCard(status.videoUrl)
  }
}, 5000)
```

### 5. Création Carte Output
```typescript
await boardItems.create({
  type: 'video',
  content: { url: videoUrl },
  metadata: { connected_to: [inputCardId] }
})
```

---

## 🎨 Relation Visuelle

```
Board Canvas
┌────────────────────────────────────────┐
│  ┌─────────────┐    ┌─────────────┐   │
│  │   INPUT     │───►│   OUTPUT    │   │
│  │  Prompt     │    │   Video     │   │
│  └─────────────┘    └─────────────┘   │
└────────────────────────────────────────┘
```

---

## 📊 Données Stockées

### board_items (Input)
```json
{
  "type": "ai-generated",
  "content": { "prompt": "...", "status": "processing" },
  "metadata": { "luma_generation_id": "..." }
}
```

### board_items (Output)
```json
{
  "type": "video",
  "content": { "url": "https://...", "thumbnail_url": "..." },
  "metadata": { "connected_to": ["input-uuid"] }
}
```

### ai_generations
```json
{
  "ai_provider": "luma",
  "prompt": "...",
  "result": { "video_url": "...", "duration": 5.2 },
  "status": "completed"
}
```

---

**Document créé le**: 20 Nov 2024  
**Version**: 1.0
