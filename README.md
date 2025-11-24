# 🎨 Elite Visuals

**Plateforme collaborative de création visuelle avec IA**

Elite Visuals est une application web moderne qui combine la puissance de l'IA avec des outils de collaboration en temps réel pour créer, organiser et partager des contenus visuels et des vidéos virales.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.9-38bdf8)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e)](https://supabase.com/)

---

## ✨ Fonctionnalités

### 🎯 Core Features
- **Tableau Infini** - Canvas illimité avec zoom et pan
- **Collaboration Temps Réel** - WebSocket avec Yjs
- **Authentification** - Supabase Auth (Email/Password)
- **Gestion de Projets** - Boards et items organisés
- **Export Multi-Format** - PDF, PNG, JSON

### 🤖 IA Intégrée
- **Génération de Texte** - Claude, Ollama, HuggingFace
- **Génération d'Images** - Intégration Luma AI
- **OCR** - Extraction de texte avec Tesseract.js
- **Analyse Visuelle** - Traitement d'images

### ♿ Accessibilité
- **WCAG AA Compliant** - Contraste 4.52:1
- **Navigation Clavier** - Raccourcis complets
- **Gestes Tactiles** - Support multi-touch
- **Lecteurs d'Écran** - ARIA labels complets

### ⚡ Performance
- **Turbopack** - Bundler ultra-rapide (10x)
- **Lazy Loading** - Chargement optimisé
- **Code Splitting** - Bundles optimisés
- **Image Optimization** - AVIF/WebP

---

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** 18.x ou supérieur
- **npm** ou **yarn**
- **Compte Supabase** (gratuit)

### Installation

```bash
# 1. Cloner le repository
git clone https://github.com/votre-username/elite-visuals.git
cd elite-visuals

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés Supabase

# 4. Démarrer le serveur de développement
npm run dev
```

Le site sera accessible sur **http://localhost:3000**

---

## 🔧 Configuration

### Variables d'Environnement

Créer un fichier `.env.local` à la racine:

```env
# Supabase (Requis)
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon

# IA (Optionnel)
OLLAMA_BASE_URL=http://localhost:11434
ANTHROPIC_API_KEY=sk-ant-votre-cle
HUGGINGFACE_API_KEY=hf_votre-cle
LUMA_API_KEY=votre-cle-luma
```

### Configuration Supabase

