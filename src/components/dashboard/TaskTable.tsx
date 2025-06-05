import { useMemo, useState } from 'react'
import { ChevronUp, ChevronDown, MoreHorizontal, Eye, Edit, Trash2, CheckSquare, Wifi, WifiOff } from 'lucide-react'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useTasks } from '@/hooks/useTasks'
import { useTaskFilters } from '@/hooks/useTaskFilters'
import { useRealtimeTaskUpdates } from '@/hooks/useRealtimeTaskUpdates'
import { Button, PulseSkeleton } from '@/components/ui'
import TaskRow, { TaskRowSkeleton } from './TaskRow'
import { cn } from '@/lib/utils'

type SortField = 'status' | 'repo' | 'branch' | 'prompt' | 'owner' | 'attempts' | 'prState' | 'updatedAt'

interface TableColumn {
  key: SortField
  label: string
  sortable: boolean
  className?: string
}

const columns: TableColumn[] = [
  { key: 'status', label: 'Status', sortable: true },
  { key: 'repo', label: 'Repository', sortable: true },
  { key: 'branch', label: 'Branch', sortable: true },
  { key: 'prompt' as SortField, label: 'Prompt', sortable: false },
  { key: 'owner', label: 'Owner', sortable: true },
  { key: 'attempts', label: 'Attempts', sortable: true, className: 'text-center' },
  { key: 'prState' as SortField, label: 'PR State', sortable: false },
  { key: 'updatedAt', label: 'Last Update', sortable: true },
]

export default function TaskTable() {
  const { apiParams } = useTaskFilters()
  const { data: taskList, isLoading, error, refetch } = useTasks(apiParams)
  
  // Real-time updates
  const { isConnected, isReconnecting } = useRealtimeTaskUpdates({
    onTaskStatusChange: (taskId, status) => {
      console.log(`Task ${taskId} status changed to ${status}`)
    }
  })
  
  const [sortField, setSortField] = useState<SortField>('updatedAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [isBulkSelectMode, setIsBulkSelectMode] = useState(false)

  // Sort tasks locally (in a real app, this would be done server-side)
  const sortedTasks = useMemo(() => {
    if (!taskList?.tasks) return []
    
    return [...taskList.tasks].sort((a, b) => {
      let aValue: any
      let bValue: any
      
      // Map sort field to actual task property
      switch (sortField) {
        case 'prompt':
          aValue = a.prompt
          bValue = b.prompt
          break
        case 'prState':
          aValue = a.prState || ''
          bValue = b.prState || ''
          break
        case 'updatedAt':
          aValue = new Date(a.updatedAt).getTime()
          bValue = new Date(b.updatedAt).getTime()
          break
        default:
          aValue = a[sortField]
          bValue = b[sortField]
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [taskList?.tasks, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(taskId)) {
        newSet.delete(taskId)
      } else {
        newSet.add(taskId)
      }
      return newSet
    })
  }

  const toggleAllTasks = () => {
    if (selectedTasks.size === sortedTasks.length) {
      setSelectedTasks(new Set())
    } else {
      setSelectedTasks(new Set(sortedTasks.map(task => task.id)))
    }
  }

  const enableBulkSelectMode = () => {
    setIsBulkSelectMode(true)
  }

  const exitBulkSelectMode = () => {
    setIsBulkSelectMode(false)
    setSelectedTasks(new Set())
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <div className="text-red-600 dark:text-red-400 mb-4">
          Failed to load tasks
        </div>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Tasks
              </h3>
              {/* Connection status indicator */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  Demo Data
                </span>
                <div className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium gap-1",
                  isConnected 
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                    : isReconnecting
                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                )}>
                  {isConnected ? (
                    <>
                      <Wifi className="h-3 w-3" />
                      Live
                    </>
                  ) : isReconnecting ? (
                    <>
                      <WifiOff className="h-3 w-3" />
                      Reconnecting
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3" />
                      Offline
                    </>
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isLoading ? (
                <PulseSkeleton className="w-32 h-4" />
              ) : (
                `${taskList?.totalCount || 0} tasks total`
              )}
            </p>
          </div>
          
          {!isBulkSelectMode ? (
            <Button 
              variant="outline" 
              size="sm" 
              icon={<CheckSquare className="h-4 w-4" />}
              onClick={enableBulkSelectMode}
            >
              Select Multiple
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedTasks.size} selected
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={exitBulkSelectMode}
              >
                Cancel
              </Button>
              {selectedTasks.size > 0 && (
                <Menu as="div" className="relative">
                  <Menu.Button as={Fragment}>
                    <Button variant="outline" size="sm" icon={<MoreHorizontal className="h-4 w-4" />}>
                      Actions
                    </Button>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700">
                      <div className="p-1">
                        <Menu.Item>
                          <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            <Edit className="h-4 w-4 mr-2" />
                            Bulk Edit
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Selected
                          </button>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              {/* Select All Checkbox - only show in bulk select mode */}
              {isBulkSelectMode && (
                <th className="px-6 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={selectedTasks.size === sortedTasks.length && sortedTasks.length > 0}
                    onChange={toggleAllTasks}
                    className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                  />
                </th>
              )}
              
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                    column.sortable && 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300',
                    column.className
                  )}
                  onClick={column.sortable ? () => handleSort(column.key) : undefined}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={cn(
                            'h-3 w-3 -mb-1',
                            sortField === column.key && sortDirection === 'asc' 
                              ? 'text-primary-600' 
                              : 'text-gray-400'
                          )} 
                        />
                        <ChevronDown 
                          className={cn(
                            'h-3 w-3',
                            sortField === column.key && sortDirection === 'desc' 
                              ? 'text-primary-600' 
                              : 'text-gray-400'
                          )} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              
              {/* Actions Column */}
              <th className="px-6 py-3 w-12">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <Fragment key={index}>
                  <TaskRowSkeleton showCheckbox={isBulkSelectMode} />
                </Fragment>
              ))
            ) : sortedTasks.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={columns.length + (isBulkSelectMode ? 2 : 1)} className="px-6 py-12 text-center">
                  <div className="text-gray-500 dark:text-gray-400">
                    <p className="text-lg font-medium mb-2">No tasks found</p>
                    <p className="text-sm">Try adjusting your filters or create a new task.</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Task rows
              sortedTasks.map((task) => (
                <Fragment key={task.id}>
                  <TaskRow 
                    task={task} 
                    isSelected={selectedTasks.has(task.id)}
                    onSelect={isBulkSelectMode ? () => toggleTaskSelection(task.id) : undefined}
                    checkbox={isBulkSelectMode ? (
                      <input
                        type="checkbox"
                        checked={selectedTasks.has(task.id)}
                        onChange={() => toggleTaskSelection(task.id)}
                        className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                      />
                    ) : undefined}
                    actions={
                      <Menu as="div" className="relative">
                        <Menu.Button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-1 w-32 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700">
                            <div className="p-1">
                              <Menu.Item>
                                <Link
                                  to={`/tasks/${task.id}`}
                                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Link>
                              </Menu.Item>
                              <Menu.Item>
                                <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </button>
                              </Menu.Item>
                              <Menu.Item>
                                <button className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </button>
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    }
                  />
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {taskList && taskList.totalCount > taskList.limit && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {taskList.tasks.length} of {taskList.totalCount} tasks
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled={taskList.page === 1}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={!taskList.hasMore}>
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
