# Amp Orchestrator Architecture Overview

This diagram shows the main components and their relationships in the Amp Orchestrator system.

```mermaid
graph TB
    %% Frontend
    UI[🌐 React UI<br/>Vite SPA<br/>Task Management]
    
    %% Orchestrator Core
    subgraph ORCH [🎯 Amp Orchestrator - Go Service]
        direction TB
        API[🔌 API Layer<br/>Gin/Chi Router<br/>REST Endpoints]
        BUS[⚡ Event Bus<br/>Go Channels<br/>Real-time Events]
        STORE[(📊 Task Store<br/>SQLite + GORM<br/>Persistent State)]
        WORKER[🐳 Worker Manager<br/>Container Lifecycle<br/>Task Execution]
    end
    
    %% External Services
    DOCKER[🐋 Docker Engine<br/>Container Runtime<br/>Isolated Execution]
    GITHUB[🐙 GitHub App<br/>JWT Authentication<br/>Repository Access]
    CI[⚙️ GitHub Actions<br/>CI/CD Pipeline<br/>Build Status]
    REPO[📁 Git Repository<br/>Source Code<br/>+ Amp CLI Tools]
    
    %% Primary API Communication
    UI ---|🔐 REST API<br/>JSON + JWT Auth<br/>CRUD Operations| API
    API ---|📡 WebSocket Push<br/>Real-time Updates<br/>Task Status| UI
    
    %% Internal Orchestrator Flow
    API ---|📝 Commands<br/>Task Creation| BUS
    BUS ---|💾 State Persistence<br/>Task History| STORE
    BUS ---|🚀 Task Dispatch<br/>Container Spawn| WORKER
    
    %% Worker to Docker Communication
    WORKER ---|🔧 Docker API<br/>create/start/stop/exec<br/>Log Streaming| DOCKER
    
    %% External System Integration
    API ---|🔑 GitHub API<br/>Repository Access<br/>Branch/PR Management| GITHUB
    BUS ---|📊 Status Sync<br/>CI Status Updates<br/>Build Notifications| CI
    DOCKER ---|📥 Git Operations<br/>clone/checkout/commit/push<br/>File System Access| REPO
    
    %% Event Flow Back to Bus
    STORE -.->|📈 State Changes<br/>Task Updates| BUS
    WORKER -.->|🔔 Container Events<br/>Start/Stop/Error| BUS
    CI -.->|✅ Build Results<br/>Success/Failure| BUS
    GITHUB -.->|🔔 Webhook Events<br/>PR Status| BUS
    
    %% Styling
    classDef frontend fill:#3b82f6,stroke:#1e40af,color:#ffffff
    classDef orchestrator fill:#10b981,stroke:#059669,color:#ffffff
    classDef external fill:#f59e0b,stroke:#d97706,color:#000000
    classDef storage fill:#8b5cf6,stroke:#7c3aed,color:#ffffff
    
    class UI frontend
    class API,BUS,WORKER orchestrator
    class DOCKER,GITHUB,CI,REPO external
    class STORE storage
```

## Key Components

### Frontend Layer
- **React UI**: Modern SPA built with Vite for fast development and deployment
- **Real-time Updates**: WebSocket connection for live task status and log streaming

### Orchestrator Core (Go)
- **API Layer**: RESTful endpoints using Gin or Chi router with JWT authentication
- **Event Bus**: Go channels for internal communication and event distribution
- **Task Store**: SQLite database with GORM for task persistence and history
- **Worker Manager**: Container lifecycle management and task execution coordination
- **CI Monitor**: Continuous polling of GitHub Actions for build status and feedback

### External Integrations
- **Docker Engine**: Isolated task execution environment with long-running containers
- **GitHub App**: Repository access and PR management
- **CI/CD Pipeline**: GitHub Actions integration with automatic retry feedback loop
- **Git Repository**: Source code management with Amp CLI tools

## Autonomous CI Feedback Loop

A key differentiator of the Amp Orchestrator is its **autonomous feedback loop** with CI systems:

1. **Long-Running Containers**: Amp instances stay alive across multiple CI attempts
2. **CI Monitoring**: Orchestrator continuously polls GitHub Actions for results
3. **Error Analysis**: Failed CI runs are parsed into actionable feedback
4. **Iterative Fixing**: Amp automatically addresses CI failures and retries
5. **Bounded Execution**: Maximum retry limits prevent infinite loops

This enables Amp to deliver **production-ready code** by automatically fixing test failures, build errors, and lint warnings until all CI checks pass.

> 📋 **See [CI Feedback Loop Architecture](./ci-feedback-loop.md) for detailed implementation**
