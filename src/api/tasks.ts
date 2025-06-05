// Task CRUD operations and API calls for Amp Orchestrator

import { apiClient, handleApiError } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import { isDevelopment } from '@/config/environment';
import { 
  filterMockTasks, 
  mockThreadMessages, 
  mockTaskLogs, 
  mockCIStatus 
} from '@/data/mockTasks';
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
} from '@/types/task';
import type {
  ApiResponse,
  PaginatedResponse,
  TaskLogsQuery,
  TaskThreadQuery,
} from '@/types/api';

// MOCK DATA FLAG - Set to false to use real API
// Automatically use real API in production, allow override in development
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || false;

// Log API mode in development
if (isDevelopment()) {
  console.log(`📡 Task API Mode: ${USE_MOCK_DATA ? 'MOCK DATA' : 'REAL API'}`);
}

// Utility functions for API responses
export const transformTaskResponse = (apiTask: any): Task => {
  // Map the actual API response format to our Task interface
  return {
    id: apiTask.id,
    repo: apiTask.repo || 'Unknown', // fallback if missing
    branch: apiTask.branch || 'main', // fallback if missing
    status: mapApiStatus(apiTask.status),
    prompt: apiTask.prompt || 'No prompt available', // fallback if missing
    attempts: apiTask.attempts || 1, // fallback if missing
    createdAt: apiTask.started || apiTask.createdAt || new Date().toISOString(),
    updatedAt: apiTask.updated || apiTask.updatedAt || apiTask.started || new Date().toISOString(),
    owner: apiTask.owner || 'Unknown', // fallback if missing
    prUrl: apiTask.prUrl || apiTask.pr_url,
    prState: apiTask.prState || apiTask.pr_state,
    title: apiTask.title || (apiTask.prompt ? apiTask.prompt.slice(0, 50) + (apiTask.prompt.length > 50 ? '...' : '') : `Task ${apiTask.id}`),
    description: apiTask.description,
    tags: apiTask.tags || [],
  };
};

// Map API status to our TaskStatus type
function mapApiStatus(apiStatus: string): Task['status'] {
  switch (apiStatus?.toLowerCase()) {
    case 'stopped':
    case 'completed':
      return 'success';
    case 'running':
    case 'active':
      return 'running';
    case 'failed':
    case 'error':
      return 'error';
    case 'aborted':
    case 'cancelled':
      return 'aborted';
    case 'paused':
      return 'paused';
    case 'queued':
    case 'pending':
      return 'queued';
    case 'waiting':
      return 'waiting_for_input';
    case 'retrying':
      return 'retrying';
    case 'review':
      return 'needs_review';
    default:
      return 'queued'; // safe fallback
  }
}

// Task list and filtering
export const getTasks = async (params?: TaskListParams): Promise<TaskListResponse> => {
  // Return mock data if flag is enabled
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return filterMockTasks(params);
  }

  try {
    if (isDevelopment()) {
      console.log('🔍 Fetching tasks from:', API_ENDPOINTS.TASKS.LIST);
      console.log('🔍 API Client base URL:', apiClient.getBaseURL());
    }

    const response = await apiClient.get(API_ENDPOINTS.TASKS.LIST) as any;
    
    // Handle plain array response from current API
    const tasksArray = Array.isArray(response) ? response : (response?.data || []);
    
    if (isDevelopment()) {
      console.log('📋 Raw API response:', tasksArray);
    }
    
    const transformedTasks = tasksArray.map(transformTaskResponse);
    
    if (isDevelopment()) {
      console.log('📋 Transformed tasks:', transformedTasks);
    }
    
    return {
      tasks: transformedTasks,
      totalCount: transformedTasks.length,
      page: 1,
      limit: 50,
      hasMore: false,
    };
  } catch (error) {
    if (isDevelopment()) {
      console.error('❌ Failed to fetch tasks:', error);
      console.error('❌ Error details:', error instanceof Error ? error.message : error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack');
    }
    throw error; // Re-throw instead of handling to see the actual error
  }
};

// Get single task
export const getTask = async (taskId: string): Promise<Task> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const mockResponse = filterMockTasks();
    const task = mockResponse.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }
    return task;
  }

  try {
    if (isDevelopment()) {
      console.log(`🔍 Fetching task: ${taskId}`);
    }

    const response = await apiClient.get<ApiResponse<Task>>(
      API_ENDPOINTS.TASKS.GET(taskId)
    );
    return transformTaskResponse(response.data);
  } catch (error) {
    if (isDevelopment()) {
      console.error(`❌ Failed to fetch task ${taskId}:`, error);
    }
    return handleApiError(error);
  }
};

