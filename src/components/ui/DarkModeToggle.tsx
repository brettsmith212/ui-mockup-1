import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib'

export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <button
      onClick={toggleDarkMode}
      className="relative inline-flex h-9 w-16 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="sr-only">Toggle dark mode</span>
      
      {/* Toggle circle */}
      <span
        className={`absolute inline-block h-7 w-7 transform rounded-full bg-white dark:bg-gray-800 shadow-lg transition-transform duration-200 ease-in-out ${
          isDarkMode ? 'translate-x-3' : '-translate-x-3'
        }`}
      />
      
      {/* Sun icon */}
      <Sun
        className={`absolute left-2 h-4 w-4 text-amber-500 transition-opacity duration-200 ${
          isDarkMode ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {/* Moon icon */}
      <Moon
        className={`absolute right-2 h-4 w-4 text-blue-400 transition-opacity duration-200 ${
          isDarkMode ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </button>
  )
}
