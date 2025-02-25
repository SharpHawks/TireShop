import { createPool } from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set",
  );
}

// Parse DATABASE_URL
const dbUrl = new URL(process.env.DATABASE_URL);
const username = decodeURIComponent(dbUrl.username);
const password = decodeURIComponent(dbUrl.password);
const database = dbUrl.pathname.substring(1); // Remove leading '/'

export const pool = createPool({
  host: dbUrl.hostname,
  user: username,
  password: password,
  database: database,
  port: parseInt(dbUrl.port || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const db = drizzle(pool);