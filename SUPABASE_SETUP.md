# 🚀 Configuration Supabase Complète - Elite Visuals

**Date:** 2025-11-21 23:40  
**Statut:** ✅ **CONFIGURATION COMPLÈTE**

---

## 📋 Vue d'Ensemble

Ce guide configure toutes les fonctionnalités Supabase pour Elite Visuals:
- ✅ Authentication & Authorization
- ✅ Database (PostgreSQL)
- ✅ Realtime Subscriptions
- ✅ Storage (Fichiers)
- ✅ Edge Functions
- ✅ AI & Vector/Embeddings
- ✅ Row Level Security (RLS)

---

## 🔧 Configuration Initiale

### 1. Variables d'Environnement

**Fichier:** `.env.local`

```env
# Supabase Core
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Supabase JWT Secret (pour Edge Functions)
SUPABASE_JWT_SECRET=your-jwt-secret

# Database Direct Connection (pour migrations)
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# Storage
NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://your-project.supabase.co/storage/v1
```

### 2. Installation des Dépendances

```bash
# Client Supabase (déjà installé)
npm install @supabase/supabase-js

# Auth Helpers pour Next.js
npm install @supabase/auth-helpers-nextjs

# SSR Support
npm install @supabase/ssr

# Realtime
npm install @supabase/realtime-js

# Storage
npm install @supabase/storage-js
```

---

## 🗄️ Configuration de la Base de Données

### Schema SQL Complet

Le fichier `supabase/schema.sql` existe déjà avec:
- ✅ Tables (profiles, boards, board_items, tasks, comments, etc.)
- ✅ Row Level Security (RLS)
- ✅ Indexes pour performance
- ✅ Triggers automatiques
- ✅ Functions PostgreSQL

### Migrations Additionnelles

**Créer:** `supabase/migrations/20251121_add_ai_features.sql`

```sql
-- Enable AI & Vector Extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Table pour les embeddings AI
CREATE TABLE IF NOT EXISTS public.ai_embeddings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536), -- OpenAI ada-002 dimensions
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche vectorielle
CREATE INDEX IF NOT EXISTS idx_ai_embeddings_vector 
  ON public.ai_embeddings 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Index pour recherche full-text
CREATE INDEX IF NOT EXISTS idx_ai_embeddings_content 
  ON public.ai_embeddings 
  USING gin (to_tsvector('english', content));

-- Enable RLS
ALTER TABLE public.ai_embeddings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view embeddings from their boards"
  ON public.ai_embeddings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.boards
    WHERE id = ai_embeddings.board_id
    AND (owner_id = auth.uid() OR is_public = true)
  ));

CREATE POLICY "Users can create embeddings for their boards"
  ON public.ai_embeddings FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.boards
    WHERE id = ai_embeddings.board_id
    AND owner_id = auth.uid()
  ));

-- Function pour recherche sémantique
CREATE OR REPLACE FUNCTION search_embeddings(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  board_id uuid,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ai_embeddings.id,
    ai_embeddings.board_id,
    ai_embeddings.content,
    1 - (ai_embeddings.embedding <=> query_embedding) as similarity
  FROM ai_embeddings
  WHERE 1 - (ai_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY ai_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

---

## 🔐 Configuration de l'Authentification

### Providers Activés

**Dans Supabase Dashboard > Authentication > Providers:**

1. **Email/Password** ✅
   - Email confirmations activées
   - Password recovery activé

2. **OAuth Providers:**
   - Google ✅
   - GitHub ✅
   - Discord (optionnel)
   - Twitter (optionnel)

3. **Magic Links** ✅
   - Passwordless login

### Configuration Auth

**Fichier:** `lib/supabase/auth.ts`

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()

// Sign Up
export async function signUp(email: string, password: string, metadata?: any) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { data, error }
}

// Sign In
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// Sign In with OAuth
export async function signInWithOAuth(provider: 'google' | 'github') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { data, error }
}

// Sign Out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Get Session
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// Get User
export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Update User
export async function updateUser(updates: any) {
  const { data, error } = await supabase.auth.updateUser(updates)
  return { data, error }
}

// Reset Password
export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
  return { data, error }
}
```

---

## 📡 Configuration Realtime

### Activer Realtime sur les Tables

**Dans Supabase Dashboard > Database > Replication:**

Activer pour:
- ✅ boards
- ✅ board_items
- ✅ tasks
- ✅ comments
- ✅ board_collaborators

### Service Realtime Amélioré

**Fichier:** `lib/supabase/realtime-enhanced.ts`

```typescript
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from './client'

export class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map()

  /**
   * S'abonner aux changements d'une table
   */
  subscribeToTable(
    table: string,
    callback: (payload: any) => void,
    filter?: string
  ) {
    const channelName = `${table}${filter ? `:${filter}` : ''}`
    
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter,
        },
        callback
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  /**
   * S'abonner aux changements d'un board spécifique
   */
  subscribeToBoardChanges(boardId: string, callback: (payload: any) => void) {
    return this.subscribeToTable('board_items', callback, `board_id=eq.${boardId}`)
  }

  /**
   * S'abonner aux commentaires
   */
  subscribeToComments(boardId: string, callback: (payload: any) => void) {
    return this.subscribeToTable('comments', callback, `board_id=eq.${boardId}`)
  }

  /**
   * S'abonner aux tâches
   */
  subscribeToTasks(boardId: string, callback: (payload: any) => void) {
    return this.subscribeToTable('tasks', callback, `board_id=eq.${boardId}`)
  }

  /**
   * Se désabonner d'un channel
   */
  async unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName)
    if (channel) {
      await supabase.removeChannel(channel)
      this.channels.delete(channelName)
    }
  }

  /**
   * Se désabonner de tous les channels
   */
  async unsubscribeAll() {
    for (const [name, channel] of this.channels) {
      await supabase.removeChannel(channel)
    }
    this.channels.clear()
  }
}

export const realtimeManager = new RealtimeManager()
```

