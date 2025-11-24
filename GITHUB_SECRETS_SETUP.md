# Configuration des Secrets GitHub

Pour que les workflows CI/CD fonctionnent correctement, vous devez configurer les secrets et variables suivants dans votre repository GitHub.

## 📍 Accès aux paramètres

1. Allez sur votre repository: https://github.com/Endsi3g/elite-visuals
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu latéral, cliquez sur **Secrets and variables** > **Actions**

## 🔐 Secrets requis

### Pour Supabase (Build & Deploy)
Ajoutez ces secrets dans l'onglet **Secrets**:

- `NEXT_PUBLIC_SUPABASE_URL`
  - Votre URL Supabase (ex: https://xxxxx.supabase.co)
  
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Votre clé anonyme Supabase

### Pour les API AI (Deploy uniquement)
- `ANTHROPIC_API_KEY` - Clé API Claude/Anthropic
- `HUGGINGFACE_API_KEY` - Clé API HuggingFace
- `LUMA_API_KEY` - Clé API Luma AI

### Pour Vercel (Deploy uniquement)
- `VERCEL_TOKEN` - Token d'accès Vercel
- `VERCEL_ORG_ID` - ID de votre organisation Vercel
- `VERCEL_PROJECT_ID` - ID du projet Vercel

### Pour Lighthouse CI (optionnel)
- `LHCI_GITHUB_APP_TOKEN` - Token pour Lighthouse CI

## 📊 Variables (alternative aux secrets pour les URLs publiques)

Dans l'onglet **Variables**, vous pouvez aussi ajouter:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Les variables sont utilisées dans le workflow `ci.yml` avec `${{ vars.XXX }}` au lieu de `${{ secrets.XXX }}`.

## ⚙️ Comment ajouter un secret

1. Cliquez sur **New repository secret**
2. Entrez le nom du secret (ex: `NEXT_PUBLIC_SUPABASE_URL`)
3. Collez la valeur
4. Cliquez sur **Add secret**

## ✅ Vérification

Une fois les secrets configurés, les workflows GitHub Actions devraient fonctionner correctement. Vous pouvez vérifier l'état dans l'onglet **Actions** de votre repository.

## 🚨 Note importante

- Les secrets `NEXT_PUBLIC_*` sont exposés côté client dans le build Next.js
- Ne mettez JAMAIS de clés privées ou sensibles dans les variables `NEXT_PUBLIC_*`
- Les autres secrets (API keys, tokens Vercel) restent privés côté serveur

## 🔄 Workflows affectés

- ✅ **CI** (ci.yml) - Lint & Build
- ✅ **Tests** (tests.yml) - Unit, E2E, Accessibility, Lighthouse
- ✅ **Deploy** (deploy.yml) - Déploiement Vercel
- ✅ **Pages** (nextjs.yml) - GitHub Pages
