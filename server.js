// Importation des modules nécessaires
const http = require('http');
const app = require('./app');
const sequelize = require('./config/database'); // Importez la configuration de la base de données

/**
 * Fonction pour normaliser le port sur lequel le serveur va écouter.
 * Ceci est utile pour s'assurer que le port est sous une forme correcte et utilisable.
 * 
 * @param {string|number} val - La valeur du port à normaliser.
 * @returns {number|string|boolean} Le port normalisé sous forme de numéro, ou une chaîne si pipe, ou false si invalide.
 */
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val; // retourne la valeur originale si ce n'est pas un nombre
  }
  if (port >= 0) {
    return port; // retourne le port si positif
  }
  return false; // retourne false si le port est négatif
};

// Définition du port sur lequel le serveur va écouter
const port = normalizePort('3000');
app.set('port', port);

/**
 * Gestionnaire d'erreurs pour le serveur.
 * Cette fonction est appelée en cas d'erreur lors de l'écoute du serveur sur le port.
 * 
 * @param {Object} error - L'objet d'erreur généré.
 */
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1); // sortie si le port nécessite des privilèges élevés
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1); // sortie si le port est déjà utilisé
      break;
    default:
      throw error;
  }
};

// Création du serveur HTTP en utilisant l'application Express
const server = http.createServer(app);

// Gestion des événements d'erreur et d'écoute du serveur
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind); // Log lors du démarrage de l'écoute du serveur
});

// Ajouter la commande SQL pour utiliser explicitement la base de données "dentiste"
sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie');
    return sequelize.query('USE dentiste');  // Utiliser explicitement la base de données dentiste
  })
  .then(() => {
    
    return sequelize.sync({ force: false });  // Synchroniser les tables après avoir sélectionné la base
  })
  .then(() => {
    console.log('La base de données a été synchronisée');
    server.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Erreur lors de la synchronisation de la base de données :', err);
  });

