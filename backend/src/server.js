import app from './app.js'
import { env } from './config/env.js'

const server = app.listen(env.port, () => {
  console.info(`Ruta API listening on http://localhost:${env.port}`)
})

server.on('error', (error) => {
  console.error('Ruta API failed to start', error)
  process.exitCode = 1
})
