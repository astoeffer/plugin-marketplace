# PocketFlow / AI Agent Development Context

> 100-line LLM framework | Graph + Shared Store | Zero dependencies

## Core Abstraction

```
┌─────────────────────────────────────────────┐
│                   FLOW                       │
│  ┌─────┐  action  ┌─────┐  action  ┌─────┐ │
│  │Node │─────────▶│Node │─────────▶│Node │ │
│  └─────┘          └─────┘          └─────┘ │
│     │                │                │     │
│     └────────────────┴────────────────┘     │
│              SHARED STORE                   │
└─────────────────────────────────────────────┘
```

## Node Lifecycle

| Method | Purpose | Returns |
|--------|---------|---------|
| `prep(shared)` | Read from store, prepare data | Data for exec |
| `exec(prep_result)` | Core logic (LLM call, etc) | Result |
| `post(shared, prep, exec)` | Save to store, decide next | Action string |

## Basic Node Pattern

```python
from pocketflow import Node, Flow

class SummarizeNode(Node):
    def prep(self, shared: dict) -> str:
        return shared.get("text", "")

    def exec(self, text: str) -> str:
        return call_llm(f"Summarize: {text}")

    def post(self, shared: dict, text: str, summary: str) -> str:
        shared["summary"] = summary
        return "done"
```

## Flow Construction

```python
# Linear flow with >> operator
node1 >> node2 >> node3

# Conditional branching with - operator
node1 >> node2
node2 - "success" >> node3
node2 - "error" >> error_handler

# Create and run
flow = Flow(start=node1)
result = flow.run({"input": "data"})
```

## Design Patterns

### Agent (Decision Loop)

```python
class AgentNode(Node):
    def exec(self, context: dict) -> dict:
        return call_llm("What tool to use?", context)

    def post(self, shared, ctx, decision) -> str:
        shared["last_action"] = decision
        return decision["action"]  # Routes to next node

# Agent routes to different tools
agent >> tool_search   # "search" action
agent >> tool_respond  # "respond" action
agent >> agent         # "think" loops back
```

### RAG (Retrieval-Augmented)

```python
embed >> retrieve >> augment >> generate

class RetrieveNode(Node):
    def exec(self, embedding):
        return vector_db.search(embedding, k=5)
```

### Batch Processing

```python
from pocketflow import BatchNode

class ProcessBatch(BatchNode):
    def exec(self, items: list) -> list:
        return [process(item) for item in items]
```

### Async for I/O

```python
from pocketflow import AsyncNode

class AsyncLLMNode(AsyncNode):
    async def exec(self, prompt: str) -> str:
        return await async_llm_call(prompt)
```

## Best Practices

1. **Single responsibility** - One task per node
2. **Use shared store** - Don't pass data through returns
3. **Meaningful actions** - "success", "retry", "error" not "a", "b"
4. **Custom utilities** - Implement own LLM wrappers (no vendor lock-in)
5. **Async for I/O** - API calls, file operations

## Anti-Patterns

```python
# WRONG: God node doing everything
class DoEverything(Node):
    def exec(self, data):
        load(); process(); call_api(); save(); format()

# CORRECT: Separate concerns
class LoadNode(Node): pass
class ProcessNode(Node): pass
class APINode(Node): pass
```

## Moodle Chatbot Integration

```python
# Chatbot flow for Moodle widget
class MoodleContextNode(Node):
    """Load Moodle context (course, user, capabilities)"""
    def exec(self, params):
        return moodle_webservice.get_context(params["courseid"])

class PolicyCheckNode(Node):
    """Check AI policy acceptance"""
    def post(self, shared, ctx, accepted) -> str:
        return "proceed" if accepted else "show_policy"

# Flow
context >> policy_check >> generate_response >> format_output
policy_check - "show_policy" >> policy_prompt
```

## Reference
- https://the-pocket.github.io/PocketFlow/
- https://github.com/The-Pocket/PocketFlow
