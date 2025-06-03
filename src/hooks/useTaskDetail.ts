import { useQuery } from '@tanstack/react-query'
import { taskApi } from '@/api/tasks'

export function useTaskDetail(taskId: string) {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () => taskApi.getTask(taskId),
    enabled: !!taskId,
  })
}

export function useTaskActions(taskId: string) {
  const mergePR = async () => {
    // TODO: Implement merge PR functionality
    console.log('Merging PR for task:', taskId)
  }

  const deleteBranch = async () => {
    // TODO: Implement delete branch functionality  
    console.log('Deleting branch for task:', taskId)
  }

  return {
    mergePR,
    deleteBranch,
  }
}
