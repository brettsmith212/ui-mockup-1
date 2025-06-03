// Task type definitions from PRD specification

export type TaskStatus =
  | 'queued' 
  | 'running' 
  | 'retrying'
  | 'needs_review' 
  | 'success'
  | 'aborted' 
  | 'error'

export type TaskEventKind =
  | 'status' 
  | 'log' 
  | 'ci'
  | 'thread' 
  | 'git'

export interface Task {
  id: string
  repo: string
  branch: string
  status: TaskStatus
  prompt: string            // latest prompt
  attempts: number
  updatedAt: string         // ISO date string
  createdAt: string         // ISO date string
  owner: string
  prUrl?: string
  prState?: 'open' | 'merged' | 'closed'
  // Additional fields for UI
  title?: string            // derived from prompt or repo
  description?: string      // optional task description
  elapsedTime?: number      // milliseconds since start
  estimatedCompletion?: string // ISO date string
  tags?: string[]           // optional tags for filtering
}

export interface TaskEvent {
  taskId: string
  kind: TaskEventKind
  payload: string           // JSON string for complex kinds
  ts: string                // ISO date string
  id?: string               // event ID for deduplication
}

export interface ThreadMessage {
  id: string
  role: 'user' | 'amp' | 'system'
  content: string
  ts: string                // ISO date string
  metadata?: {
    type?: 'text' | 'code' | 'error' | 'file_change'
    files?: string[]        // affected files
    exitCode?: number       // for command results
  }
}

export interface TaskLogs {
  taskId: string
  logs: LogEntry[]
  totalLines: number
  hasMore: boolean
}

export interface LogEntry {
  id: string
  timestamp: string         // ISO date string
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  source?: string           // which component generated the log
  metadata?: Record<string, any>
}

export interface CIStatus {
  taskId: string
  runId?: string
  status: 'pending' | 'running' | 'success' | 'failure' | 'cancelled'
  conclusion?: string
  url?: string              // link to CI run
  jobs: CIJob[]
  checks: CICheck[]
  startedAt?: string        // ISO date string
  completedAt?: string      // ISO date string
  lastUpdated?: string      // ISO date string
}

export interface CIJob {
  id: string
  name: string
  status: 'pending' | 'running' | 'success' | 'failure' | 'cancelled'
  url?: string
  startedAt?: string
  completedAt?: string
  duration?: string
  conclusion?: string
  steps?: CIStep[]
}

export interface CIStep {
  name: string
  status: 'pending' | 'running' | 'success' | 'failure' | 'skipped'
  conclusion?: string
  number: number
  duration?: string
}

export interface CICheck {
  id: string
  name: string
  status: 'pending' | 'running' | 'success' | 'failure'
  conclusion?: string
  url?: string
  required: boolean
  description?: string
}

// Task creation and update types
export interface CreateTaskRequest {
  repo: string
  prompt: string
  branch?: string           // auto-generated if not provided
  title?: string
  description?: string
  tags?: string[]
}

export interface UpdateTaskRequest {
  prompt?: string
  status?: TaskStatus
  title?: string
  description?: string
  tags?: string[]
}

export interface TaskActionRequest {
  action: 'continue' | 'interrupt' | 'abort' | 'retry'
  prompt?: string           // required for continue/interrupt
  reason?: string           // optional reason for abort
}

// Git operations
export interface GitOperation {
  taskId: string
  operation: 'merge' | 'delete_branch' | 'create_pr'
  prUrl?: string
  mergeSha?: string
  success: boolean
  error?: string
}

// Task filters and pagination
export interface TaskFilters {
  status?: TaskStatus[]
  owner?: string[]
  repo?: string
  search?: string           // search in title, prompt, repo
  tags?: string[]
  dateRange?: {
    start: string           // ISO date string
    end: string             // ISO date string
  }
}

export interface TaskListParams extends TaskFilters {
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'updatedAt' | 'status' | 'owner' | 'repo'
  sortDirection?: 'asc' | 'desc'
}

export interface TaskListResponse {
  tasks: Task[]
  totalCount: number
  page: number
  limit: number
  hasMore: boolean
}

// Status utilities
export const ACTIVE_STATUSES: TaskStatus[] = ['running', 'retrying']
export const COMPLETED_STATUSES: TaskStatus[] = ['success', 'error', 'aborted']
export const ACTIONABLE_STATUSES: TaskStatus[] = ['error', 'aborted', 'needs_review']

export const isTaskActive = (status: TaskStatus): boolean => 
  ACTIVE_STATUSES.includes(status)

export const isTaskCompleted = (status: TaskStatus): boolean => 
  COMPLETED_STATUSES.includes(status)

export const isTaskActionable = (status: TaskStatus): boolean => 
  ACTIONABLE_STATUSES.includes(status)

export const canMergeTask = (task: Task): boolean => 
  task.status === 'success' && task.prState === 'open'

export const canDeleteBranch = (task: Task): boolean => 
  (task.status === 'success' && task.prState === 'merged') || 
  task.status === 'aborted'

export const getTaskDisplayTitle = (task: Task): string => 
  task.title || 
  task.prompt.slice(0, 50) + (task.prompt.length > 50 ? '...' : '') ||
  `Task for ${task.repo}`

export const formatElapsedTime = (createdAt: string, updatedAt?: string): string => {
  const start = new Date(createdAt)
  const end = updatedAt ? new Date(updatedAt) : new Date()
  const diff = end.getTime() - start.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  return `${minutes}m`
}
