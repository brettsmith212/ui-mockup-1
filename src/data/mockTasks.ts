// Mock task data for development and UI showcase
// Easy to remove: just set USE_MOCK_DATA to false in api/tasks.ts

import type { Task, TaskListResponse, ThreadMessage, TaskLogs, CIStatus } from '@/types/task'

// Generate mock tasks with realistic data
export const mockTasks: Task[] = [
  {
    id: '1',
    repo: 'frontend/auth-service',
    branch: 'amp/refactor-auth',
    status: 'running',
    prompt: 'Refactor the authentication system to use NextAuth.js instead of custom JWT implementation. Update all login flows and ensure backwards compatibility.',
    attempts: 1,
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(), // 35 minutes ago
    owner: 'john.doe',
    prUrl: 'https://github.com/company/frontend/pull/234',
    prState: 'open',
    title: 'Refactor authentication system',
  },
  {
    id: '2',
    repo: 'backend/api-gateway',
    branch: 'amp/add-logging',
    status: 'success',
    prompt: 'Add structured logging throughout the API endpoints using Winston. Include request IDs, user context, and performance metrics.',
    attempts: 2,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    owner: 'jane.smith',
    prUrl: 'https://github.com/company/backend/pull/156',
    prState: 'merged',
    title: 'Add structured logging',
  },
  {
    id: '3',
    repo: 'mobile/react-native-app',
    branch: 'amp/fix-crash',
    status: 'needs_review',
    prompt: 'Fix the crash that occurs when users tap the profile button on iOS 15. The error seems to be related to the navigation stack.',
    attempts: 1,
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    createdAt: new Date(Date.now() - 6.5 * 60 * 60 * 1000).toISOString(), // 6.5 hours ago
    owner: 'bob.wilson',
    prUrl: 'https://github.com/company/mobile/pull/89',
    prState: 'open',
    title: 'Fix iOS profile crash',
  },
  {
    id: '4',
    repo: 'shared/ui-components',
    branch: 'amp/button-variants',
    status: 'error',
    prompt: 'Create new button variants for the design system: ghost, outline, and danger styles. Include proper TypeScript definitions and Storybook stories.',
    attempts: 3,
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(), // 15 hours ago
    owner: 'alice.johnson',
    prState: 'closed',
    title: 'Add button variants to design system',
  },
  {
    id: '5',
    repo: 'infrastructure/k8s-configs',
    branch: 'amp/update-nginx',
    status: 'retrying',
    prompt: 'Update nginx configuration to handle WebSocket connections properly. The current setup is dropping connections after 60 seconds.',
    attempts: 2,
    updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    owner: 'john.doe',
    title: 'Fix nginx WebSocket configuration',
  },
  {
    id: '6',
    repo: 'backend/user-service',
    branch: 'amp/password-reset',
    status: 'queued',
    prompt: 'Implement secure password reset flow with email verification and rate limiting. Follow OWASP guidelines for security.',
    attempts: 1,
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    owner: 'jane.smith',
    title: 'Implement password reset flow',
  },
  {
    id: '7',
    repo: 'backend/notification-service', 
    branch: 'amp/email-templates',
    status: 'paused',
    prompt: 'Create email templates for user notifications including welcome, password reset, and account verification emails.',
    attempts: 1,
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    owner: 'bob.wilson',
    title: 'Create email notification templates',
  },
  {
    id: '8',
    repo: 'mobile/react-native-app',
    branch: 'amp/push-notifications',
    status: 'waiting_for_input',
    prompt: 'Implement push notifications for iOS and Android. Need to integrate with Firebase Cloud Messaging.',
    attempts: 1,
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
    owner: 'alice.johnson',
    title: 'Add push notifications support',
  },
  {
    id: '9',
    repo: 'frontend/dashboard',
    branch: 'amp/charts-update',
    status: 'success',
    prompt: 'Update the analytics charts to use Chart.js v4. Migrate from the deprecated react-chartjs-2 components and improve performance.',
    attempts: 1,
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    createdAt: new Date(Date.now() - 1.1 * 24 * 60 * 60 * 1000).toISOString(), // 1.1 days ago
    owner: 'bob.wilson',
    prUrl: 'https://github.com/company/frontend/pull/189',
    prState: 'merged',
    title: 'Upgrade to Chart.js v4',
  },
  {
    id: '8',
    repo: 'backend/notification-service',
    branch: 'amp/email-templates',
    status: 'aborted',
    prompt: 'Create responsive email templates for user notifications. Include welcome emails, password resets, and billing notifications.',
    attempts: 1,
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(), // 9 hours ago
    owner: 'alice.johnson',
    title: 'Create email templates',
  },
]

// Mock task list response
export const mockTaskListResponse: TaskListResponse = {
  tasks: mockTasks,
  totalCount: mockTasks.length,
  page: 1,
  limit: 50,
  hasMore: false,
}

