/**
 * API endpoint configuration
 * Centralizes all API endpoint definitions for the Amp Orchestrator
 */

import { env } from './environment';

/**
 * API endpoint paths (without base URL)
 */
export const API_ENDPOINTS = {
  // Authentication endpoints (for future use)
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  
  // Task management endpoints
  TASKS: {
    LIST: '/api/tasks',
    CREATE: '/api/tasks',
    GET: (id: string) => `/api/tasks/${id}`,
    UPDATE: (id: string) => `/api/tasks/${id}`,
    DELETE: (id: string) => `/api/tasks/${id}`,
  },
  
  // Task action endpoints
  TASK_ACTIONS: {
    CONTINUE: (id: string) => `/api/tasks/${id}/continue`,
    INTERRUPT: (id: string) => `/api/tasks/${id}/interrupt`,
    ABORT: (id: string) => `/api/tasks/${id}/abort`,
    RETRY: (id: string) => `/api/tasks/${id}/retry`,
    ACTION: (id: string) => `/api/tasks/${id}/action`,
  },
  
  // Task data endpoints
  TASK_DATA: {
    THREAD: (id: string) => `/api/tasks/${id}/thread`,
    LOGS: (id: string) => `/api/tasks/${id}/logs`,
    CI: (id: string) => `/api/tasks/${id}/ci`,
  },
  
  // Git operation endpoints
  GIT: {
    MERGE: (id: string) => `/api/tasks/${id}/merge`,
    DELETE_BRANCH: (id: string) => `/api/tasks/${id}/delete-branch`,
    CREATE_PR: (id: string) => `/api/tasks/${id}/create-pr`,
  },
  
  // System endpoints
  SYSTEM: {
    HEALTH: '/health',
    METRICS: '/metrics',
    VERSION: '/version',
  },
} as const;

/**
 * WebSocket endpoint configuration
 */
export const WS_ENDPOINTS = {
  TASKS: '/api/ws',
  LOGS: (id: string) => `/api/ws?task=${id}&type=logs`,
  THREAD: (id: string) => `/api/ws?task=${id}&type=thread`,
} as const;

/**
 * Build full API URL from endpoint path
 */
export function buildApiUrl(endpoint: string): string {
  const baseUrl = env.API_BASE_URL.replace(/\/$/, ''); // Remove trailing slash
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${path}`;
}

/**
 * Build full WebSocket URL from endpoint path
 */
export function buildWsUrl(endpoint: string): string {
  const baseUrl = env.WS_BASE_URL.replace(/\/$/, ''); // Remove trailing slash
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${path}`;
}

/**
 * API configuration for different environments
 */
export const API_CONFIG = {
  development: {
    baseURL: env.API_BASE_URL,
    timeout: env.API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: false,
  },
  production: {
    baseURL: env.API_BASE_URL,
    timeout: env.API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: true,
  },
  test: {
    baseURL: 'http://localhost:8080',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: false,
  },
} as const;

/**
 * Get API configuration for current environment
 */
export function getApiConfig() {
  return API_CONFIG[env.NODE_ENV];
}

/**
 * Common query parameter types for API endpoints
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface DateRangeParams {
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchParams {
  search?: string;
}

export interface FilterParams {
  status?: string | string[];
  owner?: string | string[];
  repo?: string;
  tags?: string | string[];
}

/**
 * Common API parameter interfaces
 */
export interface TaskListParams extends 
  PaginationParams, 
  SortParams, 
  DateRangeParams, 
  SearchParams, 
  FilterParams {}

export interface TaskLogsParams extends 
  PaginationParams, 
  SearchParams {
  level?: string | string[];
  since?: string;
  source?: string;
}

export interface TaskThreadParams extends 
  PaginationParams {
  since?: string;
  role?: string | string[];
}

/**
 * Build query string from parameters
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * HTTP status code constants
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * API error types
 */
export const API_ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;
