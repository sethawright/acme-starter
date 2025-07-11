import { z } from 'zod'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('localhost'),

  // CORS settings
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000), // 15 minutes
  RATE_LIMIT_MAX: z.coerce.number().default(100), // 100 requests per window

  // Security
  TRUST_PROXY: z.coerce.boolean().default(false),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Future database configuration
  DATABASE_URL: z.string().optional(),

  // Future auth configuration
  JWT_SECRET: z.string().optional(),
})

export type Config = z.infer<typeof configSchema>

export const config = configSchema.parse(process.env)

// Validate critical config in production
if (config.NODE_ENV === 'production') {
  const productionSchema = configSchema.extend({
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters in production'),
  })

  try {
    productionSchema.parse(process.env)
  } catch (error) {
    console.error('❌ Production configuration validation failed:', error)
    process.exit(1)
  }
}

export default config
