import { Plus } from 'lucide-react'
import { Button, StatusPill, type TaskStatus } from '@/components/ui'

export default function Dashboard() {
  const statuses: TaskStatus[] = ['queued', 'running', 'retrying', 'needs_review', 'success', 'error', 'aborted']

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and monitor your Amp coding tasks
          </p>
        </div>
        
        <Button icon={<Plus className="h-4 w-4" />}>
          New Task
        </Button>
      </div>

      {/* Placeholder content */}
      <div className="card p-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto flex items-center justify-center">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No tasks yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create your first Amp task to get started with automated coding assistance.
            </p>
            
            <Button size="lg">
              Create Task
            </Button>
          </div>
        </div>
      </div>
      
      {/* Status examples for design verification */}
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Status Pills Preview
        </h3>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((status) => (
            <StatusPill key={status} status={status} />
          ))}
        </div>
      </div>
    </div>
  )
}
