// backend/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../model');

// ---- SERIALIZE / DESERIALIZE ----
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user || false);
  } catch (err) {
    done(err);
  }
});

// ---- BASE PUBLIQUE (dev vs prod) ----
// PUBLIC_BASE peut être injecté via env pour surcharger si besoin
const isProd = process.env.NODE_ENV === 'production';
const PUBLIC_BASE =
  process.env.PUBLIC_BASE
  || (isProd ? 'https://my1prod.com/nodejsmysql' : 'http://localhost:3000');

// Ex: callback final = https://my1prod.com/nodejsmysql/api/auth/google/callback
const CALLBACK_URL = `${PUBLIC_BASE.replace(/\/+$/,'')}/api/auth/google/callback`;

// ---- STRATEGIE GOOGLE ----
passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile?.emails?.[0]?.value;
      if (!email) {
        return done(new Error('Impossible de récupérer l’email Google.'));
      }

      const [user] = await User.findOrCreate({
        where: { email },
        defaults: {
          firstName: profile?.name?.givenName || '',
          lastName:  profile?.name?.familyName || '',
          password:  '',     // auth OAuth ⇒ pas de mot de passe local
          role:      'Patient',
        },
      });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

module.exports = passport;