import { useQuery } from '@tanstack/react-query';
import { taskApi } from '../api/tasks';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  source?: string;
  metadata?: Record<string, any>;
}

export interface TaskLogs {
  taskId: string;
  entries: LogEntry[];
  isStreaming: boolean;
  lastUpdated: string;
}

export const useTaskLogs = (taskId: string, enabled = true) => {
  return useQuery({
    queryKey: ['task-logs', taskId],
    queryFn: () => taskApi.getTaskLogs(taskId),
    enabled,
    refetchInterval: 2000, // Poll every 2 seconds for new logs
    refetchIntervalInBackground: false,
    staleTime: 1000, // Consider data stale after 1 second
  });
};

export const useTaskLogsStream = (taskId: string, enabled = true) => {
  return useQuery({
    queryKey: ['task-logs-stream', taskId],
    queryFn: () => taskApi.getTaskLogs(taskId, { tail: 50 }), // Get last 50 lines for streaming
    enabled,
    refetchInterval: 1000, // Poll every second for new logs
    refetchIntervalInBackground: false,
    staleTime: 0, // Always consider streaming data stale
  });
};
