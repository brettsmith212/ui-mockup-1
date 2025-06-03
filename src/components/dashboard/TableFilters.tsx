import { Filter, X, Users, GitBranch } from 'lucide-react'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { SearchInput, Button, StatusPill } from '@/components/ui'
import { useTaskFilters } from '@/hooks/useTaskFilters'
import { cn } from '@/lib/utils'

export default function TableFilters() {
  const {
    filters,
    hasActiveFilters,
    activeFilterCount,
    availableStatuses,
    setSearchFilter,
    toggleStatus,
    setOwnerFilter,
    setRepoFilter,
    isStatusSelected,
    applyQuickFilter,
    clearFilters,
  } = useTaskFilters()

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Search and Quick Filters */}
      <div className="flex flex-1 gap-3 items-center">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder="Search repos or prompts..."
            value={filters.search}
            onChange={(e) => setSearchFilter(e.target.value)}
            onClear={() => setSearchFilter('')}
          />
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyQuickFilter('active')}
            className={cn(
              filters.status?.some(s => ['running', 'retrying', 'queued'].includes(s)) && 
              'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
            )}
          >
            Active
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyQuickFilter('completed')}
            className={cn(
              filters.status?.includes('success') && 
              'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
            )}
          >
            Completed
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyQuickFilter('failed')}
            className={cn(
              filters.status?.some(s => ['error', 'aborted'].includes(s)) && 
              'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            )}
          >
            Failed
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2 items-center">
        {/* Status Filter Dropdown */}
        <Menu as="div" className="relative">
          <Menu.Button as={Fragment}>
            <Button
              variant="outline"
              size="sm"
              icon={<Filter className="h-4 w-4" />}
              className={cn(
                hasActiveFilters && 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              )}
            >
              Status
              {filters.status && filters.status.length > 0 && (
                <span className="ml-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full px-1.5 py-0.5 text-xs">
                  {filters.status.length}
                </span>
              )}
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
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 focus:outline-none">
              <div className="p-2">
                <div className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2">
                  Task Status
                </div>
                <div className="space-y-1">
                  {availableStatuses.map((status) => (
                    <Menu.Item key={status}>
                      <button
                        onClick={() => toggleStatus(status)}
                        className={cn(
                          'flex items-center w-full px-2 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                          isStatusSelected(status) && 'bg-primary-50 dark:bg-primary-900/30'
                        )}
                      >
                        <div className="flex items-center flex-1">
                          <StatusPill status={status} size="sm" />
                        </div>
                        {isStatusSelected(status) && (
                          <div className="w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </button>
                    </Menu.Item>
                  ))}
                </div>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        {/* Owner Filter Dropdown */}
        <Menu as="div" className="relative">
          <Menu.Button as={Fragment}>
            <Button
              variant="outline"
              size="sm"
              icon={<Users className="h-4 w-4" />}
              className={cn(
                filters.owner && 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              )}
            >
              Owner
              {filters.owner && (
                <span className="ml-1 max-w-20 truncate text-xs">
                  {filters.owner}
                </span>
              )}
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
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 focus:outline-none">
              <div className="p-2">
                <div className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2">
                  Task Owner
                </div>
                <div className="space-y-1">
                  {/* Mock owners - in real app, fetch from API */}
                  {['john.doe', 'jane.smith', 'bob.wilson', 'alice.johnson'].map((owner) => (
                    <Menu.Item key={owner}>
                      <button
                        onClick={() => setOwnerFilter(filters.owner === owner ? null : owner)}
                        className={cn(
                          'flex items-center w-full px-2 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left',
                          filters.owner === owner && 'bg-primary-50 dark:bg-primary-900/30'
                        )}
                      >
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-2">
                          <span className="text-xs font-medium text-white">
                            {owner.split('.')[0][0].toUpperCase()}
                          </span>
                        </div>
                        <span className="flex-1">{owner}</span>
                        {filters.owner === owner && (
                          <div className="w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </button>
                    </Menu.Item>
                  ))}
                </div>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        {/* Repo Filter Dropdown */}
        <Menu as="div" className="relative">
          <Menu.Button as={Fragment}>
            <Button
              variant="outline"
              size="sm"
              icon={<GitBranch className="h-4 w-4" />}
              className={cn(
                filters.repo && 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              )}
            >
              Repo
              {filters.repo && (
                <span className="ml-1 max-w-20 truncate text-xs">
                  {filters.repo.split('/').pop()}
                </span>
              )}
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
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 focus:outline-none">
              <div className="p-2">
                <div className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2">
                  Repository
                </div>
                <div className="space-y-1">
                  {/* Mock repos - in real app, fetch from API */}
                  {[
                    'frontend/auth-service',
                    'backend/api-gateway',
                    'mobile/react-native-app',
                    'shared/ui-components',
                    'infrastructure/k8s-configs'
                  ].map((repo) => (
                    <Menu.Item key={repo}>
                      <button
                        onClick={() => setRepoFilter(filters.repo === repo ? null : repo)}
                        className={cn(
                          'flex items-center w-full px-2 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left',
                          filters.repo === repo && 'bg-primary-50 dark:bg-primary-900/30'
                        )}
                      >
                        <GitBranch className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="flex-1 font-mono text-xs">{repo}</span>
                        {filters.repo === repo && (
                          <div className="w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </button>
                    </Menu.Item>
                  ))}
                </div>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            icon={<X className="h-3 w-3" />}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Clear
            <span className="ml-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full px-1.5 py-0.5 text-xs">
              {activeFilterCount}
            </span>
          </Button>
        )}
      </div>
    </div>
  )
}
