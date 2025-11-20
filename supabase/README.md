# Configuration Supabase pour Elite Visuals

## 🚀 Installation rapide

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre **URL du projet** et votre **clé anon/public**

### 2. Configurer les variables d'environnement

Vos clés API sont déjà configurées dans `.env.local`. Vérifiez que vous avez :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
```

### 3. Exécuter le schéma SQL

1. Ouvrez le **SQL Editor** dans votre dashboard Supabase
2. Copiez le contenu de `supabase/schema.sql`
3. Exécutez le script SQL

Cela créera :
- ✅ Toutes les tables nécessaires
- ✅ Les politiques RLS (Row Level Security)
- ✅ Les triggers et fonctions
- ✅ Le bucket de storage pour les médias
- ✅ Les indexes pour optimiser les performances

### 4. Configurer l'authentification

Dans votre dashboard Supabase :

1. **Authentication > Providers**
   - Activez **Email** (déjà activé par défaut)
   - Optionnel : Activez **Google**, **GitHub**, etc.

2. **Authentication > Email Templates**
   - Personnalisez les emails de confirmation si nécessaire

3. **Authentication > URL Configuration**
   - Site URL : `http://localhost:3000` (développement)
   - Redirect URLs : `http://localhost:3000/**`

### 5. Configurer le Storage

Le bucket `media` est créé automatiquement par le script SQL avec :
- ✅ Accès public en lecture
- ✅ Upload restreint aux utilisateurs authentifiés
- ✅ Modification/suppression par le propriétaire uniquement

## 📊 Structure de la base de données

### Tables principales

#### `profiles`
Profils utilisateurs (étend `auth.users`)
- `id` : UUID (référence auth.users)
- `email` : Email unique
- `full_name` : Nom complet
- `avatar_url` : URL de l'avatar

#### `boards`
Tableaux de travail collaboratifs
- `id` : UUID
- `title` : Titre du board
- `owner_id` : Propriétaire
- `is_public` : Visibilité publique
- `thumbnail_url` : Miniature

#### `board_items`
Éléments sur les boards (images, textes, vidéos, etc.)
- `id` : UUID
- `board_id` : Référence au board
- `type` : Type de contenu (text, image, video, audio, pdf, url, ai-generated)
- `x`, `y` : Position
- `width`, `height` : Dimensions
- `content` : Contenu JSON
- `z_index` : Ordre d'affichage

#### `tasks`
Tâches et gestion de projet
- `id` : UUID
- `board_id` : Référence au board
- `title` : Titre de la tâche
- `status` : backlog, in-progress, review, done
- `assigned_to` : openai, claude, luma, human
- `priority` : low, medium, high, urgent

#### `comments`
Commentaires et annotations
- `id` : UUID
- `board_id` : Référence au board
- `item_id` : Référence à un item (optionnel)
- `user_id` : Auteur
- `content` : Contenu du commentaire
- `x`, `y` : Position (pour annotations visuelles)

#### `board_collaborators`
Collaborateurs sur les boards
- `board_id` : Référence au board
- `user_id` : Utilisateur
- `role` : owner, editor, viewer

#### `ai_generations`
Historique des générations IA
- `id` : UUID
- `board_id` : Référence au board
- `ai_provider` : openai, claude, luma, ollama
- `prompt` : Prompt utilisé
- `result` : Résultat JSON
- `status` : pending, processing, completed, failed

## 🔒 Sécurité (RLS)

Toutes les tables ont des politiques RLS activées :

### Boards
- ✅ Les boards publics sont visibles par tous
- ✅ Les propriétaires peuvent tout faire sur leurs boards
- ✅ Les collaborateurs ont accès selon leur rôle

### Board Items
- ✅ Visibles si le board est accessible
- ✅ Modification par owner et editors uniquement

### Tasks
- ✅ Visibles si le board est accessible
- ✅ Gestion par owner et editors

### Comments
- ✅ Visibles si le board est accessible
- ✅ Création par utilisateurs authentifiés
- ✅ Modification/suppression par l'auteur uniquement

## 🔄 Temps réel

Supabase Realtime est activé sur toutes les tables. Vous pouvez vous abonner aux changements :

```typescript
// Exemple dans votre code
supabase
  .channel('board:123')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'board_items',
    filter: 'board_id=eq.123'
  }, (payload) => {
    console.log('Change received!', payload)
  })
  .subscribe()
```

## 📦 Storage

### Bucket `media`
- **Path structure** : `{user_id}/{board_id}/{filename}`
- **Max file size** : 50MB (configurable)
- **Types acceptés** : images, vidéos, audio, PDF

### Upload d'un fichier

```typescript
const { data, error } = await supabase.storage
  .from('media')
  .upload(`${userId}/${boardId}/${file.name}`, file)
```

## 🧪 Test de la configuration

Après avoir exécuté le schéma SQL, testez :

1. **Authentification**
   ```bash
   npm run dev
   # Créez un compte utilisateur
   ```

2. **Création de données**
   ```typescript
   // Créer un board
   const { data } = await supabase
     .from('boards')
     .insert({ title: 'Test Board', owner_id: user.id })
     .select()
   ```

3. **Upload de fichier**
   ```typescript
   // Upload une image
   const file = new File(['test'], 'test.png', { type: 'image/png' })
   await uploadFile(file, `test/${Date.now()}.png`)
   ```

## 🔧 Maintenance

### Backup
Supabase fait des backups automatiques. Vous pouvez aussi :
- Exporter les données via le dashboard
- Utiliser `pg_dump` pour des backups manuels

### Monitoring
- Dashboard Supabase : Logs, métriques, erreurs
- Table Editor : Visualiser et modifier les données
- SQL Editor : Requêtes personnalisées

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)
- [Storage](https://supabase.com/docs/guides/storage)

## 🆘 Problèmes courants

### Erreur RLS
Si vous avez des erreurs de permissions :
1. Vérifiez que l'utilisateur est authentifié
2. Vérifiez les politiques RLS dans le dashboard
3. Utilisez le SQL Editor pour tester les requêtes

### Erreur Storage
Si l'upload échoue :
1. Vérifiez que le bucket `media` existe
2. Vérifiez les politiques de storage
3. Vérifiez la taille du fichier

### Erreur Realtime
Si les updates en temps réel ne fonctionnent pas :
1. Vérifiez que Realtime est activé sur la table
2. Vérifiez votre abonnement au channel
3. Vérifiez les logs dans le dashboard
