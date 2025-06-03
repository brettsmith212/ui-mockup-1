// Task CRUD operations and API calls

import { apiClient, withAuth, handleApiError } from '@/lib/api'
import { 
  filterMockTasks, 
  mockThreadMessages, 
  mockTaskLogs, 
  mockCIStatus 
} from '@/data/mockTasks'
import type {
  Task,
  TaskListResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskActionRequest,
  TaskListParams,
  ThreadMessage,
  TaskLogs,
  CIStatus,
  GitOperation,
} from '@/types/task'
import type {
  ApiResponse,
  PaginatedResponse,
  TaskListQuery,
  TaskLogsQuery,
  TaskThreadQuery,
} from '@/types/api'

// MOCK DATA FLAG - Set to false to use real API
// TODO: Remove this flag and mock data before production
const USE_MOCK_DATA = true

// Task list and filtering
export const getTasks = withAuth(
  async (client: typeof apiClient, params?: TaskListParams): Promise<TaskListResponse> => {
    // Return mock data if flag is enabled
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      return filterMockTasks(params)
    }

    try {
      const queryParams: TaskListQuery = {
        page: params?.page || 1,
        limit: params?.limit || 50,
        sortBy: params?.sortBy || 'updatedAt',
        sortDirection: params?.sortDirection || 'desc',
      }

      // Add filters
      if (params?.status?.length) {
        queryParams.status = params.status
      }
      if (params?.owner?.length) {
        queryParams.owner = params.owner
      }
      if (params?.repo) {
        queryParams.repo = params.repo
      }
      if (params?.search) {
        queryParams.search = params.search
      }
      if (params?.tags?.length) {
        queryParams.tags = params.tags
      }
      if (params?.dateRange) {
        queryParams.dateFrom = params.dateRange.start
        queryParams.dateTo = params.dateRange.end
      }

      const response = await client.get<PaginatedResponse<Task>>('/tasks', queryParams as Record<string, string>)
      
      return {
        tasks: response.data,
        totalCount: response.meta.totalCount,
        page: response.meta.page,
        limit: response.meta.limit,
        hasMore: response.meta.hasNext,
      }
    } catch (error) {
      return handleApiError(error)
    }
  }
)

// Get single task
export const getTask = withAuth(
  async (client: typeof apiClient, taskId: string): Promise<Task> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200))
      const mockResponse = filterMockTasks()
      const task = mockResponse.tasks.find(t => t.id === taskId)
      if (!task) {
        throw new Error(`Task ${taskId} not found`)
      }
      return task
    }

    try {
      const response = await client.get<ApiResponse<Task>>(`/tasks/${taskId}`)
      return response.data
    } catch (error) {
      return handleApiError(error)
    }
  }
)

// Create new task
export const createTask = withAuth(
  async (client: typeof apiClient, request: CreateTaskRequest): Promise<Task> => {
    try {
      const response = await client.post<ApiResponse<Task>>('/tasks', request)
      return response.data
    } catch (error) {
      return handleApiError(error)
    }
  }
)

// Update task
export const updateTask = withAuth(
  async (client: typeof apiClient, taskId: string, request: UpdateTaskRequest): Promise<Task> => {
    try {
      const response = await client.patch<ApiResponse<Task>>(`/tasks/${taskId}`, request)
      return response.data
    } catch (error) {
      return handleApiError(error)
    }
  }
)

// Delete task
export const deleteTask = withAuth(
  async (client: typeof apiClient, taskId: string): Promise<{ success: boolean }> => {
    try {
      await client.delete<ApiResponse<void>>(`/tasks/${taskId}`)
      return { success: true }
    } catch (error) {
      return handleApiError(error)
    }
  }
)

// Task actions
export const performTaskAction = withAuth(
  async (client: typeof apiClient, taskId: string, action: TaskActionRequest): Promise<Task> => {
    try {
      const response = await client.post<ApiResponse<Task>>(`/tasks/${taskId}/action`, action)
      return response.data
    } catch (error) {
      return handleApiError(error)
    }
  }
)

// Continue task with new prompt
export const continueTask = withAuth(
  async (client: typeof apiClient, taskId: string, prompt: string): Promise<Task> => {
    try {
      const response = await client.post<ApiResponse<Task>>(`/tasks/${taskId}/continue`, { prompt })
      return response.data
    } catch (error) {
      return handleApiError(error)
    }
  }
)

// Interrupt task and restart with new prompt
export const interruptTask = withAuth(
  async (client: typeof apiClient, taskId: string, prompt: string): Promise<Task> => {
    try {
      const response = await client.post<ApiResponse<Task>>(`/tasks/${taskId}/interrupt`, { prompt })
      return response.data
    } catch (error) {
      return handleApiError(error)
    }
  }
)

