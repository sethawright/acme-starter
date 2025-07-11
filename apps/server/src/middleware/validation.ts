import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError, z } from 'zod'

export interface ValidationSchemas {
  body?: ZodSchema
  query?: ZodSchema
  params?: ZodSchema
  headers?: ZodSchema
}

export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      if (schemas.body) {
        req.body = schemas.body.parse(req.body)
      }

      // Validate query parameters
      if (schemas.query) {
        req.query = schemas.query.parse(req.query)
      }

      // Validate route parameters
      if (schemas.params) {
        req.params = schemas.params.parse(req.params)
      }

      // Validate headers
      if (schemas.headers) {
        req.headers = schemas.headers.parse(req.headers)
      }

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
            received: err.received,
          })),
          timestamp: new Date().toISOString(),
        })
      }
      next(error)
    }
  }
}

// Convenience functions for common validation scenarios
export const validateBody = (schema: ZodSchema) => validate({ body: schema })
export const validateQuery = (schema: ZodSchema) => validate({ query: schema })
export const validateParams = (schema: ZodSchema) => validate({ params: schema })
export const validateHeaders = (schema: ZodSchema) => validate({ headers: schema })

// Common validation schemas
export const commonSchemas = {
  id: z.object({
    id: z.string().uuid('Invalid ID format'),
  }),
  pagination: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
  }),
}
