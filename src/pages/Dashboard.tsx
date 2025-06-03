import { Plus } from 'lucide-react'

export default function Dashboard() {
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
        
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </button>
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
            
            <button className="btn bg-primary-600 hover:bg-primary-700 text-white px-6 py-2">
              Create Task
            </button>
          </div>
        </div>
      </div>
      
      {/* Status examples for design verification */}
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Status Pills Preview
        </h3>
        <div className="flex gap-2 flex-wrap">
          <span className="status-pill bg-status-queued/20 text-status-queued">queued</span>
          <span className="status-pill bg-status-running/20 text-status-running">running</span>
          <span className="status-pill bg-status-retrying/20 text-status-retrying">retrying</span>
          <span className="status-pill bg-status-needs-review/20 text-status-needs-review">needs review</span>
          <span className="status-pill bg-status-success/20 text-status-success">success</span>
          <span className="status-pill bg-status-error/20 text-status-error">error</span>
          <span className="status-pill bg-status-aborted/20 text-status-aborted">aborted</span>
        </div>
      </div>
    </div>
  )
}
