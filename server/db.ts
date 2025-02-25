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
  ? [decodeURIComponent(dbUrl.username), decodeURIComponent(dbUrl.password)] 
  : [undefined, undefined];

// Declare pool and db variables
let pool: ReturnType<typeof createPool>;
let db: ReturnType<typeof drizzle>;

try {
  log('Initializing MySQL connection pool...', 'database');
  pool = createPool({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port || '3306'),
    user: username,
    password: password,
    database: dbUrl.pathname.substring(1), // Remove leading '/'
    ssl: {
      rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Test the connection
  pool.getConnection().then(conn => {
    log('Successfully connected to MySQL database', 'database');
    conn.release();
  }).catch(err => {
    console.error('Failed to connect to MySQL:', err);
    process.exit(1);
  });

  // Initialize health monitoring
  initializeHealthMonitoring(pool);
  log('Database health monitoring initialized', 'database');

  db = drizzle(pool, { mode: 'default' });
} catch (error) {
  console.error('Error initializing MySQL connection:', error);
  process.exit(1);
}

export { pool, db };