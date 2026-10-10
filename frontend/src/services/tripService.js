import { request } from './apiClient.js'

export function getTrips() {
  return request('/trips')
}
