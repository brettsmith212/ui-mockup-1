import { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { useTheme } from '@/lib'
import Header from './Header'

interface AppLayoutProps {
  children?: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isDarkMode } = useTheme()

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
        {/* Header */}
        <Header />
        
        {/* Main content */}
        <main className="flex-1">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}
