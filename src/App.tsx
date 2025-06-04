import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { validateEnvironment, logEnvironment, isDevelopment } from '@/config/environment'
import { tokenManager } from '@/lib/api'
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
        
        // Temporarily disable authentication for development
        tokenManager.forceBypassAuth();
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
