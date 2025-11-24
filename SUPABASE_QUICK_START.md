# 🚀 Guide de démarrage rapide Supabase

## 📋 Prérequis

L'application fonctionne maintenant **sans Supabase configuré**, mais pour utiliser les fonctionnalités d'authentification et de base de données, vous devez configurer Supabase.

## ⚡ Configuration rapide (5 minutes)

### 1. Créer un projet Supabase

1. Allez sur https://supabase.com
2. Cliquez sur **Start your project**
3. Créez un compte ou connectez-vous
4. Cliquez sur **New Project**
5. Remplissez les informations:
   - **Name**: elite-visuals (ou votre nom)
   - **Database Password**: Choisissez un mot de passe fort
   - **Region**: Choisissez la région la plus proche
6. Cliquez sur **Create new project**
7. Attendez ~2 minutes que le projet soit créé

### 2. Obtenir vos clés API

1. Dans votre projet Supabase, allez dans **Settings** (⚙️)
2. Cliquez sur **API** dans le menu latéral
3. Vous verrez deux informations importantes:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (une longue chaîne de caractères)

### 3. Configurer votre fichier `.env.local`

1. Ouvrez le fichier `.env.local` à la racine du projet
2. Remplacez les valeurs placeholder:

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon-ici
```

3. Sauvegardez le fichier

### 4. Redémarrer le serveur

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis redémarrez
npm run dev
```

## ✅ Vérification

L'application devrait maintenant:
- ✅ Démarrer sans erreur
- ✅ Se connecter à Supabase
- ✅ Permettre l'authentification (si configurée)

## 🗄️ Configuration de la base de données (optionnel)

Si vous voulez utiliser les fonctionnalités complètes, vous devez créer les tables:

1. Dans Supabase, allez dans **SQL Editor**
2. Copiez le contenu de `supabase/migrations/` (si disponible)
3. Exécutez les migrations SQL

Ou consultez `SUPABASE_SETUP.md` pour un guide complet.

## 🔒 Sécurité

- ⚠️ **Ne commitez JAMAIS** le fichier `.env.local` dans Git
- ✅ Le fichier est déjà dans `.gitignore`
- ✅ Les clés `NEXT_PUBLIC_*` sont exposées côté client (c'est normal)
- ⚠️ N'utilisez jamais la clé `service_role` côté client

## 🆘 Problèmes courants

### Erreur: "Invalid supabaseUrl"
- ✅ **Résolu!** L'application fonctionne maintenant sans Supabase
- Pour activer Supabase, suivez les étapes ci-dessus

### Erreur: "Failed to fetch"
- Vérifiez que l'URL Supabase est correcte
- Vérifiez votre connexion internet
- Vérifiez que le projet Supabase est actif

### Erreur: "Invalid API key"
- Vérifiez que vous avez copié la clé `anon public` et non la clé `service_role`
- Vérifiez qu'il n'y a pas d'espaces avant/après la clé

## 📚 Documentation complète

Pour une configuration avancée, consultez:
- `SUPABASE_SETUP.md` - Guide complet
- `GITHUB_SECRETS_SETUP.md` - Configuration CI/CD
- https://supabase.com/docs - Documentation officielle

## 🎯 Mode développement sans Supabase

L'application fonctionne maintenant en mode dégradé sans Supabase:
- ✅ Pages publiques accessibles
- ✅ Interface utilisateur fonctionnelle
- ⚠️ Authentification désactivée
- ⚠️ Fonctionnalités base de données désactivées

C'est parfait pour le développement frontend!