1. **Créer un projet** sur [supabase.com](https://supabase.com)
2. **Récupérer les clés** dans Settings > API
3. **Créer les tables** (voir `SUPABASE_ERROR_FIX.md`)
4. **Activer Authentication** dans le dashboard

---

## 📦 Scripts Disponibles

```bash
# Développement
npm run dev              # Démarrer avec Turbopack
npm run build            # Build de production
npm run start            # Démarrer en production
npm run lint             # Linter le code

# Tests Unitaires
npm test                 # Tests unitaires (Jest)
npm run test:watch       # Tests en mode watch
npm run test:coverage    # Tests avec couverture

# Tests E2E
npm run test:e2e         # Tous les tests E2E (Playwright)
npm run test:e2e:ui      # Tests E2E en mode UI
npm run test:landing     # Tests de la landing page
npm run test:ai-tasks    # Tests de la page AI Tasks
npm run test:performance # Tests de performance

# Tests d'Accessibilité
npm run test:accessibility  # Tests d'accessibilité automatisés

# Lighthouse & Performance
npm run lighthouse       # Audit Lighthouse local
npm run lighthouse:ci    # Lighthouse CI complet

# Tous les Tests
npm run test:all         # Tests unitaires + E2E
npm run test:all-local   # Suite complète (PowerShell)

# Audit
npm run audit:accessibility  # Audit accessibilité
npm run audit:full       # Audit complet du projet
```

---

## 🏗️ Architecture

### Stack Technique

**Frontend:**
- Next.js 15.5.6 (App Router)
- React 18.3.1
- TypeScript 5.5.4
- Tailwind CSS 3.4.9

**Backend:**
- Supabase (PostgreSQL)
- Supabase Auth
- Supabase Realtime

**Canvas & Collaboration:**
- Konva.js 9.3.14
- React Konva 18.2.10
- Yjs 13.6.10
- Y-WebSocket 1.5.0

**IA & ML:**
- Anthropic Claude SDK
- LangChain 0.3.5
- Tesseract.js 5.0.0

**UI Components:**
- Radix UI
- Framer Motion 11.3.28
- Lucide React 0.427.0

### Structure du Projet

```
elite-visuals/
├── app/                    # Pages Next.js (App Router)
│   ├── dashboard/         # Dashboard utilisateur
│   ├── login/            # Authentification
│   ├── faq/              # FAQ
│   └── page.tsx          # Landing page
├── components/            # Composants React
│   ├── board/            # Composants canvas
│   ├── dashboard/        # Composants dashboard
│   ├── kanban/           # Kanban board
│   ├── landing/          # Landing page
│   └── ui/               # Composants UI (shadcn)
├── lib/                   # Utilitaires
│   ├── supabase/         # Client Supabase
│   ├── accessibility/    # Outils accessibilité
│   └── collaboration/    # WebSocket & Yjs
├── hooks/                 # Custom React hooks
├── public/               # Assets statiques
└── docs/                 # Documentation
```

---

## 🎨 Fonctionnalités Détaillées

### Tableau Infini (Infinite Board)

- **Canvas illimité** avec zoom et pan
- **Clustering intelligent** pour les performances
- **Drag & Drop** d'éléments
- **Sélection multiple** avec Shift
- **Raccourcis clavier** complets
- **Export** en PDF, PNG, JSON

### Collaboration Temps Réel

- **Curseurs multi-utilisateurs** en temps réel
- **Synchronisation automatique** avec Yjs
- **Indicateurs de présence** colorés
- **Gestion des conflits** automatique

### Système de Boards

- **Création de boards** illimités
- **Organisation par projets**
- **Partage et permissions**
- **Historique des modifications**

---

## ♿ Accessibilité

Elite Visuals est **entièrement accessible** selon les standards WCAG AA:

### Couleurs
- ✅ Contraste minimum 4.52:1
- ✅ Palette accessible testée
- ✅ Mode sombre (à venir)

### Navigation
- ✅ Navigation clavier complète
- ✅ Raccourcis documentés
- ✅ Focus visible
- ✅ Skip links

### Gestes
- ✅ Support tactile multi-touch
- ✅ Pinch to zoom
- ✅ Swipe navigation
- ✅ Alternative clavier pour tout

### Lecteurs d'Écran
- ✅ ARIA labels complets
- ✅ Rôles sémantiques
- ✅ Live regions
- ✅ Descriptions alternatives

**Documentation:** Voir `ACCESSIBILITY_INTEGRATION_COMPLETE.md`

---

## ⚡ Optimisations Performance

### Chargement Initial
- **Lazy Loading** des composants non-critiques
- **Code Splitting** automatique
- **Image Optimization** AVIF/WebP
- **Font Optimization** avec preload

### Développement
- **Turbopack** - 10x plus rapide que Webpack
- **Hot Reload** instantané
- **Compilation incrémentale**

### Métriques Cibles
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1

**Documentation:** Voir `PERFORMANCE_OPTIMIZATION.md`

---

## 🧪 Tests

### Tests Unitaires
```bash
npm run test
```

### Tests E2E
```bash
npm run test:e2e
npm run test:e2e:ui    # Mode UI
```

### Tests d'Accessibilité
```bash
npm run test:accessibility
npm run audit:accessibility
```

### Lighthouse
```bash
npm run lighthouse
```

---

## 📚 Documentation

### Guides Principaux
- **QUICK_START.md** - Guide de démarrage rapide
- **PERFORMANCE_OPTIMIZATION.md** - Optimisations détaillées
- **ACCESSIBILITY_INTEGRATION_COMPLETE.md** - Guide accessibilité
- **SUPABASE_ERROR_FIX.md** - Configuration Supabase

### Guides Techniques
- **TURBOPACK_SETUP.md** - Configuration Turbopack
- **COMPONENT_FIXES.md** - Corrections de composants
- **BUGFIXES.md** - Historique des corrections
- **FINAL_STATUS.md** - Statut du projet

### Référence
- **ACCESSIBILITY_QUICK_REFERENCE.md** - Référence rapide
- **SUPABASE_DIAGNOSTIC.md** - Diagnostic Supabase

---

## 🤝 Contribution

Les contributions sont les bienvenues!

### Workflow

1. **Fork** le projet
2. **Créer une branche** (`git checkout -b feature/AmazingFeature`)
3. **Commit** les changements (`git commit -m 'Add AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir une Pull Request**

### Standards

- ✅ Code TypeScript strict
- ✅ Tests pour les nouvelles fonctionnalités
- ✅ Documentation mise à jour
- ✅ Accessibilité WCAG AA
- ✅ Lint sans erreurs

---

## 🐛 Problèmes Connus

### Supabase "Failed to fetch"
**Solution:** Voir `SUPABASE_ERROR_FIX.md`

### Port 3000 occupé
**Solution:** Le serveur utilise automatiquement 3001/3002

### Cache corrompu
```bash
rm -rf .next
npm run dev
```

---

## 📄 Licence  

Ce projet est sous licence **MIT**.

---

## 👥 Équipe

**Elite Visuals Team**

- Architecture & Performance
- Accessibilité & UX
- IA & Collaboration

---

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) - Framework React
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - Composants accessibles
- [Konva.js](https://konvajs.org/) - Canvas 2D
- [Yjs](https://yjs.dev/) - CRDT pour collaboration

---

## 📞 Support

- **Documentation:** Voir `/docs`
- **Issues:** [GitHub Issues](https://github.com/votre-username/elite-visuals/issues)
- **Discord:** [Rejoindre la communauté](#)

---

**Fait avec ❤️ par l'équipe Elite Visuals**

*Dernière mise à jour: 2025-11-21*