// Abort task
export const abortTask = withAuth(
  async (client: typeof apiClient, taskId: string, reason?: string): Promise<Task> => {
    try {
      const response = await client.post<ApiResponse<Task>>(`/tasks/${taskId}/abort`, { reason })
      return response.data
    } catch (error) {
      return handleApiError(error)
    }
  }
)

// Retry task
export const retryTask = withAuth(
  async (client: typeof apiClient, taskId: string): Promise<Task> => {
    try {
      const response = await client.post<ApiResponse<Task>>(`/tasks/${taskId}/retry`)
      return response.data
    } catch (error) {
      return handleApiError(error)
    }
  }
)

// Get task thread/conversation
export const getTaskThread = withAuth(
  async (client: typeof apiClient, taskId: string, params?: TaskThreadQuery): Promise<ThreadMessage[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return mockThreadMessages[taskId] || []
    }

    try {
      const queryParams: TaskThreadQuery = {
        page: params?.page || 1,
        limit: params?.limit || 100,
        ...params,
      }

      const response = await client.get<PaginatedResponse<ThreadMessage>>(
        `/tasks/${taskId}/thread`, 
        queryParams as Record<string, string>
      )
      return response.data
    } catch (error) {
      return handleApiError(error)
    }
  }
)

// Get task logs
export const getTaskLogs = withAuth(
  async (client: typeof apiClient, taskId: string, params?: TaskLogsQuery): Promise<TaskLogs> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400))
      return mockTaskLogs[taskId] || {
        taskId,
        logs: [],
        totalLines: 0,
        hasMore: false,
      }
    }

    try {
      const queryParams: TaskLogsQuery = {
        page: params?.page || 1,
        limit: params?.limit || 1000,
        ...params,
      }

      const response = await client.get<PaginatedResponse<TaskLogs['logs'][0]>>(
        `/tasks/${taskId}/logs`, 
        queryParams as Record<string, string>
      )
      
      return {
        taskId,
        logs: response.data,
        totalLines: response.meta.totalCount,
        hasMore: response.meta.hasNext,
      }
    } catch (error) {
      return handleApiError(error)
    }
  }
)

export const getLogsStream = withAuth(
  async (client: typeof apiClient, taskId: string): Promise<TaskLogs> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200))
      return mockTaskLogs[taskId] || {
        taskId,
        logs: [],
        totalLines: 0,
        hasMore: false,
      }
    }

    try {
      const response = await client.get<ApiResponse<TaskLogs>>(`/tasks/${taskId}/logs/stream`)
      return response.data
    } catch (error) {
      return handleApiError(error)
    }
  }
)

// Get task CI status
export const getTaskCI = withAuth(
  async (client: typeof apiClient, taskId: string): Promise<CIStatus> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 350))
      return mockCIStatus[taskId] || {
        taskId,
        status: 'pending',
        jobs: [],
        checks: [],
      }
    }

    try {
      const response = await client.get<ApiResponse<CIStatus>>(`/tasks/${taskId}/ci`)
      return response.data
    } catch (error) {
      return handleApiError(error)
    }
  }
)

// Git operations
export const mergeTask = withAuth(
  async (client: typeof apiClient, taskId: string): Promise<GitOperation> => {
    try {
      const response = await client.post<ApiResponse<GitOperation>>(`/tasks/${taskId}/merge`)
      return response.data
    } catch (error) {
      return handleApiError(error)
    }
  }
)

export const deleteTaskBranch = withAuth(
  async (client: typeof apiClient, taskId: string): Promise<GitOperation> => {
    try {
      const response = await client.post<ApiResponse<GitOperation>>(`/tasks/${taskId}/delete-branch`)
      return response.data
    } catch (error) {
      return handleApiError(error)
    }
  }
)

export const createTaskPR = withAuth(
  async (client: typeof apiClient, taskId: string): Promise<GitOperation> => {
    try {
      const response = await client.post<ApiResponse<GitOperation>>(`/tasks/${taskId}/create-pr`)
      return response.data
    } catch (error) {
      return handleApiError(error)
    }
  }
)

// Utility functions for API responses
export const transformTaskResponse = (task: any): Task => {
  return {
    ...task,
    // Ensure dates are properly formatted
    createdAt: new Date(task.createdAt).toISOString(),
    updatedAt: new Date(task.updatedAt).toISOString(),
    // Add computed fields
    title: task.title || task.prompt?.slice(0, 50) + (task.prompt?.length > 50 ? '...' : ''),
  }
}

export const transformTaskListResponse = (response: any): TaskListResponse => {
  return {
    tasks: response.data.map(transformTaskResponse),
    totalCount: response.meta.totalCount,
    page: response.meta.page,
    limit: response.meta.limit,
    hasMore: response.meta.hasNext,
  }
}

// Export all task API functions
export const taskApi = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  performTaskAction,
  continueTask,
  interruptTask,
  abortTask,
  retryTask,
  getTaskThread,
  getTaskLogs,
  getLogsStream,
  getTaskCI,
  mergeTask,
  deleteTaskBranch,
  createTaskPR,
}
