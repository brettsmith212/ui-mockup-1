import { useCallback, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  useTaskEvents, 
  useTaskEventsByTaskId,
  UseTaskEventsOptions 
} from './useTaskEvents';
import { 
  TaskStatusEvent, 
  TaskLogEvent, 
  ThreadMessageEvent,
  TaskProgressEvent 
} from '../types/events';
import { Task } from '../types/task';

interface UseRealtimeTaskUpdatesOptions {
  /**
   * Whether to enable real-time updates
   * @default true
   */
  enabled?: boolean;
  
  /**
   * Callback when any task status changes
   */
  onTaskStatusChange?: (taskId: string, status: string) => void;
  
  /**
   * Callback when new logs are received
   */
  onNewLogs?: (taskId: string, logLine: string) => void;
  
  /**
   * Callback when new thread messages are received
   */
  onNewMessage?: (taskId: string, message: any) => void;
  
  /**
   * Callback when task progress updates
   */
  onProgressUpdate?: (taskId: string, progress: number, stage: string) => void;
}

export function useRealtimeTaskUpdates(options: UseRealtimeTaskUpdatesOptions = {}) {
  const { 
    enabled = true,
    onTaskStatusChange,
    onNewLogs,
    onNewMessage,
    onProgressUpdate
  } = options;

  const queryClient = useQueryClient();
  const callbacksRef = useRef({ onTaskStatusChange, onNewLogs, onNewMessage, onProgressUpdate });
  callbacksRef.current = { onTaskStatusChange, onNewLogs, onNewMessage, onProgressUpdate };

  const handleTaskStatusUpdate = useCallback((event: TaskStatusEvent) => {
    const { taskId, status } = event.payload;
    
    // Update task in tasks list cache
    queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => {
      return oldTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: status as Task['status'], updatedAt: event.payload.updatedAt }
          : task
      );
    });

    // Update individual task cache
    queryClient.setQueryData(['task', taskId], (oldTask: Task | undefined) => {
      return oldTask 
        ? { ...oldTask, status: status as Task['status'], updatedAt: event.payload.updatedAt }
        : oldTask;
    });

    callbacksRef.current.onTaskStatusChange?.(taskId, status);
  }, [queryClient]);

  const handleTaskLog = useCallback((event: TaskLogEvent) => {
    const { taskId, logLine } = event.payload;
    
    // Append to logs cache
    queryClient.setQueryData(['task-logs', taskId], (oldLogs: string[] = []) => {
      // Prevent duplicate log lines
      if (oldLogs[oldLogs.length - 1] === logLine) {
        return oldLogs;
      }
      return [...oldLogs, logLine];
    });

    callbacksRef.current.onNewLogs?.(taskId, logLine);
  }, [queryClient]);

  const handleThreadMessage = useCallback((event: ThreadMessageEvent) => {
    const { taskId, messageId, role, content, timestamp } = event.payload;
    
    const newMessage = {
      id: messageId,
      role,
      content,
      timestamp,
      taskId,
    };

    // Add to thread messages cache
    queryClient.setQueryData(['task-thread', taskId], (oldMessages: any[] = []) => {
      // Prevent duplicate messages
      if (oldMessages.some(msg => msg.id === messageId)) {
        return oldMessages;
      }
      return [...oldMessages, newMessage];
    });

    callbacksRef.current.onNewMessage?.(taskId, newMessage);
  }, [queryClient]);

  const handleTaskProgress = useCallback((event: TaskProgressEvent) => {
    const { taskId, progress, stage, estimatedTimeRemaining } = event.payload;
    
    // Update task progress in cache
    queryClient.setQueryData(['task', taskId], (oldTask: Task | undefined) => {
      return oldTask 
        ? { 
            ...oldTask, 
            progress, 
            stage,
            estimatedTimeRemaining 
          }
        : oldTask;
    });

    callbacksRef.current.onProgressUpdate?.(taskId, progress, stage);
  }, [queryClient]);

  const eventOptions: UseTaskEventsOptions = enabled ? {
    onTaskStatusUpdate: handleTaskStatusUpdate,
    onTaskLog: handleTaskLog,
    onThreadMessage: handleThreadMessage,
    onTaskProgress: handleTaskProgress,
  } : {};

  const { connectionState, isConnected, isReconnecting } = useTaskEvents(eventOptions);

  return {
    connectionState,
    isConnected,
    isReconnecting,
    enabled,
  };
}

// Hook for specific task real-time updates
export function useRealtimeTaskUpdatesByTaskId(
  taskId: string, 
  options: UseRealtimeTaskUpdatesOptions = {}
) {
  const { 
    enabled = true,
    onTaskStatusChange,
    onNewLogs,
    onNewMessage,
    onProgressUpdate
  } = options;

  const queryClient = useQueryClient();
  const callbacksRef = useRef({ onTaskStatusChange, onNewLogs, onNewMessage, onProgressUpdate });
  callbacksRef.current = { onTaskStatusChange, onNewLogs, onNewMessage, onProgressUpdate };

  const handleTaskStatusUpdate = useCallback((event: TaskStatusEvent) => {
    const { status } = event.payload;
    
    // Update individual task cache
    queryClient.setQueryData(['task', taskId], (oldTask: Task | undefined) => {
      return oldTask 
        ? { ...oldTask, status: status as Task['status'], updatedAt: event.payload.updatedAt }
        : oldTask;
    });

    callbacksRef.current.onTaskStatusChange?.(taskId, status);
  }, [queryClient, taskId]);

  const handleTaskLog = useCallback((event: TaskLogEvent) => {
    const { logLine } = event.payload;
    
    // Append to logs cache
    queryClient.setQueryData(['task-logs', taskId], (oldLogs: string[] = []) => {
      if (oldLogs[oldLogs.length - 1] === logLine) {
        return oldLogs;
      }
      return [...oldLogs, logLine];
    });

    callbacksRef.current.onNewLogs?.(taskId, logLine);
  }, [queryClient, taskId]);

  const handleThreadMessage = useCallback((event: ThreadMessageEvent) => {
    const { messageId, role, content, timestamp } = event.payload;
    
    const newMessage = {
      id: messageId,
      role,
      content,
      timestamp,
      taskId,
    };

    // Add to thread messages cache
    queryClient.setQueryData(['task-thread', taskId], (oldMessages: any[] = []) => {
      if (oldMessages.some(msg => msg.id === messageId)) {
        return oldMessages;
      }
      return [...oldMessages, newMessage];
    });

    callbacksRef.current.onNewMessage?.(taskId, newMessage);
  }, [queryClient, taskId]);

  const handleTaskProgress = useCallback((event: TaskProgressEvent) => {
    const { progress, stage, estimatedTimeRemaining } = event.payload;
    
    // Update task progress in cache
    queryClient.setQueryData(['task', taskId], (oldTask: Task | undefined) => {
      return oldTask 
        ? { 
            ...oldTask, 
            progress, 
            stage,
            estimatedTimeRemaining 
          }
        : oldTask;
    });

    callbacksRef.current.onProgressUpdate?.(taskId, progress, stage);
  }, [queryClient, taskId]);

  const eventOptions: UseTaskEventsOptions = enabled ? {
    onTaskStatusUpdate: handleTaskStatusUpdate,
    onTaskLog: handleTaskLog,
    onThreadMessage: handleThreadMessage,
    onTaskProgress: handleTaskProgress,
  } : {};

  const { connectionState, isConnected, isReconnecting } = useTaskEventsByTaskId(taskId, eventOptions);

  return {
    connectionState,
    isConnected,
    isReconnecting,
    enabled,
  };
}
