import { MessageSquare, Terminal, Zap } from 'lucide-react'

export type TabType = 'thread' | 'logs' | 'ci'

interface TaskTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function TaskTabs({ activeTab, onTabChange }: TaskTabsProps) {
  const tabs = [
    {
      id: 'thread' as const,
      label: 'Thread',
      icon: MessageSquare,
    },
    {
      id: 'logs' as const,
      label: 'Logs',
      icon: Terminal,
    },
    {
      id: 'ci' as const,
      label: 'CI',
      icon: Zap,
    },
  ]

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav className="flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 pb-3 border-b-2 transition-colors ${
                isActive
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
