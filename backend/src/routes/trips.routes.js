import { Router } from 'express'
import { listTrips } from '../controllers/tripController.js'

const router = Router()

router.get('/', listTrips)

export default router
