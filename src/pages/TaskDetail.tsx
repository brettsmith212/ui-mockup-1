import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, GitMerge, Trash2, Terminal, MessageSquare, Zap } from 'lucide-react'
import { Button, StatusPill, Textarea } from '@/components/ui'

export default function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back navigation */}
      <div className="mb-6">
        <Link 
          to="/"
          className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Tasks
        </Link>
      </div>

      {/* Task header */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <StatusPill status="running" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Task #{taskId}
              </span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">
              Refactor authentication system
            </h1>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <span>
                <strong>Repo:</strong> frontend/auth-service
              </span>
              <span>
                <strong>Branch:</strong> amp/refactor-auth
              </span>
              <span>
                <strong>Attempts:</strong> 1
              </span>
              <span>
                <strong>Running for:</strong> 30 minutes
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="success" 
              icon={<GitMerge className="h-4 w-4" />}
            >
              Merge PR
            </Button>
            
            <Button 
              variant="danger" 
              icon={<Trash2 className="h-4 w-4" />}
            >
              Delete Branch
            </Button>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          <button className="flex items-center space-x-2 pb-3 border-b-2 border-primary-500 text-primary-600 dark:text-primary-400">
            <MessageSquare className="h-4 w-4" />
            <span>Thread</span>
          </button>
          
          <button className="flex items-center space-x-2 pb-3 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <Terminal className="h-4 w-4" />
            <span>Logs</span>
          </button>
          
          <button className="flex items-center space-x-2 pb-3 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <Zap className="h-4 w-4" />
            <span>CI</span>
          </button>
        </nav>
      </div>

      {/* Tab content */}
      <div className="space-y-6">
        {/* Thread placeholder */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Conversation Thread
          </h3>
          
          <div className="space-y-4">
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="flex-1">
                <div className="bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl max-w-4/5">
                  <p>Starting authentication system refactor. Analyzing current implementation...</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                  2 minutes ago
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Prompt bar */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex space-x-3">
            <Textarea
              placeholder="Send a message to continue the task..."
              className="flex-1"
              resize={false}
              rows={2}
            />
            <Button className="self-end">
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
