/**
 * Environment configuration utility
 * Centralizes environment variable access and provides type-safe defaults
 */

export interface Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  API_BASE_URL: string;
  WS_BASE_URL: string;
  API_TIMEOUT: number;
  WS_RECONNECT_INTERVAL: number;
  WS_MAX_RECONNECT_ATTEMPTS: number;
  WS_HEARTBEAT_INTERVAL: number;
  ENABLE_DEV_TOOLS: boolean;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * Get environment configuration with type-safe defaults
 */
export function getEnvironment(): Environment {
  const nodeEnv = import.meta.env.NODE_ENV as Environment['NODE_ENV'] || 'development';
  
  // Default API URL based on environment
  // In development, use relative URLs to leverage Vite proxy
  const defaultApiUrl = nodeEnv === 'production' 
    ? 'https://api.amp-orchestrator.com' 
    : (typeof window !== 'undefined' ? '' : 'http://localhost:8080');
    
  // Default WebSocket URL based on API URL
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultApiUrl;
  const defaultWsUrl = apiBaseUrl.replace(/^http/, 'ws');

  return {
    NODE_ENV: nodeEnv,
    API_BASE_URL: apiBaseUrl,
    WS_BASE_URL: import.meta.env.VITE_WS_BASE_URL || defaultWsUrl,
    API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
    WS_RECONNECT_INTERVAL: Number(import.meta.env.VITE_WS_RECONNECT_INTERVAL) || 1000,
    WS_MAX_RECONNECT_ATTEMPTS: Number(import.meta.env.VITE_WS_MAX_RECONNECT_ATTEMPTS) || 10,
    WS_HEARTBEAT_INTERVAL: Number(import.meta.env.VITE_WS_HEARTBEAT_INTERVAL) || 30000,
    ENABLE_DEV_TOOLS: import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true' || nodeEnv === 'development',
    LOG_LEVEL: (import.meta.env.VITE_LOG_LEVEL as Environment['LOG_LEVEL']) || 
      (nodeEnv === 'production' ? 'warn' : 'debug'),
  };
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return getEnvironment().NODE_ENV === 'development';
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return getEnvironment().NODE_ENV === 'production';
}

/**
 * Check if we're in test mode
 */
export function isTest(): boolean {
  return getEnvironment().NODE_ENV === 'test';
}

/**
 * Get the current environment instance
 */
export const env = getEnvironment();

/**
 * Validate required environment variables
 */
export function validateEnvironment(): void {
  const requiredVars = ['API_BASE_URL'];
  const missing: string[] = [];
  
  const currentEnv = getEnvironment();
  
  requiredVars.forEach(varName => {
    const value = currentEnv[varName as keyof Environment];
    if (!value) {
      missing.push(varName);
    }
  });
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file or environment configuration.'
    );
  }
  
  // Validate URLs
  try {
    new URL(currentEnv.API_BASE_URL);
  } catch {
    throw new Error(`Invalid API_BASE_URL: ${currentEnv.API_BASE_URL}`);
  }
  
  try {
    new URL(currentEnv.WS_BASE_URL);
  } catch {
    throw new Error(`Invalid WS_BASE_URL: ${currentEnv.WS_BASE_URL}`);
  }
}

/**
 * Log current environment configuration (for debugging)
 */
export function logEnvironment(): void {
  if (!isDevelopment()) return;
  
  const currentEnv = getEnvironment();
  console.group('🔧 Environment Configuration');
  console.log('NODE_ENV:', currentEnv.NODE_ENV);
  console.log('API_BASE_URL:', currentEnv.API_BASE_URL);
  console.log('WS_BASE_URL:', currentEnv.WS_BASE_URL);
  console.log('API_TIMEOUT:', currentEnv.API_TIMEOUT);
  console.log('LOG_LEVEL:', currentEnv.LOG_LEVEL);
  console.groupEnd();
}
