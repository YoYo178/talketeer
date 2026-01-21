import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import ENV from '@src/common/ENV';
import { User } from '@src/models';

const isProduction = ENV.NodeEnv === 'production';
const callbackURL = new URL((isProduction ? '/talketeer' : '') + '/api/auth/google/callback', ENV.BackendOrigin);

passport.use(new GoogleStrategy({
  clientID: ENV.GoogleClientId,
  clientSecret: ENV.GoogleClientSecret,
  callbackURL: callbackURL.toString(),
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    const googleEmail = profile.emails?.[0]?.value;

    if (!googleEmail)
      return done(new Error('There was an error while fetching your email from Google.'), false);

    let user = await User.findOne({ email: googleEmail });

    // If the user does not exist, create a new one
    user ??= await User.create({
      name: profile.displayName,
      displayName: profile.displayName,
      email: googleEmail,
      username: profile.username ?? googleEmail.split('@')[0],
      passwordHash: '', // TODO: Add change password functionality to allow user to set their password in case of an OAuth2 registration.

      isVerified: true, // OAuth2 speciality, no mail verification needed
      verifiedAt: new Date(), // OAuth2 speciality, no mail verification needed
    });

    const { _id, username, email } = user.toObject();

    return done(null, { id: _id.toString(), username, email });
  } catch (err) {
    return done(err, false);
  }
}));

export default passport;