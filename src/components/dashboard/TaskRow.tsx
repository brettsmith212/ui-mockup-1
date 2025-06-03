import { Link } from 'react-router-dom'
import { ExternalLink, GitBranch, Clock } from 'lucide-react'
import { StatusPill } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Task } from '@/types/task'
import { formatElapsedTime, getTaskDisplayTitle } from '@/types/task'

interface TaskRowProps {
  task: Task
  isSelected?: boolean
  onSelect?: () => void
}

export default function TaskRow({ task, isSelected = false, onSelect }: TaskRowProps) {
  const displayTitle = getTaskDisplayTitle(task)
  const elapsedTime = formatElapsedTime(task.createdAt, task.updatedAt)

  return (
    <tr
      className={cn(
        'border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
        isSelected && 'bg-primary-50 dark:bg-primary-900/20'
      )}
      onClick={onSelect}
    >
      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusPill status={task.status} size="sm" />
      </td>

      {/* Repository */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <GitBranch className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {task.repo}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {task.branch}
            </div>
          </div>
          {task.prUrl && (
            <a
              href={task.prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </td>

      {/* Branch */}
      <td className="px-6 py-4">
        <div className="text-sm font-mono text-gray-900 dark:text-gray-100 truncate max-w-32">
          {task.branch}
        </div>
      </td>

      {/* Prompt */}
      <td className="px-6 py-4">
        <div className="max-w-md">
          <Link
            to={`/tasks/${task.id}`}
            className="text-sm text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2"
            onClick={(e) => e.stopPropagation()}
          >
            {displayTitle}
          </Link>
        </div>
      </td>

      {/* Owner */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-white">
              {task.owner.split('.')[0][0].toUpperCase()}
            </span>
          </div>
          <span className="text-sm text-gray-900 dark:text-gray-100 truncate">
            {task.owner}
          </span>
        </div>
      </td>

      {/* Attempts */}
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span className={cn(
          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
          task.attempts === 1 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
            : task.attempts <= 3
            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
        )}>
          {task.attempts}
        </span>
      </td>

      {/* PR State */}
      <td className="px-6 py-4 whitespace-nowrap">
        {task.prState ? (
          <span className={cn(
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
            task.prState === 'open' && 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
            task.prState === 'merged' && 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
            task.prState === 'closed' && 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          )}>
            {task.prState}
          </span>
        ) : (
          <span className="text-xs text-gray-400 dark:text-gray-500">-</span>
        )}
      </td>

      {/* Last Update */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="h-3 w-3" />
          <span>{elapsedTime} ago</span>
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-500">
          {new Date(task.updatedAt).toLocaleDateString()}
        </div>
      </td>
    </tr>
  )
}

// Skeleton loader for task rows
export function TaskRowSkeleton() {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      <td className="px-6 py-4">
        <div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="space-y-2">
          <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="space-y-2">
          <div className="w-48 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="w-8 h-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mx-auto" />
      </td>
      <td className="px-6 py-4">
        <div className="w-12 h-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </td>
    </tr>
  )
}
