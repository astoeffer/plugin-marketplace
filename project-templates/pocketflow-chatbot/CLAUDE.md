# Project: PocketFlow Chatbot

> Auto-configured for AI chatbot development with PocketFlow + Moodle integration.

## Active Contexts
@~/.claude/contexts/pocketflow.md
@~/.claude/contexts/frontend.md
@~/.claude/contexts/accessibility.md

## Project Specifics

**Framework**: PocketFlow
**Integration**: Moodle (webservice/iframe)
**LLM Provider**: [OpenAI|Anthropic|Local]

## Enabled Plugins
- ai-app-dev (PocketFlow patterns, chatbot integration)

## Architecture
```
Frontend (Widget) ──▶ Backend (PocketFlow) ──▶ LLM API
       │                      │
   iframe/WS              Shared Store
```

## Quality Gates
```bash
pytest
mypy .
ruff check .
```
