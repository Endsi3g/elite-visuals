# 🚀 Guide Vercel CLI - Elite Visuals

## Installation

```bash
npm i -g vercel
```

## Commandes Essentielles

### 1. Connexion

```bash
vercel login
```

### 2. Déploiement

#### Déploiement Preview (Test)

```bash
vercel
```

#### Déploiement Production

```bash
vercel --prod
```

#### Déploiement avec Build Local

```bash
vercel --prod --build-env NEXT_PUBLIC_SUPABASE_URL=your_url
```

### 3. Gestion des Variables d'Environnement

#### Lister les Variables

```bash
vercel env ls
```

#### Ajouter une Variable

```bash
# Production
vercel env add NEXT_PUBLIC_SUPABASE_URL production

# Preview
vercel env add NEXT_PUBLIC_SUPABASE_URL preview

# Development
vercel env add NEXT_PUBLIC_SUPABASE_URL development

# Toutes les environnements
vercel env add ANTHROPIC_API_KEY
```

#### Supprimer une Variable

```bash
vercel env rm VARIABLE_NAME production
```

#### Importer depuis .env

```bash
vercel env pull .env.local
```

### 4. Logs et Monitoring

#### Voir les Logs en Temps Réel

```bash
vercel logs [deployment-url]
```

#### Logs avec Suivi

```bash
vercel logs [deployment-url] --follow
```

### 5. Gestion des Déploiements

#### Lister les Déploiements

```bash
vercel ls
```

#### Inspecter un Déploiement

```bash
vercel inspect [deployment-url]
```

#### Promouvoir un Déploiement en Production

```bash
vercel promote [deployment-url]
```

#### Supprimer un Déploiement

```bash
vercel rm [deployment-url]
```

### 6. Alias et Domaines

#### Assigner un Alias

```bash
vercel alias set [deployment-url] elite-visuals.vercel.app
```

#### Lister les Alias

```bash
vercel alias ls
```

#### Ajouter un Domaine Personnalisé

```bash
vercel domains add elite-visuals.com
```

### 7. Projets

#### Lister les Projets

```bash
vercel projects ls
```

#### Créer un Projet

```bash
vercel project add elite-visuals
```

### 8. Secrets (Recommandé pour les Clés API)

#### Ajouter un Secret

```bash
vercel secrets add autonoma-client-id "your-client-id"
vercel secrets add autonoma-client-secret "your-client-secret"
```

#### Lister les Secrets

```bash
vercel secrets ls
```

#### Utiliser un Secret dans les Variables d'Environnement

```bash
vercel env add AUTONOMA_CLIENT_ID production
# Puis sélectionner le secret dans la liste
```

### 9. Configuration Locale

#### Initialiser le Projet

```bash
vercel link
```

#### Télécharger la Configuration

```bash
vercel pull
```

### 10. Build et Dev

#### Lancer en Local avec Vercel

```bash
vercel dev
```

#### Build Local

```bash
vercel build
```

## 📋 Workflow Complet de Déploiement

### Première Fois

```bash
# 1. Se connecter
vercel login

# 2. Lier le projet
vercel link

# 3. Ajouter les variables d'environnement
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add ANTHROPIC_API_KEY production
vercel env add HUGGINGFACE_API_KEY production
vercel env add LUMA_API_KEY production

# 4. Déployer en production
vercel --prod
```

### Déploiements Suivants

```bash
# Preview (automatique sur chaque push)
git push origin feature-branch

# Production (automatique sur push vers main)
git push origin main

# Ou manuel
vercel --prod
```

## 🔐 Bonnes Pratiques

### 1. Utiliser les Secrets pour les Données Sensibles

```bash
# Créer des secrets
vercel secrets add db-password "super-secret-password"
vercel secrets add api-key "sk-..."

# Les référencer dans les variables d'environnement
vercel env add DATABASE_PASSWORD production
# Sélectionner @db-password dans la liste
```

### 2. Séparer les Environnements

```bash
# Variables différentes par environnement
vercel env add API_URL production
# Entrer: https://api.production.com

vercel env add API_URL preview
# Entrer: https://api.staging.com
```

### 3. Vérifier Avant de Déployer

```bash
# Build local
npm run build

# Test local avec Vercel
vercel dev

# Preview deployment
vercel

# Puis production
vercel --prod
```

## 🚨 Dépannage

### Erreur : "No token found"

```bash
vercel logout
vercel login
```

### Erreur : "Project not linked"

```bash
vercel link
```

### Voir les Erreurs de Build

```bash
vercel logs [deployment-url] --follow
```

### Réinitialiser la Configuration

```bash
rm -rf .vercel
vercel link
```

## 📚 Ressources

- [Documentation Vercel CLI](https://vercel.com/docs/cli)
- [Variables d'Environnement](https://vercel.com/docs/concepts/projects/environment-variables)
- [Secrets](https://vercel.com/docs/cli/secrets)

---

**Astuce :** Ajoutez `vercel` à vos scripts npm dans `package.json` :

```json
{
  "scripts": {
    "deploy": "vercel --prod",
    "deploy:preview": "vercel"
  }
}
```

Puis utilisez simplement :

```bash
npm run deploy
```
