// TanStack Query hooks for task operations

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { useToasts } from '@/lib'
import { taskApi } from '@/api/tasks'
import type {
  TaskListParams,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskActionRequest,
} from '@/types/task'

// Get paginated tasks list
export const useTasks = (params?: TaskListParams) => {
  return useQuery({
    queryKey: queryKeys.tasks.list(params),
    queryFn: () => taskApi.getTasks(params),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get infinite scrolling tasks list
export const useInfiniteTasks = (params?: Omit<TaskListParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: queryKeys.tasks.list(params),
    queryFn: ({ pageParam = 1 }) => taskApi.getTasks({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined
    },
    initialPageParam: 1,
    staleTime: 30 * 1000,
  })
}

// Get single task
export const useTask = (taskId: string) => {
  return useQuery({
    queryKey: queryKeys.tasks.detail(taskId),
    queryFn: () => taskApi.getTask(taskId),
    enabled: !!taskId,
    staleTime: 10 * 1000, // 10 seconds for active task
  })
}

// Get task thread/conversation
export const useTaskThread = (taskId: string) => {
  return useQuery({
    queryKey: queryKeys.tasks.thread(taskId),
    queryFn: () => taskApi.getTaskThread(taskId),
    enabled: !!taskId,
    staleTime: 5 * 1000, // 5 seconds for real-time updates
    refetchInterval: 5000, // 5 seconds
  })
}

// Get task logs
export const useTaskLogs = (taskId: string) => {
  return useQuery({
    queryKey: queryKeys.tasks.logs(taskId),
    queryFn: () => taskApi.getTaskLogs(taskId),
    enabled: !!taskId,
    staleTime: 2 * 1000, // 2 seconds for logs
    refetchInterval: 3000, // Refetch every 3 seconds
  })
}

// Get task CI status
export const useTaskCI = (taskId: string) => {
  return useQuery({
    queryKey: queryKeys.tasks.ci(taskId),
    queryFn: () => taskApi.getTaskCI(taskId),
    enabled: !!taskId,
    staleTime: 15 * 1000, // 15 seconds for CI
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

// Create task mutation
export const useCreateTask = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToasts()

  return useMutation({
    mutationFn: (request: CreateTaskRequest) => taskApi.createTask(request),
    onSuccess: (newTask) => {
      // Invalidate tasks list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      
      // Add new task to cache
      queryClient.setQueryData(queryKeys.tasks.detail(newTask.id), newTask)
      
      addToast({
        type: 'success',
        title: 'Task Created',
        message: `Task "${newTask.title || newTask.prompt.slice(0, 30)}..." has been created successfully.`,
      })
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Failed to Create Task',
        message: error.message || 'An unexpected error occurred.',
      })
    },
  })
}

// Update task mutation
export const useUpdateTask = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToasts()

  return useMutation({
    mutationFn: ({ taskId, request }: { taskId: string; request: UpdateTaskRequest }) =>
      taskApi.updateTask(taskId, request),
    onSuccess: (updatedTask) => {
      // Update task in cache
      queryClient.setQueryData(queryKeys.tasks.detail(updatedTask.id), updatedTask)
      
      // Invalidate tasks list
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      
      addToast({
        type: 'success',
        title: 'Task Updated',
        message: 'Task has been updated successfully.',
      })
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Failed to Update Task',
        message: error.message || 'An unexpected error occurred.',
      })
    },
  })
}

// Delete task mutation
export const useDeleteTask = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToasts()

  return useMutation({
    mutationFn: (taskId: string) => taskApi.deleteTask(taskId),
    onSuccess: (_, taskId) => {
      // Remove task from cache
      queryClient.removeQueries({ queryKey: queryKeys.tasks.detail(taskId) })
      
      // Invalidate tasks list
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      
      addToast({
        type: 'success',
        title: 'Task Deleted',
        message: 'Task has been deleted successfully.',
      })
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Failed to Delete Task',
        message: error.message || 'An unexpected error occurred.',
      })
    },
  })
}

