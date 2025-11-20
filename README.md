# 🎨 Elite Visuals - MVP IA de Création Visuelle & Collaboration

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-green)](https://supabase.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**Le premier OS Créatif Collaboratif pour agences francophones**

> 🔗 **Repository GitHub** : [https://github.com/Endsi3g/elite-visuals](https://github.com/Endsi3g/elite-visuals)

Application web moderne fusionnant idéation (whiteboard), gestion de projet (Kanban IA) et production (GenAI) dans une interface unifiée.

> **Proposition de Valeur Unique:** "De l'idée à l'asset final sans changer d'onglet."

**Conformité PRD v1.0:** 86% ✅ | [Voir détails](./PRD_IMPLEMENTATION.md)

## ✨ Fonctionnalités Principales

### 🖼️ Board Visuel Infini (Inspiration: Figma/Luma/Poppy)
- **Canvas interactif** avec zoom/pan illimité (Konva.js)
- **Universal Drag & Drop** : .mp4, .mov, .mp3, .pdf, .png, URLs (YouTube/Web)
- **Smart Clustering** : L'IA détecte la proximité sémantique et propose des groupes
- **Grille dynamique** subtile (points gris 10% opacité)
- **Micro-animations** orange (#FF684A) style Luma
- **Media Cards** : Coins arrondis 12px, bordure orange au survol

### 🤖 IA Multi-modale & Analyse (100% Open Source)
- **Ollama LLM** : Llama 3, Mistral - Scripts, briefs, analyses (local, gratuit)
- **LLaVA Vision** : Analyse d'images multimodale via Ollama
- **Transcription** : Whisper via HuggingFace avec note carte automatique
- **Claude 3.5 Sonnet** : Storytelling, pitchs, stratégie créative (optionnel)
- **Luma AI Dream Machine** : Génération vidéo/image contextuelle
- **Fallback HuggingFace** : API gratuite si Ollama indisponible
- **Mind-Mapping Assisté** : Double-clic génère des nœuds enfants suggérés

### 📋 Kanban & Agents Autonomes (Inspiration: AgentsBoard)
- **Dual View** : Basculer entre Vue Board et Vue Tâches
- **Agent Delegation** : Clic droit > Attribuer à Agent Copywriter/Designer/Analyzer
- **4 colonnes** : Backlog > En cours (IA/Humain) > Review > Validé
- **Suivi automatisé** : Agents notifient à la complétion
- **Indicateurs visuels** : Icônes colorées par agent (OpenAI, Claude, Luma, Humain)

### 👥 Collaboration & Export
- **Collaboration temps réel** : Yjs + Supabase Realtime
- **Avatars actifs** avec bordure orange si actif
- **Mode Showroom Client** : Interface épurée, lecture seule, watermarks Elite
- **Exports Intelligents** : PDF vectoriel, Markdown structuré
- **Commentaires** : Points oranges sur le board

### 🎨 Design Elite Visuals
- **Palette** : Blanc (#FFFFFF) + Orange (#FF684A)
- **Effets glow** : Ombres orange sur interactions
- **Typographie** : Inter, moderne et épurée
- **Animations smooth** : Transitions fluides Luma-style

## 🚀 Installation

### Prérequis
- Node.js 18+ et npm/yarn
- **Ollama** installé localement ([Guide d'installation](./OLLAMA_SETUP.md))
- Comptes API (optionnels) : HuggingFace, Anthropic, Firebase

### Étapes

1. **Cloner et installer**
```bash
cd elite-visuals
npm install
```

2. **Configuration environnement**
```bash
cp .env.local.example .env.local
```

Éditer `.env.local` avec vos clés API :
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Ollama (LLM Open Source)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3

# HuggingFace (Fallback)
HUGGINGFACE_API_KEY=hf_your_key

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key

# Luma AI (unofficial)
LUMA_API_KEY=your_luma_key
LUMA_API_URL=https://api.lumalabs.ai/v1
```

3. **Lancer en développement**
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

4. **Build production**
```bash
npm run build
npm start
```

## 🚀 Déploiement

L'application est prête pour le déploiement sur Vercel, Netlify, Railway ou Docker.

**Démarrage rapide :** Consultez [`QUICK_START_DEPLOY.md`](./QUICK_START_DEPLOY.md)

**Guide complet :** Consultez [`DEPLOYMENT.md`](./DEPLOYMENT.md)

**Vercel CLI :** Consultez [`VERCEL_CLI.md`](./VERCEL_CLI.md)

### Déploiement en un clic sur Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Endsi3g/elite-visuals)

**Note :** N'oubliez pas de configurer les variables d'environnement (voir `.env.example`)

## 📁 Structure du Projet

```
elite-visuals/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx             # Page d'accueil (board + kanban)
│   └── globals.css          # Styles globaux
├── components/
│   ├── board/
│   │   ├── InfiniteBoard.tsx    # Canvas Konva principal
│   │   └── BoardCard.tsx        # Carte média sur board
│   ├── kanban/
│   │   ├── KanbanSidebar.tsx    # Sidebar Kanban
│   │   └── KanbanColumn.tsx     # Colonne de tâches
│   ├── layout/
│   │   └── Header.tsx           # Header avec logo Elite
│   └── ui/
│       ├── button.tsx           # Composant bouton
│       └── toaster.tsx          # Notifications toast
├── lib/
│   ├── utils.ts             # Utilitaires (cn, etc.)
│   ├── firebase.ts          # Config Firebase (à créer)
│   └── ai/
│       ├── openai.ts        # Service OpenAI (à créer)
│       ├── claude.ts        # Service Claude (à créer)
│       └── luma.ts          # Service Luma AI (à créer)
├── hooks/
│   └── use-toast.ts         # Hook toast (à créer)
├── public/
│   └── logo.svg             # Logo Elite Visuals
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🎯 Workflows Utilisateur

### 1. Créateur de Contenu
1. Drag & drop vidéo YouTube sur board
2. IA analyse et transcrit automatiquement
3. Génère 3 scripts publicitaires (OpenAI)
4. Crée moodboard vidéo avec Luma AI
5. Équipe approuve/rejette dans Kanban

### 2. Marketer
1. Crée cluster "Campagne Orange"
2. Attribue tâches à agents IA :
   - Script → OpenAI
   - Pitch → Claude
   - Visuel → Luma
   - Analyse marché → OpenAI
3. Suivi automatisé en Kanban
4. Export markdown pour client

### 3. UX Designer
1. Crée board "Brief Client" collaboratif
2. Équipe ajoute ressources (images, notes vocales)
3. IA résume et propose user flow
4. Génère image/vidéo "dream machine" Luma
5. Partage instantané au client

## 🛠️ Stack Technique

### Frontend
- **Next.js 14** (App Router)
- **React 18** + TypeScript
- **TailwindCSS** (customisé blanc/orange)
- **Konva.js** + react-konva (canvas)
- **Framer Motion** (animations)
- **shadcn/ui** (composants)
- **Lucide React** (icônes)

### Backend & Services
- **Supabase** : Auth, PostgreSQL, Storage, Realtime
- **Ollama** : LLM open source local (Llama 3, Mistral, LLaVA)
- **HuggingFace API** : Fallback & Whisper transcription
- **Anthropic Claude API** : Claude 3 (optionnel)
- **Luma AI API** : Génération vidéo/image

### État & Data
- **Zustand** : State management
- **React Dropzone** : Upload fichiers
- **Axios** : Requêtes HTTP

## 🔑 APIs & Intégrations

### Ollama (LLM Open Source)
```typescript
// lib/ai/ollama.ts
import axios from 'axios'

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434"
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || "llama3"

export async function generateScript(prompt: string) {
  const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
    model: DEFAULT_MODEL,
    prompt,
    stream: false,
  })
  return response.data.response
}
```

**Modèles disponibles :** Llama 3, Mistral, CodeLlama, LLaVA (vision)  
**Coût :** Gratuit 🎉  
**Setup :** [Guide Ollama](./OLLAMA_SETUP.md)

### Luma AI (Unofficial)
```typescript
// lib/ai/luma.ts
import axios from 'axios'

export async function generateVideo(prompt: string) {
  const response = await axios.post(
    `${process.env.LUMA_API_URL}/generations`,
    { prompt },
    {
      headers: {
        'Authorization': `Bearer ${process.env.LUMA_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  )
  return response.data
}
```

## 📊 KPIs & Métriques

- **Taux d'activation** : Boards créés / utilisateurs
- **Volume médias** : Analysés et générés par mois
- **Tâches IA** : Attribuées et complétées automatiquement
- **NPS** : Feedback utilisateurs/clients

## 🎨 Personnalisation

### Couleurs
```css
/* globals.css */
--primary: #FF684A;        /* Orange Elite */
--background: #FFFFFF;     /* Blanc pur */
```

### Logo
Remplacer `public/logo.svg` avec logo Elite Visuals

### Animations
Modifier `tailwind.config.ts` :
```typescript
animation: {
  'glow': 'glow 2s ease-in-out infinite',
}
```

## 🚧 Prochaines Étapes

### Phase 2 - Fonctionnalités Avancées
- [ ] Chat contextuel temps réel
- [ ] Permissions granulaires (lecture/édition)
- [ ] Export PDF/PNG/MP4 avec watermark
- [ ] Mode présentation client
- [ ] Recherche IA sur board
- [ ] Mind-mapping dynamique
- [ ] OCR automatique
- [ ] Intégration Figma

### Phase 3 - Optimisations
- [ ] WebSockets pour collaboration
- [ ] Cache Redis
- [ ] CDN pour médias
- [ ] Tests E2E (Playwright)
- [ ] CI/CD (GitHub Actions)

## 📚 Ressources & Inspirations

- [Poppy AI](https://getpoppy.ai) - Inspiration workflow
- [Luma AI](https://lumalabs.ai) - Génération vidéo
- [AgentsBoard](https://github.com/Justmalhar/AgentsBoard) - Kanban IA
- [Figma](https://figma.com) - Collaboration temps réel

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Propriétaire - Elite Visuals © 2024

## 💬 Support

- Email : support@elitevisuals.com
- Discord : [Elite Visuals Community](#)
- Docs : [docs.elitevisuals.com](#)

---

**Fait avec ❤️ et IA par Elite Visuals**
