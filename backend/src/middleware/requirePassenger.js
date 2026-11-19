import { requireAuth } from './requireAuth.js'

export function requirePassenger(request, response, next) {
  return requireAuth(request, response, () => {
    if (request.user.role !== 'PASSENGER') {
      return response.status(403).json({ error: 'This action is available to passenger accounts only.' })
    }
    return next()
  })
}
