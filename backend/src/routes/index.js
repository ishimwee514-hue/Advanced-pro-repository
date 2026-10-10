import { Router } from 'express'
import authRoutes from './auth.routes.js'
import agencyRoutes from './agency.routes.js'
import paymentRoutes from './payments.routes.js'
import tripRoutes from './trips.routes.js'

const router = Router()

router.get('/health', (_request, response) => {
  response.json({ status: 'ok', service: 'ruta-api' })
})
router.use('/auth', authRoutes)
router.use('/trips', tripRoutes)
router.use('/payments', paymentRoutes)
router.use('/agency', agencyRoutes)

export default router