// Create new task
export const createTask = async (request: CreateTaskRequest): Promise<Task> => {
  try {
    if (isDevelopment()) {
      console.log('📝 Creating task:', request);
    }

    const response = await apiClient.post<ApiResponse<Task>>(
      API_ENDPOINTS.TASKS.CREATE, 
      request
    );
    return transformTaskResponse(response.data);
  } catch (error) {
    if (isDevelopment()) {
      console.error('❌ Failed to create task:', error);
    }
    return handleApiError(error);
  }
};

// Update task
export const updateTask = async (taskId: string, request: UpdateTaskRequest): Promise<Task> => {
  try {
    if (isDevelopment()) {
      console.log(`✏️ Updating task ${taskId}:`, request);
    }

    const response = await apiClient.patch<ApiResponse<Task>>(
      API_ENDPOINTS.TASKS.UPDATE(taskId), 
      request
    );
    return transformTaskResponse(response.data);
  } catch (error) {
    if (isDevelopment()) {
      console.error(`❌ Failed to update task ${taskId}:`, error);
    }
    return handleApiError(error);
  }
};

// Delete task
export const deleteTask = async (taskId: string): Promise<{ success: boolean }> => {
  try {
    if (isDevelopment()) {
      console.log(`🗑️ Deleting task: ${taskId}`);
    }

    await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.TASKS.DELETE(taskId)
    );
    return { success: true };
  } catch (error) {
    if (isDevelopment()) {
      console.error(`❌ Failed to delete task ${taskId}:`, error);
    }
    return handleApiError(error);
  }
};

// Task actions
export const performTaskAction = async (taskId: string, action: TaskActionRequest): Promise<Task> => {
  try {
    if (isDevelopment()) {
      console.log(`⚡ Performing action on task ${taskId}:`, action);
    }

    const response = await apiClient.post<ApiResponse<Task>>(
      API_ENDPOINTS.TASK_ACTIONS.ACTION(taskId), 
      action
    );
    return transformTaskResponse(response.data);
  } catch (error) {
    if (isDevelopment()) {
      console.error(`❌ Failed to perform action on task ${taskId}:`, error);
    }
    return handleApiError(error);
  }
};

// Continue task with new prompt
export const continueTask = async (taskId: string, prompt: string): Promise<Task> => {
  try {
    if (isDevelopment()) {
      console.log(`▶️ Continuing task ${taskId} with prompt:`, prompt);
    }

    const response = await apiClient.post<ApiResponse<Task>>(
      API_ENDPOINTS.TASK_ACTIONS.CONTINUE(taskId), 
      { prompt }
    );
    return transformTaskResponse(response.data);
  } catch (error) {
    if (isDevelopment()) {
      console.error(`❌ Failed to continue task ${taskId}:`, error);
    }
    return handleApiError(error);
  }
};

// Interrupt task and restart with new prompt
export const interruptTask = async (taskId: string, prompt: string): Promise<Task> => {
  try {
    if (isDevelopment()) {
      console.log(`⏸️ Interrupting task ${taskId} with new prompt:`, prompt);
    }

    const response = await apiClient.post<ApiResponse<Task>>(
      API_ENDPOINTS.TASK_ACTIONS.INTERRUPT(taskId), 
      { prompt }
    );
    return transformTaskResponse(response.data);
  } catch (error) {
    if (isDevelopment()) {
      console.error(`❌ Failed to interrupt task ${taskId}:`, error);
    }
    return handleApiError(error);
  }
};

// Abort task
export const abortTask = async (taskId: string, reason?: string): Promise<Task> => {
  try {
    if (isDevelopment()) {
      console.log(`🛑 Aborting task ${taskId}${reason ? ` with reason: ${reason}` : ''}`);
    }

    const response = await apiClient.post<ApiResponse<Task>>(
      API_ENDPOINTS.TASK_ACTIONS.ABORT(taskId), 
      { reason }
    );
    return transformTaskResponse(response.data);
  } catch (error) {
    if (isDevelopment()) {
      console.error(`❌ Failed to abort task ${taskId}:`, error);
    }
    return handleApiError(error);
  }
};

// Retry task
export const retryTask = async (taskId: string): Promise<Task> => {
  try {
    if (isDevelopment()) {
      console.log(`🔄 Retrying task: ${taskId}`);
    }

    const response = await apiClient.post<ApiResponse<Task>>(
      API_ENDPOINTS.TASK_ACTIONS.RETRY(taskId)
    );
    return transformTaskResponse(response.data);
  } catch (error) {
    if (isDevelopment()) {
      console.error(`❌ Failed to retry task ${taskId}:`, error);
    }
    return handleApiError(error);
  }
};

