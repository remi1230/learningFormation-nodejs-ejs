// app.js
require('dotenv').config();

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

// ===============================
// 1) CONFIG GLOBALE
// ===============================
const allowedOrigin =
  process.env.NODE_ENV === 'production'
    ? 'https://my1prod.com'
    : 'http://localhost:5173';

app.use(cors({
  origin: allowedOrigin,
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

// ===============================
// 2) STATIQUES
// ===============================
const UPLOAD_DIR = path.resolve(process.cwd(), 'public', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ⚠️ IMPORTANT : servir /app/public à la RACINE
app.use(express.static(path.join(__dirname, 'public')));

// Uploads accessibles sous /uploads
app.use('/uploads', express.static(UPLOAD_DIR));

// Variables pour EJS éventuelles
app.use((req, res, next) => {
  res.locals.protUrl = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  res.locals.hostUrl = process.env.NODE_ENV === 'production' ? 'my1prod.com' : 'localhost:3000';
  res.locals.baseUrl = process.env.NODE_ENV === 'production' ? '/nodejsmysql' : '';
  next();
});

// ===============================
// 3) ROUTES API (à la racine)
// ===============================
app.use('/api/auth', authRoutes);
app.use('/api', mainRoutes);
app.use('/api', userRoutes);
app.use('/api', serviceRoutes);
app.use('/api', schedulesRoutes);
app.use('/api', newsRoutes);
app.use('/api', appointmentRoutes);
app.use('/api/upload-image', makeUploadRoute(UPLOAD_DIR));

// ===============================
// 4) FALLBACK SPA
// ===============================
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;