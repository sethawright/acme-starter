import { HealthResponse } from '@acme/api-types'

export class HealthService {
  /**
   * Get application health status
   * @returns Health response with status and timestamp
   */
  public getHealth(): HealthResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Perform detailed health check (can be extended for database, external services, etc.)
   * @returns Detailed health information
   */
  public async getDetailedHealth(): Promise<HealthResponse & { details?: unknown }> {
    const basicHealth = this.getHealth()

    // TODO: Add checks for:
    // - Database connection
    // - External service availability
    // - Memory usage
    // - CPU usage
    // - Disk space

    return {
      ...basicHealth,
      details: {
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        version: process.version,
        platform: process.platform,
        arch: process.arch,
      },
    }
  }
}

// Export singleton instance
export const healthService = new HealthService()
