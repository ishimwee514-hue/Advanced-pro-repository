import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { prisma } from '../config/database.js'
import { createAuthToken } from '../utils/authTokens.js'

const scrypt = promisify(scryptCallback)

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = await scrypt(password, salt, 64)
  return `scrypt:${salt}:${Buffer.from(derivedKey).toString('hex')}`
}

async function verifyPassword(password, storedHash) {
  const [algorithm, salt, storedKey] = String(storedHash).split(':')
  if (algorithm !== 'scrypt' || !salt || !storedKey) return false
  const derivedKey = Buffer.from(await scrypt(password, salt, 64))
  const expected = Buffer.from(storedKey, 'hex')
  return expected.length === derivedKey.length && timingSafeEqual(expected, derivedKey)
}

function handleConfigurationError(error, response) {
  if (error?.statusCode !== 503) return false
  response.status(503).json({ error: error.message })
  return true
}

export async function register(request, response, next) {
  try {
    const { name, email, password, phone } = request.body ?? {}
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return response.status(400).json({ error: 'Enter a name between 2 and 100 characters.' })
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.length > 254) {
      return response.status(400).json({ error: 'Enter a valid email address.' })
    }
    if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
      return response.status(400).json({ error: 'Password must be between 8 and 128 characters.' })
    }
    if (phone !== undefined && phone !== null && (typeof phone !== 'string' || phone.trim().length > 30)) {
      return response.status(400).json({ error: 'Phone number must be 30 characters or fewer.' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const user = await prisma.user.create({
      data: {
        name: name.trim(), email: normalizedEmail, phone: phone?.trim() || null,
        passwordHash: await hashPassword(password), role: 'PASSENGER',
      },
      select: { id: true, name: true, email: true, role: true },
    })
    return response.status(201).json({ token: createAuthToken(user), user })
  } catch (error) {
    if (handleConfigurationError(error, response)) return
    if (error?.code === 'P2002') return response.status(409).json({ error: 'An account with these details already exists.' })
    return next(error)
  }
}

export async function login(request, response, next) {
  try {
    const { email, password } = request.body ?? {}
    if (typeof email !== 'string' || typeof password !== 'string' || password.length > 128) {
      return response.status(400).json({ error: 'Enter your email and password.' })
    }
    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } })
    const valid = user ? await verifyPassword(password, user.passwordHash) : false
    if (!user || !valid || user.role !== 'PASSENGER') {
      return response.status(401).json({ error: 'Email or password is incorrect.' })
    }
    return response.json({
      token: createAuthToken(user),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    if (handleConfigurationError(error, response)) return
    return next(error)
  }
}
