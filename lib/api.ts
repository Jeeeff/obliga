// lib/api.ts

// Config point for API base URL with fallback
// NEXT_PUBLIC_API_BASE_URL can be set in .env.local
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

// Helper: read response safely (text -> maybe JSON)
async function readErrorMessage(response: Response): Promise<string> {
  const fallback = `HTTP ${response.status}`

  let text = ""
  try {
    text = await response.text()
  } catch {
    return fallback
  }

  if (!text) return fallback

  // Try parse JSON error bodies like { error: "..."} or { message: "..." }
  try {
    const data = JSON.parse(text)
    return data?.error ?? data?.message ?? fallback
  } catch {
    // Not JSON, return raw text (trim to avoid huge messages)
    return text.length > 500 ? text.slice(0, 500) : text
  }
}

export const api = {
  BASE_URL,
  async request(endpoint: string, options: RequestInit = {}) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null

    // Normalize headers (options.headers can be Headers | object | array)
    const headers = new Headers(options.headers)
    
    // Only set Content-Type to JSON if body is not FormData
    if (!(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json")
    }
    
    headers.set("Accept", "application/json")

    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      cache: "no-store",
    })

    // Unauthorized -> clear token + redirect + throw ApiError(status)
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken")
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login"
        }
      }
      throw new ApiError("Unauthorized", 401)
    }

    // Any non-2xx response -> throw ApiError with status + message
    if (!response.ok) {
      const msg = await readErrorMessage(response)
      throw new ApiError(msg, response.status)
    }

    // No content
    if (response.status === 204) return null

    // Parse success response safely
    const contentType = response.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      // if API returns empty body with 200, avoid crash:
      const text = await response.text()
      return text ? JSON.parse(text) : null
    }

    // Fallback: return text for non-JSON (rare)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.text() as Promise<any>
  },

  get(endpoint: string) {
    return this.request(endpoint, { method: "GET" })
  },

  post(endpoint: string, body: unknown) {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
    return this.request(endpoint, {
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
    })
  },

  put(endpoint: string, body: unknown) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    })
  },

  delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" })
  },
}