// Get task thread/conversation
export const getTaskThread = async (taskId: string, params?: TaskThreadQuery): Promise<ThreadMessage[]> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockThreadMessages[taskId] || [];
  }

  try {
    const queryParams: Record<string, any> = {
      page: params?.page || 1,
      limit: params?.limit || 100,
      ...params,
    };

    if (isDevelopment()) {
      console.log(`💬 Fetching thread for task ${taskId}:`, queryParams);
    }

    const response = await apiClient.get<PaginatedResponse<ThreadMessage>>(
      API_ENDPOINTS.TASK_DATA.THREAD(taskId), 
      queryParams
    );
    return response.data;
  } catch (error) {
    if (isDevelopment()) {
      console.error(`❌ Failed to fetch thread for task ${taskId}:`, error);
    }
    return handleApiError(error);
  }
};

// Get task logs
export const getTaskLogs = async (taskId: string, params?: TaskLogsQuery): Promise<TaskLogs> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockTaskLogs[taskId] || {
      taskId,
      logs: [],
      totalLines: 0,
      hasMore: false,
    };
  }

  try {
    const queryParams: Record<string, any> = {
      page: params?.page || 1,
      limit: params?.limit || 1000,
      ...params,
    };

    if (isDevelopment()) {
      console.log(`📋 Fetching logs for task ${taskId}:`, queryParams);
    }

    const response = await apiClient.get<PaginatedResponse<TaskLogs['logs'][0]>>(
      API_ENDPOINTS.TASK_DATA.LOGS(taskId), 
      queryParams
    );
    
    return {
      taskId,
      logs: response.data,
      totalLines: response.meta.totalCount,
      hasMore: response.meta.hasNext,
    };
  } catch (error) {
    if (isDevelopment()) {
      console.error(`❌ Failed to fetch logs for task ${taskId}:`, error);
    }
    return handleApiError(error);
  }
};

// Get task CI status
export const getTaskCI = async (taskId: string): Promise<CIStatus> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 350));
    return mockCIStatus[taskId] || {
      taskId,
      status: 'pending',
      jobs: [],
      checks: [],
    };
  }

  try {
    if (isDevelopment()) {
      console.log(`🔧 Fetching CI status for task: ${taskId}`);
    }

    const response = await apiClient.get<ApiResponse<CIStatus>>(
      API_ENDPOINTS.TASK_DATA.CI(taskId)
    );
    return response.data;
  } catch (error) {
    if (isDevelopment()) {
      console.error(`❌ Failed to fetch CI status for task ${taskId}:`, error);
    }
    return handleApiError(error);
  }
};

// Git operations
export const mergeTask = async (taskId: string): Promise<GitOperation> => {
  try {
    if (isDevelopment()) {
      console.log(`🔀 Merging task: ${taskId}`);
    }

    const response = await apiClient.post<ApiResponse<GitOperation>>(
      API_ENDPOINTS.GIT.MERGE(taskId)
    );
    return response.data;
  } catch (error) {
    if (isDevelopment()) {
      console.error(`❌ Failed to merge task ${taskId}:`, error);
    }
    return handleApiError(error);
  }
};

export const deleteTaskBranch = async (taskId: string): Promise<GitOperation> => {
  try {
    if (isDevelopment()) {
      console.log(`🗑️ Deleting branch for task: ${taskId}`);
    }

    const response = await apiClient.post<ApiResponse<GitOperation>>(
      API_ENDPOINTS.GIT.DELETE_BRANCH(taskId)
    );
    return response.data;
  } catch (error) {
    if (isDevelopment()) {
      console.error(`❌ Failed to delete branch for task ${taskId}:`, error);
    }
    return handleApiError(error);
  }
};

export const createTaskPR = async (taskId: string): Promise<GitOperation> => {
  try {
    if (isDevelopment()) {
      console.log(`📝 Creating PR for task: ${taskId}`);
    }

    const response = await apiClient.post<ApiResponse<GitOperation>>(
      API_ENDPOINTS.GIT.CREATE_PR(taskId)
    );
    return response.data;
  } catch (error) {
    if (isDevelopment()) {
      console.error(`❌ Failed to create PR for task ${taskId}:`, error);
    }
    return handleApiError(error);
  }
};

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
  getTaskCI,
  mergeTask,
  deleteTaskBranch,
  createTaskPR,
};
