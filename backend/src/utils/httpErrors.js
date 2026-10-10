export function notImplemented(response, message) {
  return response.status(501).json({ error: message })
}
