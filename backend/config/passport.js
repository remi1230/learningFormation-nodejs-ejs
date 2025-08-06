const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../model');

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;
  const [user] = await User.findOrCreate({
    where: { email },
    defaults: {
      firstName: profile.name.givenName,
      lastName:  profile.name.familyName,
      password:  '', // peut être vide ou généré
      role:      'Patient'
    }
  });
  return done(null, user);
}));