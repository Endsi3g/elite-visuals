# 🚀 Guide de Déploiement - Elite Visuals

## Prérequis

- Compte GitHub avec accès au repository
- Compte Vercel (recommandé) ou autre plateforme (Netlify, Railway, etc.)
- Variables d'environnement configurées

## 📋 Checklist Pré-Déploiement

- [ ] Toutes les variables d'environnement sont documentées dans `.env.example`
- [ ] Le build local fonctionne : `npm run build`
- [ ] Les tests passent (si applicable)
- [ ] Le fichier `.gitignore` exclut `.env` et `.env.local`
- [ ] Les secrets Supabase sont prêts

## 🌐 Déploiement sur Vercel (Recommandé)

### Option 1 : Via l'interface Vercel

1. **Connecter le repository**
   - Aller sur [vercel.com](https://vercel.com)
   - Cliquer sur "New Project"
   - Importer le repository GitHub `elite-visuals`

2. **Configurer les variables d'environnement**
   Dans les paramètres du projet Vercel, ajouter :
   
   ```env
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
   ANTHROPIC_API_KEY=votre_clé_anthropic
   HUGGINGFACE_API_KEY=votre_clé_huggingface
   LUMA_API_KEY=votre_clé_luma
   LUMA_API_URL=https://api.lumalabs.ai/v1
   ```
   
   > **Note :** Référez-vous au fichier `.env.example` pour la liste complète des variables

3. **Déployer**
   - Cliquer sur "Deploy"
   - Vercel détectera automatiquement Next.js et utilisera `vercel.json`

### Option 2 : Via GitHub Actions (Automatique)

1. **Configurer les secrets GitHub**
   Dans Settings > Secrets and variables > Actions, ajouter :
   - `VERCEL_TOKEN` : Token d'API Vercel
   - `VERCEL_ORG_ID` : ID de votre organisation Vercel
   - `VERCEL_PROJECT_ID` : ID du projet Vercel
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
   - `HUGGINGFACE_API_KEY`
   - `LUMA_API_KEY`

2. **Déclencher le déploiement**
   
   ```bash
   git push origin main
   ```
   
   Le workflow `.github/workflows/deploy.yml` se déclenchera automatiquement.

3. **Vérifier le déploiement**
   - Aller dans l'onglet "Actions" sur GitHub
   - Suivre le workflow "Deploy to Production"
   - Une fois terminé, l'application sera déployée sur Vercel

## 🔧 Déploiement sur d'autres plateformes

### Netlify

1. Connecter le repository sur Netlify
2. Build command : `npm run build`
3. Publish directory : `.next`
4. Ajouter les variables d'environnement dans Settings > Environment

### Railway

1. Créer un nouveau projet sur Railway
2. Connecter le repository GitHub
3. Railway détectera automatiquement Next.js
4. Ajouter les variables d'environnement

### Docker (Auto-hébergement)

```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

Build et run :

```bash
docker build -t elite-visuals .
docker run -p 3000:3000 --env-file .env elite-visuals
```

> **Note :** L'option `output: 'standalone'` dans `next.config.js` optimise le build Docker

## 🔄 Mises à Jour Continues

### Workflow de mise à jour

1. **Développement local**
   
   ```bash
   git checkout -b feature/nouvelle-fonctionnalite
   # Développer...
   npm run build  # Vérifier que ça build
   git commit -m "feat: nouvelle fonctionnalité"
   ```

2. **Pull Request**
   
   ```bash
   git push origin feature/nouvelle-fonctionnalite
   ```
   
   - Créer une PR sur GitHub
   - Le workflow CI (`.github/workflows/ci.yml`) vérifie automatiquement :
     - Lint (ESLint)
     - Build (compilation Next.js)

3. **Merge et déploiement**
   - Merger la PR dans `main`
   - Le workflow de déploiement se déclenche automatiquement
   - Vercel déploie la nouvelle version

### Rollback en cas de problème

**Sur Vercel :**

1. Aller dans Deployments
2. Trouver le déploiement précédent stable
3. Cliquer sur "Promote to Production"

**Via Git :**

```bash
git revert HEAD
git push origin main
```

Le workflow de déploiement se déclenchera automatiquement avec la version précédente.

## 🔐 Sécurité

### Variables d'environnement sensibles

- ❌ **Ne jamais** commit `.env` ou `.env.local`
- ✅ Utiliser `.env.example` pour documenter
- ✅ Utiliser les secrets GitHub Actions
- ✅ Utiliser les variables d'environnement de la plateforme

### Supabase Row Level Security (RLS)

Assurez-vous que RLS est activé sur toutes les tables :

```sql
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;
```

Consultez le fichier `supabase/schema.sql` pour les politiques RLS complètes.

## 📊 Monitoring Post-Déploiement

### Vérifications

- [ ] L'application se charge correctement
- [ ] Les images Supabase s'affichent (vérifier `remotePatterns` dans `next.config.js`)
- [ ] L'authentification fonctionne
- [ ] Les API externes (Anthropic, Luma, HuggingFace) répondent
- [ ] Le board Konva s'affiche et est interactif
- [ ] Le Kanban fonctionne (drag & drop)
- [ ] Pas d'erreurs dans les logs Vercel
- [ ] Les variables d'environnement sont correctement chargées

### Logs

**Via CLI Vercel :**

```bash
vercel logs [deployment-url]
```

**Via l'interface Vercel :**

Vercel > Deployments > [Votre déploiement] > Logs

**Via GitHub Actions :**

GitHub > Actions > [Workflow run] > Deploy to Production

## 🆘 Dépannage

### Erreur : "Module not found"

- Vérifier que toutes les dépendances sont dans `package.json`
- Exécuter `npm install` localement
- Vérifier la version de Node.js (18+ requis)

### Erreur : "Environment variable not defined"

- Vérifier que toutes les variables sont dans les settings Vercel
- Les variables `NEXT_PUBLIC_*` doivent être définies au build time
- Redéployer après avoir ajouté des variables d'environnement

### Build timeout

- Augmenter la limite de timeout dans les settings Vercel
- Optimiser les imports (lazy loading)
- Vérifier qu'il n'y a pas de boucles infinies dans les composants

### Images ne se chargent pas

- Vérifier la configuration `remotePatterns` dans `next.config.js`
- Vérifier les CORS sur Supabase Storage
- S'assurer que les URLs Supabase sont correctes dans `.env`

### Erreur : "Failed to compile"

- Vérifier les erreurs TypeScript localement : `npm run build`
- Corriger les imports manquants
- Vérifier la compatibilité des versions de packages

### Canvas Konva ne s'affiche pas

- Vérifier que `konva` et `react-konva` sont installés
- Vérifier les erreurs de console dans le navigateur
- S'assurer que le composant est bien client-side (`'use client'`)

### Erreur : "Can't resolve 'canvas'" (Konva)

- La configuration webpack dans `next.config.js` exclut déjà `canvas` et `konva` du bundle serveur
- Vérifier que tous les composants utilisant Konva ont la directive `"use client"`
- Si le problème persiste, vérifier que `next.config.js` contient bien la section webpack

## 📚 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)

---

**Besoin d'aide ?** Consultez les logs ou contactez l'équipe Elite Visuals.
