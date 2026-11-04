import test from 'node:test'
import assert from 'node:assert/strict'
import { once } from 'node:events'

process.env.AUTH_TOKEN_SECRET ??= 'ruta-test-secret-with-at-least-32-characters'

const [{ default: app }, { prisma }] = await Promise.all([
  import('../src/app.js'),
  import('../src/config/database.js'),
])

test('passenger booking expires, cancels, and safely releases a seat', async () => {
  const server = app.listen(0)
  await once(server, 'listening')
  const api = `http://127.0.0.1:${server.address().port}/api`
  const suffix = Date.now().toString()
  let routeId
  let vehicleId
  let tripId
  let passengerId

  async function call(path, options = {}) {
    const response = await fetch(api + path, {
      ...options,
      headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
    })
    const body = await response.json()
    return { response, body }
  }

  try {
    const route = await prisma.route.create({
      data: { origin: `Test Origin ${suffix}`, destination: `Test Destination ${suffix}`, baseFare: '2500.00' },
    })
    routeId = route.id
    const vehicle = await prisma.vehicle.create({
      data: { plate: `TEST-${suffix}`, model: 'Test coach', capacity: 12 },
    })
    vehicleId = vehicle.id
    const trip = await prisma.trip.create({
      data: {
        routeId,
        vehicleId,
        departureAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        status: 'SCHEDULED',
      },
    })
    tripId = trip.id

    const registration = await call('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Ruta Booking Test',
        email: `ruta-booking-${suffix}@example.com`,
        password: 'test-password-123',
      }),
    })
    assert.equal(registration.response.status, 201)
    const token = registration.body.token
    passengerId = registration.body.user.id
    assert.ok(token)

    const unauthorized = await call(`/trips/${tripId}/tickets`, {
      method: 'POST',
      body: JSON.stringify({ seatNumber: '1' }),
    })
    assert.equal(unauthorized.response.status, 401)

    const firstBooking = await call(`/trips/${tripId}/tickets`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ seatNumber: '1' }),
    })
    assert.equal(firstBooking.response.status, 201)
    assert.equal(firstBooking.body.ticket.status, 'PENDING')
    assert.ok(firstBooking.body.ticket.expiresAt)

    const duplicate = await call(`/trips/${tripId}/tickets`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ seatNumber: '1' }),
    })
    assert.equal(duplicate.response.status, 409)

    const cancelled = await call(`/trips/${tripId}/tickets/${firstBooking.body.ticket.id}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    assert.equal(cancelled.response.status, 200)

    const seatsAfterCancellation = await call(`/trips/${tripId}/seats`)
    assert.equal(seatsAfterCancellation.body.seats.find((seat) => seat.seatNumber === '1').status, 'AVAILABLE')

    const secondBooking = await call(`/trips/${tripId}/tickets`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ seatNumber: '1' }),
    })
    assert.equal(secondBooking.response.status, 201)

    await prisma.ticket.update({
      where: { id: secondBooking.body.ticket.id },
      data: { expiresAt: new Date(Date.now() - 1000) },
    })

    const seatsAfterExpiry = await call(`/trips/${tripId}/seats`)
    assert.equal(seatsAfterExpiry.body.seats.find((seat) => seat.seatNumber === '1').status, 'AVAILABLE')

    const expiredTicket = await prisma.ticket.findUnique({ where: { id: secondBooking.body.ticket.id } })
    assert.equal(expiredTicket.status, 'CANCELLED')

    const thirdBooking = await call(`/trips/${tripId}/tickets`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ seatNumber: '1' }),
    })
    assert.equal(thirdBooking.response.status, 201)

    const history = await call('/trips/my-tickets', {
      headers: { Authorization: `Bearer ${token}` },
    })
    assert.equal(history.response.status, 200)
    assert.ok(history.body.tickets.some((ticket) => ticket.id === thirdBooking.body.ticket.id && ticket.tripId === tripId))
  } finally {
    if (tripId) await prisma.ticket.deleteMany({ where: { tripId } }).catch(() => {})
    if (tripId) await prisma.trip.deleteMany({ where: { id: tripId } }).catch(() => {})
    if (routeId) await prisma.route.deleteMany({ where: { id: routeId } }).catch(() => {})
    if (vehicleId) await prisma.vehicle.deleteMany({ where: { id: vehicleId } }).catch(() => {})
    if (passengerId) await prisma.user.deleteMany({ where: { id: passengerId } }).catch(() => {})
    await new Promise((resolve) => server.close(resolve))
    await prisma.$disconnect()
  }
})
