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
      content: 'I found the current authentication files. Now I\'ll install NextAuth.js and begin the migration:\n\n```bash\nnpm install next-auth\nnpm install @next-auth/prisma-adapter\n```\n\nCreating the NextAuth.js configuration...',
      ts: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
      metadata: {
        type: 'code',
        exitCode: 0
      }
    },
    {
      id: 'msg-4',
      role: 'user',
      content: 'Great! Make sure to maintain the existing user session format for backwards compatibility.',
      ts: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-5',
      role: 'amp',
      content: 'Absolutely! I\'m implementing a compatibility layer to ensure existing sessions continue to work. Currently working on:\n\n1. ✅ NextAuth.js configuration\n2. 🔄 Custom JWT callback for session compatibility\n3. ⏳ Updating login components\n4. ⏳ Testing with existing user sessions',
      ts: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
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
      content: 'Structured logging has been successfully implemented! ✅\n\nKey improvements:\n- Request ID tracking across all endpoints\n- User context in all log entries\n- Performance metrics with response times\n- Error tracking with stack traces\n\nAll tests are passing and the PR is ready for review.',
      ts: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
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
}

// Mock CI status
export const mockCIStatus: Record<string, CIStatus> = {
  '1': {
    taskId: '1',
    runId: 'run-12345',
    status: 'running',
    url: 'https://github.com/company/frontend/actions/runs/12345',
    startedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
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
    jobs: [
      {
        id: 'job-3',
        name: 'Build and Test',
        status: 'success',
        url: 'https://github.com/company/backend/actions/runs/12340/jobs/1',
        startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
      },
    ],
    checks: [
      {
        id: 'check-4',
        name: 'Continuous Integration',
        status: 'success',
        conclusion: 'success',
        required: true,
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
      let aVal = a[params.sortBy as keyof Task]
      let bVal = b[params.sortBy as keyof Task]
      
      if (params.sortBy === 'updatedAt' || params.sortBy === 'createdAt') {
        aVal = new Date(aVal as string).getTime()
        bVal = new Date(bVal as string).getTime()
      }
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = (bVal as string).toLowerCase()
      }
      
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
