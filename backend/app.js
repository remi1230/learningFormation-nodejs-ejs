// app.js
require('dotenv').config();

const basePath = process.env.BASE_PATH || '/';
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const session = require('cookie-session');
const passport = require('passport');
require('./config/passport');

const { sequelize } = require('./model');

const mainRoutes        = require('./routes/main');
const userRoutes        = require('./routes/user');
const serviceRoutes     = require('./routes/service');
const schedulesRoutes   = require('./routes/schedules');
const newsRoutes        = require('./routes/news');
const appointmentRoutes = require('./routes/appointment');
const authRoutes        = require('./routes/auth.routes');
const makeUploadRoute   = require('./routes/uploadRoute');

const app = express();

// =====================================================
// 1) CONFIG GLOBALE
// =====================================================

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET || 'dev',
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: 'lax',
}));

app.use(passport.initialize());
app.use(passport.session());

const UPLOAD_DIR = path.resolve(process.cwd(), 'public', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use(basePath + 'public',  express.static(path.join(__dirname, 'public')));
app.use(basePath + 'uploads', express.static(UPLOAD_DIR));

app.use((req, res, next) => {
  res.locals.protUrl = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  res.locals.hostUrl = process.env.NODE_ENV === 'production' ? 'my1prod.com' : 'localhost:3000';
  res.locals.baseUrl = process.env.NODE_ENV === 'production' ? '/nodejsmysql' : '';
  next();
});

// =====================================================
// 2) ROUTES API
// =====================================================

app.use(basePath + 'api/auth', authRoutes);
app.use(basePath + 'api', mainRoutes);
app.use(basePath + 'api', userRoutes);
app.use(basePath + 'api', serviceRoutes);
app.use(basePath + 'api', schedulesRoutes);
app.use(basePath + 'api', newsRoutes);
app.use(basePath + 'api', appointmentRoutes);
app.use(basePath + 'api/upload-image', makeUploadRoute(UPLOAD_DIR));


// =====================================================
// 3) FALLBACK POUR REACT (SPA)
// =====================================================

app.get('*', (req, res, next) => {
  if (
    req.path.startsWith(basePath + 'api') ||
    req.path.startsWith(basePath + 'uploads') ||
    req.path.startsWith(basePath + 'public')
  ) {
    return next();
  }

  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// =====================================================
// 4) LANCEMENT
// =====================================================

/*const port = process.env.PORT || 3000;

sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`API sur http://localhost:${port}`);
    console.log('DB synchronisée.');
  });
});*/

module.exports = app;