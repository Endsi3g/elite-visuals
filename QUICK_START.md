# 🚀 Quick Start - Elite Visuals Phase 2

Guide rapide pour tester les nouvelles fonctionnalités avancées.

## 📦 Installation

```bash
# Cloner le projet (si pas déjà fait)
cd elite-visuals

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## ✨ Tester les Nouvelles Fonctionnalités

### 1. SmartCluster (30 secondes)

1. Ajoutez plusieurs cartes sur le board (bouton `+`)
2. Regardez en bas à droite → panneau "Smart Clustering"
3. Cliquez sur "Analyser"
4. Attendez 2 secondes
5. Cliquez sur "Créer le cluster" sur une suggestion

**Résultat:** Vos items sont maintenant groupés en clusters colorés!

---

### 2. Mode Showroom (1 minute)

1. Créez quelques éléments sur votre board
2. Cherchez le panneau "Mode Showroom" (en haut à droite)
3. Cliquez sur "Activer"
4. Cliquez sur "Copier le lien"
5. Ouvrez le lien dans un nouvel onglet

**Résultat:** Interface client professionnelle avec watermark Elite Visuals!

**URL:** `http://localhost:3000/showroom/demo`

---

### 3. Export Markdown (15 secondes)

1. Ajoutez des items et créez des clusters
2. Cliquez sur l'icône "Download" (en haut à gauche)
3. Sélectionnez "Markdown"
4. Le fichier se télécharge automatiquement

**Résultat:** Fichier `.md` structuré avec tous vos clusters!

---

### 4. Chat Contextuel (1 minute)

1. Cliquez sur l'icône de chat flottant (en bas à droite)
2. Tapez: "Combien d'éléments sur le board ?"
3. Appuyez sur Entrée
4. L'IA répond avec le contexte de votre board

**Essayez aussi:**
- "Fais-moi un résumé"
- "Donne-moi des idées"

---

### 5. Recherche IA (30 secondes)

1. Créez plusieurs items avec différents contenus
2. La barre de recherche apparaît en haut (centre)
3. Tapez un mot-clé
4. Cliquez sur "Rechercher" (icône Sparkles)
5. Filtrez par type si nécessaire

**Résultat:** Résultats avec score de pertinence!

---

### 6. Mind-Mapping (1 minute)

1. Ajoutez le composant MindMap au board
2. Double-cliquez sur le nœud central
3. L'IA génère des nœuds enfants automatiquement
4. Déplacez les nœuds (drag & drop)

**Résultat:** Mind-map dynamique avec suggestions IA!

---

## 🧪 Tests E2E

```bash
# Installer Playwright (si pas déjà fait)
npx playwright install

# Lancer tous les tests
npm run test:e2e

# Mode UI interactif
npm run test:e2e:ui

# Mode debug
npm run test:e2e:debug
```

**Tests disponibles:**
- ✅ Chargement du board
- ✅ Ajout de cartes
- ✅ Zoom
- ✅ Export
- ✅ SmartCluster
- ✅ Showroom
- ✅ Collaboration

---

## 🔧 Configuration Supabase (Collaboration)

### Option 1: Utiliser le mode démo (sans Supabase)

Les fonctionnalités fonctionnent en mode local sans configuration.

### Option 2: Activer la collaboration réelle

1. Créer un compte sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Copier l'URL et la clé Anon
4. Créer `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

5. Redémarrer le serveur: `npm run dev`

---

## 🎨 Personnalisation

### Changer les couleurs

Éditer `app/globals.css`:

```css
--primary: #FF684A;        /* Orange Elite */
--background: #FFFFFF;     /* Blanc */
```

### Ajuster le rate limiting

Éditer `lib/security/rate-limiter.ts`:

```typescript
export const aiRateLimiter = new RateLimiter(20, 1) // 20 req/min
```

---

## 📱 PWA (Progressive Web App)

### Tester en local

1. Build production: `npm run build`
2. Démarrer: `npm start`
3. Ouvrir Chrome DevTools
4. Onglet "Application" → "Manifest"
5. Vérifier que le manifest est chargé

### Installer sur mobile

1. Déployer sur Vercel/Netlify
2. Ouvrir sur mobile
3. "Ajouter à l'écran d'accueil"

---

## 🐛 Troubleshooting

### Le board ne charge pas
```bash
# Vérifier que le serveur tourne
npm run dev
# Ouvrir http://localhost:3000
```

### SmartCluster ne répond pas
```typescript
// Vérifier la console pour les erreurs
// Le mode démo utilise des suggestions mockées
```

### Tests E2E échouent
```bash
# Installer les navigateurs Playwright
npx playwright install

# Vérifier que le serveur dev tourne
npm run dev

# Relancer les tests
npm run test:e2e
```

### Erreurs TypeScript
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentation Complète

- **Fonctionnalités:** `ADVANCED_FEATURES.md`
- **Implémentation:** `PHASE2_IMPLEMENTATION.md`
- **README:** `README.md`

---

## 🎯 Prochaines Étapes

Après avoir testé les fonctionnalités:

1. **Personnaliser** les couleurs et le branding
2. **Configurer Supabase** pour la collaboration
3. **Déployer** sur Vercel
4. **Tester** avec de vrais utilisateurs
5. **Implémenter** les fonctionnalités Phase 3

---

## 💡 Astuces

### Raccourcis Clavier (à venir)
- `Ctrl/Cmd + K` → Recherche
- `Ctrl/Cmd + E` → Export
- `Ctrl/Cmd + /` → Chat

### Performance
- Limitez à 50 items sur le board pour des performances optimales
- Utilisez les clusters pour organiser
- Exportez régulièrement en Markdown

### Collaboration
- Partagez le lien Showroom aux clients
- Utilisez le chat pour la documentation
- Exportez avant les réunions

---

**Besoin d'aide?** Consultez `ADVANCED_FEATURES.md` pour plus de détails!

**Fait avec ❤️ par Elite Visuals**
