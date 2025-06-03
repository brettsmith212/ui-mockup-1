import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { TaskHeader } from '@/components/task/TaskHeader'
import { TaskTabs, type TabType } from '@/components/task/TaskTabs'
import { ThreadView } from '@/components/task/ThreadView'
import { LogsView } from '@/components/task/LogsView'
import { CIView } from '@/components/task/CIView'
import { PromptBar } from '@/components/task/PromptBar'
import { useTaskDetail, useTaskActions } from '@/hooks/useTaskDetail'
import { useTaskThread, useSendMessage, useTaskActions as useThreadActions } from '@/hooks/useTaskThread'

export default function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>()
  const [activeTab, setActiveTab] = useState<TabType>('thread')
  
  const { data: task, isLoading, error } = useTaskDetail(taskId!)
  const { mergePR, deleteBranch } = useTaskActions(taskId!)
  const { data: messages = [], isLoading: isThreadLoading } = useTaskThread(taskId!)
  const sendMessage = useSendMessage(taskId!)
  const { continueTask, interruptTask, abortTask, retryTask } = useThreadActions(taskId!)

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
          <div className="card overflow-hidden" style={{ height: 'calc(100vh - 400px)' }}>
            <ThreadView
              taskId={taskId!}
              messages={messages}
              isLoading={isThreadLoading}
              onSendMessage={(message) => sendMessage.mutate(message)}
              isConnected={true}
            />
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="card overflow-hidden" style={{ height: 'calc(100vh - 400px)' }}>
            <LogsView taskId={taskId!} />
          </div>
        )}

        {activeTab === 'ci' && (
          <div className="card overflow-hidden" style={{ maxHeight: 'calc(100vh - 400px)' }}>
            <CIView taskId={taskId!} />
          </div>
        )}
      </div>

      {/* Sticky Prompt Bar */}
      <PromptBar
        task={task}
        onSendMessage={(prompt) => sendMessage.mutate(prompt)}
        onContinue={(prompt) => continueTask.mutate(prompt)}
        onInterrupt={(prompt) => interruptTask.mutate(prompt)}
        onAbort={(reason) => abortTask.mutate(reason)}
        onRetry={() => retryTask.mutate()}
        isLoading={sendMessage.isPending || continueTask.isPending || interruptTask.isPending || abortTask.isPending || retryTask.isPending}
      />
    </div>
  )
}
