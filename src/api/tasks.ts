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
  // Map the new API response format to our Task interface
  return {
    id: apiTask.id,
    repo: apiTask.repo || 'Unknown', // fallback if missing
    branch: apiTask.branch || 'main', // fallback if missing
    status: mapApiStatus(apiTask.status),
    prompt: apiTask.prompt || apiTask.message || 'No prompt available', // fallback if missing
    attempts: apiTask.attempts || 1, // fallback if missing
    createdAt: apiTask.started || apiTask.createdAt || new Date().toISOString(),
    updatedAt: apiTask.updated || apiTask.updatedAt || apiTask.started || new Date().toISOString(),
    owner: apiTask.owner || 'Unknown', // fallback if missing
    prUrl: apiTask.prUrl || apiTask.pr_url,
    prState: apiTask.prState || apiTask.pr_state,
    title: apiTask.title || (apiTask.prompt || apiTask.message ? 
      (apiTask.prompt || apiTask.message).slice(0, 50) + ((apiTask.prompt || apiTask.message).length > 50 ? '...' : '') : 
      `Task ${apiTask.id}`),
    description: apiTask.description,
    tags: apiTask.tags || [],
  };
};

// Map API status to our TaskStatus type
function mapApiStatus(apiStatus: string): Task['status'] {
  switch (apiStatus?.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'stopped':
      return 'success'; // Treat stopped as success for now
    case 'running':
      return 'running';
    case 'failed':
      return 'error';
    case 'aborted':
      return 'aborted';
    case 'interrupted':
      return 'paused'; // Map interrupted to paused
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

    // Build query parameters for the new API
    const queryParams: Record<string, any> = {};
    
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.page && params.page > 1) {
      // For now, we'll use offset-based pagination as a fallback
      // The API supports cursor-based pagination which is better
      queryParams.offset = (params.page - 1) * (params.limit || 50);
    }
    if (params?.status?.length) {
      queryParams.status = params.status.join(',');
    }
    if (params?.sortBy) {
      queryParams.sort_by = params.sortBy === 'updatedAt' ? 'started' : params.sortBy;
    }
    if (params?.sortDirection) {
      queryParams.sort_order = params.sortDirection;
    }
    if (params?.dateRange) {
      queryParams.started_after = params.dateRange.start;
      queryParams.started_before = params.dateRange.end;
    }

    const response = await apiClient.get(API_ENDPOINTS.TASKS.LIST, queryParams) as any;
    
    if (isDevelopment()) {
      console.log('📋 Raw API response:', response);
    }
    
    // Handle new API response format: { tasks, next_cursor, has_more, total }
    const tasks = response.tasks || [];
    const transformedTasks = tasks.map(transformTaskResponse);
    
    if (isDevelopment()) {
      console.log('📋 Transformed tasks:', transformedTasks);
    }
    
    return {
      tasks: transformedTasks,
      totalCount: response.total || transformedTasks.length,
      page: params?.page || 1,
      limit: params?.limit || 50,
      hasMore: response.has_more || false,
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
      console.log(`🔍 Backend doesn't have individual task endpoints yet, fetching from task list`);
    }

    // Workaround: Backend doesn't have individual task endpoints yet
    // So we fetch all tasks and find the one we need
    const tasksResponse = await getTasks();
    const task = tasksResponse.tasks.find(t => t.id === taskId);
    
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }
    
    if (isDevelopment()) {
      console.log(`✅ Found task ${taskId}:`, task);
    }
    
    return task;
  } catch (error) {
    if (isDevelopment()) {
      console.error(`❌ Failed to fetch task ${taskId}:`, error);
    }
    throw error;
  }
};

