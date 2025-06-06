// HTTP client configuration for Amp Orchestrator integration

import { isDevelopment } from '../config/environment';
import { getApiConfig, HTTP_STATUS, API_ERROR_TYPES } from '../config/api';

export interface ApiError extends Error {
  status: number;
  statusText: string;
  data?: any;
  type: string;
  timestamp: string;
}

// Get API configuration based on environment
const apiConfig = getApiConfig();

// Create custom error class
class HTTPError extends Error implements ApiError {
  status: number;
  statusText: string;
  data?: any;
  type: string;
  timestamp: string;

  constructor(status: number, statusText: string, data?: any, type?: string) {
    const message = data?.message || statusText;
    super(`HTTP ${status}: ${message}`);
    this.name = 'HTTPError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    this.type = type || this.getErrorType(status);
    this.timestamp = new Date().toISOString();
  }

  private getErrorType(status: number): string {
    switch (status) {
      case 0:
        return API_ERROR_TYPES.NETWORK_ERROR;
      case HTTP_STATUS.BAD_REQUEST:
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        return API_ERROR_TYPES.VALIDATION_ERROR;
      case HTTP_STATUS.UNAUTHORIZED:
      case HTTP_STATUS.FORBIDDEN:
        return API_ERROR_TYPES.AUTHORIZATION_ERROR;
      case HTTP_STATUS.NOT_FOUND:
        return API_ERROR_TYPES.NOT_FOUND_ERROR;
      case HTTP_STATUS.TOO_MANY_REQUESTS:
        return API_ERROR_TYPES.TIMEOUT_ERROR;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      case HTTP_STATUS.BAD_GATEWAY:
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        return API_ERROR_TYPES.SERVER_ERROR;
      default:
        return API_ERROR_TYPES.UNKNOWN_ERROR;
    }
  }
}

// JWT token management (currently disabled for initial setup)
class TokenManager {
  private tokenKey = 'amp_jwt_token';
  private isAuthEnabled = false; // Temporarily disabled

  getToken(): string | null {
    if (!this.isAuthEnabled) return null;
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isTokenValid(): boolean {
    if (!this.isAuthEnabled) return true; // Allow all requests when auth is disabled
    
    const token = this.getToken();
    if (!token) return false;

    try {
      // Parse JWT payload (basic validation)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      
      // Check if token is expired
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  // Enable/disable authentication for testing
  setAuthEnabled(enabled: boolean): void {
    this.isAuthEnabled = enabled;
    if (isDevelopment()) {
      console.log(`🔐 Authentication ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  // Development helper to force bypass auth
  forceBypassAuth(): void {
    this.isAuthEnabled = false;
    if (isDevelopment()) {
      console.log('🔓 Authentication force bypassed for development');
    }
  }

  getAuthStatus(): boolean {
    return this.isAuthEnabled;
  }
}

export const tokenManager = new TokenManager();

// Request retry configuration
interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryCondition: (error: HTTPError) => boolean;
}

const defaultRetryConfig: RetryConfig = {
  maxRetries: 0, // Disable retries for now to prevent duplicate requests
  retryDelay: 1000,
  retryCondition: (error: HTTPError) => {
    // Retry on network errors and 5xx server errors
    return error.status === 0 || (error.status >= 500 && error.status < 600);
  }
};

// HTTP client class
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private retryConfig: RetryConfig;

  constructor(config = apiConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
    this.defaultHeaders = { ...config.headers };
    this.retryConfig = defaultRetryConfig;
  }

  private async requestWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    try {
      if (isDevelopment()) {
        console.log(`📡 Making request to: ${endpoint}`, { retryCount, options });
      }
      return await this.request<T>(endpoint, options);
    } catch (error) {
      if (isDevelopment()) {
        console.error(`❌ Request failed:`, { endpoint, error, retryCount });
      }
      
      if (error instanceof HTTPError && 
          retryCount < this.retryConfig.maxRetries && 
          this.retryConfig.retryCondition(error)) {
        
        if (isDevelopment()) {
          console.warn(`🔄 Retrying request (${retryCount + 1}/${this.retryConfig.maxRetries}):`, endpoint);
        }
        
        await this.delay(this.retryConfig.retryDelay * Math.pow(2, retryCount));
        return this.requestWithRetry<T>(endpoint, options, retryCount + 1);
      }
      throw error;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Prepare headers
    const headers = new Headers();
    
    // Add default headers
    Object.entries(this.defaultHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
    
    // Add custom headers from options
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (typeof value === 'string') {
          headers.set(key, value);
        }
      });
    }
    
    // Add JWT token if available and auth is enabled
    if (tokenManager.getAuthStatus()) {
      const token = tokenManager.getToken();
      if (token && tokenManager.isTokenValid()) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          try {
            errorData = await response.text();
          } catch {
            errorData = null;
          }
        }
        
        throw new HTTPError(response.status, response.statusText, errorData);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        return '' as T;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Re-throw HTTPError as-is
      if (error instanceof HTTPError) {
        throw error;
      }
      
      // Handle abort errors (timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new HTTPError(0, 'Request Timeout', error, API_ERROR_TYPES.TIMEOUT_ERROR);
      }
      
      // Handle network errors
      throw new HTTPError(0, 'Network Error', error, API_ERROR_TYPES.NETWORK_ERROR);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // HTTP methods with retry support
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let finalEndpoint = endpoint;
    
    // Handle query parameters
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, String(v)));
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
      
      const queryString = searchParams.toString();
      if (queryString) {
        finalEndpoint += (endpoint.includes('?') ? '&' : '?') + queryString;
      }
    }
    
    return this.requestWithRetry<T>(finalEndpoint);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.requestWithRetry<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.requestWithRetry<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.requestWithRetry<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.requestWithRetry<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // Utility methods
  setRetryConfig(config: Partial<RetryConfig>): void {
    this.retryConfig = { ...this.retryConfig, ...config };
  }

  getBaseURL(): string {
    return this.baseURL;
  }

  updateBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
    if (isDevelopment()) {
      console.log(`🔗 API Base URL updated to: ${baseURL}`);
    }
  }
}

// Create and export the default API client
export const apiClient = new ApiClient();

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
