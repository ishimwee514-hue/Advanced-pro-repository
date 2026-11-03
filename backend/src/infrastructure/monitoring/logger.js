export const logger = Object.freeze({
  info(message, context = {}) { console.log(JSON.stringify({ timestamp: new Date().toISOString(), level: 'info', message, ...context })) },
  warn(message, context = {}) { console.warn(JSON.stringify({ timestamp: new Date().toISOString(), level: 'warn', message, ...context })) },
  error(message, context = {}) { console.error(JSON.stringify({ timestamp: new Date().toISOString(), level: 'error', message, ...context })) },
})
