import { Router } from 'express'
import { updateTripLocation } from '../controllers/locationController.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { requireRole } from '../middleware/requireRole.js'

const router = Router()
router.post('/trips/:tripId/location', requireAuth, requireRole('DRIVER', 'ADMIN'), updateTripLocation)
export default router
