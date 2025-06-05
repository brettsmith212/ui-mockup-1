# Mock Data for Amp Task Management UI

This document describes the mock data used during development of the Amp Task Management UI and the transition to real API integration.

## Current Status: API Integration Complete ✅

As of Step 3, the UI has been **successfully integrated with the real Amp Orchestrator API**. The mock data system remains as a fallback for development scenarios where the backend is unavailable.

## API Mode Configuration

The API mode is controlled by environment variables:

```bash
# Use real Amp Orchestrator API (default)
VITE_USE_MOCK_DATA=false

# Use mock data for development/testing
VITE_USE_MOCK_DATA=true
```

**Default behavior:**
- ✅ **Production**: Always uses real API
- ✅ **Development**: Uses real API by default
- 🔄 **Fallback**: Mock data available when backend unavailable

## Real API Integration

### Completed Features
- ✅ **Task CRUD Operations**: Create, read, update, delete tasks
- ✅ **Task Actions**: Continue, interrupt, abort, retry
- ✅ **Thread Management**: Conversation messages and history
- ✅ **Log Streaming**: Execution logs and output
- ✅ **CI Status**: Build and pipeline information
- ✅ **Git Operations**: Merge, branch deletion, PR creation
- ✅ **Authentication**: JWT-based auth (currently bypassed for development)
- ✅ **Error Handling**: Comprehensive error handling with logging
- ✅ **Retry Logic**: Automatic retry with exponential backoff
- ✅ **Cache Management**: Optimized TanStack Query integration

### API Endpoints Connected
All endpoints from the [API Contract](./docs/API_CONTRACT.md) are implemented:

- `GET /api/tasks` - Task list with filtering and pagination
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task details
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/continue` - Continue task with new prompt
- `POST /api/tasks/:id/interrupt` - Interrupt and restart task
- `POST /api/tasks/:id/abort` - Abort task
- `POST /api/tasks/:id/retry` - Retry failed task
- `GET /api/tasks/:id/thread` - Get conversation thread
- `GET /api/tasks/:id/logs` - Get execution logs
- `GET /api/tasks/:id/ci` - Get CI status
- `POST /api/tasks/:id/merge` - Merge PR
- `POST /api/tasks/:id/delete-branch` - Delete branch
- `POST /api/tasks/:id/create-pr` - Create PR

## Mock Data (Fallback System)

Mock data is still available as a fallback when `VITE_USE_MOCK_DATA=true`.

### Data Sources
All mock data is located in `src/data/mockTasks.ts` and includes:
- **Tasks**: Sample task list with various statuses
- **Thread Messages**: Conversation threads between users and Amp
- **Execution Logs**: Sample terminal output and execution logs
- **CI Status**: Mock GitHub Actions and CI/CD pipeline information

### Task Statuses
The mock data includes tasks with the following statuses:
- `queued`: Tasks waiting to start
- `running`: Tasks currently being executed
- `paused`: Tasks temporarily paused
- `waiting_for_input`: Tasks waiting for user response
- `retrying`: Tasks retrying after failure
- `needs_review`: Tasks completed but requiring review
- `success`: Successfully completed tasks
- `aborted`: Manually cancelled tasks
- `error`: Tasks that failed with errors

## Development Workflow

### Using Real API (Recommended)
1. Start your Amp Orchestrator server
2. Set environment variable: `VITE_API_BASE_URL=http://localhost:8080`
3. Run the UI: `npm run dev`
4. The UI will connect to your real backend

### Using Mock Data (Testing/Development)
1. Set environment variable: `VITE_USE_MOCK_DATA=true`
2. Run the UI: `npm run dev`
3. The UI will use simulated data

### Environment Configuration
Create a `.env.local` file:

```bash
# Real API configuration
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_BASE_URL=ws://localhost:8080
VITE_USE_MOCK_DATA=false

# Development options
VITE_LOG_LEVEL=debug
VITE_ENABLE_DEV_TOOLS=true
```

## API Integration Details

### Request/Response Transformation
- ✅ **Request Mapping**: UI data structures → API format
- ✅ **Response Transformation**: API responses → UI data structures
- ✅ **Error Mapping**: API errors → User-friendly messages
- ✅ **Date Handling**: ISO strings and proper timezone handling

### Caching Strategy
- ✅ **Smart Invalidation**: Cache updates on mutations
- ✅ **Background Refetching**: Keep data fresh
- ✅ **Optimistic Updates**: Immediate UI feedback
- ✅ **Error Recovery**: Rollback on failure

### Development Features
- ✅ **Detailed Logging**: All API calls logged in development
- ✅ **Error Visualization**: Clear error messages and debugging
- ✅ **Request Inspection**: Network request details in console
- ✅ **Performance Monitoring**: Query timing and cache hit rates

## Real-Time Features (Next Step)

The following real-time features will be implemented in Step 6-7:
- 🔄 **WebSocket Integration**: Live task status updates
- 🔄 **Log Streaming**: Real-time execution logs
- 🔄 **Thread Updates**: Live conversation messages
- 🔄 **Progress Tracking**: Real-time task progress

## Troubleshooting

### Backend Connection Issues
If the UI can't connect to your Amp Orchestrator:

1. **Check Backend Status**: Ensure your Amp Orchestrator is running
2. **Verify URL**: Check `VITE_API_BASE_URL` points to correct address
3. **CORS Issues**: Ensure backend allows requests from `http://localhost:5173`
4. **Fallback to Mock**: Set `VITE_USE_MOCK_DATA=true` for development

### Common Issues
- **404 Errors**: Backend endpoint not implemented
- **CORS Errors**: Backend CORS configuration needed
- **Auth Errors**: Currently bypassed, will be implemented in Step 13
- **Network Errors**: Check backend connectivity and firewall

### Debug Information
In development mode, check the browser console for:
- 📡 API mode indicator (MOCK DATA vs REAL API)
- 🔍 API request logs with parameters
- ✅ Successful responses with data
- ❌ Error details with troubleshooting info

## Migration Complete ✨

The UI is now fully integrated with the Amp Orchestrator API and ready for real backend testing. Mock data remains available as a development convenience when needed.

## Legacy Mock Data Contents

### Tasks (`src/data/mockTasks.ts`)
- **8 sample tasks** across different repositories
- **All task statuses** represented (queued, running, success, error, etc.)
- **Realistic branch names** like `amp/refactor-auth`
- **Detailed prompts** showing real-world use cases
- **PR states and URLs** for GitHub integration preview

### Thread Messages
- **Conversation history** between user and Amp
- **Code blocks** with syntax highlighting
- **System messages** for task lifecycle events
- **Realistic timestamps** and message flow

### Logs
- **Structured log entries** with different levels (info, warn, error, debug)
- **Multiple sources** (orchestrator, git, npm, jest, etc.)
- **Realistic progression** of task execution

### CI Status
- **GitHub Actions** integration preview
- **Job status and steps** for build pipelines
- **Check status** for required and optional checks
- **Realistic timing** and status progression
