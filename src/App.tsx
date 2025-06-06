import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { validateEnvironment, logEnvironment, isDevelopment, env } from '@/config/environment'
import { tokenManager } from '@/lib/api'
import { initializeGlobalWebSocket } from '@/lib/websocket'
import { buildWsUrl, WS_ENDPOINTS } from '@/config/api'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import TaskDetail from './pages/TaskDetail'

function App() {
  // Initialize app configuration
  React.useEffect(() => {
    try {
      // Validate environment configuration
      validateEnvironment();
      
      // Log environment in development
      if (isDevelopment()) {
        logEnvironment();
        
        // Debug: Log API config for troubleshooting
        console.log('🔧 API Base URL:', env.API_BASE_URL);
        console.log('🔧 Full API URL example:', `${env.API_BASE_URL}/api/tasks`);
        
        // Temporarily disable authentication for development
        tokenManager.forceBypassAuth();
        
        // Initialize WebSocket for real-time updates
        try {
          const wsUrl = buildWsUrl(WS_ENDPOINTS.TASKS);
          console.log('🔌 Initializing WebSocket:', wsUrl);
          
          const wsClient = initializeGlobalWebSocket({
            url: wsUrl,
            protocols: [],
            reconnectInterval: 1000,
            maxReconnectAttempts: 10,
            heartbeatInterval: 30000,
          });
          
          // Connect to WebSocket
          wsClient.connect().then(() => {
            console.log('✅ WebSocket connected successfully');
          }).catch((error) => {
            console.warn('⚠️ WebSocket connection failed:', error);
          });
        } catch (error) {
          console.error('❌ Failed to initialize WebSocket:', error);
        }
        
        console.log('🚀 App initialized in development mode');
        console.log('🔓 Authentication bypassed for testing');
      }
    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks/:taskId" element={<TaskDetail />} />
          </Routes>
        </AppLayout>
      </Router>
    </QueryClientProvider>
  );
}

export default App
