
// Config point for API base URL with fallback
// NEXT_PUBLIC_API_BASE_URL can be set in .env.local
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        // Only redirect if not already on login page to avoid loops or redundant redirects
        if (!window.location.pathname.includes('/login')) {
           window.location.href = '/login';
        }
      }
    }

    if (!response.ok) {
       let errorMessage = `HTTP error! status: ${response.status}`;
       try {
          const errorData = await response.json();
          if (errorData.error) {
              errorMessage = errorData.error;
          }
       } catch (e) {
          // If JSON parse fails, try to get text body
          const textError = await response.text().catch(() => null);
          if (textError) {
              errorMessage = textError;
          }
       }
       throw new Error(errorMessage);
    }

    if (response.status === 204) return null;

    return response.json();
  },

  get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};
