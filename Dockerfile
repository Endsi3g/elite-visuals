# Dockerfile pour Elite Visuals - Next.js App
FROM node:20-alpine AS base

# Installer les dépendances nécessaires
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --legacy-peer-deps

# Copier le reste des fichiers
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Variables d'environnement par défaut
ENV NODE_ENV=development
ENV PORT=3000

# Commande de démarrage
CMD ["npm", "run", "dev"]
