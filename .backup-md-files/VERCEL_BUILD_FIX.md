# 🔧 Fix Build Vercel - Konva SSR Issue

**Date:** 20 Novembre 2024  
**Problème:** Module not found: Can't resolve 'canvas'

---

## 🐛 Problème

```
./node_modules/konva/lib/index-node.js
Module not found: Can't resolve 'canvas'

Import trace for requested module:
./node_modules/react-konva/es/ReactKonva.js
./components/board/InfiniteBoard.tsx
./app/page.tsx
```

**Cause:** Konva essaie de charger le module `canvas` (Node.js) pendant le Server-Side Rendering (SSR) de Next.js, mais ce module n'est pas disponible dans l'environnement Vercel.

---

## ✅ Solutions Appliquées

### 1. Configuration Next.js (`next.config.js`)

**Changements:**
- Exclusion de `canvas`, `konva`, et `react-konva` du bundle serveur
- Alias pour forcer l'utilisation de la version browser de Konva
- Suppression de l'option `experimental.serverActions` obsolète

```javascript
webpack: (config, { isServer }) => {
  if (isServer) {
    config.externals = [...(config.externals || []), 'canvas', 'konva', 'react-konva']
  }
  // Alias pour forcer l'utilisation de la version browser de Konva
  config.resolve.alias = {
    ...config.resolve.alias,
    'konva': 'konva/lib/index-browser.js',
  }
  return config
},
experimental: {
  optimizePackageImports: ['react-konva', 'konva'],
},
```

### 2. Wrapper Konva (`components/board/KonvaWrapper.tsx`)

**Nouveau fichier créé** pour importer Konva dynamiquement côté client uniquement:

```typescript
"use client"

import dynamic from 'next/dynamic'

export const Stage = dynamic(
  () => import('react-konva').then((mod) => mod.Stage),
  { ssr: false }
)

export const Layer = dynamic(
  () => import('react-konva').then((mod) => mod.Layer),
  { ssr: false }
)

// ... autres exports
```

### 3. Mise à jour des Composants

**`components/board/InfiniteBoard.tsx`:**
```typescript
// Avant
import { Stage, Layer, Rect, Text, Image as KonvaImage } from "react-konva"

// Après
import { Stage, Layer, Rect, Text, Image as KonvaImage } from "./KonvaWrapper"
```

**`app/showroom/[id]/page.tsx`:**
```typescript
// Import dynamique direct
const Stage = dynamic(() => import("react-konva").then((mod) => mod.Stage), { ssr: false })
const Layer = dynamic(() => import("react-konva").then((mod) => mod.Layer), { ssr: false })
const Rect = dynamic(() => import("react-konva").then((mod) => mod.Rect), { ssr: false })
const Text = dynamic(() => import("react-konva").then((mod) => mod.Text), { ssr: false })
```

---

## 🚀 Déploiement sur Vercel

### Étape 1: Commit et Push

```bash
git add .
git commit -m "fix: Konva SSR issue for Vercel deployment"
git push origin main
```

### Étape 2: Vérifier le Build Localement

```bash
# Build de production
npm run build

# Démarrer en production
npm start
```

### Étape 3: Redéployer sur Vercel

Le déploiement se fera automatiquement après le push, ou manuellement:

```bash
vercel --prod
```

---

## 📊 Vérifications

### ✅ Checklist Avant Déploiement

- [x] `next.config.js` mis à jour avec webpack config
- [x] `KonvaWrapper.tsx` créé avec imports dynamiques
- [x] `InfiniteBoard.tsx` utilise le wrapper
- [x] `app/showroom/[id]/page.tsx` utilise imports dynamiques
- [x] Tous les composants Konva ont `"use client"`
- [x] Build local réussi (`npm run build`)

### ⚠️ Avertissements Attendus (Non-Bloquants)

```
⚠ Invalid next.config.js options detected: 
⚠ Expected object, received boolean at "experimental.serverActions"
⚠ Server Actions are available by default now
```

**Solution:** Déjà corrigé dans `next.config.js` - l'option `serverActions` a été supprimée.

---

## 🔍 Autres Fichiers Utilisant Konva

Si d'autres composants utilisent Konva, appliquez la même solution:

### Méthode 1: Utiliser le Wrapper

```typescript
import { Stage, Layer, Rect } from "@/components/board/KonvaWrapper"
```

### Méthode 2: Import Dynamique Direct

```typescript
const Stage = dynamic(() => import("react-konva").then((mod) => mod.Stage), { ssr: false })
```

### Fichiers à Vérifier

- `components/board/BoardCard.tsx`
- `components/board/OptimizedGrid.tsx`
- `components/board/MindMap.tsx`
- Tout autre composant important `react-konva`

---

## 🐛 Troubleshooting

### Erreur Persiste Après Déploiement

1. **Vérifier les imports:**
   ```bash
   grep -r "from \"react-konva\"" components/
   ```

2. **Nettoyer le cache Vercel:**
   - Aller sur Vercel Dashboard
   - Settings → General → Clear Build Cache
   - Redéployer

3. **Vérifier les variables d'environnement:**
   ```bash
   vercel env ls
   ```

### Build Local Échoue

```bash
# Nettoyer et réinstaller
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Canvas Module Still Required

Si l'erreur persiste, ajouter à `package.json`:

```json
{
  "browser": {
    "canvas": false
  }
}
```

---

## 📚 Ressources

- [Next.js Dynamic Imports](https://nextjs.org/docs/advanced-features/dynamic-import)
- [Konva SSR Issues](https://github.com/konvajs/react-konva/issues/188)
- [Vercel Build Configuration](https://vercel.com/docs/concepts/next.js/overview)

---

## ✅ Résultat Attendu

Après ces corrections, le build Vercel devrait réussir:

```
✓ Creating an optimized production build
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (5/5)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         120 kB
├ ○ /showroom/[id]                       3.8 kB         118 kB
└ ○ /api/...                             0 B                0 B

○  (Static)  prerendered as static content

✓ Build completed successfully
```

---

**Build devrait maintenant passer sur Vercel!** 🚀

Si le problème persiste, vérifiez que tous les fichiers ont été correctement commités et pushés.
