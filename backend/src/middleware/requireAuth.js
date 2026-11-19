import { verifyAuthToken } from '../utils/authTokens.js'

export function requireAuth(request, response, next) {
  const authorization = request.get('authorization') ?? ''
  const match = authorization.match(/^Bearer\s+(.+)$/i)
  const user = match ? verifyAuthToken(match[1]) : null
  if (!user) return response.status(401).json({ error: 'Sign in to continue.' })
  request.user = user
  return next()
}
