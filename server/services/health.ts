import { Pool } from '@neondatabase/serverless';
import { log } from '../vite';

export interface DatabaseHealth {
  isConnected: boolean;
  poolSize: number;
  activeConnections: number;
  waitingConnections: number;
  latencyMs: number;
  lastChecked: Date;
  error?: string;
}

export class DatabaseHealthMonitor {
  private pool: Pool;
  private lastHealth: DatabaseHealth | null = null;
  private checkInterval: NodeJS.Timer | null = null;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async checkHealth(): Promise<DatabaseHealth> {
    const startTime = Date.now();
    try {
      // Test query to check database connectivity
      await this.pool.query('SELECT 1');
      const latencyMs = Date.now() - startTime;

      // Get pool statistics
      const poolStats = await this.getPoolStats();

      const health: DatabaseHealth = {
        isConnected: true,
        poolSize: poolStats.totalCount,
        activeConnections: poolStats.activeCount,
        waitingConnections: poolStats.waitingCount,
        latencyMs,
        lastChecked: new Date(),
      };

      this.lastHealth = health;
      return health;
    } catch (error) {
      const health: DatabaseHealth = {
        isConnected: false,
        poolSize: 0,
        activeConnections: 0,
        waitingConnections: 0,
        latencyMs: Date.now() - startTime,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      this.lastHealth = health;
      log(`Database health check failed: ${health.error}`, 'health');
      return health;
    }
  }

  private async getPoolStats() {
    const stats = {
      totalCount: this.pool.totalCount,
      waitingCount: this.pool.waitingCount,
      activeCount: this.pool.idleCount,
    };
    return stats;
  }

  startMonitoring(intervalMs: number = 30000) {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(async () => {
      try {
        const health = await this.checkHealth();
        if (!health.isConnected) {
          log('Database connection is down!', 'health');
        }
      } catch (error) {
        log(`Error in health monitoring: ${error}`, 'health');
      }
    }, intervalMs);

    log('Database health monitoring started', 'health');
  }

  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  getLastHealth(): DatabaseHealth | null {
    return this.lastHealth;
  }
}

let monitor: DatabaseHealthMonitor | null = null;

export function initializeHealthMonitoring(pool: Pool): DatabaseHealthMonitor {
  if (!monitor) {
    monitor = new DatabaseHealthMonitor(pool);
    monitor.startMonitoring();
  }
  return monitor;
}

export function getHealthMonitor(): DatabaseHealthMonitor | null {
  return monitor;
}
