# 📁 Structure du Projet Elite Visuals

## Vue d'ensemble

```
elite-visuals/
├── 📱 app/                      # Next.js 14 App Router
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Page d'accueil
│   └── globals.css             # Styles globaux
│
├── 🎨 components/               # Composants React
│   ├── board/                  # Board visuel infini
│   │   ├── InfiniteBoard.tsx   # Canvas Konva principal
│   │   ├── BoardCard.tsx       # Cartes médias
│   │   └── SmartCluster.tsx    # Clustering IA
│   ├── kanban/                 # Système Kanban
│   │   ├── KanbanSidebar.tsx   # Sidebar Kanban
│   │   └── KanbanColumn.tsx    # Colonnes de tâches
│   ├── layout/                 # Layout components
│   │   └── Header.tsx          # Header Elite Visuals
│   ├── studio/                 # Studio génératif
│   │   └── MagicPrompt.tsx     # Modal génération IA
│   └── ui/                     # shadcn/ui components
│       ├── button.tsx
│       ├── toast.tsx
│       └── toaster.tsx
│
├── 🪝 hooks/                    # React hooks custom
│   └── use-toast.ts            # Toast notifications
│
├── 📚 lib/                      # Bibliothèques & services
│   ├── ai/                     # Services IA
│   │   ├── ollama.ts           # Ollama LLM (Llama 3, Mistral)
│   │   ├── claude.ts           # Anthropic Claude
│   │   └── luma.ts             # Luma AI vidéo/image
│   ├── supabase/               # Supabase modulaire
│   │   ├── client.ts           # Client Supabase
│   │   ├── types.ts            # Types TypeScript
│   │   └── hooks.ts            # React hooks Supabase
│   ├── supabase.ts             # Export principal (backward compat)
│   └── utils.ts                # Utilitaires (cn, etc.)
│
├── 🗄️ supabase/                 # Configuration Supabase
│   ├── schema.sql              # Schéma complet de la DB
│   ├── reset.sql               # Reset de la DB
│   ├── migrations/             # Migrations SQL
│   │   └── 001_initial_schema.sql
│   ├── ARCHITECTURE.md         # Architecture DB
│   ├── CHECKLIST.md            # Checklist setup
│   ├── EXAMPLES.md             # Exemples d'utilisation
│   ├── QUICKSTART.md           # Démarrage rapide
│   └── README.md               # Documentation Supabase
│
├── 🔧 Configuration
│   ├── .env.local.example      # Template variables d'environnement
│   ├── .gitignore              # Fichiers ignorés par Git
│   ├── next.config.js          # Config Next.js
│   ├── tailwind.config.ts      # Config TailwindCSS
│   ├── tsconfig.json           # Config TypeScript
│   ├── postcss.config.js       # Config PostCSS
│   └── package.json            # Dépendances npm
│
├── 📖 Documentation
│   ├── README.md               # Documentation principale
│   ├── QUICKSTART.md           # Démarrage rapide 3 min
│   ├── INSTALL.md              # Installation détaillée
│   ├── INSTALLATION_WINDOWS.md # Installation Windows
│   ├── OLLAMA_SETUP.md         # Setup Ollama LLM
│   ├── SUPABASE_SETUP.md       # Setup Supabase
│   ├── SUPABASE_COMPLET.md     # Guide Supabase complet
│   ├── PRD_IMPLEMENTATION.md   # Conformité PRD
│   ├── SECURITY.md             # Sécurité & best practices
│   ├── CONTRIBUTING.md         # Guide de contribution
│   ├── CHANGELOG.md            # Historique des versions
│   ├── GITHUB_SETUP.md         # Setup GitHub
│   ├── DEPLOY.md               # Guide de déploiement
│   └── LICENSE                 # Licence MIT
│
└── 🤖 .github/                  # GitHub Actions & templates
    ├── workflows/
    │   └── ci.yml              # CI/CD pipeline
    ├── ISSUE_TEMPLATE/         # Templates d'issues
    ├── PULL_REQUEST_TEMPLATE.md
    └── FUNDING.yml             # Sponsoring
```

## 🎯 Composants Clés

### Board Visuel Infini
- **InfiniteBoard.tsx** : Canvas Konva avec zoom/pan
- **BoardCard.tsx** : Cartes médias déplaçables
- **SmartCluster.tsx** : Clustering IA sémantique

### Kanban IA
- **KanbanSidebar.tsx** : Sidebar avec 4 colonnes
- **KanbanColumn.tsx** : Colonnes de tâches avec agents

### Services IA
- **ollama.ts** : LLM open source (Llama 3, Mistral, LLaVA)
- **claude.ts** : Storytelling et pitchs créatifs
- **luma.ts** : Génération vidéo/image

### Supabase
- **client.ts** : Client Supabase avec fonctions CRUD
- **types.ts** : Types TypeScript pour la DB
- **hooks.ts** : React hooks (useAuth, useBoard, etc.)

## 📦 Dépendances Principales

```json
{
  "next": "14.2.5",
  "react": "^18.3.1",
  "typescript": "^5.5.4",
  "@supabase/supabase-js": "^2.39.0",
  "konva": "^9.3.14",
  "react-konva": "^18.2.10",
  "@anthropic-ai/sdk": "^0.25.2",
  "zustand": "^4.5.4",
  "tailwindcss": "^3.4.1",
  "framer-motion": "^11.3.28"
}
```

## 🗂️ Conventions de Nommage

- **Composants** : PascalCase (`InfiniteBoard.tsx`)
- **Hooks** : camelCase avec préfixe `use` (`use-toast.ts`)
- **Utilitaires** : camelCase (`utils.ts`)
- **Types** : PascalCase (`Board`, `Task`)
- **Constantes** : UPPER_SNAKE_CASE (`OLLAMA_BASE_URL`)

## 🎨 Architecture

### Frontend
- **Next.js 14** : App Router, Server Components
- **React 18** : Hooks, Context API
- **TypeScript** : Typage strict
- **TailwindCSS** : Utility-first CSS

### Backend
- **Supabase** : PostgreSQL, Auth, Storage, Realtime
- **Ollama** : LLM local open source
- **HuggingFace** : Fallback IA

### State Management
- **Zustand** : State global léger
- **React Query** : Cache et synchronisation (via Supabase hooks)

## 📊 Flux de Données

```
User Action → Component → Hook → Supabase Client → PostgreSQL
                    ↓
                 Zustand Store
                    ↓
              UI Update (React)
```

## 🔐 Sécurité

- **RLS (Row Level Security)** : Activé sur toutes les tables
- **JWT Authentication** : Via Supabase Auth
- **Environment Variables** : Secrets dans `.env.local`
- **HTTPS** : Obligatoire en production

## 🚀 Performance

- **Server Components** : Rendu côté serveur
- **Image Optimization** : Next.js Image
- **Code Splitting** : Automatique avec Next.js
- **Lazy Loading** : Composants et routes

## 📈 Évolutivité

- **Modular Architecture** : Composants réutilisables
- **Type Safety** : TypeScript strict
- **API Routes** : Next.js API routes
- **Database Indexing** : Indexes sur colonnes fréquentes

---

**Version** : 1.0.0  
**Dernière mise à jour** : 19 Nov 2024
