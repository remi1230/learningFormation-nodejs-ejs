# Étape 1 : Build React
FROM node:20.19.1-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN npm run build

# Étape 2 : Build Backend
FROM node:20.19.1-alpine AS backend

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend ./

# Copier les fichiers build du frontend vers le dossier public du backend
COPY --from=frontend-builder /app/frontend/dist ./public

# (si ton backend sert les fichiers statiques depuis ./public)
EXPOSE 3000

CMD ["node", "index.js"]