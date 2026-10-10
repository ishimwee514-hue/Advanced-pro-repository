import { notImplemented } from '../utils/httpErrors.js'

export function createPayment(_request, response) {
  return notImplemented(response, 'Payment providers are not configured')
}
