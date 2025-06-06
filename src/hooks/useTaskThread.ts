import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskApi } from '@/api/tasks'

export function useTaskThread(taskId: string) {
  return useQuery({
    queryKey: ['task', taskId, 'thread'],
    queryFn: () => taskApi.getTaskThread(taskId),
    enabled: !!taskId,
    refetchInterval: 5000, // Poll for new messages every 5 seconds
  })
}

export function useSendMessage(taskId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (messageContent: string) => {
      // Send message by continuing the task with the new prompt
      return await taskApi.continueTask(taskId, messageContent)
    },
    onSuccess: () => {
      // Invalidate and refetch thread messages
      queryClient.invalidateQueries({ 
        queryKey: ['task', taskId, 'thread'] 
      })
      
      // Also invalidate the task details to update status
      queryClient.invalidateQueries({ 
        queryKey: ['task', taskId] 
      })
    },
    onError: (error) => {
      console.error('Failed to send message:', error)
    },
  })
}

export function useTaskActions(taskId: string) {
  const queryClient = useQueryClient()

  const continueTask = useMutation({
    mutationFn: (prompt: string) => taskApi.continueTask(taskId, prompt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      queryClient.invalidateQueries({ queryKey: ['task', taskId, 'thread'] })
    },
  })

  const interruptTask = useMutation({
    mutationFn: (prompt: string) => taskApi.interruptTask(taskId, prompt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      queryClient.invalidateQueries({ queryKey: ['task', taskId, 'thread'] })
    },
  })

  const abortTask = useMutation({
    mutationFn: (reason?: string) => taskApi.abortTask(taskId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      queryClient.invalidateQueries({ queryKey: ['task', taskId, 'thread'] })
    },
  })

  const retryTask = useMutation({
    mutationFn: () => taskApi.retryTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      queryClient.invalidateQueries({ queryKey: ['task', taskId, 'thread'] })
    },
  })

  return {
    continueTask,
    interruptTask,
    abortTask,
    retryTask,
  }
}
