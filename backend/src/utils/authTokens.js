import { createHmac, timingSafeEqual } from 'node:crypto'

const tokenLifetimeSeconds = 60 * 60 * 24 * 7

function getSecret() {
  const secret = process.env.AUTH_TOKEN_SECRET
  if (!secret || secret.length < 32) {
    const error = new Error('Authentication is not configured. Set AUTH_TOKEN_SECRET to a random value of at least 32 characters.')
    error.statusCode = 503
    throw error
  }
  return secret
}

export function assertAuthConfigured() {
  getSecret()
}

function sign(value) {
  return createHmac('sha256', getSecret()).update(value).digest('base64url')
}

export function createAuthToken(user) {
  const now = Math.floor(Date.now() / 1000)
  const payload = Buffer.from(JSON.stringify({
    sub: user.id,
    role: user.role,
    iat: now,
    exp: now + tokenLifetimeSeconds,
  })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function verifyAuthToken(token) {
  const parts = token.split('.')
  if (parts.length !== 2) return null

  let expected
  try {
    expected = Buffer.from(sign(parts[0]))
  } catch {
    return null
  }
  const actual = Buffer.from(parts[1])
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null

  try {
    const payload = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'))
    const now = Math.floor(Date.now() / 1000)
    if (!payload.sub || !payload.exp || payload.exp <= now || payload.role !== 'PASSENGER') return null
    return { id: payload.sub, role: payload.role }
  } catch {
    return null
  }
}
