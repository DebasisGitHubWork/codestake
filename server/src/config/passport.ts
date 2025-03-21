import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

// Check if GitHub credentials are available
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';

// Only set up GitHub OAuth if credentials are available
if (githubClientId && githubClientSecret) {
  console.log('GitHub OAuth is configured and enabled');
  
  // GitHub OAuth Strategy
  passport.use(new GitHubStrategy({
    clientID: githubClientId,
    clientSecret: githubClientSecret,
    callbackURL: `${serverUrl}/api/auth/github/callback`,
    scope: ['user:email'],
  }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ githubId: profile.id });

      if (user) {
        return done(null, user);
      }

      // Get primary email from GitHub
      const email = profile.emails && profile.emails[0]?.value;

      // Create a new user
      user = new User({
        githubId: profile.id,
        email: email,
        username: profile.username,
        displayName: profile.displayName || profile.username,
        avatar: profile.photos?.[0]?.value,
      });

      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  }));
} else {
  console.warn('GitHub OAuth is not configured. GitHub login will not work.');
  console.warn('To enable GitHub login, set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in your .env file');
}

// Serialize user
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport; 