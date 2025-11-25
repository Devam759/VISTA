// First check for window.APP_CONFIG, then Vite env var, then use Render URL as fallback
export const API_BASE_URL = (
  (typeof window !== 'undefined' && window.APP_CONFIG?.API_URL) ||
  import.meta.env.VITE_API_URL ||
  ((typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) ? 'http://localhost:4000' : 'https://vista-k1r1.onrender.com')
).replace(/\/$/, '')

export async function apiFetch(path, { method = 'GET', body, headers = {}, token } = {}) {
  const baseUrl = API_BASE_URL
  const url = `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`
  const isJSONBody = body && typeof body === 'object' && !(body instanceof FormData)

  // Add timeout to handle Render cold starts (can take 30-60s)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout

  try {
    const res = await fetch(url, {
      method,
      headers: {
        ...(isJSONBody ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: isJSONBody ? JSON.stringify(body) : body,
      credentials: 'include',
      signal: controller.signal
    })

    clearTimeout(timeoutId)

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
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. The server might be waking up (Render free tier). Please try again in a moment.')
    }
    throw error
  }
}
