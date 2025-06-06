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

  const handleTaskStatusUpdate = useCallback((event: any) => {
    const { taskId, onTaskStatusUpdate } = optionsRef.current;
    
    // Backend sends: { type: "task-update", data: { id: "abc", status: "stopped", ... } }
    const eventTaskId = event.data?.id;
    
    // Only handle events for the specified task or all tasks if no taskId specified
    if (taskId && eventTaskId !== taskId) {
      return;
    }

    // Invalidate relevant queries to trigger refetch
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['task', eventTaskId] });

    // Call custom handler if provided - adapt to expected format
    if (onTaskStatusUpdate) {
      const adaptedEvent = {
        type: 'task_status_update',
        payload: {
          taskId: eventTaskId,
          status: event.data?.status,
          updatedAt: event.data?.started || new Date().toISOString()
        }
      };
      onTaskStatusUpdate(adaptedEvent as TaskStatusEvent);
    }
  }, [queryClient]);

  const handleTaskLog = useCallback((event: any) => {
    const { taskId, onTaskLog } = optionsRef.current;
    
    // Backend sends: { type: "log", data: { worker_id: "abc", content: "line", timestamp: "..." } }
    const eventTaskId = event.data?.worker_id;
    
    if (taskId && eventTaskId !== taskId) {
      return;
    }

    // Update logs cache
    queryClient.setQueryData(
      ['task-logs', eventTaskId],
      (oldLogs: string[] = []) => [...oldLogs, event.data?.content || '']
    );

    // Call custom handler if provided - adapt to expected format
    if (onTaskLog) {
      const adaptedEvent = {
        type: 'task_log',
        payload: {
          taskId: eventTaskId,
          logLine: event.data?.content || '',
          timestamp: event.data?.timestamp || new Date().toISOString()
        }
      };
      onTaskLog(adaptedEvent as TaskLogEvent);
    }
  }, [queryClient]);

  const handleThreadMessage = useCallback((event: any) => {
    const { taskId, onThreadMessage } = optionsRef.current;
    
    // Backend sends: { type: "thread_message", data: { id: "msg-123", type: "assistant", content: "...", ... } }
    // Need to extract task ID from somewhere - might need to be passed in context
    const eventTaskId = taskId; // For now, assume we're filtering at subscription level
    
    if (taskId && !eventTaskId) {
      return;
    }

    const messageData = {
      id: event.data?.id || crypto.randomUUID(),
      role: event.data?.type === 'assistant' ? 'assistant' : 'user', 
      content: event.data?.content || '',
      timestamp: event.data?.timestamp || new Date().toISOString(),
      taskId: eventTaskId
    };

    // Update thread messages cache
    queryClient.setQueryData(
      ['task-thread', eventTaskId],
      (oldMessages: any[] = []) => {
        // Prevent duplicates
        if (oldMessages.some(msg => msg.id === messageData.id)) {
          return oldMessages;
        }
        return [...oldMessages, messageData];
      }
    );

    // Call custom handler if provided - adapt to expected format
    if (onThreadMessage) {
      const adaptedEvent = {
        type: 'thread_message',
        payload: {
          taskId: eventTaskId,
          messageId: messageData.id,
          role: messageData.role,
          content: messageData.content,
          timestamp: messageData.timestamp
        }
      };
      onThreadMessage(adaptedEvent as ThreadMessageEvent);
    }
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

    // Subscribe to events (matching backend event types)
    const unsubscribeStatus = wsClient.subscribe('task-update', handleTaskStatusUpdate);
    const unsubscribeLog = wsClient.subscribe('log', handleTaskLog);
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
