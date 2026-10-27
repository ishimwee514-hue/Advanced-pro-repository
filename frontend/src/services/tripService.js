import { request } from './apiClient.js'

export function getTrips(filters = {}) {
  const query = new URLSearchParams()
  for (const key of ['origin', 'destination', 'date']) {
    if (filters[key]) query.set(key, filters[key])
  }
  const suffix = query.size ? `?${query.toString()}` : ''
  return request(`/trips${suffix}`)
}

export function getTripSeats(tripId) {
  return request(`/trips/${encodeURIComponent(tripId)}/seats`)
}

export function bookTrip(tripId, seatNumber, token) {
  return request(`/trips/${encodeURIComponent(tripId)}/tickets`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ seatNumber }),
  })
}

export function getMyTickets(token) {
  return request('/trips/my-tickets', { headers: { Authorization: `Bearer ${token}` } })
}
