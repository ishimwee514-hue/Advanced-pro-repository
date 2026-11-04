import { prisma } from '../../config/database.js'
import { logger } from '../monitoring/logger.js'

const cleanupIntervalMs = 60 * 1000

export async function releaseExpiredReservations() {
  const result = await prisma.ticket.updateMany({
    where: { status: 'PENDING', expiresAt: { lte: new Date() } },
    data: { status: 'CANCELLED' },
  })
  return result.count
}

export function startReservationCleanup() {
  let running = false

  const run = async () => {
    if (running) return
    running = true
    try {
      const released = await releaseExpiredReservations()
      if (released > 0) logger.info('Expired seat reservations released', { count: released })
    } catch (error) {
      logger.error('Reservation cleanup failed', { error: error.message })
    } finally {
      running = false
    }
  }

  void run()
  const timer = setInterval(run, cleanupIntervalMs)
  timer.unref()
  return () => clearInterval(timer)
}
