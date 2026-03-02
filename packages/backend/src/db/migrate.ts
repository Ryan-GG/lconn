import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const runMigrations = async () => {
  const connectionString = process.env.DATABASE_URL!;

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  console.log('Running migrations...');

  await migrate(db, { migrationsFolder: './src/db/migrations' });

  console.log('Migrations completed successfully');

  await pool.end();
  process.exit(0);
};

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
