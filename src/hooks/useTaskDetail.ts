import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { taskApi } from '@/api/tasks';
import { isDevelopment } from '@/config/environment';

export function useTaskDetail(taskId: string) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(taskId),
    queryFn: () => taskApi.getTask(taskId),
    enabled: !!taskId,
    staleTime: 10 * 1000, // 10 seconds
    retry: (failureCount, error: any) => {
      // Don't retry on 404 errors
      if (error?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

export function useTaskThread(taskId: string) {
  return useQuery({
    queryKey: queryKeys.tasks.thread(taskId),
    queryFn: () => taskApi.getTaskThread(taskId),
    enabled: !!taskId,
    staleTime: 5 * 1000, // 5 seconds for real-time feeling
  });
}

export function useTaskLogs(taskId: string, streaming = false) {
  return useQuery({
    queryKey: queryKeys.tasks.logs(taskId),
    queryFn: () => taskApi.getTaskLogs(taskId),
    enabled: !!taskId,
    staleTime: streaming ? 0 : 5 * 1000,
    refetchInterval: streaming ? 2000 : false, // Refetch every 2 seconds when streaming
  });
}

export function useTaskCI(taskId: string) {
  return useQuery({
    queryKey: queryKeys.tasks.ci(taskId),
    queryFn: () => taskApi.getTaskCI(taskId),
    enabled: !!taskId,
    staleTime: 15 * 1000, // 15 seconds for CI status
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useTaskActions(taskId: string) {
  const queryClient = useQueryClient();

  const mergePR = useMutation({
    mutationFn: () => taskApi.mergeTask(taskId),
    onSuccess: (result) => {
      if (isDevelopment()) {
        console.log('✅ PR merged successfully:', result);
      }
      // Invalidate task queries to refetch updated state
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() });
    },
    onError: (error) => {
      if (isDevelopment()) {
        console.error('❌ Failed to merge PR:', error);
      }
    },
  });

  const deleteBranch = useMutation({
    mutationFn: () => taskApi.deleteTaskBranch(taskId),
    onSuccess: (result) => {
      if (isDevelopment()) {
        console.log('✅ Branch deleted successfully:', result);
      }
      // Invalidate task queries to refetch updated state
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() });
    },
    onError: (error) => {
      if (isDevelopment()) {
        console.error('❌ Failed to delete branch:', error);
      }
    },
  });

  const createPR = useMutation({
    mutationFn: () => taskApi.createTaskPR(taskId),
    onSuccess: (result) => {
      if (isDevelopment()) {
        console.log('✅ PR created successfully:', result);
      }
      // Invalidate task queries to refetch updated state
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() });
    },
    onError: (error) => {
      if (isDevelopment()) {
        console.error('❌ Failed to create PR:', error);
      }
    },
  });

  return {
    mergePR: {
      mutate: mergePR.mutate,
      mutateAsync: mergePR.mutateAsync,
      isPending: mergePR.isPending,
      error: mergePR.error,
    },
    deleteBranch: {
      mutate: deleteBranch.mutate,
      mutateAsync: deleteBranch.mutateAsync,
      isPending: deleteBranch.isPending,
      error: deleteBranch.error,
    },
    createPR: {
      mutate: createPR.mutate,
      mutateAsync: createPR.mutateAsync,
      isPending: createPR.isPending,
      error: createPR.error,
    },
  };
}
