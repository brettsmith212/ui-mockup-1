# Backend API Contract

This document specifies the complete API contract that the backend must implement for the Amp Task Management UI to function properly.

## Overview

The UI is built with React and TypeScript, using TanStack Query for data fetching and caching, and WebSocket for real-time updates. All API responses should follow REST conventions with proper HTTP status codes.

## Authentication

All endpoints require JWT authentication via the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

### Auth Endpoints

#### POST /auth/login
```typescript
// Request
{
  email: string;
  password: string;
}

// Response
{
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
      role: 'admin' | 'user';
      permissions: string[];
    };
    token: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
      tokenType: 'Bearer';
    };
  };
  success: boolean;
  timestamp: string;
}
```

#### POST /auth/refresh
```typescript
// Request
{
  refreshToken: string;
}

// Response (same as login)
```

## Task Management Endpoints

### GET /api/tasks
List tasks with filtering, pagination, and sorting.

**Query Parameters:**
```typescript
{
  page?: number;           // Default: 1
  limit?: number;          // Default: 20, Max: 100
  status?: string[];       // Filter by task status
  owner?: string[];        // Filter by owner
  repo?: string;           // Filter by repository
  search?: string;         // Search in title, prompt, repo
  tags?: string[];         // Filter by tags
  sortBy?: 'createdAt' | 'updatedAt' | 'status' | 'owner' | 'repo';
  sortDirection?: 'asc' | 'desc';
  dateFrom?: string;       // ISO date string
  dateTo?: string;         // ISO date string
}
```

**Response:**
```typescript
{
  data: Task[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  success: boolean;
  timestamp: string;
}
```

### POST /api/tasks
Create a new task.

**Request:**
```typescript
{
  repo: string;            // GitHub repo URL or name
  prompt: string;          // Task instruction
  branch?: string;         // Auto-generated if not provided
  title?: string;          // Optional display title
  description?: string;    // Optional description
  tags?: string[];         // Optional tags
}
```

**Response:**
```typescript
{
  data: Task;
  success: boolean;
  timestamp: string;
}
```

### GET /api/tasks/:id
Get a single task with full details.

**Response:**
```typescript
{
  data: Task;
  success: boolean;
  timestamp: string;
}
```

### PATCH /api/tasks/:id
Update task properties.

**Request:**
```typescript
{
  prompt?: string;
  status?: TaskStatus;
  title?: string;
  description?: string;
  tags?: string[];
}
```

### DELETE /api/tasks/:id
Delete a task and cleanup associated resources.

## Task Actions

### POST /api/tasks/:id/continue
Continue a paused/waiting task with additional instructions.

**Request:**
```typescript
{
  prompt: string;          // Additional instructions
}
```

**Response:**
```typescript
{
  data: Task;              // Updated task
  success: boolean;
  timestamp: string;
}
```

### POST /api/tasks/:id/interrupt
Interrupt a running task and restart with new instructions.

**Request:**
```typescript
{
  prompt: string;          // New instructions
}
```

### POST /api/tasks/:id/abort
Abort a task with optional reason.

**Request:**
```typescript
{
  reason?: string;         // Optional abort reason
}
```

### POST /api/tasks/:id/retry
Retry a failed task.

**Response:**
```typescript
{
  data: Task;              // Updated task
  success: boolean;
  timestamp: string;
}
```

## Task Data Endpoints

### GET /api/tasks/:id/thread
Get conversation thread for a task.

**Query Parameters:**
```typescript
{
  page?: number;
  limit?: number;
  since?: string;          // ISO timestamp
  role?: string[];         // Filter by message role
}
```

**Response:**
```typescript
{
  data: ThreadMessage[];
  meta: PaginationMeta;
  success: boolean;
  timestamp: string;
}

interface ThreadMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    type?: 'text' | 'code' | 'error' | 'file_change';
    files?: string[];
    exitCode?: number;
  };
}
```

### GET /api/tasks/:id/logs
Get task execution logs.

**Query Parameters:**
```typescript
{
  page?: number;
  limit?: number;
  level?: string[];        // Filter by log level
  since?: string;          // ISO timestamp
  search?: string;         // Search in log messages
  source?: string;         // Filter by log source
}
```

**Response:**
```typescript
{
  data: {
    logs: LogEntry[];
    totalLines: number;
    hasMore: boolean;
  };
  success: boolean;
  timestamp: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  source?: string;
  metadata?: Record<string, any>;
}
```

### GET /api/tasks/:id/ci
Get CI/build status for a task.

**Response:**
```typescript
{
  data: {
    taskId: string;
    runId?: string;
    status: 'pending' | 'running' | 'success' | 'failure' | 'cancelled';
    conclusion?: string;
    url?: string;
    jobs: CIJob[];
    checks: CICheck[];
    startedAt?: string;
    completedAt?: string;
    lastUpdated?: string;
  };
  success: boolean;
  timestamp: string;
}
```

