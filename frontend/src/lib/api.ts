const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4010'

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) {
    let message = `API error: ${res.status} ${res.statusText}`
    try {
      const body = await res.json()
      if (body.message) message = body.message
    } catch { /* ignore */ }
    throw new Error(message)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
