// Get API base URL - use localhost:4000 for development, render.com for production
const getApiBaseUrl = () => {
  // Check environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // Auto-detect localhost for development
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:4000'
  }
  
  // Default to production
  return 'https://vista-ia7c.onrender.com'  // Backend Render URL
}

// Make it a getter function to always evaluate at runtime
export const getApiBaseUrl_Dynamic = () => getApiBaseUrl().replace(/\/$/, '')

// Keep the static version for backwards compatibility
export const API_BASE_URL = getApiBaseUrl().replace(/\/$/, '')

export async function apiFetch(path, { method = 'GET', body, headers = {}, token } = {}) {
  const baseUrl = getApiBaseUrl_Dynamic()
  const url = `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`
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
