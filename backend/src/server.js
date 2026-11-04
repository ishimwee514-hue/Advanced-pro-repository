import app from './app.js'
import { prisma } from './config/database.js'
import { env } from './config/env.js'
import { logger } from './infrastructure/monitoring/logger.js'
import { startReservationCleanup } from './infrastructure/jobs/reservationCleanup.js'

const stopReservationCleanup = startReservationCleanup()
const server = app.listen(env.port, () => {
  logger.info('Ruta API listening', { port: env.port })
})

server.on('error', (error) => {
  logger.error('Ruta API failed to start', { error: error.message })
  process.exitCode = 1
})

let shuttingDown = false
async function shutdown(signal) {
  if (shuttingDown) return
  shuttingDown = true
  logger.info('Ruta API shutting down', { signal })
  stopReservationCleanup()
  server.close(async (error) => {
    if (error) logger.error('HTTP server shutdown failed', { error: error.message })
    try {
      await prisma.$disconnect()
    } catch (disconnectError) {
      logger.error('Database disconnect failed', { error: disconnectError.message })
      process.exitCode = 1
    }
    if (error) process.exitCode = 1
  })
}

process.once('SIGINT', () => void shutdown('SIGINT'))
process.once('SIGTERM', () => void shutdown('SIGTERM'))
