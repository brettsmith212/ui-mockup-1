import { User, Bot, Settings } from 'lucide-react'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'
import type { ThreadMessage } from '@/types/task'

interface MessageBubbleProps {
  message: ThreadMessage
  className?: string
}

export function MessageBubble({ message, className = '' }: MessageBubbleProps) {
  const getRoleConfig = (role: ThreadMessage['role']) => {
    switch (role) {
      case 'user':
        return {
          icon: User,
          label: 'You',
          bgColor: 'bg-blue-600',
          textColor: 'text-blue-600 dark:text-blue-400',
          bubbleColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
        }
      case 'amp':
        return {
          icon: Bot,
          label: 'Amp',
          bgColor: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
          textColor: 'text-emerald-600 dark:text-emerald-400',
          bubbleColor: 'bg-emerald-50 dark:bg-emerald-900/20',
          borderColor: 'border-emerald-200 dark:border-emerald-800',
        }
      case 'system':
        return {
          icon: Settings,
          label: 'System',
          bgColor: 'bg-gray-600',
          textColor: 'text-gray-600 dark:text-gray-400',
          bubbleColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-700',
        }
    }
  }

  const config = getRoleConfig(message.role)
  const Icon = config.icon

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 1) {
      return 'just now'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getMessageTypeIndicator = () => {
    if (message.metadata?.type === 'error') {
      return (
        <div className="flex items-center space-x-1 text-red-500 dark:text-red-400 text-xs mb-2">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          <span>Error</span>
        </div>
      )
    }
    
    if (message.metadata?.type === 'file_change') {
      return (
        <div className="flex items-center space-x-1 text-purple-500 dark:text-purple-400 text-xs mb-2">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          <span>File Changes</span>
        </div>
      )
    }

    if (message.metadata?.type === 'code') {
      return (
        <div className="flex items-center space-x-1 text-blue-500 dark:text-blue-400 text-xs mb-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          <span>Code Execution</span>
        </div>
      )
    }

    return null
  }

  const getFilesList = () => {
    if (message.metadata?.files?.length) {
      return (
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Affected files:
          </div>
          <div className="flex flex-wrap gap-1">
            {message.metadata.files.map((file, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono"
              >
                {file}
              </span>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className={`flex space-x-3 ${className}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 ${config.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-4 h-4 text-white" />
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-1">
          <span className={`text-sm font-medium ${config.textColor}`}>
            {config.label}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTimestamp(message.ts)}
          </span>
          {message.metadata?.exitCode !== undefined && (
            <span className={`text-xs px-2 py-0.5 rounded ${
              message.metadata.exitCode === 0
                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              Exit: {message.metadata.exitCode}
            </span>
          )}
        </div>

        {/* Message bubble */}
        <div className={`${config.bubbleColor} ${config.borderColor} border rounded-xl p-3 max-w-4xl`}>
          {getMessageTypeIndicator()}
          <MarkdownRenderer content={message.content} />
          {getFilesList()}
        </div>
      </div>
    </div>
  )
}
