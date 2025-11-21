# 🔧 Correction Erreur Supabase - "Failed to fetch"

**Date:** 2025-11-21  
**Erreur:** `TypeError: Failed to fetch`

---

## ❌ Problème

### Erreur Console
```
Failed to fetch
at SupabaseAuthClient.signUp
```

**Cause:** L'URL Supabase dans `.env.local` est invalide ou le projet Supabase n'existe pas/n'est pas accessible.

---

## ✅ Solutions

### Solution 1: Vérifier la Configuration Supabase

#### 1. Créer un Projet Supabase (si nécessaire)

1. **Aller sur** https://app.supabase.com
2. **Créer un compte** ou se connecter
3. **Créer un nouveau projet**
   - Nom: `elite-visuals`
   - Mot de passe de base de données: (choisir un mot de passe fort)
   - Région: Choisir la plus proche

#### 2. Récupérer les Identifiants

1. **Dans le dashboard Supabase**, aller dans:
   ```
   Settings > API
   ```

2. **Copier:**
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### 3. Mettre à Jour `.env.local`

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon-publique-ici
```

**⚠️ Important:**
- Remplacer `votre-projet-id` par votre vrai ID de projet
- Remplacer `votre-cle-anon-publique-ici` par votre vraie clé
- **NE PAS** commiter ce fichier dans Git

---

### Solution 2: Mode Développement Sans Supabase

Si vous voulez développer sans Supabase pour l'instant:

#### Option A: Mock Auth (Recommandé pour dev)

Créer `lib/supabase/mock-client.ts`:

```typescript
export const auth = {
  signIn: async (email: string, password: string) => {
    console.log('Mock signIn:', email)
    return { user: { email }, session: { access_token: 'mock' } }
  },
  signUp: async (email: string, password: string) => {
    console.log('Mock signUp:', email)
    return { user: { email }, session: { access_token: 'mock' } }
  },
  signOut: async () => {
    console.log('Mock signOut')
  },
  getUser: async () => {
    return { user: null }
  }
}

export const isSupabaseConfigured = false
```

Puis dans `app/login/page.tsx`, importer depuis le mock:

```typescript
// import { auth, isSupabaseConfigured } from "@/lib/supabase/client"
import { auth, isSupabaseConfigured } from "@/lib/supabase/mock-client"
```

#### Option B: Désactiver l'Authentification

Rediriger directement vers le dashboard sans authentification:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  // Skip auth for development
  router.push("/dashboard")
}
```

---

## 🔍 Diagnostic

### Vérifier la Configuration Actuelle

```powershell
# Dans PowerShell, vérifier les variables d'environnement
Get-Content .env.local | Select-String "SUPABASE"
```

### Tester la Connexion Supabase

```powershell
# Tester si l'URL est accessible
curl https://votre-projet-id.supabase.co/rest/v1/
```

**Réponse attendue:**
- ✅ Status 200 ou 401 (normal, pas authentifié)
- ❌ Timeout ou erreur DNS → URL invalide

---

## ✅ Correction Appliquée

### Amélioration de la Gestion d'Erreur

**Fichier:** `app/login/page.tsx`

**Changement:**
```typescript
catch (error: any) {
  console.error('Login error:', error)
  
  let errorMessage = error.message || "Une erreur est survenue"
  
  // Gestion spécifique de l'erreur "Failed to fetch"
  if (error.message === "Failed to fetch" || error.name === "TypeError") {
    errorMessage = "Impossible de se connecter au serveur d'authentification. Vérifiez votre connexion internet ou la configuration Supabase."
  }
  
  toast({
    title: "Erreur de connexion",
    description: errorMessage,
    variant: "destructive",
  })
}
```

**Avantages:**
- ✅ Message d'erreur plus explicite
- ✅ Log de l'erreur dans la console
- ✅ Guidance pour l'utilisateur

---

## 📋 Checklist de Configuration

### Avant de Démarrer

- [ ] Compte Supabase créé
- [ ] Projet Supabase créé
- [ ] URL du projet récupérée
- [ ] Clé anon récupérée
- [ ] `.env.local` mis à jour
- [ ] Serveur redémarré

### Vérification

```powershell
# 1. Vérifier que .env.local existe
Test-Path .env.local

# 2. Vérifier le contenu (sans afficher les clés)
Get-Content .env.local | Select-String "NEXT_PUBLIC_SUPABASE_URL"

# 3. Redémarrer le serveur
npm run dev
```

---

## 🗄️ Configuration de la Base de Données

### Tables Nécessaires

Une fois Supabase configuré, créer les tables:

#### 1. Table `boards`

```sql
create table boards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table boards enable row level security;

-- Policy: Users can only see their own boards
create policy "Users can view own boards"
  on boards for select
  using (auth.uid() = user_id);

-- Policy: Users can create boards
create policy "Users can create boards"
  on boards for insert
  with check (auth.uid() = user_id);

-- Policy: Users can update own boards
create policy "Users can update own boards"
  on boards for update
  using (auth.uid() = user_id);

-- Policy: Users can delete own boards
create policy "Users can delete own boards"
  on boards for delete
  using (auth.uid() = user_id);
```

#### 2. Table `board_items`

```sql
create table board_items (
  id uuid default gen_random_uuid() primary key,
  board_id uuid references boards on delete cascade not null,
  type text not null,
  title text,
  content text,
  x numeric not null,
  y numeric not null,
  width numeric default 300,
  height numeric default 200,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table board_items enable row level security;

-- Policy: Users can view items from their boards
create policy "Users can view items from own boards"
  on board_items for select
  using (
    exists (
      select 1 from boards
      where boards.id = board_items.board_id
      and boards.user_id = auth.uid()
    )
  );
```

---

## 🚀 Démarrage Rapide

### Configuration Minimale

```bash
# 1. Copier l'exemple
cp .env.example .env.local

# 2. Éditer .env.local
# Remplacer les valeurs par vos vraies clés Supabase

# 3. Redémarrer
npm run dev
```

### Test de Connexion

1. Aller sur http://localhost:3000/login
2. Créer un compte test
3. Vérifier dans Supabase Dashboard > Authentication > Users

---

## 📚 Ressources

### Documentation
- [Supabase Quickstart](https://supabase.com/docs/guides/getting-started)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

### Support
- [Supabase Discord](https://discord.supabase.com/)
- [Supabase GitHub](https://github.com/supabase/supabase)

---

## 💡 Conseils

### Sécurité

1. **Ne jamais commiter `.env.local`**
   ```gitignore
   # .gitignore
   .env.local
   .env*.local
   ```

2. **Utiliser des clés différentes** pour dev/prod

3. **Activer RLS** (Row Level Security) sur toutes les tables

### Performance

1. **Activer le cache** Supabase
2. **Utiliser des index** sur les colonnes fréquemment requêtées
3. **Limiter les requêtes** avec pagination

---

**Dernière mise à jour:** 2025-11-21 15:13  
**Statut:** ✅ Gestion d'erreur améliorée  
**Action requise:** Configurer Supabase avec de vraies clés
