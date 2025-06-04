/**
 * Authentication guard component (temporarily bypassed for development)
 * This component will be fully implemented when authentication is enabled
 */

import { ReactNode } from 'react';
import { useAuth } from '../../stores/auth-store';
import { isDevelopment } from '../../config/environment';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  requirePermissions?: string[];
}

export function AuthGuard({ 
  children, 
  fallback,
  requirePermissions = [] 
}: AuthGuardProps) {
  const { isAuthenticated, user, isAuthBypassEnabled } = useAuth();

  // Always allow access in development or when auth is bypassed
  if (isDevelopment() || isAuthBypassEnabled) {
    return <>{children}</>;
  }

  // Check authentication
  if (!isAuthenticated || !user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default fallback - redirect to login
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              Authentication Required
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Please log in to access this page
            </p>
          </div>
          <div className="mt-8">
            <button
              onClick={() => {
                // TODO: Implement login redirect
                console.log('Redirect to login');
              }}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check permissions if required
  if (requirePermissions.length > 0) {
    const hasPermissions = requirePermissions.every(permission => 
      user.permissions.includes(permission) || 
      user.permissions.includes('admin:all')
    );

    if (!hasPermissions) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                Access Denied
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                You don't have permission to access this page
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                Required: {requirePermissions.join(', ')}
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  // All checks passed, render children
  return <>{children}</>;
}

// Higher-order component for protecting routes
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  requirePermissions?: string[]
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard requirePermissions={requirePermissions}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}

// Hook for checking permissions
export function usePermissions() {
  const { user, isAuthenticated, isAuthBypassEnabled } = useAuth();

  const hasPermission = (permission: string): boolean => {
    // Always allow in development or when auth is bypassed
    if (isDevelopment() || isAuthBypassEnabled) {
      return true;
    }

    if (!isAuthenticated || !user) {
      return false;
    }

    return user.permissions.includes(permission) || 
           user.permissions.includes('admin:all');
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin: hasPermission('admin:all'),
    canRead: hasPermission('tasks:read'),
    canWrite: hasPermission('tasks:write'),
    canDelete: hasPermission('tasks:delete'),
  };
}

export default AuthGuard;
