// Charge les variables d'environnement depuis un fichier `.env`
require('dotenv').config();

// Importations des dépendances nécessaires
const express       = require('express');
const { sequelize } = require('./model');
const path          = require('path');
const cors          = require('cors');

//Auth google
const session = require('cookie-session');
const passport = require('passport');
require('./config/passport');

// Importation du modèle de BDD
const Appointment = require('./model/Appointment');
const News        = require('./model/News');
const User        = require('./model/User');
const Schedule    = require('./model/Schedules');
const Service     = require('./model/Service');

// Création d'une instance d'application Express
const app = express();
//app.set('view engine', 'ejs');

app.use(session({
  secret: 'supersecret',
  maxAge: 24 * 60 * 60 * 1000
}));
app.use(passport.initialize());
app.use(passport.session());

// Configuration de la connexion à MySQL
const port = 3000;

sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`L'application écoute sur le port ${port}`);
    console.log("La base de données a été synchronisée.");
  });
});

// Activation du CORS pour permettre les requêtes cross-origin
app.use(cors());

// Configuration du cache HTTP pour toutes les réponses
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

// Activation de l'analyse du corps des requêtes JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serveur de fichiers statiques pour le répertoire 'public'
app.use('/public', express.static(path.join(__dirname, 'public')));

// Lien dynamique selon dev ou prod
app.use((req, res, next) => {
  res.locals.protUrl = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  res.locals.hostUrl = process.env.NODE_ENV === 'production' ? 'my1prod.com' : 'localhost:3000';
  res.locals.baseUrl = process.env.NODE_ENV === 'production' ? '/nodejsmysql' : '';
  next();
})

// Importation et utilisation des routeurs pour différentes parties de l'application
const mainRoutes        = require('./routes/main');
const userRoutes        = require('./routes/user');
const serviceRoutes     = require('./routes/service');
const schedulesRoutes   = require('./routes/schedules');
const newsRoutes        = require('./routes/news');
const appointmentRoutes = require('./routes/appointment');
app.use('/api', mainRoutes);
app.use('/api', userRoutes);
app.use('/api', serviceRoutes);
app.use('/api', schedulesRoutes);
app.use('/api', newsRoutes);
app.use('/api', appointmentRoutes);

//Auth Google
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes); 

// Exportation de l'application pour utilisation dans d'autres fichiers, par exemple le serveur
module.exports = app;