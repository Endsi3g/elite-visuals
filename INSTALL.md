# 🚀 Guide d'Installation Elite Visuals

## Installation Rapide

### 1. Installer les dépendances

```bash
cd elite-visuals
npm install
```

### 2. Installer les dépendances manquantes (si nécessaire)

```bash
npm install tailwindcss-animate
```

### 3. Configuration des variables d'environnement

Copier le fichier d'exemple :
```bash
copy .env.local.example .env.local
```

Éditer `.env.local` avec vos clés API réelles.

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Configuration Firebase

1. Créer un projet sur [Firebase Console](https://console.firebase.google.com/)
2. Activer Authentication (Google, Email/Password)
3. Créer une base Firestore
4. Créer un Storage bucket
5. Copier les credentials dans `.env.local`

## Configuration OpenAI

1. Créer un compte sur [OpenAI Platform](https://platform.openai.com/)
2. Générer une clé API
3. Ajouter `OPENAI_API_KEY` dans `.env.local`

## Configuration Anthropic Claude

1. Créer un compte sur [Anthropic Console](https://console.anthropic.com/)
2. Générer une clé API
3. Ajouter `ANTHROPIC_API_KEY` dans `.env.local`

## Configuration Luma AI (Optionnel)

1. Accéder à [Luma Labs](https://lumalabs.ai/)
2. Obtenir une clé API (unofficial API)
3. Ajouter `LUMA_API_KEY` et `LUMA_API_URL` dans `.env.local`

## Structure des Dépendances

### Production
- `next@14.2.5` - Framework React
- `react@18.3.1` - Bibliothèque UI
- `typescript@5.5.4` - Typage statique
- `tailwindcss@3.4.9` - Styles CSS
- `konva@9.3.14` - Canvas 2D
- `react-konva@18.2.10` - Wrapper React pour Konva
- `openai@4.55.4` - SDK OpenAI
- `@anthropic-ai/sdk@0.25.2` - SDK Claude
- `axios@1.7.4` - Requêtes HTTP
- `firebase@10.12.5` - Backend Firebase
- `framer-motion@11.3.28` - Animations
- `zustand@4.5.4` - State management
- `lucide-react@0.427.0` - Icônes
- `react-dropzone@14.2.3` - Upload fichiers

### UI Components (shadcn/ui)
- `@radix-ui/react-dialog`
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-slot`
- `@radix-ui/react-tabs`
- `@radix-ui/react-toast`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`

## Commandes Disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint
```

## Résolution des Problèmes

### Erreur: Module not found

```bash
npm install
```

### Erreur: TypeScript

Les erreurs TypeScript avant l'installation des dépendances sont normales.

### Erreur: Canvas/Konva

Si Konva ne fonctionne pas :
```bash
npm install canvas konva react-konva --force
```

### Erreur: Firebase

Vérifier que toutes les variables d'environnement Firebase sont correctement configurées.

## Prochaines Étapes

1. ✅ Installer les dépendances
2. ✅ Configurer les variables d'environnement
3. ✅ Lancer le serveur
4. 🎨 Personnaliser le design
5. 🤖 Tester les intégrations IA
6. 👥 Configurer l'authentification
7. 🚀 Déployer en production

## Support

Pour toute question ou problème :
- 📧 Email : support@elitevisuals.com
- 💬 Discord : [Elite Visuals Community](#)
- 📚 Documentation : [docs.elitevisuals.com](#)
