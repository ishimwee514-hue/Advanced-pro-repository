const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'

export async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })
  const responseBody = await response.text()
  const data = responseBody ? JSON.parse(responseBody) : null

  if (!response.ok) {
    throw new Error(data?.error ?? `API request failed with status ${response.status}`)
  }

  return data
}
