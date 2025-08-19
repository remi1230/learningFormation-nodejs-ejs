const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware JWT
const auth = require('../middleware/auth');
router.get('/me', auth, async (req, res) => {
  const userId = req.auth.userId;
  if(userId === 9998 || userId === 9999) {
    const userRole = userId === 9998 ? 'Patient' : 'Professional';
    const dayDate  = new Date();

    let user       = {};
    user.id        = userId;
    user.firstName = 'Pour';
    user.lastName  = 'démonstration';
    user.email     = 'pour.test@gmail.com';
    user.role      = userRole;
    user.password  = userRole;
    user.obsolete  = 0;
    user.createdAt = dayDate;
    user.updatedAt = dayDate;
    user.serviceId = userRole === 'Patient' ? undefined : 1;

    return res.json(user);
  }

  const { User } = require('../model');
  const user = await User.findByPk(req.auth.userId, {
    attributes: { exclude: ['password'] }
  });
  res.json(user);
});

// Démarre le login avec Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false
}));

// Callback Google → JWT + Cookie
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user.id, userRole: req.user.role },
      'RANDOM_TOKEN_SECRET',
      { expiresIn: '24h' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 3600 * 1000
    });
    res.redirect('http://localhost:5173/take-appointment'); // ou autre redirection frontend
  }
);

// ▼▼ Déconnexion JWT (efface le cookie) ▼▼
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',     // mets 'none' + secure:true si front et API sont sur domaines différents en prod HTTPS
    secure: false,       // true en prod HTTPS
  });
  return res.sendStatus(204);
});

module.exports = router;