## Git Operations

### POST /api/tasks/:id/merge
Merge the task's pull request.

**Response:**
```typescript
{
  data: {
    success: boolean;
    prUrl: string;
    mergeSha?: string;
    error?: string;
  };
  success: boolean;
  timestamp: string;
}
```

### POST /api/tasks/:id/delete-branch
Delete the task's branch after merge/abort.

**Response:**
```typescript
{
  data: {
    success: boolean;
    branch: string;
    error?: string;
  };
  success: boolean;
  timestamp: string;
}
```

### POST /api/tasks/:id/create-pr
Create a pull request for the task.

**Request:**
```typescript
{
  title?: string;
  description?: string;
  draft?: boolean;
}
```

## WebSocket Events

The UI connects to WebSocket at `/ws` with JWT authentication via query parameter:
```
ws://localhost:8080/ws?token=<jwt_token>
```

### Event Format
All WebSocket messages follow this structure:
```typescript
{
  type: string;
  payload: any;
  timestamp: string;      // ISO date string
}
```

### Task Status Updates
```typescript
{
  type: 'task_status_update';
  payload: {
    taskId: string;
    status: TaskStatus;
    updatedAt: string;
  };
}
```

### Log Stream
```typescript
{
  type: 'task_log';
  payload: {
    taskId: string;
    logLine: string;
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'debug';
  };
}
```

### Thread Messages
```typescript
{
  type: 'thread_message';
  payload: {
    taskId: string;
    messageId: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
  };
}
```

### Task Progress
```typescript
{
  type: 'task_progress';
  payload: {
    taskId: string;
    progress: number;        // 0-100
    stage: string;           // Human readable stage
    estimatedTimeRemaining?: number; // milliseconds
  };
}
```

### Heartbeat
The client sends ping messages every 30 seconds:
```typescript
{
  type: 'ping';
  timestamp: string;
}
```

The server should respond with:
```typescript
{
  type: 'pong';
  timestamp: string;
}
```

## Data Types

### Task
```typescript
interface Task {
  id: string;
  repo: string;            // Repository name or URL
  branch: string;          // Git branch name
  status: TaskStatus;
  prompt: string;          // Latest prompt/instruction
  attempts: number;        // Number of retry attempts
  updatedAt: string;       // ISO date string
  createdAt: string;       // ISO date string
  owner: string;           // User who created the task
  prUrl?: string;          // Pull request URL
  prState?: 'open' | 'merged' | 'closed';
  title?: string;          // Display title
  description?: string;    // Optional description
  elapsedTime?: number;    // Milliseconds since start
  estimatedCompletion?: string; // ISO date string
  tags?: string[];         // Optional tags
}

type TaskStatus = 
  | 'queued'              // Waiting to start
  | 'running'             // Currently executing
  | 'paused'              // Temporarily paused
  | 'waiting_for_input'   // Waiting for user response
  | 'retrying'            // Retrying after failure
  | 'needs_review'        // Completed but needs review
  | 'success'             // Successfully completed
  | 'aborted'             // Manually aborted
  | 'error';              // Failed with error
```

## Error Handling

All error responses should follow this format:
```typescript
{
  error: string;           // Error code/type
  message: string;         // Human readable message
  statusCode: number;      // HTTP status code
  timestamp: string;       // ISO date string
  details?: Record<string, any>; // Optional additional details
}
```

### Common Error Codes
- `UNAUTHORIZED` (401): Invalid or expired token
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid request data
- `RATE_LIMITED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

## Rate Limiting

Include rate limit headers in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
X-RateLimit-Retry-After: 3600
```

## Health Check

### GET /health
```typescript
{
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;          // Seconds
  services: {
    database: 'up' | 'down';
    redis: 'up' | 'down';
    websocket: 'up' | 'down';
    git: 'up' | 'down';
  };
  timestamp: string;
}
```

## CORS Configuration

For development, allow:
- Origin: `http://localhost:5173` (Vite dev server)
- Methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`
- Headers: `Content-Type, Authorization, X-Requested-With`
- Credentials: `true`

## Implementation Notes

1. **Task State Management**: Tasks can transition between states. Ensure proper validation of state transitions.

2. **Real-time Updates**: WebSocket events should be sent to all connected clients with access to the task.

3. **Pagination**: Use cursor-based pagination for better performance with large datasets.

4. **Caching**: Consider implementing Redis caching for frequently accessed data.

5. **Security**: Validate all input data and sanitize outputs. Implement proper RBAC for task access.

6. **Monitoring**: Log all API calls and WebSocket events for debugging and analytics.

7. **Git Integration**: Integrate with GitHub/GitLab APIs for repository operations.

8. **File Handling**: Support file uploads for task attachments and code files.

This contract ensures the UI can function fully with proper real-time updates, data management, and user interactions.
