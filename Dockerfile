# Utiliser l'image officielle de Node.js avec Alpine Linux
FROM node:alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier package.json et package-lock.json (si présent)
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier les autres fichiers et dossiers du projet dans le conteneur
COPY . .

# Télécharger le script wait-for-it
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh

# Donner les permissions d'exécution au script wait-for-it
RUN chmod +x /wait-for-it.sh

# Exposer le port sur lequel l'application va s'exécuter
EXPOSE 3000

# Utiliser wait-for-it pour attendre que MySQL soit prêt avant de démarrer l'application
CMD ["./wait-for-it.sh", "db:3306", "--", "npm", "start"]