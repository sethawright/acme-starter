import { createApp } from './app'
import { config } from './config'

/**
 * Start the server
 */
async function startServer(): Promise<void> {
  try {
    const app = createApp()

    const server = app.listen(config.PORT, config.HOST, () => {
      console.log(`🚀 Server running on http://${config.HOST}:${config.PORT}`)
      console.log(`📦 Environment: ${config.NODE_ENV}`)
      console.log(`🔧 API Base URL: http://${config.HOST}:${config.PORT}/api/v1`)
    })

    // Graceful shutdown handling
    const gracefulShutdown = (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`)

      server.close((err) => {
        if (err) {
          console.error('❌ Error during server shutdown:', err)
          process.exit(1)
        }

        console.log('✅ Server closed successfully')
        process.exit(0)
      })
    }

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
      process.exit(1)
    })

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error)
      process.exit(1)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer()
}

export { startServer }
