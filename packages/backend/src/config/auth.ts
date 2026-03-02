import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { db } from './database';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load environment variables (safe to call multiple times)
dotenv.config();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL!;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !GITHUB_CALLBACK_URL) {
  throw new Error('GitHub OAuth environment variables are required');
}

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        // Check if user exists
        const existingUsers = await db
          .select()
          .from(users)
          .where(eq(users.githubId, profile.id))
          .limit(1);

        if (existingUsers.length > 0) {
          return done(null, existingUsers[0]);
        }

        // Create new user
        const newUser = await db
          .insert(users)
          .values({
            githubId: profile.id,
            githubUsername: profile.username,
            avatarUrl: profile.photos?.[0]?.value,
          })
          .returning();

        return done(null, newUser[0]);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (userResults.length === 0) {
      return done(null, false);
    }

    done(null, userResults[0]);
  } catch (error) {
    done(error);
  }
});

export default passport;
