import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  casing: "camelCase",
  verbose: true,
  dialect: 'postgresql',
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    user: 'lconn',
    password: 'lconn_dev',
    database: 'lconn',
    ssl: false,
  },
} satisfies Config;
