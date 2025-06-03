import { QueryClient } from '@tanstack/react-query'

// TanStack Query configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes for most data
      staleTime: 5 * 60 * 1000,
      // Cache time: 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status
          if (status >= 400 && status < 500) {
            return false
          }
        }
        // Retry up to 2 times for other errors
        return failureCount < 2
      },
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for real-time data
      refetchOnWindowFocus: true,
      // Background refetch interval for active queries (30 seconds)
      refetchInterval: 30 * 1000,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      // Mutation retry delay
      retryDelay: 1000,
    },
  },
})

// Query keys factory for consistent key management
export const queryKeys = {
  // Task-related queries
  tasks: {
    all: ['tasks'] as const,
    lists: () => [...queryKeys.tasks.all, 'list'] as const,
    list: (filters?: Record<string, any>) => 
      [...queryKeys.tasks.lists(), filters] as const,
    details: () => [...queryKeys.tasks.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.tasks.details(), id] as const,
    logs: (id: string) => [...queryKeys.tasks.detail(id), 'logs'] as const,
    thread: (id: string) => [...queryKeys.tasks.detail(id), 'thread'] as const,
    ci: (id: string) => [...queryKeys.tasks.detail(id), 'ci'] as const,
  },
  
  // Auth-related queries
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
  
  // Real-time queries (shorter cache times)
  realtime: {
    taskStatus: (id: string) => ['realtime', 'task', id, 'status'] as const,
    taskLogs: (id: string) => ['realtime', 'task', id, 'logs'] as const,
  },
} as const

// Type for query keys
export type QueryKeys = typeof queryKeys
