export interface WebSocketMessage {
  type: string;
  payload: unknown;
  timestamp: string;
}

export interface TaskStatusEvent {
  type: 'task_status_update';
  payload: {
    taskId: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
    updatedAt: string;
  };
}

export interface TaskLogEvent {
  type: 'task_log';
  payload: {
    taskId: string;
    logLine: string;
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'debug';
  };
}

export interface ThreadMessageEvent {
  type: 'thread_message';
  payload: {
    taskId: string;
    messageId: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
  };
}

export interface TaskProgressEvent {
  type: 'task_progress';
  payload: {
    taskId: string;
    progress: number;
    stage: string;
    estimatedTimeRemaining?: number;
  };
}

export interface ConnectionStatusEvent {
  type: 'connection_status';
  payload: {
    status: 'connected' | 'disconnected' | 'reconnecting' | 'error';
    message?: string;
  };
}

export type TaskEvent = 
  | TaskStatusEvent 
  | TaskLogEvent 
  | ThreadMessageEvent 
  | TaskProgressEvent 
  | ConnectionStatusEvent;

export interface WebSocketConfig {
  url: string;
  protocols?: string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

export interface WebSocketState {
  isConnected: boolean;
  isReconnecting: boolean;
  reconnectAttempts: number;
  lastError?: string;
}
