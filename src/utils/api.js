export const API_BASE_URL = (import.meta?.env?.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')

export async function apiFetch(path, { method = 'GET', body, headers = {}, token } = {}) {
  const url = `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
  const isJSONBody = body && typeof body === 'object' && !(body instanceof FormData)
  const res = await fetch(url, {
    method,
    headers: {
      ...(isJSONBody ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: isJSONBody ? JSON.stringify(body) : body,
    credentials: 'include',
  })

  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch (_e) {
    data = text
  }

  if (!res.ok) {
    const message = (data && (data.error || data.message)) || res.statusText || 'Request failed'
    const err = new Error(message)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}