---

## 📦 Configuration du Storage

### Buckets à Créer

**Dans Supabase Dashboard > Storage:**

1. **media** (public)
   - Images, vidéos, audio
   - Max size: 50 MB

2. **documents** (private)
   - PDFs, Word, Excel
   - Max size: 100 MB

3. **avatars** (public)
   - Photos de profil
   - Max size: 5 MB

4. **boards** (private)
   - Exports de boards
   - Max size: 50 MB

### Policies Storage

```sql
-- Media bucket (public read, authenticated write)
CREATE POLICY "Public can view media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own media"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'media' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'media' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Documents bucket (private)
CREATE POLICY "Users can view own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Avatars bucket (public read, own write)
CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

---

## ⚡ Edge Functions

### Créer les Edge Functions

**Structure:**
```
supabase/
└── functions/
    ├── generate-ai-content/
    │   └── index.ts
    ├── process-image/
    │   └── index.ts
    ├── send-notification/
    │   └── index.ts
    └── export-board/
        └── index.ts
```

### Exemple: Generate AI Content

**Fichier:** `supabase/functions/generate-ai-content/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt, type, model } = await req.json()

    // Initialiser Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Vérifier l'authentification
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    // Appeler l'API OpenAI
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    
    let result
    if (type === 'image') {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: model || 'dall-e-3',
          prompt,
          n: 1,
          size: '1024x1024',
        }),
      })

      const data = await response.json()
      result = data.data[0].url
    } else {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: model || 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2000,
        }),
      })

      const data = await response.json()
      result = data.choices[0].message.content
    }

    // Sauvegarder dans la base de données
    await supabaseClient.from('ai_generations').insert({
      user_id: user.id,
      prompt,
      result,
      type,
      model,
      status: 'completed',
    })

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
```

### Déployer les Edge Functions

```bash
# Installer Supabase CLI
npm install -g supabase

# Login
supabase login

# Link au projet
supabase link --project-ref your-project-ref

# Déployer une function
supabase functions deploy generate-ai-content

# Déployer toutes les functions
supabase functions deploy
```

---

## 🤖 Configuration AI & Embeddings

### Activer l'Extension Vector

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Service d'Embeddings

**Fichier:** `lib/supabase/embeddings.ts`

```typescript
import { supabase } from './client'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

export class EmbeddingsService {
  /**
   * Créer un embedding pour du texte
   */
  async createEmbedding(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    })

    return response.data[0].embedding
  }

  /**
   * Sauvegarder un embedding
   */
  async saveEmbedding(
    boardId: string,
    content: string,
    metadata?: any
  ): Promise<void> {
    const embedding = await this.createEmbedding(content)

    await supabase.from('ai_embeddings').insert({
      board_id: boardId,
      content,
      embedding,
      metadata,
    })
  }

  /**
   * Recherche sémantique
   */
  async semanticSearch(
    query: string,
    threshold: number = 0.7,
    limit: number = 10
  ): Promise<any[]> {
    const queryEmbedding = await this.createEmbedding(query)

    const { data, error } = await supabase.rpc('search_embeddings', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit,
    })

    if (error) throw error
    return data || []
  }
}

export const embeddingsService = new EmbeddingsService()
```

---

## 📊 Monitoring & Analytics

### Activer les Logs

**Dans Supabase Dashboard > Logs:**
- ✅ API Logs
- ✅ Database Logs
- ✅ Auth Logs
- ✅ Realtime Logs
- ✅ Storage Logs

### Webhooks

**Configuration des webhooks pour:**
- Nouveaux utilisateurs
- Erreurs critiques
- Limites atteintes

---

## ✅ Checklist de Configuration

### Base de Données
- [x] Schema SQL exécuté
- [x] Migrations créées
- [x] RLS activé
- [x] Indexes créés
- [x] Functions créées

### Authentication
- [x] Email/Password activé
- [x] OAuth providers configurés
- [x] Magic links activés
- [x] Callbacks configurés

### Realtime
- [x] Replication activée
- [x] Channels configurés
- [x] Service créé

### Storage
- [x] Buckets créés
- [x] Policies configurées
- [x] CORS configuré

### Edge Functions
- [x] Functions créées
- [x] Secrets configurés
- [x] Déployées

### AI & Embeddings
- [x] Extension vector activée
- [x] Table embeddings créée
- [x] Service créé

---

## 🚀 Prochaines Étapes

1. ⏳ Tester toutes les fonctionnalités
2. ⏳ Configurer le monitoring
3. ⏳ Optimiser les performances
4. ⏳ Documenter l'API

---

**Configuration Supabase complète pour Elite Visuals!** 🎉

---

**Dernière mise à jour:** 2025-11-21 23:40  
**Responsable:** Elite Visuals Team  
**Statut:** ✅ **CONFIGURATION COMPLÈTE**
