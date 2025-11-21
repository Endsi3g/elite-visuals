# 🎨 Elite Visuals - MVP IA de Création Visuelle & Collaboration

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-green)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)](https://vercel.com)

**Le premier OS Créatif Collaboratif pour agences francophones**

> 🔗 **Repository GitHub** : [https://github.com/Endsi3g/elite-visuals](https://github.com/Endsi3g/elite-visuals)  
> 🚀 **Déploiement Vercel** : [https://elite-visuals.vercel.app](https://elite-visuals.vercel.app)

Application web moderne fusionnant idéation (whiteboard), gestion de projet (Kanban IA) et production (GenAI) dans une interface unifiée.

## ✨ Fonctionnalités Principales

### 🖼️ Board Visuel Infini
- **Canvas interactif** avec zoom/pan illimité (Konva.js)
- **Universal Drag & Drop** : Images, vidéos, PDF, URLs
- **Smart Clustering** : Organisation assistée par IA
- **Design Luma-style** : Interface épurée et animations fluides

### 🤖 IA Multi-modale (100% Open Source)
- **Ollama LLM** : Llama 3, Mistral (local, gratuit)
- **LLaVA Vision** : Analyse d'images
- **Transcription** : Whisper via HuggingFace
- **Génération** : Support pour Luma AI (vidéo) et Claude 3.5

### 📋 Kanban & Agents Autonomes
- **Dual View** : Basculer entre Board et Kanban
- **Agent Delegation** : Attribution de tâches à des agents IA (Copywriter, Designer, Analyzer)
- **Suivi automatisé** : Notifications de complétion

### 👥 Collaboration
- **Temps réel** : Yjs + Supabase Realtime
- **Mode Showroom** : Présentation client sans distraction
- **Exports** : PDF, Markdown

## 🚀 Installation

### Prérequis
- Node.js 18+
- Ollama (pour l'IA locale)
- Clés API (Supabase, et optionnellement HuggingFace/Anthropic/Luma)

### Démarrage Rapide

1. **Cloner et installer**
```bash
git clone https://github.com/Endsi3g/elite-visuals.git
cd elite-visuals
npm install
```

2. **Configuration**
```bash
cp .env.local.example .env.local
# Éditer .env.local avec vos variables
```

3. **Lancer en développement**
```bash
npm run dev
```

## 🛠️ Stack Technique

- **Frontend** : Next.js 14, React 18, TailwindCSS, Framer Motion
- **Canvas** : Konva.js
- **Backend** : Supabase (Auth, DB, Realtime, Storage)
- **IA** : Ollama (Local), HuggingFace, Anthropic

## 🔧 Maintenance & Audit

Le projet inclut des outils d'audit automatisés pour maintenir la qualité du code et de la documentation.

### Scripts Disponibles

- **Audit Complet** : `npm run audit:full` - Vérifie les fichiers redondants, valide les connexions et lance les tests.
- **Audit Projet** : `npm run audit:project` - Nettoie les fichiers Markdown inutiles.
- **Audit Accessibilité** : `npm run audit:accessibility` - Vérifie la conformité WCAG.

> Pour plus de détails sur la maintenance, consultez les scripts dans le dossier `scripts/`.

## 📂 Documentation

Documentation détaillée disponible dans le dossier `/docs` :
- [Tests](./docs/testing/QUICK_START.md)
- [Performance](./docs/performance/QUICK_START.md)
- [Monitoring](./docs/monitoring/QUICK_START.md)
- [Supabase](./supabase/README.md)

## 🤝 Contribution

Les Pull Requests sont les bienvenues. Veuillez consulter [CONTRIBUTING.md](CONTRIBUTING.md) pour les directives.

## 📄 Licence

MIT © 2024 Elite Visuals
