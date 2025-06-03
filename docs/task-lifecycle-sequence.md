# Amp Orchestrator Task Lifecycle

This sequence diagram shows how a typical task flows through the system from creation to completion, including the CI feedback loop that is central to Amp's value proposition.

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant UI as 🌐 React UI
    participant API as 🔌 API Layer
    participant BUS as ⚡ Event Bus
    participant STORE as 📊 Task Store
    participant WORKER as 🐳 Worker Manager
    participant DOCKER as 🐋 Docker Engine
    participant GITHUB as 🐙 GitHub API
    participant REPO as 📁 Git Repository

    %% Task Creation Flow
    Note over U,REPO: Task Creation & Setup
    U->>UI: Create new task
    UI->>API: POST /tasks {prompt, repo}
    API->>BUS: TaskCreated event
    BUS->>STORE: Persist task (status: queued)
    API-->>UI: Task created response
    UI-->>U: Task confirmation

    %% Task Execution Flow
    Note over U,REPO: Task Execution Phase
    BUS->>WORKER: Dispatch task
    WORKER->>GITHUB: Get repo access token
    GITHUB-->>WORKER: JWT token
    WORKER->>DOCKER: Create container + mount repo
    DOCKER->>REPO: Git clone repository
    DOCKER-->>WORKER: Container ready
    
    %% Real-time Updates
    Note over U,REPO: Real-time Status Updates
    WORKER->>BUS: TaskStarted event
    BUS->>STORE: Update status (running)
    BUS->>UI: WebSocket: task status update
    UI-->>U: Show "Running" status

    %% Task Execution
    Note over U,REPO: Code Generation & Execution
    DOCKER->>DOCKER: Execute Amp CLI commands
    DOCKER->>BUS: Stream logs & progress
    BUS->>UI: WebSocket: real-time logs
    UI-->>U: Show live output
    DOCKER->>REPO: Git commit & push changes
    REPO->>GITHUB: Trigger CI/CD pipeline

    %% CI Feedback Loop (Typical Case)
    Note over U,REPO: CI Feedback Loop - Iteration 1
    GITHUB->>GITHUB: Run tests, build, lint
    GITHUB-->>WORKER: CI failed + error details
    WORKER->>DOCKER: Send CI feedback to Amp
    DOCKER->>DOCKER: Amp analyzes & fixes CI errors
    DOCKER->>REPO: Commit fixes & push
    REPO->>GITHUB: Trigger CI retry

    Note over U,REPO: CI Feedback Loop - Iteration 2  
    GITHUB->>GITHUB: Run tests again
    GITHUB-->>WORKER: CI still failing
    WORKER->>DOCKER: Send new error feedback
    DOCKER->>DOCKER: Amp makes additional fixes
    DOCKER->>REPO: Commit more fixes & push
    REPO->>GITHUB: Trigger final CI run

    %% Completion Flow
    Note over U,REPO: Task Completion & PR Creation
    GITHUB->>GITHUB: All CI checks pass ✅
    GITHUB-->>WORKER: CI success notification
    WORKER->>GITHUB: Create pull request
    GITHUB-->>WORKER: PR created
    WORKER->>BUS: TaskCompleted event
    BUS->>STORE: Update status (success)
    BUS->>UI: WebSocket: final status
    UI-->>U: Show success + PR link
```

## Flow Breakdown

### 1. Task Creation (User → System)
- User submits a new coding task through the React UI
- API validates request and creates task record
- Event bus notifies all components of new task
- Task is queued for execution

### 2. Task Execution Setup
- Worker manager receives task dispatch
- Authenticates with GitHub for repository access
- Spins up isolated Docker container
- Clones target repository into container

### 3. Real-time Communication
- WebSocket connection provides live updates to UI
- User sees immediate status changes
- Log streaming shows progress in real-time

### 4. Code Generation
- Amp CLI executes within Docker container
- Generates code changes based on user prompt
- Streams output and progress back to orchestrator
- Commits and pushes changes to trigger CI

### 5. CI Feedback Loop (Key Differentiator)
- CI pipeline runs automatically on pushed changes
- **If CI fails**: Orchestrator sends structured error feedback to Amp
- Amp analyzes CI errors and makes targeted fixes
- Process repeats until all CI checks pass
- **Container stays alive** throughout the entire feedback cycle

### 6. Completion & Integration
- Only after **all CI checks pass** does task complete
- Pull request is created with production-ready code
- Final status update sent to user with PR link

## Key Innovation: CI Feedback Loop

The sequence above shows **the typical Amp Orchestrator task lifecycle**, which includes automatic CI failure detection and fixing. This is what differentiates Amp from traditional CI systems:

- **Traditional CI**: Code → CI fails → Manual developer intervention required
- **Amp Orchestrator**: Code → CI fails → **Automatic analysis & fixes** → Retry until success

> 📋 **For detailed implementation of the CI feedback loop**, see [CI Feedback Loop Architecture](./ci-feedback-loop.md)
