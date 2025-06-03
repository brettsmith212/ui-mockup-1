import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)
  const [isDark, setIsDark] = useState(true)

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">
              Amp Orchestrator
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and monitor your Amp coding tasks
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setCount((count) => count + 1)}
                className="btn bg-primary-600 hover:bg-primary-700 text-white px-6 py-2"
              >
                Count is {count}
              </button>
              
              <button
                onClick={() => setIsDark(!isDark)}
                className="btn bg-gray-600 hover:bg-gray-700 text-white px-6 py-2"
              >
                {isDark ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
            
            <div className="flex gap-2 justify-center flex-wrap">
              <span className="status-pill bg-status-queued/20 text-status-queued">queued</span>
              <span className="status-pill bg-status-running/20 text-status-running">running</span>
              <span className="status-pill bg-status-retrying/20 text-status-retrying">retrying</span>
              <span className="status-pill bg-status-needs-review/20 text-status-needs-review">needs review</span>
              <span className="status-pill bg-status-success/20 text-status-success">success</span>
              <span className="status-pill bg-status-error/20 text-status-error">error</span>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              TailwindCSS with custom theme configured ✅
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
