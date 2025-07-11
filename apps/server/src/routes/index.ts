import { Router } from 'express'
import { healthRouter } from './health.routes'

const router = Router()

// Health check routes
router.use('/health', healthRouter)

// TODO: Add more route modules here
// router.use('/users', userRouter)
// router.use('/auth', authRouter)

export { router as apiRouter }
