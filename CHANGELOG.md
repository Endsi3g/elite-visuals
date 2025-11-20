# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [Non publié]

### Ajouté
- 🚀 Configuration complète de déploiement (Vercel, Netlify, Railway, Docker)
- 🔄 Workflow GitHub Actions pour CI/CD automatique
- 📝 Fichier `.env.example` avec documentation des variables d'environnement
- ⚙️ Configuration `vercel.json` optimisée
- 📚 Guide de déploiement complet (`DEPLOYMENT.md`)
- 🔧 Optimisation Next.js pour production (output standalone, compression)
- 🧪 Intégration Autonoma pour tests automatisés (`lib/autonoma.ts`)
- 📖 Guide complet Vercel CLI (`VERCEL_CLI.md`)

### Modifié
- ⚡ Configuration `next.config.js` avec `remotePatterns` et optimisations
- 🔧 Configuration webpack pour exclure `canvas` et `konva` du bundle serveur
- 📖 Documentation de déploiement améliorée avec guides détaillés

### Corrigé
- 🐛 Erreur de build "Module not found: Can't resolve 'canvas'" avec Konva
- ⚠️ Warning `experimental.serverActions` deprecated (supprimé)

### À venir
- Tests E2E avec Playwright
- Mode présentation client
- Recherche IA sur le board
- Export PDF/PNG/MP4 avec watermark

## [0.1.0] - 2024-11-19

### Ajouté
- 🎨 Board visuel infini avec Konva.js
- 🤖 Intégration Ollama pour LLM local (Llama 3, Mistral, LLaVA)
- 📋 Kanban avec agents IA autonomes
- 👥 Collaboration temps réel avec Supabase
- 🎯 Drag & Drop universel (vidéos, images, PDFs, URLs)
- 🔥 Intégration Luma AI pour génération vidéo/image
- 💬 Système de commentaires sur le board
- 🎨 Design Elite Visuals (blanc + orange #FF684A)
- 📚 Documentation complète (README, INSTALLATION, guides)
- 🗄️ Schéma Supabase complet avec RLS
- 🔐 Authentification et gestion des utilisateurs
- 📱 Interface responsive

### Fonctionnalités Principales
- Canvas interactif avec zoom/pan illimité
- Smart clustering et analyse sémantique
- Agents IA : OpenAI, Claude, Luma, Ollama
- 4 colonnes Kanban : Backlog, En cours, Review, Validé
- Upload et analyse automatique de médias
- Transcription audio avec Whisper
- Génération de scripts et briefs IA
- Collaboration multi-utilisateurs
- Exports intelligents (PDF, Markdown)

### Technique
- Next.js 14 avec App Router
- React 18 + TypeScript
- TailwindCSS customisé
- Supabase (Auth, Database, Storage, Realtime)
- Konva.js pour le canvas
- Zustand pour le state management
- shadcn/ui pour les composants

### Documentation
- README complet avec workflows utilisateur
- Guide d'installation Windows/macOS/Linux
- Guide de configuration Ollama
- Guide de configuration Supabase
- Guide de déploiement (Vercel, Netlify, Railway, Docker)
- Templates GitHub (Issues, PRs)
- Guide de contribution
- Workflows CI/CD avec GitHub Actions
- Licence MIT

## [0.0.1] - 2024-11-01

### Ajouté
- Configuration initiale du projet
- Structure de base Next.js
- Configuration TailwindCSS
- Composants UI de base

---

## Types de Changements

- **Ajouté** : pour les nouvelles fonctionnalités
- **Modifié** : pour les changements dans les fonctionnalités existantes
- **Déprécié** : pour les fonctionnalités qui seront bientôt supprimées
- **Supprimé** : pour les fonctionnalités supprimées
- **Corrigé** : pour les corrections de bugs
- **Sécurité** : en cas de vulnérabilités

## Liens

- [Non publié]: https://github.com/Endsi3g/elite-visuals/compare/v0.1.0...HEAD
- [0.1.0]: https://github.com/Endsi3g/elite-visuals/releases/tag/v0.1.0
- [0.0.1]: https://github.com/Endsi3g/elite-visuals/releases/tag/v0.0.1
