import { Request, Response } from 'express'
import { HealthResponseSchema } from '@acme/api-types'
import { healthService } from '../services/health.service'
import { asyncHandler } from '../middleware/error-handler'

export class HealthController {
  /**
   * GET /health
   * Basic health check endpoint
   */
  public getHealth = asyncHandler(async (req: Request, res: Response) => {
    const health = healthService.getHealth()

    // Validate response against schema
    const validatedResponse = HealthResponseSchema.parse(health)

    res.status(200).json(validatedResponse)
  })

  /**
   * GET /health/detailed
   * Detailed health check endpoint
   */
  public getDetailedHealth = asyncHandler(async (req: Request, res: Response) => {
    const health = await healthService.getDetailedHealth()

    // For detailed health, we might want to extend the schema
    // For now, just return the basic validated response with details
    const validatedResponse = HealthResponseSchema.parse({
      status: health.status,
      timestamp: health.timestamp,
    })

    res.status(200).json({
      ...validatedResponse,
      details: health.details,
    })
  })
}

// Export singleton instance
export const healthController = new HealthController()
