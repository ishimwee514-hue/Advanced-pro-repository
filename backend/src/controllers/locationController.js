import { prisma } from '../config/database.js'

const activeTripStatuses = ['SCHEDULED', 'BOARDING', 'DEPARTED']
const staleAfterMs = 5 * 60 * 1000

export async function updateTripLocation(request, response, next) {
  try {
    const { latitude, longitude, accuracyMeters, speedKph, headingDegrees } = request.body ?? {}
    if (typeof latitude !== 'number' || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
        typeof longitude !== 'number' || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      return response.status(400).json({ error: 'Provide valid numeric latitude and longitude.' })
    }
    if (accuracyMeters !== undefined && (typeof accuracyMeters !== 'number' || !Number.isFinite(accuracyMeters) || accuracyMeters < 0 || accuracyMeters > 10000)) {
      return response.status(400).json({ error: 'Accuracy must be between 0 and 10000 metres.' })
    }
    if (speedKph !== undefined && (typeof speedKph !== 'number' || !Number.isFinite(speedKph) || speedKph < 0 || speedKph > 300)) {
      return response.status(400).json({ error: 'Speed must be between 0 and 300 km/h.' })
    }
    if (headingDegrees !== undefined && (typeof headingDegrees !== 'number' || !Number.isFinite(headingDegrees) || headingDegrees < 0 || headingDegrees >= 360)) {
      return response.status(400).json({ error: 'Heading must be between 0 and 359.99 degrees.' })
    }

    const trip = await prisma.trip.findUnique({
      where: { id: request.params.tripId },
      include: { vehicle: { select: { id: true, driverId: true } } },
    })
    if (!trip || !activeTripStatuses.includes(trip.status)) {
      return response.status(404).json({ error: 'The trip is not active for location updates.' })
    }
    if (request.user.role !== 'ADMIN' && trip.vehicle.driverId !== request.user.id) {
      return response.status(403).json({ error: 'You are not the assigned driver for this trip.' })
    }

    const location = await prisma.vehicleLocation.upsert({
      where: { vehicleId: trip.vehicle.id },
      create: {
        vehicleId: trip.vehicle.id, tripId: trip.id, latitude, longitude,
        accuracyMeters: accuracyMeters ?? null, speedKph: speedKph ?? null,
        headingDegrees: headingDegrees ?? null, recordedAt: new Date(),
      },
      update: {
        tripId: trip.id, latitude, longitude,
        accuracyMeters: accuracyMeters ?? null, speedKph: speedKph ?? null,
        headingDegrees: headingDegrees ?? null, recordedAt: new Date(),
      },
      select: { latitude: true, longitude: true, accuracyMeters: true, speedKph: true, headingDegrees: true, recordedAt: true },
    })
    return response.status(200).json({ location })
  } catch (error) { return next(error) }
}

export async function getTripLocation(request, response, next) {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: request.params.tripId },
      select: { id: true, status: true },
    })
    if (!trip || !activeTripStatuses.includes(trip.status)) {
      return response.status(404).json({ error: 'Live location is not available for this trip.' })
    }
    const ticket = await prisma.ticket.findFirst({
      where: { tripId: trip.id, passengerId: request.user.id, status: { in: ['PENDING', 'CONFIRMED'] } },
      select: { id: true },
    })
    if (!ticket) {
      return response.status(403).json({ error: 'A valid reservation is required to view this bus location.' })
    }
    const location = await prisma.vehicleLocation.findFirst({
      where: { tripId: trip.id },
      orderBy: { recordedAt: 'desc' },
      select: { latitude: true, longitude: true, accuracyMeters: true, speedKph: true, headingDegrees: true, recordedAt: true },
    })
    if (!location) return response.status(404).json({ error: 'The driver has not shared a location yet.' })
    return response.json({ location: { ...location, isStale: Date.now() - location.recordedAt.getTime() > staleAfterMs } })
  } catch (error) { return next(error) }
}
