import { Link, useLocation } from 'react-router-dom'
import DarkModeToggle from '../ui/DarkModeToggle'
import UserAvatar from '../ui/UserAvatar'

export default function Header() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                Amp Orchestrator
              </span>
            </Link>
            
            {/* Navigation breadcrumb */}
            <nav className="hidden md:flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
              <Link 
                to="/"
                className={`px-3 py-1 rounded-md transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Tasks
              </Link>
              {location.pathname.startsWith('/tasks/') && (
                <>
                  <span>/</span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md">
                    Task Detail
                  </span>
                </>
              )}
            </nav>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            <UserAvatar />
          </div>
        </div>
      </div>
    </header>
  )
}
