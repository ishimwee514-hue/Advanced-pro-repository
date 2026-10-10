export function notFoundHandler(_request, response) {
  response.status(404).json({ error: 'API route not found' })
}

export function errorHandler(error, _request, response, _next) {
  console.error(error)
  response.status(500).json({ error: 'Internal server error' })
}
