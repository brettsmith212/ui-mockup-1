export class ExponentialBackoff {
  private currentAttempt = 0;
  private baseDelay: number;
  private maxDelay: number;
  private maxAttempts: number;
  private jitterRange: number;

  constructor(
    baseDelay = 1000,
    maxDelay = 30000,
    maxAttempts = 10,
    jitterRange = 0.1
  ) {
    this.baseDelay = baseDelay;
    this.maxDelay = maxDelay;
    this.maxAttempts = maxAttempts;
    this.jitterRange = jitterRange;
  }

  getDelay(): number {
    if (this.currentAttempt >= this.maxAttempts) {
      return -1; // Indicate no more attempts
    }

    // Calculate exponential delay: baseDelay * 2^attempt
    const exponentialDelay = this.baseDelay * Math.pow(2, this.currentAttempt);
    
    // Cap at maxDelay
    const cappedDelay = Math.min(exponentialDelay, this.maxDelay);
    
    // Add jitter to prevent thundering herd
    const jitter = cappedDelay * this.jitterRange * (Math.random() - 0.5);
    
    return cappedDelay + jitter;
  }

  incrementAttempt(): void {
    this.currentAttempt++;
  }

  reset(): void {
    this.currentAttempt = 0;
  }

  canRetry(): boolean {
    return this.currentAttempt < this.maxAttempts;
  }

  getCurrentAttempt(): number {
    return this.currentAttempt;
  }

  getMaxAttempts(): number {
    return this.maxAttempts;
  }
}

export interface ReconnectOptions {
  baseDelay?: number;
  maxDelay?: number;
  maxAttempts?: number;
  jitterRange?: number;
  onReconnectAttempt?: (attempt: number) => void;
  onReconnectSuccess?: () => void;
  onReconnectFailure?: (error: Error) => void;
  onMaxAttemptsReached?: () => void;
}

export class ReconnectManager {
  private backoff: ExponentialBackoff;
  private reconnectTimer?: number;
  private options: ReconnectOptions;

  constructor(options: ReconnectOptions = {}) {
    this.options = options;
    this.backoff = new ExponentialBackoff(
      options.baseDelay,
      options.maxDelay,
      options.maxAttempts,
      options.jitterRange
    );
  }

  scheduleReconnect(reconnectFn: () => Promise<void>): void {
    if (!this.backoff.canRetry()) {
      this.options.onMaxAttemptsReached?.();
      return;
    }

    const delay = this.backoff.getDelay();
    if (delay === -1) {
      this.options.onMaxAttemptsReached?.();
      return;
    }

    this.reconnectTimer = window.setTimeout(async () => {
      try {
        this.backoff.incrementAttempt();
        this.options.onReconnectAttempt?.(this.backoff.getCurrentAttempt());
        
        await reconnectFn();
        
        this.reset();
        this.options.onReconnectSuccess?.();
      } catch (error) {
        this.options.onReconnectFailure?.(error as Error);
        this.scheduleReconnect(reconnectFn);
      }
    }, delay);
  }

  reset(): void {
    this.clearTimer();
    this.backoff.reset();
  }

  stop(): void {
    this.clearTimer();
  }

  private clearTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
  }

  getCurrentAttempt(): number {
    return this.backoff.getCurrentAttempt();
  }

  getMaxAttempts(): number {
    return this.backoff.getMaxAttempts();
  }
}
