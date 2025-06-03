import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Amp Orchestrator</h1>
        <p className="text-gray-400 mb-8">
          Manage and monitor your Amp coding tasks
        </p>
        <div className="space-y-4">
          <div>
            <button
              onClick={() => setCount((count) => count + 1)}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Count is {count}
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Click to test React functionality
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
