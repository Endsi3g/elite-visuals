# 🏗️ Architecture Supabase - Elite Visuals

## 📐 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                    ELITE VISUALS APP                         │
│                  (Next.js + React)                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Supabase Client
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  SUPABASE BACKEND                            │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │     Auth     │  │   Database   │  │   Storage    │     │
│  │              │  │              │  │              │     │
│  │ • Email/Pass │  │ • PostgreSQL │  │ • Media      │     │
│  │ • OAuth      │  │ • RLS        │  │   Files      │     │
│  │ • Sessions   │  │ • Realtime   │  │ • Public     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 🗄️ Schéma de base de données

### Relations entre tables

```
┌─────────────┐
│   auth.users│
└──────┬──────┘
       │
       │ 1:1
       │
┌──────▼──────┐
│  profiles   │◄────────┐
└──────┬──────┘         │
       │                │
       │ 1:N            │ N:1
       │                │
┌──────▼──────┐    ┌────┴─────────┐
│   boards    │◄───│board_collabs │
└──────┬──────┘    └──────────────┘
       │
       ├─────────┬─────────┬──────────┬──────────┐
       │ 1:N     │ 1:N     │ 1:N      │ 1:N      │
       │         │         │          │          │
┌──────▼──┐ ┌───▼────┐ ┌──▼──────┐ ┌─▼────────┐
│board_   │ │ tasks  │ │comments │ │ai_gen    │
│items    │ │        │ │         │ │erations  │
└─────────┘ └────────┘ └─────────┘ └──────────┘
```

### Détail des tables

#### 👤 profiles
```sql
id (UUID, PK) ──────────┐
email (TEXT)            │
full_name (TEXT)        │ Extends auth.users
avatar_url (TEXT)       │
created_at (TIMESTAMP)  │
updated_at (TIMESTAMP) ─┘
```

