# ✅ Checklist de configuration Supabase

Utilisez cette checklist pour vous assurer que tout est correctement configuré.

## 📋 Configuration initiale

### 1. Projet Supabase

- [ ] Compte Supabase créé sur [supabase.com](https://supabase.com)
- [ ] Nouveau projet créé
- [ ] URL du projet notée
- [ ] Clé anon/public notée
- [ ] Clé service_role notée (à garder secrète !)

### 2. Variables d'environnement

- [ ] Fichier `.env.local` existe
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configuré
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configuré
- [ ] Fichier `.env.local` dans `.gitignore`

### 3. Base de données

- [ ] SQL Editor ouvert dans le dashboard Supabase
- [ ] Contenu de `supabase/schema.sql` copié
- [ ] Script SQL exécuté avec succès
- [ ] Message "Success. No rows returned" affiché

### 4. Vérification des tables

Dans **Table Editor**, vérifier que ces tables existent :

- [ ] `profiles`
- [ ] `boards`
- [ ] `board_items`
- [ ] `tasks`
- [ ] `comments`
- [ ] `board_collaborators`
- [ ] `ai_generations`

### 5. Storage

- [ ] Bucket `media` créé
- [ ] Bucket `media` est public
- [ ] Politiques de storage configurées

### 6. Authentication

- [ ] Email provider activé (Authentication > Providers)
- [ ] Site URL configuré : `http://localhost:3000`
- [ ] Redirect URLs configurés : `http://localhost:3000/**`
- [ ] (Optionnel) OAuth providers configurés (Google, GitHub, etc.)

### 7. Row Level Security (RLS)

Dans **Authentication > Policies**, vérifier que les politiques existent pour :

- [ ] `profiles` (2 politiques)
- [ ] `boards` (4 politiques)
- [ ] `board_items` (4 politiques)
- [ ] `tasks` (2 politiques)
- [ ] `comments` (4 politiques)
- [ ] `board_collaborators` (2 politiques)
- [ ] `ai_generations` (2 politiques)

### 8. Realtime

- [ ] Database > Replication : Tables activées pour Realtime
  - [ ] `board_items`
  - [ ] `tasks`
  - [ ] `comments`

## 🧪 Tests

### Test 1 : Connexion à la base de données

```typescript
import { supabase } from '@/lib/supabase'

const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .limit(1)

console.log('Connexion:', data ? '✅ OK' : '❌ Erreur', error)
```

- [ ] Test exécuté
- [ ] Pas d'erreur de connexion

### Test 2 : Authentification

```typescript
import { auth } from '@/lib/supabase'

// Inscription
const { data, error } = await auth.signUp(
  'test@example.com',
  'password123'
)

console.log('Inscription:', data ? '✅ OK' : '❌ Erreur', error)
```

- [ ] Test exécuté
- [ ] Utilisateur créé
- [ ] Email de confirmation reçu (si activé)
- [ ] Profil créé automatiquement dans `profiles`

### Test 3 : Création d'un board

```typescript
import { boards } from '@/lib/supabase'

const board = await boards.create('Test Board', 'Description test')
console.log('Board créé:', board)
```

- [ ] Test exécuté
- [ ] Board créé avec succès
- [ ] Board visible dans Table Editor

### Test 4 : Upload de fichier

```typescript
import { storage } from '@/lib/supabase'

const file = new File(['test'], 'test.txt', { type: 'text/plain' })
const result = await storage.uploadFile(file, 'test/test.txt')
console.log('Upload:', result)
```

- [ ] Test exécuté
- [ ] Fichier uploadé
- [ ] URL publique retournée
- [ ] Fichier visible dans Storage

### Test 5 : Temps réel

```typescript
import { realtime } from '@/lib/supabase'

const channel = realtime.subscribeToBoardItems('board-id', (payload) => {
  console.log('Update reçu:', payload)
})
```

- [ ] Test exécuté
- [ ] Channel souscrit
- [ ] Updates reçus en temps réel

## 🎨 Intégration dans l'application

### Composants créés

- [ ] Page de login/signup
- [ ] Page de liste des boards
- [ ] Page de board individuel avec canvas
- [ ] Composant de tâches (Kanban)
- [ ] Composant de commentaires
- [ ] Composant d'upload de fichiers

### Hooks utilisés

- [ ] `useAuth()` pour l'authentification
- [ ] `useMyBoards()` pour la liste des boards
- [ ] `useBoardItems()` pour les items avec temps réel
- [ ] `useTasks()` pour les tâches
- [ ] `useComments()` pour les commentaires
- [ ] `useFileUpload()` pour les uploads

### Fonctionnalités implémentées

- [ ] Authentification (login/signup/logout)
- [ ] Création de boards
- [ ] Ajout d'items sur le board
- [ ] Déplacement d'items (drag & drop)
- [ ] Création de tâches
- [ ] Ajout de commentaires
- [ ] Upload d'images/fichiers
- [ ] Collaboration en temps réel
- [ ] Système de permissions (owner/editor/viewer)

## 🔒 Sécurité

- [ ] Clés API dans `.env.local` uniquement
- [ ] `.env.local` dans `.gitignore`
- [ ] Service role key jamais exposée côté client
- [ ] RLS activé sur toutes les tables
- [ ] Politiques de sécurité testées
- [ ] Validation des données côté serveur

## 📊 Monitoring

- [ ] Dashboard Supabase consulté régulièrement
- [ ] Logs vérifiés (Database > Logs)
- [ ] Métriques consultées (Project Settings > Usage)
- [ ] Alertes configurées (si nécessaire)

## 🚀 Production

### Avant le déploiement

- [ ] Variables d'environnement configurées sur la plateforme de déploiement
- [ ] URL de production ajoutée dans Authentication > URL Configuration
- [ ] Redirect URLs de production configurées
- [ ] Limites de rate limiting vérifiées
- [ ] Backup configuré (si plan payant)

### Après le déploiement

- [ ] Tests en production effectués
- [ ] Authentification fonctionne
- [ ] Temps réel fonctionne
- [ ] Upload de fichiers fonctionne
- [ ] Performances vérifiées

## 📚 Documentation

- [ ] `supabase/README.md` lu
- [ ] `supabase/QUICKSTART.md` lu
- [ ] `supabase/EXAMPLES.md` consulté
- [ ] `supabase/ARCHITECTURE.md` compris
- [ ] `SUPABASE_SETUP.md` à la racine consulté

## 🆘 Dépannage

### Problèmes courants

#### ❌ "relation does not exist"
- [ ] Vérifier que le schéma SQL a été exécuté
- [ ] Vérifier dans Table Editor que les tables existent

#### ❌ "permission denied for table"
- [ ] Vérifier que l'utilisateur est authentifié
- [ ] Vérifier les politiques RLS dans le dashboard
- [ ] Tester avec un utilisateur qui a les bonnes permissions

#### ❌ "Invalid API key"
- [ ] Vérifier que `NEXT_PUBLIC_SUPABASE_URL` est correct
- [ ] Vérifier que `NEXT_PUBLIC_SUPABASE_ANON_KEY` est correct
- [ ] Redémarrer le serveur de développement

#### ❌ Upload échoue
- [ ] Vérifier que le bucket `media` existe
- [ ] Vérifier les politiques de storage
- [ ] Vérifier la taille du fichier (limite du plan)

#### ❌ Temps réel ne fonctionne pas
- [ ] Vérifier que Realtime est activé sur les tables
- [ ] Vérifier la connexion websocket dans les DevTools
- [ ] Vérifier les logs Supabase

## ✨ Fonctionnalités avancées (optionnel)

- [ ] Edge Functions configurées
- [ ] Webhooks configurés
- [ ] Backups automatiques activés
- [ ] CDN configuré pour le storage
- [ ] Monitoring externe (Sentry, etc.)
- [ ] Analytics configurés

## 🎉 Statut final

Une fois toutes les cases cochées :

- [ ] ✅ Configuration Supabase complète et fonctionnelle
- [ ] ✅ Application Elite Visuals prête pour le développement
- [ ] ✅ Collaboration en temps réel opérationnelle
- [ ] ✅ Prêt pour la production

---

**Date de configuration** : _______________

**Configuré par** : _______________

**Notes** :
```
[Espace pour vos notes personnelles]
```
