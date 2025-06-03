import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import LoadingSpinner from './LoadingSpinner'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    icon,
    iconPosition = 'left',
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = 'btn relative overflow-hidden'
    
    const variants = {
      primary: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 text-white',
      secondary: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white',
      outline: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-primary-500 text-gray-700 dark:text-gray-300',
      ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-primary-500 text-gray-700 dark:text-gray-300',
      danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
      success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    const isDisabled = disabled || loading

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isDisabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="sm" />
          </div>
        )}
        
        <div className={cn(
          'flex items-center justify-center gap-2',
          loading && 'opacity-0'
        )}>
          {icon && iconPosition === 'left' && (
            <span className="shrink-0">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="shrink-0">{icon}</span>
          )}
        </div>
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
