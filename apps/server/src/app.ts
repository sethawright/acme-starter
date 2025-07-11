import express from 'express'
import cors from 'cors'
import { config } from './config'
import { apiRouter } from './routes'
import { errorHandler, notFoundHandler } from './middleware/error-handler'
import { requestTiming, loggerWithSkip } from './middleware/logger'
import { helmetConfig, rateLimitConfig, corsConfig } from './middleware/security'

export function createApp(): express.Application {
  const app = express()

  // Trust proxy if configured (for production behind load balancer)
  if (config.TRUST_PROXY) {
    app.set('trust proxy', 1)
  }

  // Security middleware
  app.use(helmetConfig)
  app.use(rateLimitConfig)

  // Request timing for metrics
  app.use(requestTiming)

  // Logging middleware
  app.use(loggerWithSkip)

  // CORS configuration
  app.use(cors(corsConfig))

  // Body parsing middleware (Express 5+ built-in)
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))

  // API routes
  app.use('/api/v1', apiRouter)

  // Root endpoint
  app.get('/', (_, res) => {
    res.json({
      message: 'Server is running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: config.NODE_ENV,
    })
  })

  // 404 handler
  app.use(notFoundHandler)

  // Error handling middleware (must be last)
  app.use(errorHandler)

  return app
}

export default createApp
