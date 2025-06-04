import { useEffect, useRef, useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { Button, Textarea } from '@/components/ui'
import { useRealtimeTaskUpdatesByTaskId } from '@/hooks/useRealtimeTaskUpdates'
import type { ThreadMessage } from '@/types/task'

interface ThreadViewProps {
  taskId: string
  messages: ThreadMessage[]
  isLoading?: boolean
  onSendMessage?: (message: string) => void
  isConnected?: boolean
}

export function ThreadView({ 
  taskId,
  messages, 
  isLoading = false, 
  onSendMessage,
  isConnected = true 
}: ThreadViewProps) {
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Real-time message updates
  const { isConnected: wsConnected } = useRealtimeTaskUpdatesByTaskId(taskId, {
    onNewMessage: (receivedTaskId, message) => {
      // New messages are automatically handled by TanStack Query cache updates
      console.log(`New message for task ${receivedTaskId}:`, message)
    }
  })

  // Use WebSocket connection status if available, otherwise fall back to prop
  const connectionStatus = wsConnected ?? isConnected

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleSend = async () => {
    if (!newMessage.trim() || isSending || !onSendMessage) return

    setIsSending(true)
    try {
      await onSendMessage(newMessage.trim())
      setNewMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  const getConnectionStatus = () => {
    if (!connectionStatus) {
      return (
        <div className="flex items-center justify-center p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-4">
          <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Connecting to real-time updates...</span>
          </div>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading conversation...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {getConnectionStatus()}
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Send className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                No messages yet
              </h3>
              <p className="text-sm">
                Send a message to start the conversation with Amp
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 p-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <div className="flex space-x-3">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                connectionStatus 
                  ? "Type a message to continue the task... (⌘/Ctrl + Enter to send)"
                  : "Connecting..."
              }
              disabled={!connectionStatus || isSending}
              resize={false}
              rows={3}
              className="resize-none"
            />
          </div>
          <Button 
            onClick={handleSend}
            disabled={!newMessage.trim() || !connectionStatus || isSending}
            className="self-end"
            icon={isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          >
            {isSending ? 'Sending...' : 'Send'}
          </Button>
        </div>
        
        {newMessage.trim() && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Press ⌘/Ctrl + Enter to send
          </div>
        )}
      </div>
    </div>
  )
}