// Mock thread messages for a specific task
export const mockThreadMessages: Record<string, ThreadMessage[]> = {
  '1': [
    {
      id: 'msg-1',
      role: 'system',
      content: 'Task started: Refactor authentication system',
      ts: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-2',
      role: 'amp',
      content: 'I\'ll help you refactor the authentication system to use NextAuth.js. Let me start by analyzing the current implementation...\n\n```bash\nfind src/ -name "*.ts" -o -name "*.tsx" | grep -i auth\n```',
      ts: new Date(Date.now() - 34 * 60 * 1000).toISOString(),
      metadata: {
        type: 'code',
        files: ['src/auth/', 'src/components/Login.tsx']
      }
    },
    {
      id: 'msg-3',
      role: 'amp',
      content: 'Found the following authentication-related files:\n\n```\nsrc/auth/jwt.ts\nsrc/auth/middleware.ts\nsrc/components/Login.tsx\nsrc/components/AuthProvider.tsx\nsrc/utils/session.ts\n```\n\nNow installing NextAuth.js dependencies:\n\n```bash\nnpm install next-auth @auth/prisma-adapter\nnpm install --save-dev @types/bcryptjs\n```',
      ts: new Date(Date.now() - 33 * 60 * 1000).toISOString(),
      metadata: {
        type: 'code',
        exitCode: 0
      }
    },
    {
      id: 'msg-4',
      role: 'amp',
      content: 'Creating the NextAuth.js configuration file:\n\n```typescript\n// src/auth/config.ts\nimport { NextAuthConfig } from "next-auth"\nimport CredentialsProvider from "next-auth/providers/credentials"\nimport { PrismaAdapter } from "@auth/prisma-adapter"\nimport { db } from "@/lib/db"\nimport bcrypt from "bcryptjs"\n\nexport const authConfig: NextAuthConfig = {\n  adapter: PrismaAdapter(db),\n  providers: [\n    CredentialsProvider({\n      name: "credentials",\n      credentials: {\n        email: { label: "Email", type: "email" },\n        password: { label: "Password", type: "password" }\n      },\n      async authorize(credentials) {\n        if (!credentials?.email || !credentials?.password) {\n          return null\n        }\n\n        const user = await db.user.findUnique({\n          where: { email: credentials.email }\n        })\n\n        if (!user || !await bcrypt.compare(credentials.password, user.password)) {\n          return null\n        }\n\n        return {\n          id: user.id,\n          email: user.email,\n          name: user.name,\n        }\n      }\n    })\n  ],\n  callbacks: {\n    jwt: async ({ token, user }) => {\n      if (user) {\n        token.id = user.id\n      }\n      return token\n    },\n    session: async ({ session, token }) => {\n      if (token) {\n        session.user.id = token.id as string\n      }\n      return session\n    }\n  },\n  pages: {\n    signIn: "/auth/signin",\n    signUp: "/auth/signup",\n  }\n}\n```',
      ts: new Date(Date.now() - 31 * 60 * 1000).toISOString(),
      metadata: {
        type: 'file_change',
        files: ['src/auth/config.ts']
      }
    },
    {
      id: 'msg-5',
      role: 'user',
      content: 'Great! Make sure to maintain the existing user session format for backwards compatibility.',
      ts: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-6',
      role: 'amp',
      content: 'Absolutely! I\'m implementing a compatibility layer to ensure existing sessions continue to work. Currently working on:\n\n## Progress Status\n\n1. ✅ NextAuth.js configuration\n2. ✅ Prisma adapter setup\n3. 🔄 Custom JWT callback for session compatibility\n4. ⏳ Updating login components\n5. ⏳ Migration scripts for existing sessions\n6. ⏳ Testing with existing user sessions\n\n> **Note**: I\'m preserving the existing session structure by mapping NextAuth tokens to your current format.',
      ts: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
      metadata: {
        type: 'text'
      }
    },
    {
      id: 'msg-7',
      role: 'amp',
      content: 'Creating the compatibility layer:\n\n```typescript\n// src/auth/compatibility.ts\nimport { getServerSession } from "next-auth"\nimport { authConfig } from "./config"\n\n// Legacy session format compatibility\nexport interface LegacySession {\n  user: {\n    id: string\n    email: string\n    name: string\n    role: string\n    permissions: string[]\n  }\n  accessToken: string\n  refreshToken: string\n  expiresAt: number\n}\n\nexport async function getLegacySession(): Promise<LegacySession | null> {\n  const session = await getServerSession(authConfig)\n  \n  if (!session?.user) {\n    return null\n  }\n\n  // Map NextAuth session to legacy format\n  return {\n    user: {\n      id: session.user.id,\n      email: session.user.email!,\n      name: session.user.name!,\n      role: "user", // Default role\n      permissions: ["read", "write"] // Default permissions\n    },\n    accessToken: "legacy_token_" + session.user.id,\n    refreshToken: "legacy_refresh_" + session.user.id,\n    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours\n  }\n}\n```',
      ts: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      metadata: {
        type: 'file_change',
        files: ['src/auth/compatibility.ts']
      }
    },
    {
      id: 'msg-8',
      role: 'amp',
      content: 'Updated the Login component to use NextAuth:\n\n```tsx\n// src/components/Login.tsx\nimport { signIn, signOut, useSession } from "next-auth/react"\nimport { useState } from "react"\n\nexport default function Login() {\n  const { data: session, status } = useSession()\n  const [email, setEmail] = useState("")\n  const [password, setPassword] = useState("")\n  const [loading, setLoading] = useState(false)\n\n  const handleSubmit = async (e: React.FormEvent) => {\n    e.preventDefault()\n    setLoading(true)\n    \n    try {\n      const result = await signIn("credentials", {\n        email,\n        password,\n        redirect: false\n      })\n      \n      if (result?.error) {\n        console.error("Login failed:", result.error)\n      } else {\n        window.location.href = "/dashboard"\n      }\n    } catch (error) {\n      console.error("Login error:", error)\n    } finally {\n      setLoading(false)\n    }\n  }\n\n  if (status === "loading") return <div>Loading...</div>\n  \n  if (session) {\n    return (\n      <div>\n        <p>Welcome, {session.user?.name}!</p>\n        <button onClick={() => signOut()}>Sign out</button>\n      </div>\n    )\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input\n        type="email"\n        value={email}\n        onChange={(e) => setEmail(e.target.value)}\n        placeholder="Email"\n        required\n      />\n      <input\n        type="password"\n        value={password}\n        onChange={(e) => setPassword(e.target.value)}\n        placeholder="Password"\n        required\n      />\n      <button type="submit" disabled={loading}>\n        {loading ? "Signing in..." : "Sign in"}\n      </button>\n    </form>\n  )\n}\n```',
      ts: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      metadata: {
        type: 'file_change',
        files: ['src/components/Login.tsx']
      }
    },
    {
      id: 'msg-9',
      role: 'user',
      content: 'This looks great! Can you also add tests to ensure the migration doesn\'t break existing functionality?',
      ts: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-10',
      role: 'amp',
      content: 'Excellent idea! I\'ll create comprehensive tests for the authentication migration. Let me set up the test suite:\n\n```typescript\n// src/auth/__tests__/compatibility.test.ts\nimport { describe, it, expect, beforeEach, vi } from "vitest"\nimport { getLegacySession } from "../compatibility"\nimport { getServerSession } from "next-auth"\n\n// Mock NextAuth\nvi.mock("next-auth", () => ({\n  getServerSession: vi.fn()\n}))\n\nconst mockGetServerSession = vi.mocked(getServerSession)\n\ndescribe("Authentication Compatibility", () => {\n  beforeEach(() => {\n    vi.clearAllMocks()\n  })\n\n  it("should return null when no session exists", async () => {\n    mockGetServerSession.mockResolvedValue(null)\n    \n    const result = await getLegacySession()\n    \n    expect(result).toBeNull()\n  })\n\n  it("should map NextAuth session to legacy format", async () => {\n    const mockSession = {\n      user: {\n        id: "user-123",\n        email: "test@example.com",\n        name: "John Doe"\n      }\n    }\n    \n    mockGetServerSession.mockResolvedValue(mockSession)\n    \n    const result = await getLegacySession()\n    \n    expect(result).toEqual({\n      user: {\n        id: "user-123",\n        email: "test@example.com",\n        name: "John Doe",\n        role: "user",\n        permissions: ["read", "write"]\n      },\n      accessToken: "legacy_token_user-123",\n      refreshToken: "legacy_refresh_user-123",\n      expiresAt: expect.any(Number)\n    })\n  })\n\n  it("should preserve session expiration time", async () => {\n    const mockSession = {\n      user: { id: "user-123", email: "test@example.com", name: "John Doe" }\n    }\n    \n    mockGetServerSession.mockResolvedValue(mockSession)\n    \n    const before = Date.now()\n    const result = await getLegacySession()\n    const after = Date.now()\n    \n    expect(result?.expiresAt).toBeGreaterThan(before + (23 * 60 * 60 * 1000)) // At least 23 hours\n    expect(result?.expiresAt).toBeLessThan(after + (25 * 60 * 60 * 1000)) // Less than 25 hours\n  })\n})\n```',
      ts: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      metadata: {
        type: 'file_change',
        files: ['src/auth/__tests__/compatibility.test.ts']
      }
    },
    {
      id: 'msg-11',
      role: 'amp',
      content: 'Running the test suite to ensure everything works correctly:\n\n```bash\nnpm run test auth\n```',
      ts: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      metadata: {
        type: 'code',
        exitCode: 0
      }
    },
    {
      id: 'msg-12',
      role: 'amp',
      content: '🎉 **Migration Complete!** \n\nAll tests are passing and the authentication system has been successfully refactored to use NextAuth.js while maintaining full backwards compatibility.\n\n### Summary of Changes:\n\n| Component | Status | Details |\n|-----------|--------|----------|\n| NextAuth Config | ✅ Complete | Credentials provider with Prisma adapter |\n| Compatibility Layer | ✅ Complete | Legacy session format preserved |\n| Login Component | ✅ Complete | Updated to use NextAuth hooks |\n| Test Suite | ✅ Complete | 15 tests passing, 100% coverage |\n| Migration Scripts | ✅ Complete | Existing sessions remain valid |\n\n### Key Features:\n- 🔒 Enhanced security with NextAuth.js\n- 🔄 Zero downtime migration\n- 📊 100% test coverage\n- 🛡️ Backwards compatibility maintained\n- 📱 Session persistence across devices\n\nThe refactor is ready for code review and deployment!',
      ts: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
      metadata: {
        type: 'text'
      }
    },
  ],
  '2': [
    {
      id: 'msg-6',
      role: 'system',
      content: 'Task completed successfully: Add structured logging',
      ts: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-7',
      role: 'amp',
      content: 'Structured logging has been successfully implemented! ✅\n\n## Key improvements:\n\n- **Request ID tracking** across all endpoints\n- **User context** in all log entries  \n- **Performance metrics** with response times\n- **Error tracking** with stack traces\n- **Structured format** for better parsing\n\nAll tests are passing and the PR is ready for review.',
      ts: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ],
  '3': [
    {
      id: 'msg-12',
      role: 'system',
      content: 'Task started: Fix iOS profile crash',
      ts: new Date(Date.now() - 6.5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-13',
      role: 'amp',
      content: 'I\'ll investigate the iOS profile crash issue. Let me start by examining the crash logs and navigation stack:\n\n```bash\ngrep -r "profile" src/ --include="*.ts" --include="*.tsx"\n```',
      ts: new Date(Date.now() - 6.4 * 60 * 60 * 1000).toISOString(),
      metadata: {
        type: 'code'
      }
    },
    {
      id: 'msg-14',
      role: 'amp',
      content: 'Found the issue! The crash occurs in the ProfileScreen component when trying to access navigation props that are undefined on iOS 15. Here\'s the problematic code:\n\n```typescript\n// src/screens/ProfileScreen.tsx (BEFORE)\nexport function ProfileScreen({ navigation, route }) {\n  const handleEditProfile = () => {\n    // This crashes on iOS 15 when navigation is undefined\n    navigation.navigate(\'EditProfile\', { userId: route.params.userId })\n  }\n  \n  return (\n    <TouchableOpacity onPress={handleEditProfile}>\n      <Text>Edit Profile</Text>\n    </TouchableOpacity>\n  )\n}\n```\n\n**Root Cause**: iOS 15 has stricter navigation prop handling in React Navigation v6.',
      ts: new Date(Date.now() - 6.2 * 60 * 60 * 1000).toISOString(),
      metadata: {
        type: 'error',
        files: ['src/screens/ProfileScreen.tsx']
      }
    },
    {
      id: 'msg-15',
      role: 'user',
      content: 'That makes sense! Can you also check if there are other screens with similar navigation issues?',
      ts: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-16',
      role: 'amp',
      content: 'Good thinking! Let me scan for similar patterns across the codebase:\n\n```bash\ngrep -r "navigation\\." src/screens/ -A 2 -B 2\n```\n\nFound **3 additional screens** with similar issues:\n\n1. `SettingsScreen.tsx` - Line 45\n2. `NotificationsScreen.tsx` - Line 23  \n3. `HelpScreen.tsx` - Line 67\n\nI\'ll fix all of them with proper navigation guards and use the `useNavigation` hook instead of props.',
      ts: new Date(Date.now() - 5.8 * 60 * 60 * 1000).toISOString(),
      metadata: {
        type: 'code',
        exitCode: 0
      }
    },
    {
      id: 'msg-17',
      role: 'amp',
      content: 'Here\'s the fix for all affected screens using the proper React Navigation hooks:\n\n```typescript\n// src/screens/ProfileScreen.tsx (AFTER)\nimport { useNavigation, useRoute } from \'@react-navigation/native\'\nimport type { StackNavigationProp } from \'@react-navigation/stack\'\n\ntype ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, \'Profile\'>\n\nexport function ProfileScreen() {\n  const navigation = useNavigation<ProfileScreenNavigationProp>()\n  const route = useRoute<RouteProp<RootStackParamList, \'Profile\'>>()\n  \n  const handleEditProfile = useCallback(() => {\n    if (navigation && route.params?.userId) {\n      navigation.navigate(\'EditProfile\', { \n        userId: route.params.userId \n      })\n    }\n  }, [navigation, route.params?.userId])\n  \n  return (\n    <TouchableOpacity onPress={handleEditProfile}>\n      <Text>Edit Profile</Text>\n    </TouchableOpacity>\n  )\n}\n```\n\n**Key improvements:**\n- ✅ Uses `useNavigation` hook instead of props\n- ✅ Added TypeScript types for navigation\n- ✅ Added safety checks before navigation\n- ✅ Used `useCallback` for performance',
      ts: new Date(Date.now() - 5.5 * 60 * 60 * 1000).toISOString(),
      metadata: {
        type: 'file_change',
        files: ['src/screens/ProfileScreen.tsx', 'src/screens/SettingsScreen.tsx', 'src/screens/NotificationsScreen.tsx', 'src/screens/HelpScreen.tsx']
      }
    },
    {
      id: 'msg-18',
      role: 'system',
      content: 'Code review requested: iOS navigation fixes',
      ts: new Date(Date.now() - 5.2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-19',
      role: 'user',
      content: 'The fix looks great! Can you add some unit tests to prevent regression?',
      ts: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-20',
      role: 'amp',
      content: 'Absolutely! I\'ll create comprehensive tests for the navigation fixes:\n\n```typescript\n// src/screens/__tests__/ProfileScreen.test.tsx\nimport React from \'react\'\nimport { render, fireEvent } from \'@testing-library/react-native\'\nimport { useNavigation, useRoute } from \'@react-navigation/native\'\nimport ProfileScreen from \'../ProfileScreen\'\n\n// Mock React Navigation\njest.mock(\'@react-navigation/native\', () => ({\n  useNavigation: jest.fn(),\n  useRoute: jest.fn(),\n}))\n\nconst mockNavigation = {\n  navigate: jest.fn(),\n}\n\nconst mockRoute = {\n  params: { userId: \'user-123\' },\n}\n\ndescribe(\'ProfileScreen\', () => {\n  beforeEach(() => {\n    jest.clearAllMocks()\n    ;(useNavigation as jest.Mock).mockReturnValue(mockNavigation)\n    ;(useRoute as jest.Mock).mockReturnValue(mockRoute)\n  })\n\n  it(\'should render without crashing\', () => {\n    const { getByText } = render(<ProfileScreen />)\n    expect(getByText(\'Edit Profile\')).toBeTruthy()\n  })\n\n  it(\'should navigate to EditProfile when button is pressed\', () => {\n    const { getByText } = render(<ProfileScreen />)\n    \n    fireEvent.press(getByText(\'Edit Profile\'))\n    \n    expect(mockNavigation.navigate).toHaveBeenCalledWith(\'EditProfile\', {\n      userId: \'user-123\'\n    })\n  })\n\n  it(\'should handle missing navigation gracefully\', () => {\n    ;(useNavigation as jest.Mock).mockReturnValue(null)\n    \n    const { getByText } = render(<ProfileScreen />)\n    \n    expect(() => {\n      fireEvent.press(getByText(\'Edit Profile\'))\n    }).not.toThrow()\n  })\n\n  it(\'should handle missing userId parameter\', () => {\n    ;(useRoute as jest.Mock).mockReturnValue({ params: {} })\n    \n    const { getByText } = render(<ProfileScreen />)\n    \n    fireEvent.press(getByText(\'Edit Profile\'))\n    \n    expect(mockNavigation.navigate).not.toHaveBeenCalled()\n  })\n})\n```\n\n**Tests cover:**\n- ✅ Basic rendering\n- ✅ Successful navigation\n- ✅ Null navigation handling\n- ✅ Missing parameters\n- ✅ iOS 15 edge cases',
      ts: new Date(Date.now() - 4.5 * 60 * 60 * 1000).toISOString(),
      metadata: {
        type: 'file_change',
        files: ['src/screens/__tests__/ProfileScreen.test.tsx']
      }
    },
  ],
  '4': [
    {
      id: 'msg-21',
      role: 'system',
      content: 'Task started: Database optimization',
      ts: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-22',
      role: 'amp',
      content: 'I\'ll optimize the database queries and add proper indexing. Let me start by analyzing the current performance bottlenecks:\n\n```sql\nEXPLAIN ANALYZE SELECT * FROM users \nJOIN posts ON users.id = posts.user_id \nWHERE users.created_at > \'2023-01-01\' \nORDER BY posts.created_at DESC \nLIMIT 50;\n```',
      ts: new Date(Date.now() - 23.8 * 60 * 60 * 1000).toISOString(),
      metadata: {
        type: 'code'
      }
    },
    {
      id: 'msg-23',
      role: 'amp',
      content: '⚠️ **Performance Issue Found!**\n\nCurrent query is doing a full table scan on 2.3M records:\n\n```\nSeq Scan on users  (cost=0.00..45432.00 rows=234567 width=64)\n  Filter: (created_at > \'2023-01-01\'::date)\n  Rows Removed by Filter: 1967433\nSort  (cost=15623.45..16210.87 rows=234567 width=96)\n  Sort Key: posts.created_at DESC\n  Sort Method: external sort  Disk: 18456kB\n```\n\n**Execution time: 2.4 seconds** 😱\n\nI\'ll add the missing indexes to fix this.',
      ts: new Date(Date.now() - 23.5 * 60 * 60 * 1000).toISOString(),
      metadata: {
        type: 'error'
      }
    },
    {
      id: 'msg-24',
      role: 'user',
      content: 'Yikes! That\'s way too slow. What indexes do you recommend?',
      ts: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-25',
      role: 'amp',
      content: 'Based on the query analysis, I recommend these indexes:\n\n```sql\n-- 1. Composite index for users.created_at filtering\nCREATE INDEX CONCURRENTLY idx_users_created_at \nON users (created_at) \nWHERE created_at > \'2020-01-01\';\n\n-- 2. Index for posts sorting and joining\nCREATE INDEX CONCURRENTLY idx_posts_user_created \nON posts (user_id, created_at DESC);\n\n-- 3. Covering index for frequent user lookups\nCREATE INDEX CONCURRENTLY idx_users_covering \nON users (id, email, name, created_at) \nWHERE active = true;\n```\n\n> **Note**: Using `CONCURRENTLY` to avoid blocking production traffic during index creation.',
      ts: new Date(Date.now() - 22.8 * 60 * 60 * 1000).toISOString(),
      metadata: {
        type: 'file_change',
        files: ['migrations/20231201_add_performance_indexes.sql']
      }
    },
    {
      id: 'msg-26',
      role: 'amp',
      content: 'After adding the indexes, let\'s verify the performance improvement:\n\n```sql\nEXPLAIN ANALYZE SELECT * FROM users \nJOIN posts ON users.id = posts.user_id \nWHERE users.created_at > \'2023-01-01\' \nORDER BY posts.created_at DESC \nLIMIT 50;\n```',
      ts: new Date(Date.now() - 22.5 * 60 * 60 * 1000).toISOString(),
      metadata: {
        type: 'code',
        exitCode: 0
      }
    },
    {
      id: 'msg-27',
      role: 'amp',
      content: '🚀 **Massive Performance Improvement!**\n\n```\nIndex Scan using idx_users_created_at  (cost=0.43..1234.56 rows=5000 width=64)\n  Index Cond: (created_at > \'2023-01-01\'::date)\nNested Loop  (cost=0.86..2345.67 rows=5000 width=96)\n  ->  Index Scan using idx_posts_user_created on posts\n```\n\n**New execution time: 0.045 seconds** ⚡\n\n### Performance Summary:\n\n| Metric | Before | After | Improvement |\n|--------|--------|-------|-------------|\n| Execution Time | 2.4s | 0.045s | **53x faster** |\n| Disk Usage | 18MB | 0MB | **No disk sorts** |\n| Rows Scanned | 2.3M | 5K | **460x fewer** |\n| CPU Usage | 98% | 12% | **8x less** |\n\nQuery optimization complete! 🎉',
      ts: new Date(Date.now() - 22.2 * 60 * 60 * 1000).toISOString(),
      metadata: {
        type: 'text'
      }
    },
  ],
  '7': [
    {
      id: 'msg-7-1',
      role: 'system',
      content: 'Task started: Create email notification templates',
      ts: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-7-2',
      role: 'amp',
      content: 'I\'ll help you create email templates for user notifications. Let me start by analyzing your current notification service structure...\n\n```bash\nfind backend/notification-service -name "*.ts" -o -name "*.html" | head -10\n```',
      ts: new Date(Date.now() - 29 * 60 * 1000).toISOString(),
      metadata: {
        type: 'code'
      }
    },
    {
      id: 'msg-7-3',
      role: 'amp',
      content: 'Found your notification service structure:\n\n```\nbackend/notification-service/\n├── src/\n│   ├── services/EmailService.ts\n│   ├── models/NotificationType.ts\n│   └── controllers/NotificationController.ts\n├── templates/ (empty)\n└── config/email.config.ts\n```\n\nI notice the templates directory exists but is empty. Before I create the email templates, I need to understand a few things about your brand and requirements:\n\n1. **Brand Colors & Logo**: What are your primary brand colors and do you have a logo URL I should include?\n2. **Email Footer**: What should be included in the footer (company address, unsubscribe links, social media)?\n3. **Template Engine**: Are you using a specific template engine (Handlebars, Mustache, etc.) or plain HTML?\n4. **Responsive Design**: Do you need mobile-responsive templates?\n\nCould you provide these details so I can create templates that match your brand guidelines?',
      ts: new Date(Date.now() - 27 * 60 * 1000).toISOString(),
      metadata: {
        type: 'text'
      }
    },
    {
      id: 'msg-7-4',
      role: 'system',
      content: 'Task paused - waiting for user input',
      ts: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
  ],
  '8': [
    {
      id: 'msg-8-1',
      role: 'system',
      content: 'Task started: Implement push notifications for iOS and Android',
      ts: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-8-2',
      role: 'amp',
      content: 'I\'ll help you implement push notifications using Firebase Cloud Messaging (FCM) for both iOS and Android. Let me start by examining your React Native project structure...\n\n```bash\nfind mobile/react-native-app -name "*.js" -o -name "*.ts" -o -name "*.json" | grep -E "(package|android|ios)" | head -10\n```',
      ts: new Date(Date.now() - 19 * 60 * 1000).toISOString(),
      metadata: {
        type: 'code'
      }
    },
    {
      id: 'msg-8-3',
      role: 'amp',
      content: 'Great! I can see you\'re using React Native with the standard structure:\n\n```\nmobile/react-native-app/\n├── package.json\n├── android/\n│   ├── app/build.gradle\n│   └── app/src/main/AndroidManifest.xml\n├── ios/\n│   ├── PushNotificationApp.xcodeproj\n│   └── PushNotificationApp/Info.plist\n└── src/\n```\n\nNow I\'ll install the required dependencies:\n\n```bash\nnpm install @react-native-firebase/app @react-native-firebase/messaging\nnpm install react-native-push-notification\n```',
      ts: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
      metadata: {
        type: 'code',
        exitCode: 0
      }
    },
    {
      id: 'msg-8-4',
      role: 'amp',
      content: 'Dependencies installed successfully! Now I need to configure Firebase for your project. \n\n**⚠️ Important Setup Required:**\n\nTo continue with the Firebase configuration, I need access to your Firebase project credentials:\n\n1. **Firebase Project**: Do you have an existing Firebase project, or should I guide you through creating one?\n2. **google-services.json**: For Android - this file goes in `android/app/`\n3. **GoogleService-Info.plist**: For iOS - this file goes in `ios/PushNotificationApp/`\n4. **Bundle ID/Package Name**: What are your app\'s bundle identifier and package name?\n\nWithout these Firebase configuration files, I can\'t complete the setup. Could you either:\n- Provide the Firebase config files, or\n- Let me know if you\'d like me to create a step-by-step guide for setting up a new Firebase project?\n\n**Next Steps After Config:**\n- Configure Android native code\n- Configure iOS native code  \n- Implement React Native push notification handling\n- Add notification permissions\n- Test on both platforms',
      ts: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      metadata: {
        type: 'text'
      }
    },
    {
      id: 'msg-8-5',
      role: 'system',
      content: 'Task waiting for input - Firebase configuration required',
      ts: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
  ],
}

// Mock logs for tasks
export const mockTaskLogs: Record<string, TaskLogs> = {
  '1': {
    taskId: '1',
    totalLines: 245,
    hasMore: false,
    logs: [
      {
        id: 'log-1',
        timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'Starting task: Refactor authentication system',
        source: 'orchestrator',
      },
      {
        id: 'log-2',
        timestamp: new Date(Date.now() - 34 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'Cloning repository frontend/auth-service',
        source: 'git',
      },
      {
        id: 'log-3',
        timestamp: new Date(Date.now() - 33 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'Creating branch amp/refactor-auth',
        source: 'git',
      },
      {
        id: 'log-4',
        timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'Installing dependencies: next-auth @next-auth/prisma-adapter',
        source: 'npm',
      },
      {
        id: 'log-5',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        level: 'debug',
        message: 'Analyzing existing authentication files',
        source: 'amp',
      },
      {
        id: 'log-6',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'Creating NextAuth.js configuration file',
        source: 'amp',
      },
      {
        id: 'log-7',
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        level: 'warn',
        message: 'Found deprecated JWT methods, implementing compatibility layer',
        source: 'amp',
      },
      {
        id: 'log-8',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'Running TypeScript compilation check',
        source: 'tsc',
      },
      {
        id: 'log-9',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'All tests passing (23/23)',
        source: 'jest',
      },
      {
        id: 'log-10',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'Preparing pull request...',
        source: 'git',
      },
    ],
  },
  '2': {
    taskId: '2',
    totalLines: 156,
    hasMore: false,
    logs: [
      {
        id: 'log-2-1',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'Starting task: Add structured logging',
        source: 'orchestrator',
      },
      {
        id: 'log-2-2',
        timestamp: new Date(Date.now() - 170 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'Installing winston and related packages',
        source: 'npm',
      },
      {
        id: 'log-2-3',
        timestamp: new Date(Date.now() - 160 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'Configuring Winston logger with multiple transports',
        source: 'amp',
      },
      {
        id: 'log-2-4',
        timestamp: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'Logger configuration complete',
        source: 'amp',
      },
      {
        id: 'log-2-5',
        timestamp: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'Adding logging middleware to Express routes',
        source: 'amp',
      },
      {
        id: 'log-2-6',
        timestamp: new Date(Date.now() - 130 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'All API endpoints now have structured logging',
        source: 'amp',
      },
      {
        id: 'log-2-7',
        timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'Testing log output and format',
        source: 'test',
      },
      {
        id: 'log-2-8',
        timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'Task completed successfully',
        source: 'orchestrator',
      },
    ],
  },
  '3': {
    taskId: '3',
    totalLines: 89,
    hasMore: false,
    logs: [
      {
        id: 'log-3-1',
        timestamp: new Date(Date.now() - 6.5 * 60 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'Starting task: Fix iOS profile crash',
        source: 'orchestrator',
      },
      {
        id: 'log-3-2',
        timestamp: new Date(Date.now() - 6.4 * 60 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'Setting up React Native development environment',
        source: 'setup',
      },
      {
        id: 'log-3-3',
        timestamp: new Date(Date.now() - 6.3 * 60 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'Analyzing crash logs from iOS 15 devices',
        source: 'amp',
      },
      {
        id: 'log-3-4',
        timestamp: new Date(Date.now() - 6.2 * 60 * 60 * 1000).toISOString(),
        level: 'error',
        message: 'Found navigation stack overflow in ProfileScreen.tsx:45',
        source: 'amp',
      },
      {
        id: 'log-3-5',
        timestamp: new Date(Date.now() - 6.1 * 60 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'Implementing fix for navigation issue',
        source: 'amp',
      },
      {
        id: 'log-3-6',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'Fix applied and tested on iOS 15 simulator',
        source: 'amp',
      },
    ],
  },
}

// Mock CI status
export const mockCIStatus: Record<string, CIStatus> = {
  '1': {
    taskId: '1',
    runId: 'run-12345',
    status: 'running',
    url: 'https://github.com/company/frontend/actions/runs/12345',
    startedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    jobs: [
      {
        id: 'job-1',
        name: 'Build and Test',
        status: 'success',
        url: 'https://github.com/company/frontend/actions/runs/12345/jobs/1',
        startedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        steps: [
          { name: 'Checkout', status: 'success', conclusion: 'success', number: 1 },
          { name: 'Setup Node', status: 'success', conclusion: 'success', number: 2 },
          { name: 'Install dependencies', status: 'success', conclusion: 'success', number: 3 },
          { name: 'Run tests', status: 'success', conclusion: 'success', number: 4 },
          { name: 'Build', status: 'success', conclusion: 'success', number: 5 },
        ],
      },
      {
        id: 'job-2',
        name: 'TypeScript Check',
        status: 'running',
        url: 'https://github.com/company/frontend/actions/runs/12345/jobs/2',
        startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        steps: [
          { name: 'Checkout', status: 'success', conclusion: 'success', number: 1 },
          { name: 'Setup Node', status: 'success', conclusion: 'success', number: 2 },
          { name: 'TypeScript Check', status: 'running', number: 3 },
        ],
      },
    ],
    checks: [
      {
        id: 'check-1',
        name: 'Continuous Integration',
        status: 'running',
        url: 'https://github.com/company/frontend/actions/runs/12345',
        required: true,
      },
      {
        id: 'check-2',
        name: 'Security Scan',
        status: 'success',
        conclusion: 'success',
        url: 'https://github.com/company/frontend/security',
        required: true,
      },
      {
        id: 'check-3',
        name: 'Code Coverage',
        status: 'pending',
        url: 'https://codecov.io/gh/company/frontend',
        required: false,
      },
    ],
  },
  '2': {
    taskId: '2',
    runId: 'run-12340',
    status: 'success',
    conclusion: 'success',
    url: 'https://github.com/company/backend/actions/runs/12340',
    startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
    jobs: [
      {
        id: 'job-3',
        name: 'Build and Test',
        status: 'success',
        url: 'https://github.com/company/backend/actions/runs/12340/jobs/1',
        startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
        duration: '4m 32s',
        conclusion: 'success',
        steps: [
          { name: 'Checkout', status: 'success', conclusion: 'success', number: 1, duration: '12s' },
          { name: 'Setup Node', status: 'success', conclusion: 'success', number: 2, duration: '45s' },
          { name: 'Install dependencies', status: 'success', conclusion: 'success', number: 3, duration: '1m 23s' },
          { name: 'Run tests', status: 'success', conclusion: 'success', number: 4, duration: '2m 12s' },
        ],
      },
    ],
    checks: [
      {
        id: 'check-4',
        name: 'Continuous Integration',
        status: 'success',
        conclusion: 'success',
        required: true,
        url: 'https://github.com/company/backend/actions/runs/12340',
        description: 'All tests passed successfully',
      },
    ],
  },
  '3': {
    taskId: '3',
    runId: 'run-12341',
    status: 'pending',
    url: 'https://github.com/company/mobile/actions/runs/12341',
    startedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    jobs: [
      {
        id: 'job-4',
        name: 'iOS Build and Test',
        status: 'success',
        url: 'https://github.com/company/mobile/actions/runs/12341/jobs/1',
        startedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 5.5 * 60 * 60 * 1000).toISOString(),
        duration: '8m 45s',
        conclusion: 'success',
        steps: [
          { name: 'Checkout', status: 'success', conclusion: 'success', number: 1, duration: '8s' },
          { name: 'Setup Xcode', status: 'success', conclusion: 'success', number: 2, duration: '2m 15s' },
          { name: 'Install dependencies', status: 'success', conclusion: 'success', number: 3, duration: '1m 45s' },
          { name: 'Run iOS tests', status: 'success', conclusion: 'success', number: 4, duration: '4m 37s' },
        ],
      },
      {
        id: 'job-5',
        name: 'Android Build and Test',
        status: 'pending',
        url: 'https://github.com/company/mobile/actions/runs/12341/jobs/2',
        startedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        steps: [
          { name: 'Waiting for runner', status: 'pending', number: 1 },
        ],
      },
    ],
    checks: [
      {
        id: 'check-5',
        name: 'iOS Tests',
        status: 'success',
        conclusion: 'success',
        required: true,
        url: 'https://github.com/company/mobile/actions/runs/12341',
        description: 'iOS build and tests completed successfully',
      },
      {
        id: 'check-6',
        name: 'Android Tests',
        status: 'pending',
        required: true,
        url: 'https://github.com/company/mobile/actions/runs/12341',
        description: 'Waiting for Android build to start',
      },
    ],
  },
}

// Helper function to filter mock tasks (simulates API filtering)
export const filterMockTasks = (params?: any): TaskListResponse => {
  let filteredTasks = [...mockTasks]

  // Apply status filter
  if (params?.status && params.status.length > 0) {
    filteredTasks = filteredTasks.filter(task => params.status.includes(task.status))
  }

  // Apply owner filter
  if (params?.owner && params.owner.length > 0) {
    filteredTasks = filteredTasks.filter(task => params.owner.includes(task.owner))
  }

  // Apply repo filter
  if (params?.repo) {
    filteredTasks = filteredTasks.filter(task => 
      task.repo.toLowerCase().includes(params.repo.toLowerCase())
    )
  }

  // Apply search filter
  if (params?.search) {
    const search = params.search.toLowerCase()
    filteredTasks = filteredTasks.filter(task => 
      task.repo.toLowerCase().includes(search) ||
      task.prompt.toLowerCase().includes(search) ||
      (task.title && task.title.toLowerCase().includes(search))
    )
  }

  // Apply sorting
  if (params?.sortBy) {
    filteredTasks.sort((a, b) => {
      let aVal: any = a[params.sortBy as keyof Task]
      let bVal: any = b[params.sortBy as keyof Task]
      
      if (params.sortBy === 'updatedAt' || params.sortBy === 'createdAt') {
        aVal = new Date(aVal as string).getTime()
        bVal = new Date(bVal as string).getTime()
      }
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1
      
      if (aVal < bVal) return params.sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return params.sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }

  // Apply pagination
  const page = params?.page || 1
  const limit = params?.limit || 50
  const start = (page - 1) * limit
  const paginatedTasks = filteredTasks.slice(start, start + limit)

  return {
    tasks: paginatedTasks,
    totalCount: filteredTasks.length,
    page,
    limit,
    hasMore: start + limit < filteredTasks.length,
  }
}
