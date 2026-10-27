import { request } from './apiClient.js'

export function registerPassenger(details) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify(details) })
}

export function login(credentials) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) })
}
