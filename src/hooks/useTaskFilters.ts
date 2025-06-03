// Filter state management hook for task dashboard

import { useMemo } from 'react'
import { useTaskFilters as useUITaskFilters } from '@/lib'
import type { TaskStatus, TaskListParams } from '@/types/task'

export interface TaskFilterState {
  status: TaskStatus[]
  owner: string[]
  repo: string
  search: string
  tags: string[]
  dateRange?: {
    start: string
    end: string
  }
}

export interface TaskSortState {
  sortBy: 'createdAt' | 'updatedAt' | 'status' | 'owner' | 'repo' | 'attempts'
  sortDirection: 'asc' | 'desc'
}

export interface TaskPaginationState {
  page: number
  limit: number
}

export const useTaskFilters = () => {
  const { filters, setTaskFilters, resetTaskFilters } = useUITaskFilters()

  // Convert UI store filters to API params
  const apiParams = useMemo((): TaskListParams => {
    const params: TaskListParams = {
      page: 1,
      limit: 50,
      sortBy: 'updatedAt',
      sortDirection: 'desc',
    }

    // Add status filter
    if (filters.status && filters.status.length > 0) {
      params.status = filters.status as TaskStatus[]
    }

    // Add owner filter
    if (filters.owner) {
      params.owner = [filters.owner]
    }

    // Add repo filter
    if (filters.repo) {
      params.repo = filters.repo
    }

    // Add search
    if (filters.search) {
      params.search = filters.search
    }

    return params
  }, [filters])

  // Helper functions for specific filter operations
  const setStatusFilter = (status: TaskStatus[]) => {
    setTaskFilters({ status })
  }

  const toggleStatus = (status: TaskStatus) => {
    const current = filters.status || []
    const updated = current.includes(status)
      ? current.filter(s => s !== status)
      : [...current, status]
    setTaskFilters({ status: updated })
  }

  const setOwnerFilter = (owner: string | null) => {
    setTaskFilters({ owner })
  }

  const setRepoFilter = (repo: string | null) => {
    setTaskFilters({ repo })
  }

  const setSearchFilter = (search: string) => {
    setTaskFilters({ search })
  }

  const clearFilters = () => {
    resetTaskFilters()
  }

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Boolean(
      (filters.status && filters.status.length > 0) ||
      filters.owner ||
      filters.repo ||
      filters.search
    )
  }, [filters])

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.status && filters.status.length > 0) count++
    if (filters.owner) count++
    if (filters.repo) count++
    if (filters.search) count++
    return count
  }, [filters])

  // Status filter helpers
  const availableStatuses: TaskStatus[] = [
    'queued',
    'running', 
    'retrying',
    'needs_review',
    'success',
    'error',
    'aborted'
  ]

  const isStatusSelected = (status: TaskStatus) => {
    return filters.status?.includes(status) || false
  }

  // Quick filter presets
  const applyQuickFilter = (preset: 'active' | 'completed' | 'failed' | 'all') => {
    switch (preset) {
      case 'active':
        setStatusFilter(['running', 'retrying', 'queued'])
        break
      case 'completed':
        setStatusFilter(['success'])
        break
      case 'failed':
        setStatusFilter(['error', 'aborted'])
        break
      case 'all':
        setStatusFilter([])
        break
    }
  }

  return {
    // Current filter state
    filters,
    apiParams,
    hasActiveFilters,
    activeFilterCount,
    availableStatuses,

    // Filter setters
    setStatusFilter,
    toggleStatus,
    setOwnerFilter,
    setRepoFilter,
    setSearchFilter,
    clearFilters,

    // Status helpers
    isStatusSelected,

    // Quick filters
    applyQuickFilter,

    // Raw filter functions from UI store
    setTaskFilters,
    resetTaskFilters,
  }
}

// Hook for managing table sorting and pagination
export const useTableState = () => {
  // For now, we'll manage this locally. In a real app, you might want to persist this in URL params
  const [sortState, setSortState] = React.useState<TaskSortState>({
    sortBy: 'updatedAt',
    sortDirection: 'desc',
  })

  const [paginationState, setPaginationState] = React.useState<TaskPaginationState>({
    page: 1,
    limit: 50,
  })

  const updateSort = (sortBy: TaskSortState['sortBy']) => {
    setSortState(prev => ({
      sortBy,
      sortDirection: prev.sortBy === sortBy && prev.sortDirection === 'desc' ? 'asc' : 'desc',
    }))
  }

  const updatePagination = (updates: Partial<TaskPaginationState>) => {
    setPaginationState(prev => ({ ...prev, ...updates }))
  }

  const resetPagination = () => {
    setPaginationState({ page: 1, limit: 50 })
  }

  return {
    sortState,
    paginationState,
    updateSort,
    updatePagination,
    resetPagination,
  }
}

// Import React for useState
import React from 'react'
