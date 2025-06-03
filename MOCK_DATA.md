# Mock Data Setup

This project includes comprehensive mock data for development and UI showcase purposes.

## Quick Setup

The mock data is **currently enabled** by default. The dashboard will show realistic sample tasks instead of making API calls.

## Mock Data Features

✅ **8 realistic tasks** with different statuses (running, success, error, etc.)  
✅ **Filtering and sorting** - all filters work with mock data  
✅ **Task details** - thread messages, logs, and CI status for key tasks  
✅ **Realistic timestamps** - shows elapsed time and relative dates  
✅ **Visual indicator** - "Demo Data" badge in the UI  

## How to Switch Between Mock and Real Data

### Enable Mock Data (Current State)
```typescript
// In src/api/tasks.ts
const USE_MOCK_DATA = true
```

### Disable Mock Data (Use Real API)
```typescript
// In src/api/tasks.ts  
const USE_MOCK_DATA = false
```

## Removing Mock Data for Production

When ready to deploy with real API:

1. **Set the flag to false**:
   ```typescript
   const USE_MOCK_DATA = false
   ```

2. **Remove mock data files** (optional):
   ```bash
   rm src/data/mockTasks.ts
   rm MOCK_DATA.md
   ```

3. **Remove mock imports** from `src/api/tasks.ts`:
   ```typescript
   // Remove these imports
   import { 
     filterMockTasks, 
     mockThreadMessages, 
     mockTaskLogs, 
     mockCIStatus 
   } from '@/data/mockTasks'
   ```

4. **Remove "Demo Data" badge** from `src/components/dashboard/TaskTable.tsx`:
   ```typescript
   // Remove this span element
   <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
     Demo Data
   </span>
   ```

## Mock Data Contents

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

## Benefits of Mock Data

🚀 **Instant Development** - No need to set up backend API  
🎨 **UI/UX Testing** - See how interface handles different states  
📊 **Demo Ready** - Perfect for showcasing features  
🧪 **Filter Testing** - All filters and sorting work immediately  
⚡ **Fast Iteration** - No network delays during development  

## API Simulation

The mock data includes:
- **Simulated network delays** (200-500ms) for realistic loading states
- **Filtering and search** - works exactly like real API
- **Sorting** - by date, status, owner, etc.
- **Pagination** - ready for large datasets
- **Error states** - can be toggled for testing

---

**Note**: Remember to disable mock data before production deployment!
