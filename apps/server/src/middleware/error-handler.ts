import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { config } from '../config'

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export class HttpError extends Error implements AppError {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler = (
  error: AppError | ZodError | Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500
  let message = 'Internal Server Error'
  let details: unknown = undefined

  // Handle different error types
  if (error instanceof ZodError) {
    statusCode = 400
    message = 'Validation Error'
    details = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
    }))
  } else if (error instanceof HttpError) {
    statusCode = error.statusCode
    message = error.message
  } else if (error.name === 'ValidationError') {
    statusCode = 400
    message = 'Validation Error'
    details = error.message
  } else if (error.name === 'CastError') {
    statusCode = 400
    message = 'Invalid ID format'
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired'
  } else if ('statusCode' in error && error.statusCode) {
    statusCode = error.statusCode
    message = error.message
  }

  // Log error (in production, you'd want to use a proper logger)
  if (statusCode >= 500) {
    console.error('❌ Server Error:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString(),
    })
  } else {
    console.warn('⚠️  Client Error:', {
      message: error.message,
      url: req.url,
      method: req.method,
      ip: req.ip,
      timestamp: new Date().toISOString(),
    })
  }

  // Send error response
  const response: Record<string, unknown> = {
    error: message,
    timestamp: new Date().toISOString(),
  }
  
  if (details) {
    response.details = details
  }
  
  if (config.NODE_ENV === 'development') {
    response.stack = error.stack
  }
  
  res.status(statusCode).json(response)
}

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
  })
}

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
