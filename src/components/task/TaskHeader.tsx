import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { StatusPill } from '@/components/ui'
import { GitControls } from './GitControls'
import type { Task } from '@/types/task'

interface TaskHeaderProps {
  task: Task
  onMergePR: () => void
  onDeleteBranch: () => void
}

export function TaskHeader({ task, onMergePR, onDeleteBranch }: TaskHeaderProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
  }

  const getRunningTime = (createdAt: string) => {
    const now = new Date()
    const created = new Date(createdAt)
    const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000)
    return formatDuration(diffInSeconds)
  }

  return (
    <>
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
              <StatusPill status={task.status} />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Task #{task.id}
              </span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">
              {task.prompt}
            </h1>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <span>
                <strong>Repo:</strong> {task.repo}
              </span>
              {task.branch && (
                <span>
                  <strong>Branch:</strong> {task.branch}
                </span>
              )}
              <span>
                <strong>Attempts:</strong> {task.attempts || 1}
              </span>
              {task.status === 'running' && (
                <span>
                  <strong>Running for:</strong> {getRunningTime(task.createdAt)}
                </span>
              )}
            </div>
          </div>
          
          <GitControls 
            onMergePR={onMergePR}
            onDeleteBranch={onDeleteBranch}
            canMerge={task.status === 'success'}
            canDelete={!!task.branch}
          />
        </div>
      </div>
    </>
  )
}
