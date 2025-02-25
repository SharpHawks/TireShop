import { createPool } from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema";
import { initializeHealthMonitoring } from './services/health';
import { log } from './vite';

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Parse DATABASE_URL to extract MySQL connection details
const dbUrl = new URL(process.env.DATABASE_URL);
const [username, password] = (dbUrl.username && dbUrl.password) 
  ? [dbUrl.username, dbUrl.password] 
  : [undefined, undefined];

export const pool = createPool({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port || '3306'),
  user: username,
  password: password,
  database: dbUrl.pathname.substring(1), // Remove leading '/'
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize health monitoring
initializeHealthMonitoring(pool);
log('Database health monitoring initialized', 'database');

export const db = drizzle(pool, { schema, mode: 'default' });