// Create new task
export const createTask = async (request: CreateTaskRequest): Promise<Task> => {
  try {
    if (isDevelopment()) {
      console.log('📝 Creating task:', request);
    }

    // Map our request format to the API's expected format
    const apiRequest = {
      message: request.prompt, // API expects 'message' field
      // Note: API doesn't support title, description, tags in creation yet
      // These would need to be updated via PATCH after creation
    };

    const response = await apiClient.post(
      API_ENDPOINTS.TASKS.CREATE, 
      apiRequest
    ) as any;
    
    const createdTask = transformTaskResponse(response);
    
    // If we have title, description, or tags, update them via PATCH
    if (request.title || request.description || request.tags?.length) {
      const updateRequest: any = {};
      if (request.title) updateRequest.title = request.title;
      if (request.description) updateRequest.description = request.description;
      if (request.tags?.length) updateRequest.tags = request.tags;
      
      try {
        const updatedTask = await updateTask(createdTask.id, updateRequest);
        return updatedTask;
      } catch (updateError) {
        if (isDevelopment()) {
          console.warn('⚠️ Failed to update task metadata after creation:', updateError);
        }
        // Return the created task even if metadata update failed
        return createdTask;
      }
    }
    
    return createdTask;
  } catch (error) {
    if (isDevelopment()) {
      console.error('❌ Failed to create task:', error);
    }
    throw error;
  }
};

// Update task
export const updateTask = async (taskId: string, request: UpdateTaskRequest): Promise<Task> => {
  try {
    if (isDevelopment()) {
      console.log(`✏️ Updating task ${taskId}:`, request);
    }

    const response = await apiClient.patch(
      API_ENDPOINTS.TASKS.UPDATE(taskId), 
      request
    ) as any;
    
    return transformTaskResponse(response);
  } catch (error) {
    if (isDevelopment()) {
      console.error(`❌ Failed to update task ${taskId}:`, error);
    }
    throw error;
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

    await apiClient.post(
      API_ENDPOINTS.TASK_ACTIONS.CONTINUE(taskId), 
      { message: prompt } // API expects 'message' field
    );
    
    // The continue API returns 202 Accepted, so we need to fetch the updated task
    return await getTask(taskId);
  } catch (error) {
    if (isDevelopment()) {
      console.error(`❌ Failed to continue task ${taskId}:`, error);
    }
    throw error;
  }
};

// Interrupt task (graceful interruption with SIGINT)
export const interruptTask = async (taskId: string): Promise<Task> => {
  try {
    if (isDevelopment()) {
      console.log(`⏸️ Interrupting task ${taskId}`);
    }

    await apiClient.post(
      API_ENDPOINTS.TASK_ACTIONS.INTERRUPT(taskId)
    );
    
    // The interrupt API returns 202 Accepted, so we need to fetch the updated task
    return await getTask(taskId);
  } catch (error) {
    if (isDevelopment()) {
      console.error(`❌ Failed to interrupt task ${taskId}:`, error);
    }
    throw error;
  }
};

// Abort task (force terminate with SIGKILL)
export const abortTask = async (taskId: string, reason?: string): Promise<Task> => {
  try {
    if (isDevelopment()) {
      console.log(`🛑 Aborting task ${taskId}${reason ? ` with reason: ${reason}` : ''}`);
    }

    await apiClient.post(
      API_ENDPOINTS.TASK_ACTIONS.ABORT(taskId)
      // Note: API doesn't support reason parameter in abort endpoint
    );
    
    // The abort API returns 202 Accepted, so we need to fetch the updated task
    return await getTask(taskId);
  } catch (error) {
    if (isDevelopment()) {
      console.error(`❌ Failed to abort task ${taskId}:`, error);
    }
    throw error;
  }
};

// Stop task
export const stopTask = async (taskId: string): Promise<Task> => {
  try {
    if (isDevelopment()) {
      console.log(`⏹️ Stopping task: ${taskId}`);
    }

    await apiClient.post(`/api/tasks/${taskId}/stop`);
    
    // The stop API returns 202 Accepted, so we need to fetch the updated task
    return await getTask(taskId);
  } catch (error) {
    if (isDevelopment()) {
      console.error(`❌ Failed to stop task ${taskId}:`, error);
    }
    throw error;
  }
};

// Retry task with new message
export const retryTask = async (taskId: string, message?: string): Promise<Task> => {
  try {
    if (isDevelopment()) {
      console.log(`🔄 Retrying task: ${taskId}${message ? ` with message: ${message}` : ''}`);
    }

    const requestBody = message ? { message } : { message: 'Retry task' };
    
    await apiClient.post(
      API_ENDPOINTS.TASK_ACTIONS.RETRY(taskId),
      requestBody
    );
    
    // The retry API returns 202 Accepted, so we need to fetch the updated task
    return await getTask(taskId);
  } catch (error) {
    if (isDevelopment()) {
      console.error(`❌ Failed to retry task ${taskId}:`, error);
    }
    throw error;
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
  stopTask,
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