// Task action mutations
export const useTaskAction = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToasts()

  return useMutation({
    mutationFn: ({ taskId, action }: { taskId: string; action: TaskActionRequest }) =>
      taskApi.performTaskAction(taskId, action),
    onSuccess: (updatedTask, { action }) => {
      // Update task in cache
      queryClient.setQueryData(queryKeys.tasks.detail(updatedTask.id), updatedTask)
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.thread(updatedTask.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.logs(updatedTask.id) })
      
      const actionNames = {
        continue: 'continued',
        interrupt: 'interrupted',
        abort: 'aborted',
        retry: 'retried',
      }
      
      addToast({
        type: 'success',
        title: 'Task Action Completed',
        message: `Task has been ${actionNames[action.action]} successfully.`,
      })
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Task Action Failed',
        message: error.message || 'An unexpected error occurred.',
      })
    },
  })
}

// Continue task mutation
export const useContinueTask = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToasts()

  return useMutation({
    mutationFn: ({ taskId, prompt }: { taskId: string; prompt: string }) =>
      taskApi.continueTask(taskId, prompt),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(queryKeys.tasks.detail(updatedTask.id), updatedTask)
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.thread(updatedTask.id) })
      
      addToast({
        type: 'success',
        title: 'Task Continued',
        message: 'Task has been continued with the new prompt.',
      })
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Failed to Continue Task',
        message: error.message || 'An unexpected error occurred.',
      })
    },
  })
}

// Interrupt task mutation
export const useInterruptTask = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToasts()

  return useMutation({
    mutationFn: ({ taskId, prompt }: { taskId: string; prompt: string }) =>
      taskApi.interruptTask(taskId, prompt),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(queryKeys.tasks.detail(updatedTask.id), updatedTask)
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.thread(updatedTask.id) })
      
      addToast({
        type: 'info',
        title: 'Task Interrupted',
        message: 'Task has been interrupted and will restart with the new prompt.',
      })
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Failed to Interrupt Task',
        message: error.message || 'An unexpected error occurred.',
      })
    },
  })
}

// Abort task mutation
export const useAbortTask = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToasts()

  return useMutation({
    mutationFn: ({ taskId, reason }: { taskId: string; reason?: string }) =>
      taskApi.abortTask(taskId, reason),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(queryKeys.tasks.detail(updatedTask.id), updatedTask)
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      
      addToast({
        type: 'warning',
        title: 'Task Aborted',
        message: 'Task has been aborted successfully.',
      })
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Failed to Abort Task',
        message: error.message || 'An unexpected error occurred.',
      })
    },
  })
}

// Git operation mutations
export const useMergeTask = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToasts()

  return useMutation({
    mutationFn: (taskId: string) => taskApi.mergeTask(taskId),
    onSuccess: (result, taskId) => {
      if (result.success) {
        // Invalidate task to refetch updated state
        queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(taskId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
        
        addToast({
          type: 'success',
          title: 'PR Merged',
          message: 'Pull request has been merged successfully.',
        })
      } else {
        addToast({
          type: 'error',
          title: 'Merge Failed',
          message: result.error || 'Failed to merge pull request.',
        })
      }
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Merge Failed',
        message: error.message || 'An unexpected error occurred.',
      })
    },
  })
}

export const useDeleteTaskBranch = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToasts()

  return useMutation({
    mutationFn: (taskId: string) => taskApi.deleteTaskBranch(taskId),
    onSuccess: (result, taskId) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(taskId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
        
        addToast({
          type: 'success',
          title: 'Branch Deleted',
          message: 'Task branch has been deleted successfully.',
        })
      } else {
        addToast({
          type: 'error',
          title: 'Delete Failed',
          message: result.error || 'Failed to delete branch.',
        })
      }
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: error.message || 'An unexpected error occurred.',
      })
    },
  })
}
