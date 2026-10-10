const tones = {
  'On time': 'success',
  Active: 'success',
  'On route': 'success',
  Confirmed: 'success',
  Successful: 'success',
  Boarding: 'info',
  Pending: 'warning',
  Delayed: 'warning',
  Review: 'warning',
  Departed: 'neutral',
  Refunded: 'neutral',
  Cancelled: 'danger',
  Maintenance: 'danger',
}

export function getStatusTone(status) {
  return tones[status] ?? 'neutral'
}
