import morgan from 'morgan'
import { Request, Response, NextFunction, RequestHandler } from 'express'
import { config } from '../config'

// Create custom token for response time in milliseconds
morgan.token('response-time-ms', (req: Request) => {
  if (!req.startTime) return '-'
  const diff = Date.now() - req.startTime
  return diff + 'ms'
})

// Custom token for request ID (useful for tracing)
morgan.token('req-id', (req: Request) => {
  return (req.headers['x-request-id'] as string) || '-'
})

// Development format - colorized and detailed
const developmentFormat = morgan('dev')

// Production format - JSON structured for log aggregation
const productionFormat = morgan((tokens, req, res) => {
  const log = {
    timestamp: new Date().toISOString(),
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    responseTime: tokens['response-time'](req, res),
    contentLength: tokens.res(req, res, 'content-length'),
    referrer: tokens.referrer(req, res),
    userAgent: tokens['user-agent'](req, res),
    remoteAddr: tokens['remote-addr'](req, res),
    requestId: tokens['req-id'](req, res),
    userId: tokens['user-id'](req, res),
  }

  return JSON.stringify(log)
})

// Request timing middleware
export const requestTiming = (req: Request, _res: Response, next: NextFunction) => {
  req.startTime = Date.now()
  next()
}

// Choose logger based on environment
export const logger = config.NODE_ENV === 'production' ? productionFormat : developmentFormat

// Skip logging for health check in production
export const skipHealthCheck = (req: Request) => {
  if (config.NODE_ENV === 'production' && req.url === '/api/v1/health') {
    return true
  }
  return false
}

// Logger with health check skipping
export const loggerWithSkip: RequestHandler =
  config.NODE_ENV === 'production'
    ? morgan(
        (tokens, req, res) => {
          const log = {
            timestamp: new Date().toISOString(),
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: tokens.status(req, res),
            responseTime: tokens['response-time'](req, res),
            contentLength: tokens.res(req, res, 'content-length'),
            referrer: tokens.referrer(req, res),
            userAgent: tokens['user-agent'](req, res),
            remoteAddr: tokens['remote-addr'](req, res),
            requestId: tokens['req-id'](req, res),
            userId: tokens['user-id'](req, res),
          }
          return JSON.stringify(log)
        },
        { skip: skipHealthCheck },
      )
    : morgan('dev', { skip: skipHealthCheck })

// Extend Request interface for TypeScript
declare global {
  namespace Express {
    interface Request {
      startTime?: number
    }
  }
}
