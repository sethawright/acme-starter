import { z } from 'zod'

// Response schemas
export const HealthResponseSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
})

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  })

// Export types
export type HealthResponse = z.infer<typeof HealthResponseSchema>
export type ApiResponse<T> = {
  data?: T
  error?: string
  message?: string
}
