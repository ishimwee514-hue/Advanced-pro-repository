import { request } from './apiClient.js'

export function createPayment(payment) {
  return request('/payments', {
    method: 'POST',
    body: JSON.stringify(payment),
  })
}