#### 📋 boards
```sql
id (UUID, PK)
title (TEXT)
owner_id (UUID, FK → profiles)
description (TEXT)
is_public (BOOLEAN)
thumbnail_url (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

#### 🎨 board_items
```sql
id (UUID, PK)
board_id (UUID, FK → boards)
type (ENUM: text|image|video|audio|pdf|url|ai-generated)
x, y (FLOAT) ────────┐
width, height (FLOAT)│ Position & Size
z_index (INTEGER) ───┘
content (JSONB) ─────┐
metadata (JSONB) ────┘ Flexible data
title (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

#### ✅ tasks
```sql
id (UUID, PK)
board_id (UUID, FK → boards)
title (TEXT)
description (TEXT)
status (ENUM: backlog|in-progress|review|done)
assigned_to (ENUM: openai|claude|luma|human)
assigned_user_id (UUID, FK → profiles)
priority (ENUM: low|medium|high|urgent)
ai_generated (BOOLEAN)
due_date (TIMESTAMP)
completed_at (TIMESTAMP)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

#### 💬 comments
```sql
id (UUID, PK)
board_id (UUID, FK → boards)
item_id (UUID, FK → board_items, nullable)
user_id (UUID, FK → profiles)
content (TEXT)
x, y (FLOAT, nullable) ─── Position for annotations
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

#### 👥 board_collaborators
```sql
id (UUID, PK)
board_id (UUID, FK → boards)
user_id (UUID, FK → profiles)
role (ENUM: owner|editor|viewer)
created_at (TIMESTAMP)

UNIQUE(board_id, user_id)
```

#### 🤖 ai_generations
```sql
id (UUID, PK)
board_id (UUID, FK → boards)
user_id (UUID, FK → profiles)
ai_provider (ENUM: openai|claude|luma|ollama)
prompt (TEXT)
result (JSONB)
status (ENUM: pending|processing|completed|failed)
error_message (TEXT)
created_at (TIMESTAMP)
completed_at (TIMESTAMP)
```

## 🔒 Système de sécurité (RLS)

### Matrice de permissions

| Table | Owner | Editor | Viewer | Public | Anonymous |
|-------|-------|--------|--------|--------|-----------|
| **boards** |
| SELECT | ✅ | ✅ | ✅ | ✅ (if public) | ✅ (if public) |
| INSERT | ✅ | ❌ | ❌ | ❌ | ❌ |
| UPDATE | ✅ | ❌ | ❌ | ❌ | ❌ |
| DELETE | ✅ | ❌ | ❌ | ❌ | ❌ |
| **board_items** |
| SELECT | ✅ | ✅ | ✅ | ✅ (if board public) | ✅ (if board public) |
| INSERT | ✅ | ✅ | ❌ | ❌ | ❌ |
| UPDATE | ✅ | ✅ | ❌ | ❌ | ❌ |
| DELETE | ✅ | ✅ | ❌ | ❌ | ❌ |
| **tasks** |
| SELECT | ✅ | ✅ | ✅ | ✅ (if board public) | ✅ (if board public) |
| INSERT | ✅ | ✅ | ❌ | ❌ | ❌ |
| UPDATE | ✅ | ✅ | ❌ | ❌ | ❌ |
| DELETE | ✅ | ✅ | ❌ | ❌ | ❌ |
| **comments** |
| SELECT | ✅ | ✅ | ✅ | ✅ (if board public) | ✅ (if board public) |
| INSERT | ✅ | ✅ | ✅ | ❌ | ❌ |
| UPDATE | ✅ (own) | ✅ (own) | ✅ (own) | ❌ | ❌ |
| DELETE | ✅ (own) | ✅ (own) | ✅ (own) | ❌ | ❌ |

### Flux de vérification RLS

```
User Request
     │
     ▼
┌─────────────────┐
│ Is Authenticated?│
└────┬────────────┘
     │
     ├─── NO ──► Check if board is_public
     │              │
     │              ├─── YES ──► Allow SELECT only
     │              └─── NO ───► DENY
     │
     └─── YES ──► Check ownership
                    │
                    ├─── Is Owner? ──► ALLOW ALL
                    │
                    └─── Not Owner ──► Check collaborator role
                                         │
                                         ├─── Editor ──► ALLOW SELECT, INSERT, UPDATE, DELETE
                                         ├─── Viewer ──► ALLOW SELECT only
                                         └─── None ───► Check if board is_public
```

## 🔄 Temps réel (Realtime)

### Channels disponibles

```typescript
// Board items
supabase.channel('board:{boardId}')
  .on('postgres_changes', { table: 'board_items', filter: 'board_id=eq.{boardId}' })

// Tasks
supabase.channel('tasks:{boardId}')
  .on('postgres_changes', { table: 'tasks', filter: 'board_id=eq.{boardId}' })

// Comments
supabase.channel('comments:{boardId}')
  .on('postgres_changes', { table: 'comments', filter: 'board_id=eq.{boardId}' })
```

### Événements

- `INSERT` : Nouvel élément ajouté
- `UPDATE` : Élément modifié
- `DELETE` : Élément supprimé

## 📦 Storage

### Structure des fichiers

```
media/
├── {user_id}/
│   ├── {board_id}/
│   │   ├── images/
│   │   │   ├── {timestamp}-{filename}.jpg
│   │   │   └── {timestamp}-{filename}.png
│   │   ├── videos/
│   │   │   └── {timestamp}-{filename}.mp4
│   │   ├── audio/
│   │   │   └── {timestamp}-{filename}.mp3
│   │   └── documents/
│   │       └── {timestamp}-{filename}.pdf
│   └── profile/
│       └── avatar.jpg
```

### Politiques Storage

- **Public Read** : Tous les fichiers sont lisibles publiquement
- **Authenticated Write** : Seuls les utilisateurs authentifiés peuvent uploader
- **Owner Modify** : Seul le propriétaire peut modifier/supprimer ses fichiers

## 🔌 API Client

### Structure du code

```
lib/supabase/
├── index.ts          # Point d'entrée, re-exports
├── types.ts          # Types TypeScript générés
├── client.ts         # Client Supabase + fonctions CRUD
└── hooks.ts          # React hooks pour faciliter l'usage
```

### Modules disponibles

```typescript
import { 
  // Client
  supabase,
  
  // Modules fonctionnels
  auth,
  profiles,
  boards,
  boardItems,
  tasks,
  comments,
  aiGenerations,
  storage,
  realtime,
  
  // Hooks React
  useAuth,
  useProfile,
  useBoard,
  useMyBoards,
  useBoardItems,
  useTasks,
  useComments,
  useFileUpload,
  useCanEditBoard,
  useIsBoardOwner,
  
  // Types
  Board,
  BoardItem,
  Task,
  Comment,
  Profile,
  // ...
} from '@/lib/supabase'
```

## 🚀 Flux de données

### Création d'un board avec items

```
User Action
    │
    ▼
┌─────────────────┐
│ boards.create() │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  INSERT board   │
│  in database    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Return board ID │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│ boardItems.create()  │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ INSERT board_item    │
│ in database          │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Realtime broadcast   │
│ to all subscribers   │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ All clients receive  │
│ update via websocket │
└──────────────────────┘
```

## 🎯 Optimisations

### Indexes créés

- `boards.owner_id` : Recherche rapide des boards par propriétaire
- `board_items.board_id` : Chargement rapide des items d'un board
- `tasks.board_id` : Chargement rapide des tâches
- `tasks.status` : Filtrage par statut
- `comments.board_id` : Chargement des commentaires
- `comments.item_id` : Commentaires d'un item spécifique
- `board_collaborators.board_id` : Recherche des collaborateurs
- `board_collaborators.user_id` : Boards d'un utilisateur

### Triggers

- `update_updated_at_column` : Mise à jour automatique du timestamp
- `handle_new_user` : Création automatique du profil lors de l'inscription

## 📊 Capacités

- **Utilisateurs** : Illimité
- **Boards** : Illimité
- **Items par board** : Illimité (recommandé < 1000 pour performance)
- **Collaborateurs par board** : Illimité
- **Fichiers** : Limité par le plan Supabase
- **Realtime connections** : Limité par le plan Supabase

## 🔐 Sécurité

### Bonnes pratiques implémentées

✅ Row Level Security (RLS) activé sur toutes les tables
✅ Politiques de sécurité granulaires
✅ Validation des types avec TypeScript
✅ Authentification JWT
✅ Storage sécurisé avec politiques
✅ Pas de clés API côté client (utilisation de anon key)
✅ Validation des permissions avant chaque action

### Points d'attention

⚠️ Les clés API doivent rester dans `.env.local`
⚠️ Ne jamais exposer la `service_role_key`
⚠️ Valider les données côté serveur également
⚠️ Limiter la taille des uploads
⚠️ Monitorer l'utilisation pour éviter les abus

Cette architecture est conçue pour être scalable, sécurisée et facile à maintenir ! 🚀
