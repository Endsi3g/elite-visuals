# 🔧 Guide de Configuration Supabase

## Problème: "Failed to fetch" lors de l'inscription/connexion

Si vous voyez l'erreur **"Failed to fetch"** lors de la tentative d'inscription ou de connexion, cela signifie que Supabase n'est pas configuré correctement.

## Solution Rapide

### Étape 1: Créer un projet Supabase (GRATUIT)

1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur **"Start your project"**
3. Créez un compte gratuit (avec GitHub, Google, ou email)
4. Créez un nouveau projet:
   - **Nom du projet**: `elite-visuals` (ou votre choix)
   - **Mot de passe de la base de données**: Choisissez un mot de passe fort
   - **Région**: Choisissez la plus proche de vous
   - **Plan**: Free (gratuit) - 500 MB de stockage, parfait pour commencer

### Étape 2: Récupérer vos identifiants

1. Une fois le projet créé, allez dans **Settings** (⚙️) > **API**
2. Vous verrez deux informations importantes:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (une très longue clé)

### Étape 3: Configurer votre fichier .env.local

1. Ouvrez le fichier `.env.local` à la racine du projet
2. Remplacez les valeurs par vos vraies clés:

   ```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjE2MTYxNiwiZXhwIjoxOTMxNzM3NjE2fQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. **Sauvegardez le fichier**

### Étape 4: Configurer la base de données

Vous devez créer les tables nécessaires dans Supabase:

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Copiez et exécutez le contenu du fichier `supabase/schema.sql` (si disponible)
3. Ou créez manuellement les tables suivantes:
   - `profiles` - Profils utilisateurs
   - `boards` - Boards/tableaux
   - `board_items` - Éléments sur les boards
   - `tasks` - Tâches
   - `comments` - Commentaires

### Étape 5: Redémarrer le serveur

```powershell
# Arrêter le serveur (Ctrl+C dans le terminal)
# Puis relancer:
npm run dev
```

## Vérification

1. Ouvrez votre navigateur sur [http://localhost:3000/login](http://localhost:3000/login)
2. L'alerte rouge "Configuration requise" devrait avoir disparu
3. Essayez de créer un compte - ça devrait fonctionner!

## Dépannage

### L'erreur persiste après configuration

1. **Vérifiez que vous avez bien sauvegardé `.env.local`**
2. **Redémarrez complètement le serveur** (Ctrl+C puis `npm run dev`)
3. **Videz le cache du navigateur** (Ctrl+Shift+Delete)
4. **Vérifiez que les clés sont correctes** (pas d'espaces, copie complète)

### Erreur "Invalid API key"

- Vérifiez que vous avez copié la clé **anon public** (pas la clé service_role)
- La clé doit commencer par `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

### Erreur "Database error"

- Vous devez créer les tables dans Supabase (voir Étape 4)
- Vérifiez que les tables existent dans **Table Editor**

## Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Tutoriel Supabase Auth](https://supabase.com/docs/guides/auth)
- [Schéma de la base de données](./supabase/schema.sql)

## Besoin d'aide?

Si vous rencontrez toujours des problèmes:
1. Vérifiez les logs dans la console du navigateur (F12)
2. Vérifiez les logs du serveur dans votre terminal
3. Consultez la documentation Supabase
