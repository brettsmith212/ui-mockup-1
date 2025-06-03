// HTTP client configuration with JWT interceptors

export interface ApiError extends Error {
  status: number
  statusText: string
  data?: any
}

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// Create custom error class
class HTTPError extends Error implements ApiError {
  status: number
  statusText: string
  data?: any

  constructor(status: number, statusText: string, data?: any) {
    super(`HTTP ${status}: ${statusText}`)
    this.name = 'HTTPError'
    this.status = status
    this.statusText = statusText
    this.data = data
  }
}

// JWT token management
class TokenManager {
  private tokenKey = 'amp_jwt_token'

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token)
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey)
  }

  isTokenValid(): boolean {
    const token = this.getToken()
    if (!token) return false

    try {
      // Parse JWT payload (basic validation)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Date.now() / 1000
      
      // Check if token is expired
      return payload.exp > now
    } catch {
      return false
    }
  }
}

export const tokenManager = new TokenManager()

// HTTP client class
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    // Prepare headers
    const headers = new Headers(options.headers)
    
    // Add JWT token if available
    const token = tokenManager.getToken()
    if (token && tokenManager.isTokenValid()) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    
    // Set default content type for non-GET requests
    if (options.method && options.method !== 'GET' && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      // Handle HTTP errors
      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = await response.text()
        }
        
        throw new HTTPError(response.status, response.statusText, errorData)
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        return '' as T
      }

      return await response.json()
    } catch (error) {
      // Re-throw HTTPError as-is
      if (error instanceof HTTPError) {
        throw error
      }
      
      // Handle network errors
      throw new HTTPError(0, 'Network Error', error)
    }
  }

  // HTTP methods
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(endpoint, this.baseURL)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }
    
    return this.request<T>(url.pathname + url.search)
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }
}

// Create and export the default API client
export const apiClient = new ApiClient(API_BASE_URL)

// Export types and utilities
export { HTTPError }

// Request interceptor utility
export const withAuth = <T extends Record<string, any>>(
  requestFn: (client: ApiClient, ...args: any[]) => Promise<T>
) => {
  return async (...args: any[]): Promise<T> => {
    try {
      return await requestFn(apiClient, ...args)
    } catch (error) {
      // Handle 401 Unauthorized - token expired
      if (error instanceof HTTPError && error.status === 401) {
        tokenManager.removeToken()
        // Redirect to login or refresh token
        window.location.href = '/login'
        throw error
      }
      throw error
    }
  }
}

// Response interceptor for common error handling
export const handleApiError = (error: unknown): never => {
  if (error instanceof HTTPError) {
    // Log the error for debugging
    console.error('API Error:', {
      status: error.status,
      statusText: error.statusText,
      data: error.data,
    })
    
    // You can add toast notifications here
    // Example: toast.error(`Error ${error.status}: ${error.statusText}`)
    
    throw error
  }
  
  // Handle unexpected errors
  console.error('Unexpected error:', error)
  throw new HTTPError(500, 'Internal Error', error)
}
