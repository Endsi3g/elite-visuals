# 🚀 Configuration des Variables d'Environnement Vercel

**Problème:** `Environment Variable "NEXT_PUBLIC_SUPABASE_URL" references Secret "next_public_supabase_url", which does not exist.`

**Solution:** Configurer les variables d'environnement dans Vercel.

---

## ✅ Méthode 1 : Interface Web Vercel (Recommandé)

### Étape 1 : Accéder aux Settings

1. Aller sur https://vercel.com
2. Sélectionner votre projet **elite-visuals**
3. Cliquer sur **Settings** (en haut)
4. Cliquer sur **Environment Variables** (menu gauche)

### Étape 2 : Ajouter les Variables

Cliquer sur **Add New** et ajouter chaque variable :

#### Variables Requises (Supabase)

| Name | Value | Environments |
|------|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://votre-projet.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...votre_clé` | Production, Preview, Development |

#### Variables Optionnelles (IA)

| Name | Value | Environments |
|------|-------|--------------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` | Production, Preview |
| `LUMA_API_KEY` | `...` | Production, Preview |
| `HUGGINGFACE_API_KEY` | `hf_...` | Production, Preview |

### Étape 3 : Redéployer

Après avoir ajouté les variables :
1. Aller dans **Deployments**
2. Cliquer sur les **3 points** du dernier déploiement
3. Cliquer sur **Redeploy**

---

## ✅ Méthode 2 : Vercel CLI

### Installation

```bash
npm i -g vercel
```

### Connexion

```bash
vercel login
```

### Lier le Projet

```bash
cd elite-visuals
vercel link
```

### Ajouter les Variables

```bash
# Supabase URL
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Entrer: https://votre-projet.supabase.co

# Supabase Anon Key
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Entrer: votre_clé_anon

# Optionnel : Anthropic
vercel env add ANTHROPIC_API_KEY production
# Entrer: sk-ant-...

# Optionnel : Luma AI
vercel env add LUMA_API_KEY production
# Entrer: votre_clé_luma
```

### Redéployer

```bash
vercel --prod
```

---

## ✅ Méthode 3 : Modifier vercel.json (Si pas de Supabase)

Si vous n'utilisez **pas encore** Supabase, vous pouvez temporairement supprimer les références :

### Fichier `vercel.json` Simplifié

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "regions": ["iad1"],
  "public": false
}
```

**Note:** Vous devrez ajouter les variables d'environnement plus tard quand vous configurerez Supabase.

---

## 📋 Où Trouver vos Clés Supabase ?

### 1. Aller sur Supabase

https://app.supabase.com

### 2. Sélectionner votre Projet

Ou créer un nouveau projet si vous n'en avez pas.

### 3. Settings → API

Vous y trouverez :

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  ```
  https://abcdefghijklmnop.supabase.co
  ```

- **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

---

## 🔒 Sécurité

### Variables Publiques (`NEXT_PUBLIC_*`)

Ces variables sont **exposées au client** (navigateur). C'est normal pour :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Variables Privées

Ces variables restent **côté serveur** uniquement :
- `ANTHROPIC_API_KEY`
- `LUMA_API_KEY`
- `HUGGINGFACE_API_KEY`

**Ne jamais** préfixer ces clés avec `NEXT_PUBLIC_` !

---

## ✅ Vérification

Après avoir configuré les variables :

### 1. Vérifier dans Vercel

Settings → Environment Variables → Vous devriez voir toutes vos variables.

### 2. Tester le Déploiement

```bash
vercel --prod
```

### 3. Vérifier les Logs

Si le déploiement échoue :
1. Aller dans **Deployments**
2. Cliquer sur le déploiement échoué
3. Lire les **Build Logs**

---

## 🆘 Dépannage

### Erreur : "Secret does not exist"

**Solution:** Vous avez oublié d'ajouter une variable. Vérifiez que toutes les variables référencées dans `vercel.json` existent.

### Erreur : "Invalid Supabase URL"

**Solution:** Vérifiez que l'URL commence par `https://` et se termine par `.supabase.co`

### Erreur : "Build failed"

**Solution:** 
1. Vérifier les logs de build
2. Tester localement : `npm run build`
3. Vérifier que toutes les dépendances sont dans `package.json`

---

## 📚 Ressources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)

---

## 🎯 Checklist

- [ ] Variables d'environnement ajoutées dans Vercel
- [ ] Projet redéployé
- [ ] Déploiement réussi (vert ✅)
- [ ] Application accessible sur votre URL Vercel
- [ ] Supabase fonctionne (si configuré)

---

**Créé par:** Cascade AI  
**Pour:** Elite Visuals Team  
**Date:** 20 Novembre 2024
