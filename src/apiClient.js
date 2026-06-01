const API_URL = import.meta.env.VITE_API_URL ?? ''

let onSessionExpired = null

export function setSessionExpiredHandler(handler) {
  onSessionExpired = handler
}

export async function apiClient(path, options = {}) {
  const { body, ...rest } = options

  const config = {
    ...rest,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  }

  let response
  try {
    response = await fetch(`${API_URL}${path}`, config)
  } catch {
    throw { message: 'Network error, please try again' }
  }

  let json = {}
try {
  const text = await response.text()
  if (text) json = JSON.parse(text)
} catch {
}

  if (response.status === 401) {
    if (!path.includes('/api/auth/')) {
      onSessionExpired?.()
    }
    throw {
      message: json.message ?? 'Session expired',
      fieldErrors: json.fieldErrors ?? null,
    }
  }

  if (!response.ok) {
    throw {
      message: json.message ?? 'Something went wrong',
      fieldErrors: json.fieldErrors ?? null,
    }
  }

  return json.data !== undefined ? json.data : json
}