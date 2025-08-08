// app.js
require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

// --- Auth / session (Google + login classique)
const session = require('cookie-session');
const passport = require('passport');
require('./config/passport');

// --- BDD (si besoin d'init)
const { sequelize } = require('./model');

// --- Routes métier
const mainRoutes        = require('./routes/main');
const userRoutes        = require('./routes/user');
const serviceRoutes     = require('./routes/service');
const schedulesRoutes   = require('./routes/schedules');
const newsRoutes        = require('./routes/news');
const appointmentRoutes = require('./routes/appointment');
const authRoutes        = require('./routes/auth.routes');

// --- Upload (factory pour lui passer le chemin d'uploads)
const makeUploadRoute   = require('./routes/uploadRoute'); // <= doit exporter une fonction(UPLOAD_DIR)

const app = express();

// =====================================================
// 1) CONFIG GLOBALE
// =====================================================

// CORS AVANT les routes (autorise cookies côté front)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Pas de cache côté client (utile pour auth/me)
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session (AVANT passport & routes)
app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET || 'dev',
  maxAge: 24 * 60 * 60 * 1000,
  // Si front et back sont sur des origines différentes en HTTPS :
  // sameSite: 'none', secure: true
  sameSite: 'lax',
}));

app.use(passport.initialize());
app.use(passport.session());

// Static (ok ici, ne touche pas /api/*)
const UPLOAD_DIR = path.resolve(process.cwd(), 'public', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use('/public',  express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOAD_DIR));

// Variables d’env pour les vues EJS éventuelles
app.use((req, res, next) => {
  res.locals.protUrl = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  res.locals.hostUrl = process.env.NODE_ENV === 'production' ? 'my1prod.com' : 'localhost:3000';
  res.locals.baseUrl = process.env.NODE_ENV === 'production' ? '/nodejsmysql' : '';
  next();
});

// =====================================================
// 2) ROUTES API
// =====================================================

// Auth
app.use('/api/auth', authRoutes);

// CRUDs
app.use('/api', mainRoutes);
app.use('/api', userRoutes);
app.use('/api', serviceRoutes);
app.use('/api', schedulesRoutes);
app.use('/api', newsRoutes);
app.use('/api', appointmentRoutes);

// Upload (route dédiée)
//  - POST /api/upload-image
//  - renvoie { url: '/uploads/xxx.ext' }
app.use('/api/upload-image', makeUploadRoute(UPLOAD_DIR));

// =====================================================
// 3) LANCEMENT
// =====================================================
const port = process.env.PORT || 3000;

sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`API sur http://localhost:${port}`);
    console.log('DB synchronisée.');
  });
});

module.exports = app;