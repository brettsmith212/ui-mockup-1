import { useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  TaskEvent, 
  TaskStatusEvent, 
  TaskLogEvent, 
  ThreadMessageEvent,
  TaskProgressEvent,
  WebSocketState 
} from '../types/events';
import { getGlobalWebSocketClient } from '../lib/websocket';

export interface UseTaskEventsOptions {
  taskId?: string;
  onTaskStatusUpdate?: (event: TaskStatusEvent) => void;
  onTaskLog?: (event: TaskLogEvent) => void;
  onThreadMessage?: (event: ThreadMessageEvent) => void;
  onTaskProgress?: (event: TaskProgressEvent) => void;
  onConnectionStateChange?: (state: WebSocketState) => void;
  onError?: (error: Error) => void;
}

export function useTaskEvents(options: UseTaskEventsOptions = {}) {
  const queryClient = useQueryClient();
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const handleTaskStatusUpdate = useCallback((event: TaskStatusEvent) => {
    const { taskId, onTaskStatusUpdate } = optionsRef.current;
    
    // Only handle events for the specified task or all tasks if no taskId specified
    if (taskId && event.payload.taskId !== taskId) {
      return;
    }

    // Invalidate relevant queries to trigger refetch
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['task', event.payload.taskId] });

    // Call custom handler if provided
    onTaskStatusUpdate?.(event);
  }, [queryClient]);

  const handleTaskLog = useCallback((event: TaskLogEvent) => {
    const { taskId, onTaskLog } = optionsRef.current;
    
    if (taskId && event.payload.taskId !== taskId) {
      return;
    }

    // Update logs cache
    queryClient.setQueryData(
      ['task-logs', event.payload.taskId],
      (oldLogs: string[] = []) => [...oldLogs, event.payload.logLine]
    );

    onTaskLog?.(event);
  }, [queryClient]);

  const handleThreadMessage = useCallback((event: ThreadMessageEvent) => {
    const { taskId, onThreadMessage } = optionsRef.current;
    
    if (taskId && event.payload.taskId !== taskId) {
      return;
    }

    // Update thread messages cache
    queryClient.setQueryData(
      ['task-thread', event.payload.taskId],
      (oldMessages: any[] = []) => [...oldMessages, event.payload]
    );

    onThreadMessage?.(event);
  }, [queryClient]);

  const handleTaskProgress = useCallback((event: TaskProgressEvent) => {
    const { taskId, onTaskProgress } = optionsRef.current;
    
    if (taskId && event.payload.taskId !== taskId) {
      return;
    }

    // Update task progress in cache
    queryClient.setQueryData(
      ['task', event.payload.taskId],
      (oldTask: any) => oldTask ? { 
        ...oldTask, 
        progress: event.payload.progress,
        stage: event.payload.stage,
        estimatedTimeRemaining: event.payload.estimatedTimeRemaining
      } : oldTask
    );

    onTaskProgress?.(event);
  }, [queryClient]);

  const handleConnectionStateChange = useCallback((state: WebSocketState) => {
    optionsRef.current.onConnectionStateChange?.(state);
  }, []);

  const handleError = useCallback((error: Error) => {
    optionsRef.current.onError?.(error);
  }, []);

  useEffect(() => {
    const wsClient = getGlobalWebSocketClient();
    if (!wsClient) {
      console.warn('WebSocket client not initialized. Call initializeGlobalWebSocket first.');
      return;
    }

    // Subscribe to events
    const unsubscribeStatus = wsClient.subscribe('task_status_update', handleTaskStatusUpdate);
    const unsubscribeLog = wsClient.subscribe('task_log', handleTaskLog);
    const unsubscribeMessage = wsClient.subscribe('thread_message', handleThreadMessage);
    const unsubscribeProgress = wsClient.subscribe('task_progress', handleTaskProgress);

    // Subscribe to connection state changes
    const unsubscribeState = wsClient.onStateChange(handleConnectionStateChange);
    const unsubscribeError = wsClient.onError(handleError);

    return () => {
      unsubscribeStatus();
      unsubscribeLog();
      unsubscribeMessage();
      unsubscribeProgress();
      unsubscribeState();
      unsubscribeError();
    };
  }, [
    handleTaskStatusUpdate,
    handleTaskLog,
    handleThreadMessage,
    handleTaskProgress,
    handleConnectionStateChange,
    handleError
  ]);

  const wsClient = getGlobalWebSocketClient();
  
  return {
    connectionState: wsClient?.getState() ?? {
      isConnected: false,
      isReconnecting: false,
      reconnectAttempts: 0,
    },
    isConnected: wsClient?.getState().isConnected ?? false,
    isReconnecting: wsClient?.getState().isReconnecting ?? false,
  };
}

// Hook for specific task events
export function useTaskEventsByTaskId(taskId: string, options: Omit<UseTaskEventsOptions, 'taskId'> = {}) {
  return useTaskEvents({ ...options, taskId });
}

// Hook for global task events (all tasks)
export function useGlobalTaskEvents(options: Omit<UseTaskEventsOptions, 'taskId'> = {}) {
  return useTaskEvents(options);
}

// Hook for connection status only
export function useWebSocketConnection() {
  const { connectionState, isConnected, isReconnecting } = useTaskEvents();
  
  const connect = useCallback(() => {
    const wsClient = getGlobalWebSocketClient();
    if (wsClient && !isConnected) {
      wsClient.connect().catch(console.error);
    }
  }, [isConnected]);

  const disconnect = useCallback(() => {
    const wsClient = getGlobalWebSocketClient();
    if (wsClient && isConnected) {
      wsClient.disconnect();
    }
  }, [isConnected]);

  return {
    connectionState,
    isConnected,
    isReconnecting,
    connect,
    disconnect,
  };
}
