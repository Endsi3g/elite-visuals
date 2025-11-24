# 🔐 Configuration des Secrets GitHub - Guide Rapide

Vous avez configuré Supabase localement! Maintenant configurons GitHub Actions pour que les workflows CI/CD fonctionnent.

## 📋 Vos clés Supabase

D'après votre `.env.local`, voici vos clés:

```
URL: https://ljyowryjwmgrjqrarzvg.supabase.co
Clé Anon: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqeW93cnlqd21ncmpxcmFyenZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0ODY1MzgsImV4cCI6MjA3OTA2MjUzOH0.jEWPSKLF3-7hr-IJ_kcyLHNced9eFFBG9R8mHt7ezYo
```

## 🚀 Configuration en 3 étapes

### Étape 1: Accéder aux Secrets GitHub

1. Ouvrez votre navigateur
2. Allez sur: https://github.com/Endsi3g/elite-visuals/settings/secrets/actions
3. Vous devriez voir la page "Actions secrets and variables"

### Étape 2: Ajouter les secrets Supabase

Cliquez sur **"New repository secret"** et ajoutez:

#### Secret 1: NEXT_PUBLIC_SUPABASE_URL
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Secret**: `https://ljyowryjwmgrjqrarzvg.supabase.co`
- Cliquez sur **Add secret**

#### Secret 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Secret**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqeW93cnlqd21ncmpxcmFyenZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0ODY1MzgsImV4cCI6MjA3OTA2MjUzOH0.jEWPSKLF3-7hr-IJ_kcyLHNced9eFFBG9R8mHt7ezYo`
- Cliquez sur **Add secret**

### Étape 3: Vérifier

1. Retournez sur: https://github.com/Endsi3g/elite-visuals/actions
2. Les workflows devraient maintenant passer! ✅

## 📊 Résultat attendu

Après configuration, vos workflows GitHub Actions:
- ✅ **CI / build** - Passera avec succès
- ✅ **CI / lint** - Passera avec succès  
- ✅ **Tests / Unit Tests** - Passera avec succès
- ✅ **Tests / E2E Tests** - Passera avec succès
- ✅ **Tests / Accessibility Tests** - Passera avec succès
- ✅ **Tests / Lighthouse CI** - Passera avec succès

## 🔒 Sécurité

- ✅ Les clés `NEXT_PUBLIC_*` sont sûres à exposer (elles sont publiques par design)
- ✅ Elles sont déjà dans votre code frontend
- ⚠️ Ne partagez JAMAIS la clé `service_role` (celle en commentaire)

## 🎯 Secrets optionnels (pour plus tard)

Si vous voulez déployer sur Vercel ou utiliser les APIs AI:

### Pour Vercel
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Pour les APIs AI
- `ANTHROPIC_API_KEY`
- `HUGGINGFACE_API_KEY`
- `LUMA_API_KEY`

Ces secrets sont optionnels et peuvent être ajoutés plus tard.

## ✅ Checklist

- [ ] Ouvrir https://github.com/Endsi3g/elite-visuals/settings/secrets/actions
- [ ] Ajouter `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Ajouter `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Vérifier que les workflows passent dans l'onglet Actions

---

**Temps estimé**: 2 minutes ⏱️
