import { prisma } from '../config/database.js'

const activeTripStatuses = ['SCHEDULED', 'BOARDING']
const reservedTicketStatuses = ['PENDING', 'CONFIRMED']

function parseDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date
}

function serializeTrip(trip) {
  return {
    id: trip.id,
    origin: trip.route.origin,
    destination: trip.route.destination,
    departureAt: trip.departureAt,
    arrivalAt: trip.arrivalAt,
    status: trip.status,
    fare: Number(trip.route.baseFare),
    currency: 'RWF',
    vehicle: { model: trip.vehicle.model, capacity: trip.vehicle.capacity },
    availableSeats: Math.max(0, trip.vehicle.capacity - trip.tickets.length),
  }
}

export async function listTrips(request, response, next) {
  try {
    const { origin, destination, date } = request.query
    if ((origin !== undefined && (typeof origin !== 'string' || origin.trim().length > 100)) ||
        (destination !== undefined && (typeof destination !== 'string' || destination.trim().length > 100))) {
      return response.status(400).json({ error: 'Origin and destination must be 100 characters or fewer.' })
    }
    const where = { status: { in: activeTripStatuses }, route: { active: true }, departureAt: { gte: new Date() } }
    if (origin?.trim()) where.route.origin = { contains: origin.trim(), mode: 'insensitive' }
    if (destination?.trim()) where.route.destination = { contains: destination.trim(), mode: 'insensitive' }
    if (date !== undefined) {
      const start = parseDate(date)
      if (!start) return response.status(400).json({ error: 'Date must be a valid YYYY-MM-DD date.' })
      const end = new Date(start)
      end.setUTCDate(end.getUTCDate() + 1)
      where.departureAt = { gte: start, lt: end }
    }
    const trips = await prisma.trip.findMany({
      where,
      include: {
        route: true,
        vehicle: { select: { model: true, capacity: true } },
        tickets: { where: { status: { in: reservedTicketStatuses } }, select: { id: true } },
      },
      orderBy: { departureAt: 'asc' }, take: 100,
    })
    return response.json({ trips: trips.map(serializeTrip) })
  } catch (error) { return next(error) }
}

export async function getTripSeats(request, response, next) {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: request.params.tripId },
      include: {
        route: { select: { origin: true, destination: true, baseFare: true, active: true } },
        vehicle: { select: { capacity: true } },
        tickets: { where: { status: { in: reservedTicketStatuses } }, select: { seatNumber: true } },
      },
    })
    if (!trip || !trip.route.active || !activeTripStatuses.includes(trip.status) || trip.departureAt <= new Date()) {
      return response.status(404).json({ error: 'This trip is not available for booking.' })
    }
    const booked = new Set(trip.tickets.map((ticket) => String(Number(ticket.seatNumber))))
    const seats = Array.from({ length: trip.vehicle.capacity }, (_, index) => {
      const seatNumber = String(index + 1)
      return { seatNumber, status: booked.has(seatNumber) ? 'BOOKED' : 'AVAILABLE' }
    })
    return response.json({
      trip: { id: trip.id, origin: trip.route.origin, destination: trip.route.destination, departureAt: trip.departureAt, fare: Number(trip.route.baseFare), currency: 'RWF' },
      seats,
    })
  } catch (error) { return next(error) }
}

export async function bookTrip(request, response, next) {
  try {
    const { seatNumber } = request.body ?? {}
    if (typeof seatNumber !== 'string' || !/^\d{1,3}$/.test(seatNumber) || Number(seatNumber) < 1) {
      return response.status(400).json({ error: 'Choose a valid seat number.' })
    }
    const trip = await prisma.trip.findUnique({
      where: { id: request.params.tripId },
      include: { route: true, vehicle: { select: { capacity: true } } },
    })
    if (!trip || !trip.route.active || !activeTripStatuses.includes(trip.status) || trip.departureAt <= new Date()) {
      return response.status(409).json({ error: 'This trip is no longer available for booking.' })
    }
    if (Number(seatNumber) > trip.vehicle.capacity) {
      return response.status(400).json({ error: 'That seat number is outside this vehicle’s capacity.' })
    }
    const ticket = await prisma.ticket.create({
      data: { tripId: trip.id, passengerId: request.user.id, seatNumber: String(Number(seatNumber)), fare: trip.route.baseFare, status: 'PENDING' },
      include: { trip: { include: { route: true } } },
    })
    return response.status(201).json({
      ticket: { id: ticket.id, status: ticket.status, seatNumber: ticket.seatNumber, fare: Number(ticket.fare), currency: 'RWF', origin: ticket.trip.route.origin, destination: ticket.trip.route.destination, departureAt: ticket.trip.departureAt },
      message: 'Seat reserved. Payment is not collected; the ticket remains pending until payment is integrated.',
    })
  } catch (error) {
    if (error?.code === 'P2002') return response.status(409).json({ error: 'That seat has just been booked. Select another seat.' })
    return next(error)
  }
}

export async function listMyTickets(request, response, next) {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { passengerId: request.user.id },
      include: { trip: { include: { route: true } } },
      orderBy: { createdAt: 'desc' }, take: 100,
    })
    return response.json({ tickets: tickets.map((ticket) => ({
      id: ticket.id, status: ticket.status, seatNumber: ticket.seatNumber, fare: Number(ticket.fare), currency: 'RWF',
      origin: ticket.trip.route.origin, destination: ticket.trip.route.destination, departureAt: ticket.trip.departureAt,
    })) })
  } catch (error) { return next(error) }
}
