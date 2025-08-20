# Étape 1 : Build React (frontend)
FROM node:20.19.1-alpine AS frontend-builder

WORKDIR /app/frontend

# Copie explicite des fichiers de dépendances
COPY frontend/package.json frontend/package-lock.json ./

# Installation propre et stricte
RUN npm ci

# Copie du code et build
COPY frontend ./
RUN npm run build


# Étape 2 : Backend (Node + Express + API)
FROM node:20.19.1-alpine AS backend

WORKDIR /app

# Copie explicite des fichiers de dépendances du backend
COPY backend/package.json backend/package-lock.json ./

# Installation propre en prod uniquement
RUN npm ci --omit=dev

# Vérification des dépendances (échoue si un module est manquant)
RUN npm ls --omit=dev --depth=0

# Copie du code backend directement dans /app
COPY backend/ ./

# Copier les fichiers build du frontend vers le dossier public du backend
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 3000

# Lancer le serveur
CMD ["node", "server.js"]