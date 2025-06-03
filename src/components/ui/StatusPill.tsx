import { cn } from '@/lib/utils'

export type TaskStatus = 
  | 'queued' 
  | 'running' 
  | 'paused'
  | 'waiting_for_input'
  | 'retrying' 
  | 'needs_review' 
  | 'success' 
  | 'error' 
  | 'aborted'

interface StatusPillProps {
  status: TaskStatus
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function StatusPill({ status, className, size = 'md' }: StatusPillProps) {
  const baseStyles = 'status-pill inline-flex items-center font-medium'
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  }

  const statusStyles = {
    queued: 'bg-status-queued/20 text-status-queued',
    running: 'bg-status-running/20 text-status-running',
    paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    waiting_for_input: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    retrying: 'bg-status-retrying/20 text-status-retrying', 
    needs_review: 'bg-status-needs-review/20 text-status-needs-review',
    success: 'bg-status-success/20 text-status-success',
    error: 'bg-status-error/20 text-status-error',
    aborted: 'bg-status-aborted/20 text-status-aborted',
  }

  // Status indicators (optional dots)
  const statusDots = {
    queued: '⏸️',
    running: '🔄',
    paused: '⏯️',
    waiting_for_input: '⌨️',
    retrying: '⚡',
    needs_review: '👀',
    success: '✅',
    error: '❌',
    aborted: '⛔',
  }

  const displayText = {
    queued: 'Queued',
    running: 'Running',
    paused: 'Paused',
    waiting_for_input: 'Waiting for Input',
    retrying: 'Retrying',
    needs_review: 'Needs Review',
    success: 'Success', 
    error: 'Error',
    aborted: 'Aborted',
  }

  return (
    <span 
      className={cn(
        baseStyles,
        sizes[size],
        statusStyles[status],
        className
      )}
      data-status={status}
    >
      <span className="mr-1.5">{statusDots[status]}</span>
      {displayText[status]}
    </span>
  )
}

// Export status utilities
export const getStatusColor = (status: TaskStatus): string => {
  const colors = {
    queued: 'text-slate-400',
    running: 'text-sky-500',
    paused: 'text-yellow-500',
    waiting_for_input: 'text-blue-500',
    retrying: 'text-amber-500',
    needs_review: 'text-violet-500',
    success: 'text-green-500',
    error: 'text-red-500',
    aborted: 'text-red-500',
  }
  return colors[status]
}

export const getStatusBgColor = (status: TaskStatus): string => {
  const colors = {
    queued: 'bg-slate-400/20',
    running: 'bg-sky-500/20',
    paused: 'bg-yellow-500/20',
    waiting_for_input: 'bg-blue-500/20',
    retrying: 'bg-amber-500/20',
    needs_review: 'bg-violet-500/20',
    success: 'bg-green-500/20',
    error: 'bg-red-500/20',
    aborted: 'bg-red-500/20',
  }
  return colors[status]
}

export const isStatusActive = (status: TaskStatus): boolean => {
  return ['running', 'retrying'].includes(status)
}

export const isStatusComplete = (status: TaskStatus): boolean => {
  return ['success', 'error', 'aborted'].includes(status)
}

export const canRetryStatus = (status: TaskStatus): boolean => {
  return ['error', 'aborted'].includes(status)
}
