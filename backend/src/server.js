import app from './app.js'
import { env } from './config/env.js'
import { logger } from './infrastructure/monitoring/logger.js'

const server = app.listen(env.port, () => {
  logger.info('Ruta API listening', { port: env.port })
})

server.on('error', (error) => {
  logger.error('Ruta API failed to start', { error: error.message })
  process.exitCode = 1
})
