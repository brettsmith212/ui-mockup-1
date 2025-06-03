# Amp Orchestrator Documentation

This directory contains architectural documentation for the Amp Orchestrator system.

## 📋 Documentation Index

### Architecture Overview
- **[Architecture Overview](./architecture-overview.md)** - Main system components and their relationships
- **[Task Lifecycle Sequence](./task-lifecycle-sequence.md)** - Realistic task flow including CI feedback loops
- **[Event & Data Flow](./event-data-flow.md)** - Internal event bus architecture and data persistence

### Detailed Implementation
- **[CI Feedback Loop](./ci-feedback-loop.md)** - Deep dive into autonomous CI failure detection and fixing ⭐

## 🎯 System Overview

The Amp Orchestrator is a **Go-based service** that manages AI-powered coding tasks through:

- **React UI** for task management and real-time monitoring
- **Event-driven architecture** using Go channels for internal communication  
- **Long-running Docker containers** for isolated Amp CLI execution
- **Autonomous CI feedback loops** for production-ready code generation
- **GitHub integration** for repository access and PR management

## 🔄 Key Innovation: CI Feedback Loop

Unlike traditional CI systems that simply report pass/fail, the Amp Orchestrator:

1. **Monitors CI results** in real-time via GitHub Actions API
2. **Keeps containers alive** across multiple retry attempts  
3. **Parses CI failures** into structured, actionable feedback
4. **Automatically fixes issues** and retries until all tests pass
5. **Creates pull requests** only when code is production-ready

This autonomous feedback loop enables Amp to deliver high-quality, tested code without manual intervention.

## 🚀 Quick Start

```bash
# Start the orchestrator
./amp-orchestrator --config=config.yml

# Access the UI
open http://localhost:8080

# Create a new task
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Add user authentication", "repo": "myorg/myapp"}'
```

## 📡 Real-time Features

- **WebSocket updates** for live task status and log streaming
- **Event bus** for coordinating between components
- **Container monitoring** for resource usage and health
- **CI status polling** for automatic retry coordination

---

For implementation details and code examples, see the individual documentation files above.
