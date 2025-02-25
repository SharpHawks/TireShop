import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import { initializeHealthMonitoring } from './services/health';
import { log } from './vite';

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const { Pool } = pg;
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize health monitoring
initializeHealthMonitoring(pool);
log('Database health monitoring initialized', 'database');

export const db = drizzle(pool, { schema });