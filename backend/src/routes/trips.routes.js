import { Router } from 'express'
import { bookTrip, cancelPendingTicket, getTripSeats, listMyTickets, listTrips } from '../controllers/tripController.js'
import { requirePassenger } from '../middleware/requirePassenger.js'

const router = Router()

router.get('/', listTrips)
router.get('/my-tickets', requirePassenger, listMyTickets)
router.get('/:tripId/seats', getTripSeats)
router.post('/:tripId/tickets', requirePassenger, bookTrip)
router.post('/:tripId/tickets/:ticketId/cancel', requirePassenger, cancelPendingTicket)

export default router
