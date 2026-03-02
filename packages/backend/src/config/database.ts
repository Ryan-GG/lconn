import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema';
import dotenv from 'dotenv';

// Load environment variables (safe to call multiple times)
dotenv.config();

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create connection pool
export const pool = new Pool({
  connectionString,
});

// Create Drizzle instance
export const db = drizzle(pool, { schema });
