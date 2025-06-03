import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// UI state interface
interface UIState {
  // Theme state
  isDarkMode: boolean
  toggleDarkMode: () => void
  setDarkMode: (isDark: boolean) => void
  
  // Sidebar state
  isSidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (isOpen: boolean) => void
  
  // Modal state
  activeModal: string | null
  openModal: (modalId: string) => void
  closeModal: () => void
  
  // Dashboard filters
  taskFilters: {
    status: string[]
    owner: string | null
    repo: string | null
    search: string
  }
  setTaskFilters: (filters: Partial<UIState['taskFilters']>) => void
  resetTaskFilters: () => void
  
  // Task detail state
  activeTaskTab: 'thread' | 'logs' | 'ci'
  setActiveTaskTab: (tab: UIState['activeTaskTab']) => void
  
  // Table state
  tableSettings: {
    pageSize: number
    sortBy: string | null
    sortDirection: 'asc' | 'desc'
  }
  setTableSettings: (settings: Partial<UIState['tableSettings']>) => void
  
  // Loading states
  loadingStates: Record<string, boolean>
  setLoading: (key: string, isLoading: boolean) => void
  
  // Toast notifications
  toasts: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    duration?: number
  }>
  addToast: (toast: Omit<UIState['toasts'][0], 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

// Default values
const defaultTaskFilters = {
  status: [],
  owner: null,
  repo: null,
  search: '',
}

const defaultTableSettings = {
  pageSize: 50,
  sortBy: 'updatedAt',
  sortDirection: 'desc' as const,
}

// Create the store
export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        // Theme state
        isDarkMode: true,
        toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
        setDarkMode: (isDark) => set({ isDarkMode: isDark }),
        
        // Sidebar state
        isSidebarOpen: false,
        toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
        setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
        
        // Modal state
        activeModal: null,
        openModal: (modalId) => set({ activeModal: modalId }),
        closeModal: () => set({ activeModal: null }),
        
        // Dashboard filters
        taskFilters: defaultTaskFilters,
        setTaskFilters: (filters) => set((state) => ({
          taskFilters: { ...state.taskFilters, ...filters }
        })),
        resetTaskFilters: () => set({ taskFilters: defaultTaskFilters }),
        
        // Task detail state
        activeTaskTab: 'thread',
        setActiveTaskTab: (tab) => set({ activeTaskTab: tab }),
        
        // Table state
        tableSettings: defaultTableSettings,
        setTableSettings: (settings) => set((state) => ({
          tableSettings: { ...state.tableSettings, ...settings }
        })),
        
        // Loading states
        loadingStates: {},
        setLoading: (key, isLoading) => set((state) => ({
          loadingStates: { ...state.loadingStates, [key]: isLoading }
        })),
        
        // Toast notifications
        toasts: [],
        addToast: (toast) => {
          const id = Math.random().toString(36).substr(2, 9)
          const newToast = { ...toast, id }
          set((state) => ({ toasts: [...state.toasts, newToast] }))
          
          // Auto-remove toast after duration
          const duration = toast.duration ?? 5000
          if (duration > 0) {
            setTimeout(() => {
              get().removeToast(id)
            }, duration)
          }
        },
        removeToast: (id) => set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id)
        })),
        clearToasts: () => set({ toasts: [] }),
      }),
      {
        name: 'amp-ui-store',
        // Only persist certain keys
        partialize: (state) => ({
          isDarkMode: state.isDarkMode,
          taskFilters: state.taskFilters,
          activeTaskTab: state.activeTaskTab,
          tableSettings: state.tableSettings,
        }),
      }
    ),
    {
      name: 'amp-ui-store',
    }
  )
)

// Selector hooks for common use cases
export const useTheme = () => useUIStore((state) => ({
  isDarkMode: state.isDarkMode,
  toggleDarkMode: state.toggleDarkMode,
  setDarkMode: state.setDarkMode,
}))

export const useModals = () => useUIStore((state) => ({
  activeModal: state.activeModal,
  openModal: state.openModal,
  closeModal: state.closeModal,
}))

export const useTaskFilters = () => useUIStore((state) => ({
  filters: state.taskFilters,
  setTaskFilters: state.setTaskFilters,
  resetTaskFilters: state.resetTaskFilters,
}))

export const useToasts = () => useUIStore((state) => ({
  toasts: state.toasts,
  addToast: state.addToast,
  removeToast: state.removeToast,
  clearToasts: state.clearToasts,
}))
