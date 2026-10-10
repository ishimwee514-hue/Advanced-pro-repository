import { Router } from 'express'
import { getAgencyDashboard } from '../controllers/agencyController.js'

const router = Router()

router.get('/dashboard', getAgencyDashboard)

export default router
