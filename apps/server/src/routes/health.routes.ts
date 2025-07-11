import { Router } from 'express'
import { healthController } from '../controllers/health.controller'

const router = Router()

// Basic health check
router.get('/', healthController.getHealth)

// Detailed health check
router.get('/detailed', healthController.getDetailedHealth)

export { router as healthRouter }
