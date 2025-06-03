import { User } from 'lucide-react'
import { useState } from 'react'

interface UserAvatarProps {
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

export default function UserAvatar({ user }: UserAvatarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Mock user data for now - will be replaced with real auth
  const currentUser = user || {
    name: 'John Doe',
    email: 'john.doe@example.com',
  }

  const initials = currentUser.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
        aria-expanded={isMenuOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="relative">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-xs font-medium text-white">
                {initials}
              </span>
            </div>
          )}
          
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-white dark:border-gray-900" />
        </div>

        {/* User info (hidden on mobile) */}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {currentUser.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {currentUser.email}
          </p>
        </div>
      </button>

      {/* Dropdown menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {currentUser.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {currentUser.email}
              </p>
            </div>
            
            <div className="py-1">
              <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <User className="h-4 w-4 mr-2" />
                Profile
              </button>
              
              <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                Settings
              </button>
              
              <hr className="my-1 border-gray-200 dark:border-gray-700" />
              
              <button className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
