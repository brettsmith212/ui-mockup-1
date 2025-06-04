import { TaskEvent, WebSocketConfig, WebSocketState } from '../types/events';
import { ReconnectManager, ReconnectOptions } from '../utils/websocket-reconnect';

export type EventCallback<T = TaskEvent> = (event: T) => void;
export type ErrorCallback = (error: Error) => void;
export type StateChangeCallback = (state: WebSocketState) => void;

interface EventSubscription {
  eventType: string;
  callback: EventCallback;
  id: string;
}

export class WebSocketClient {
  private ws?: WebSocket;
  private config: Required<WebSocketConfig>;
  private reconnectManager: ReconnectManager;
  private subscriptions = new Map<string, EventSubscription[]>();
  private state: WebSocketState;
  private heartbeatTimer?: number;
  private stateChangeCallbacks = new Set<StateChangeCallback>();
  private errorCallbacks = new Set<ErrorCallback>();

  constructor(config: WebSocketConfig, reconnectOptions?: ReconnectOptions) {
    this.config = {
      protocols: [],
      reconnectInterval: 1000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      ...config,
    };

    this.state = {
      isConnected: false,
      isReconnecting: false,
      reconnectAttempts: 0,
      lastError: undefined,
    };

    this.reconnectManager = new ReconnectManager({
      baseDelay: this.config.reconnectInterval,
      maxAttempts: this.config.maxReconnectAttempts,
      onReconnectAttempt: (attempt) => {
        this.updateState({ isReconnecting: true, reconnectAttempts: attempt });
      },
      onReconnectSuccess: () => {
        this.updateState({ 
          isReconnecting: false, 
          reconnectAttempts: 0,
          lastError: undefined 
        });
      },
      onReconnectFailure: (error) => {
        this.handleError(error);
      },
      onMaxAttemptsReached: () => {
        this.updateState({ 
          isReconnecting: false,
          lastError: 'Max reconnection attempts reached'
        });
      },
      ...reconnectOptions,
    });
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config.url, this.config.protocols);
        
        this.ws.onopen = () => {
          this.updateState({ 
            isConnected: true, 
            isReconnecting: false,
            reconnectAttempts: 0,
            lastError: undefined
          });
          this.reconnectManager.reset();
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event);
        };

        this.ws.onclose = (event) => {
          this.handleClose(event);
        };

        this.ws.onerror = (event) => {
          const error = new Error(`WebSocket error: ${event.type}`);
          this.handleError(error);
          reject(error);
        };

      } catch (error) {
        this.handleError(error as Error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.reconnectManager.stop();
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = undefined;
    }
    
    this.updateState({ 
      isConnected: false, 
      isReconnecting: false,
      reconnectAttempts: 0
    });
  }

  send(data: unknown): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    const message = JSON.stringify(data);
    this.ws.send(message);
  }

  subscribe<T extends TaskEvent>(
    eventType: T['type'],
    callback: EventCallback<T>
  ): () => void {
    const id = crypto.randomUUID();
    const subscription: EventSubscription = {
      eventType,
      callback: callback as EventCallback,
      id,
    };

    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, []);
    }
    
    this.subscriptions.get(eventType)!.push(subscription);

    // Return unsubscribe function
    return () => {
      const subs = this.subscriptions.get(eventType);
      if (subs) {
        const index = subs.findIndex(s => s.id === id);
        if (index !== -1) {
          subs.splice(index, 1);
        }
        if (subs.length === 0) {
          this.subscriptions.delete(eventType);
        }
      }
    };
  }

  onStateChange(callback: StateChangeCallback): () => void {
    this.stateChangeCallbacks.add(callback);
    return () => {
      this.stateChangeCallbacks.delete(callback);
    };
  }

  onError(callback: ErrorCallback): () => void {
    this.errorCallbacks.add(callback);
    return () => {
      this.errorCallbacks.delete(callback);
    };
  }

  getState(): WebSocketState {
    return { ...this.state };
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data) as TaskEvent;
      
      // Handle heartbeat responses
      if (data.type === 'pong') {
        return;
      }

      // Dispatch to subscribers
      const subscribers = this.subscriptions.get(data.type);
      if (subscribers) {
        subscribers.forEach(sub => {
          try {
            sub.callback(data);
          } catch (error) {
            console.error(`Error in event callback for ${data.type}:`, error);
          }
        });
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  private handleClose(event: CloseEvent): void {
    this.updateState({ isConnected: false });
    this.stopHeartbeat();

    // Don't reconnect if it was a normal closure
    if (event.code === 1000) {
      return;
    }

    // Attempt to reconnect
    this.reconnectManager.scheduleReconnect(() => this.connect());
  }

  private handleError(error: Error): void {
    this.updateState({ lastError: error.message });
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (callbackError) {
        console.error('Error in error callback:', callbackError);
      }
    });
  }

  private updateState(updates: Partial<WebSocketState>): void {
    this.state = { ...this.state, ...updates };
    this.stateChangeCallbacks.forEach(callback => {
      try {
        callback(this.state);
      } catch (error) {
        console.error('Error in state change callback:', error);
      }
    });
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatTimer = window.setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        try {
          this.send({ type: 'ping', timestamp: new Date().toISOString() });
        } catch (error) {
          console.error('Failed to send heartbeat:', error);
        }
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }
  }
}

// Singleton instance for global use
let globalWebSocketClient: WebSocketClient | null = null;

export function createWebSocketClient(
  config: WebSocketConfig,
  reconnectOptions?: ReconnectOptions
): WebSocketClient {
  return new WebSocketClient(config, reconnectOptions);
}

export function getGlobalWebSocketClient(): WebSocketClient | null {
  return globalWebSocketClient;
}

export function setGlobalWebSocketClient(client: WebSocketClient): void {
  globalWebSocketClient = client;
}

export function initializeGlobalWebSocket(
  config: WebSocketConfig,
  reconnectOptions?: ReconnectOptions
): WebSocketClient {
  globalWebSocketClient = createWebSocketClient(config, reconnectOptions);
  return globalWebSocketClient;
}
