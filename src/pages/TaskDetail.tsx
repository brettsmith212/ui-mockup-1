import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { Button, Textarea } from '@/components/ui'
import { TaskHeader } from '@/components/task/TaskHeader'
import { TaskTabs, type TabType } from '@/components/task/TaskTabs'
import { useTaskDetail, useTaskActions } from '@/hooks/useTaskDetail'

export default function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>()
  const [activeTab, setActiveTab] = useState<TabType>('thread')
  
  const { data: task, isLoading, error } = useTaskDetail(taskId!)
  const { mergePR, deleteBranch } = useTaskActions(taskId!)

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="card p-6 mb-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Task not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The task you're looking for doesn't exist or has been deleted.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <TaskHeader 
        task={task}
        onMergePR={mergePR}
        onDeleteBranch={deleteBranch}
      />

      <TaskTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab content */}
      <div className="space-y-6">
        {activeTab === 'thread' && (
          <>
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
                      <p>Starting {task.prompt.toLowerCase()}. Analyzing current implementation...</p>
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
          </>
        )}

        {activeTab === 'logs' && (
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Task Logs
            </h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
              <div>Task #{task.id} started at {new Date(task.createdAt).toLocaleString()}</div>
              <div>Repository: {task.repo}</div>
              <div>Status: {task.status}</div>
              <div className="mt-2 text-gray-400">Logs will be implemented in Step 11...</div>
            </div>
          </div>
        )}

        {activeTab === 'ci' && (
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              CI Pipeline
            </h3>
            <div className="text-gray-600 dark:text-gray-400">
              CI pipeline integration will be implemented in Step 12...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
