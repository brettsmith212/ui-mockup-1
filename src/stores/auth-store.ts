/**
 * Authentication store (temporarily disabled for development)
 * This will be fully implemented when authentication is enabled
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isDevelopment } from '../config/environment';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  permissions: string[];
}

interface AuthState {
  // Auth state
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  
  // Temporary bypass for development
  isAuthBypassEnabled: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  
  // Development helpers
  enableAuthBypass: () => void;
  disableAuthBypass: () => void;
  setMockUser: () => void;
}

// Mock user for development
const mockUser: User = {
  id: 'dev-user-1',
  name: 'Development User',
  email: 'dev@amp-orchestrator.com',
  avatar: undefined,
  role: 'admin',
  permissions: ['tasks:read', 'tasks:write', 'tasks:delete', 'admin:all'],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state - bypassed for development
      isAuthenticated: isDevelopment(),
      user: isDevelopment() ? mockUser : null,
      token: null,
      isAuthBypassEnabled: isDevelopment(),

      // Authentication actions (placeholders)
      login: async (email: string, password: string) => {
        if (get().isAuthBypassEnabled) {
          console.log('🔓 Auth bypassed - auto-login with mock user');
          set({
            isAuthenticated: true,
            user: mockUser,
            token: 'mock-jwt-token',
          });
          return;
        }

        // TODO: Implement real authentication
        throw new Error('Authentication not yet implemented');
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        });
        
        if (isDevelopment()) {
          console.log('🔓 Logged out (auth still bypassed for development)');
        }
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        set({ token });
      },

      // Development helpers
      enableAuthBypass: () => {
        set({
          isAuthBypassEnabled: true,
          isAuthenticated: true,
          user: mockUser,
        });
        console.log('🔓 Authentication bypass enabled');
      },

      disableAuthBypass: () => {
        set({
          isAuthBypassEnabled: false,
          isAuthenticated: false,
          user: null,
          token: null,
        });
        console.log('🔐 Authentication bypass disabled');
      },

      setMockUser: () => {
        set({
          isAuthenticated: true,
          user: mockUser,
          token: 'mock-jwt-token',
        });
        console.log('👤 Mock user set for development');
      },
    }),
    {
      name: 'amp-auth-store',
      // Only persist in production
      storage: isDevelopment() ? undefined : localStorage,
    }
  )
);

// Export helper hooks
export const useAuth = () => {
  const store = useAuthStore();
  return {
    isAuthenticated: store.isAuthenticated,
    user: store.user,
    token: store.token,
    login: store.login,
    logout: store.logout,
    isAuthBypassEnabled: store.isAuthBypassEnabled,
  };
};

export const useAuthActions = () => {
  const store = useAuthStore();
  return {
    login: store.login,
    logout: store.logout,
    enableAuthBypass: store.enableAuthBypass,
    disableAuthBypass: store.disableAuthBypass,
    setMockUser: store.setMockUser,
  };
};

// Development helper to check auth status
export const getAuthStatus = () => {
  const state = useAuthStore.getState();
  return {
    isAuthenticated: state.isAuthenticated,
    isAuthBypassEnabled: state.isAuthBypassEnabled,
    hasUser: !!state.user,
    userRole: state.user?.role,
  };
};

// Initialize auth bypass in development
if (isDevelopment()) {
  console.log('🚀 Development mode: Authentication bypass enabled');
  console.log('📝 Auth status:', getAuthStatus());
}
