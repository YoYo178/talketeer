import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import ENV from '@src/common/ENV';
import { User } from '@src/models';

passport.use(new GoogleStrategy({
  clientID: ENV.GoogleClientId,
  clientSecret: ENV.GoogleClientSecret,
  callbackURL: `${ENV.BackendOrigin}/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile?.emails && profile.emails.length > 0 ? profile.emails[0].value : undefined;
    if (!email) {
      return done(new Error('No email found in Google profile'), false);
    }
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: email,
        username: email.split('@')[0],
        passwordHash: '',
        isVerified: true,
        verifiedAt: new Date(),
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

export default passport;