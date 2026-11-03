import { Router } from 'express'
import { prisma } from '../config/database.js'
import { logger } from '../infrastructure/monitoring/logger.js'
import authRoutes from './auth.routes.js'
import agencyRoutes from './agency.routes.js'
import paymentRoutes from './payments.routes.js'
import tripRoutes from './trips.routes.js'
const router = Router()
router.get('/health', (_request, response) => response.json({ status: 'ok', service: 'ruta-api' }))
router.get('/ready', async (request, response) => {
  try { await prisma.$queryRaw`SELECT 1`; response.json({ status: 'ready', service: 'ruta-api', database: 'connected' }) }
  catch (error) { logger.error('Readiness check failed', { requestId: request.requestId, error: error.message }); response.status(503).json({ status: 'not_ready', service: 'ruta-api', database: 'unavailable' }) }
})
router.use('/auth', authRoutes)
router.use('/trips', tripRoutes)
router.use('/payments', paymentRoutes)
router.use('/agency', agencyRoutes)
export default router
