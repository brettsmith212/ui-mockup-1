// API request/response type definitions

// Base API response wrapper
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  timestamp: string
}

// Error response structure
export interface ApiError {
  error: string
  message: string
  statusCode: number
  timestamp: string
  details?: Record<string, any>
}

// Pagination metadata
export interface PaginationMeta {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
  success: boolean
  message?: string
  timestamp: string
}

// WebSocket event structure
export interface WebSocketEvent<T = any> {
  type: string
  taskId?: string
  data: T
  timestamp: string
  id: string
}

// Authentication types
export interface AuthUser {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user'
  permissions: string[]
}

export interface AuthToken {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: 'Bearer'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: AuthUser
  token: AuthToken
}

// Task API endpoints
export interface TaskEndpoints {
  // Task CRUD
  list: '/tasks'
  create: '/tasks'
  get: '/tasks/:id'
  update: '/tasks/:id'
  delete: '/tasks/:id'
  
  // Task actions
  action: '/tasks/:id/action'
  continue: '/tasks/:id/continue'
  interrupt: '/tasks/:id/interrupt'
  abort: '/tasks/:id/abort'
  retry: '/tasks/:id/retry'
  
  // Task data
  thread: '/tasks/:id/thread'
  logs: '/tasks/:id/logs'
  ci: '/tasks/:id/ci'
  
  // Git operations
  merge: '/tasks/:id/merge'
  deleteBranch: '/tasks/:id/delete-branch'
  createPR: '/tasks/:id/create-pr'
}

// Query parameters for different endpoints
export interface TaskListQuery {
  page?: number
  limit?: number
  status?: string | string[]
  owner?: string | string[]
  repo?: string
  search?: string
  tags?: string | string[]
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  dateFrom?: string
  dateTo?: string
}

export interface TaskLogsQuery {
  page?: number
  limit?: number
  level?: string | string[]
  since?: string           // ISO timestamp
  search?: string
  source?: string
}

export interface TaskThreadQuery {
  page?: number
  limit?: number
  since?: string           // ISO timestamp
  role?: string | string[]
}

// WebSocket event types
export type TaskEventType = 
  | 'task.status_changed'
  | 'task.log_added'
  | 'task.thread_message'
  | 'task.ci_updated'
  | 'task.git_operation'
  | 'task.created'
  | 'task.updated'
  | 'task.deleted'

export type SystemEventType =
  | 'system.maintenance'
  | 'system.notification'
  | 'user.connected'
  | 'user.disconnected'

export type WebSocketEventType = TaskEventType | SystemEventType

// Rate limiting
export interface RateLimitHeaders {
  'x-ratelimit-limit': string
  'x-ratelimit-remaining': string
  'x-ratelimit-reset': string
  'x-ratelimit-retry-after'?: string
}

// Health check
export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy'
  version: string
  uptime: number
  services: {
    database: 'up' | 'down'
    redis: 'up' | 'down'
    websocket: 'up' | 'down'
    git: 'up' | 'down'
  }
  timestamp: string
}

// System metrics
export interface SystemMetrics {
  activeTasks: number
  queuedTasks: number
  totalTasks: number
  activeUsers: number
  systemLoad: {
    cpu: number
    memory: number
    disk: number
  }
  timestamp: string
}

// Request/Response interceptor types
export interface RequestInterceptor {
  onRequest?: (config: RequestInit) => RequestInit | Promise<RequestInit>
  onRequestError?: (error: Error) => Error | Promise<Error>
}

export interface ResponseInterceptor {
  onResponse?: <T>(response: Response, data: T) => T | Promise<T>
  onResponseError?: (error: Error) => Error | Promise<Error>
}

// API client configuration
export interface ApiClientConfig {
  baseURL: string
  timeout?: number
  retries?: number
  retryDelay?: number
  headers?: Record<string, string>
  requestInterceptors?: RequestInterceptor[]
  responseInterceptors?: ResponseInterceptor[]
}

// Batch operations
export interface BatchRequest<T = any> {
  operations: Array<{
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    path: string
    data?: T
    id: string
  }>
}

export interface BatchResponse<T = any> {
  results: Array<{
    id: string
    success: boolean
    data?: T
    error?: ApiError
  }>
}

// File upload
export interface FileUploadRequest {
  file: File
  taskId?: string
  metadata?: Record<string, any>
}

export interface FileUploadResponse {
  url: string
  filename: string
  size: number
  mimeType: string
  taskId?: string
}

// Export commonly used types for external use
export type {
  WebSocketEvent as WSEvent,
  WebSocketEventType as WSEventType,
  TaskEventType as TaskEvent,
  SystemEventType as SystemEvent,
  ApiResponse as Response,
  PaginatedResponse as PaginatedResp,
  ApiError as ErrorResponse,
  PaginationMeta as Pagination
}
