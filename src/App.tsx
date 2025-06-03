import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import TaskDetail from './pages/TaskDetail'

function App() {
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
  )
}

export default App
