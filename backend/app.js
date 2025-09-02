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
const isProd = process.env.NODE_ENV === 'production';

// IMPORTANT : derrière Nginx/Cloudflare
app.set('trust proxy', 1);

// ===============================
// 1) CORS (dev + prod)
// ===============================
const allowlist = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://my1prod.com',
]);

app.use(cors({
  origin(origin, cb) {
    // Requêtes sans Origin (curl, SSR, fichiers statiques) -> autoriser
    if (!origin) return cb(null, true);
    return cb(null, allowlist.has(origin));
  },
  credentials: true,
}));

// Preflight explicite (utile avec credentials)
app.options('*', cors());

// Cache no-store (utile pour /auth/me, etc.)
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ===============================
// 2) Sessions (cookies)
// ===============================
// En prod (HTTPS), 'none' + secure:true évite les soucis au retour OAuth
app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET || 'dev',
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: isProd ? 'none' : 'lax',
  secure:   isProd ? true    : false,
}));

app.use(passport.initialize());
app.use(passport.session());




// ===============================
// 3) Statics
// ===============================
const UPLOAD_DIR = path.resolve(process.cwd(), 'public', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Servir le build du front à la racine (Nginx strippe /nodejsmysql/)
app.use(express.static(path.join(__dirname, 'public')));

// Uploads sous /uploads
app.use('/uploads', express.static(UPLOAD_DIR));

// Variables pour EJS éventuelles (facultatif)
app.use((req, res, next) => {
  res.locals.protUrl = isProd ? 'https' : 'http';
  res.locals.hostUrl = isProd ? 'my1prod.com' : 'localhost:3000';
  res.locals.baseUrl = isProd ? '/nodejsmysql' : '';
  next();
});


// ===============================
// 4) API
// ===============================
app.use('/api/auth', authRoutes);
app.use('/api', mainRoutes);
app.use('/api', userRoutes);
app.use('/api', serviceRoutes);
app.use('/api', schedulesRoutes);
app.use('/api', newsRoutes);
app.use('/api', appointmentRoutes);
app.use('/api/upload-image', makeUploadRoute(UPLOAD_DIR));

// Petit endpoint de santé (pratique pour vérifier rapidement)
app.get('/api/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// ===============================
// 5) Fallback SPA
// ===============================
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;