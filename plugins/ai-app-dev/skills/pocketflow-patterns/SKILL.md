---
name: pocketflow-patterns
description: Build AI applications using PocketFlow's Graph + Shared Store architecture. Use when creating AI agents, workflows, chatbot backends, RAG systems, or LLM integrations.
allowed-tools: Read, Write, Grep, Glob
---

# PocketFlow Patterns Skill

Build AI applications using PocketFlow's Graph + Shared Store architecture.

## Trigger
- Creating AI agents or workflows
- Building chatbot backends
- Implementing RAG systems
- User requests LLM integration

## Core Patterns

### 1. Basic Node
```python
from pocketflow import Node, Flow

class MyNode(Node):
    def prep(self, shared: dict) -> any:
        """Read from shared store"""
        return shared.get("input")

    def exec(self, prep_result: any) -> any:
        """Core logic (LLM call, processing)"""
        return process(prep_result)

    def post(self, shared: dict, prep: any, exec: any) -> str:
        """Save to store, return action"""
        shared["output"] = exec
        return "done"  # Action determines next node
```

### 2. Agent Pattern (Decision Loop)
```python
class DecisionNode(Node):
    def exec(self, context):
        return call_llm("What action to take?", context)

    def post(self, shared, ctx, decision) -> str:
        shared["last_decision"] = decision
        return decision["action"]  # "search", "respond", "think"

# Routing
agent = DecisionNode()
search = SearchNode()
respond = RespondNode()

agent >> search    # "search" action
agent >> respond   # "respond" action
agent - "think" >> agent  # Loop back

flow = Flow(start=agent)
```

### 3. RAG Pattern
```python
class EmbedNode(Node):
    def exec(self, query):
        return get_embedding(query)

class RetrieveNode(Node):
    def exec(self, embedding):
        return vector_db.search(embedding, k=5)

class AugmentNode(Node):
    def exec(self, docs):
        return format_context(docs)

class GenerateNode(Node):
    def exec(self, context):
        return call_llm(context)

# Pipeline
embed >> retrieve >> augment >> generate
```

### 4. Conditional Branching
```python
class RouterNode(Node):
    def post(self, shared, prep, result) -> str:
        if result["confidence"] > 0.8:
            return "high_confidence"
        elif result["needs_clarification"]:
            return "clarify"
        return "fallback"

router = RouterNode()
high_conf = HighConfidenceNode()
clarify = ClarifyNode()
fallback = FallbackNode()

router - "high_confidence" >> high_conf
router - "clarify" >> clarify
router - "fallback" >> fallback
```

### 5. Async for I/O
```python
from pocketflow import AsyncNode

class AsyncLLMNode(AsyncNode):
    async def exec(self, prompt):
        return await async_llm_call(prompt)
```

### 6. Batch Processing
```python
from pocketflow import BatchNode

class ProcessBatch(BatchNode):
    def exec(self, items: list) -> list:
        return [process(item) for item in items]
```

## LLM Wrapper (No Vendor Lock-in)

```python
# utils/llm.py
import os

def call_llm(prompt: str, model: str = None) -> str:
    """Vendor-agnostic LLM wrapper"""
    provider = os.getenv("LLM_PROVIDER", "openai")

    if provider == "openai":
        return call_openai(prompt, model)
    elif provider == "anthropic":
        return call_claude(prompt, model)
    elif provider == "local":
        return call_ollama(prompt, model)
    else:
        raise ValueError(f"Unknown provider: {provider}")
```

## Shared Store Patterns

```python
# Initialize with context
shared = {
    "user_id": user_id,
    "session_id": session_id,
    "history": [],
    "context": {},
}

# In nodes, read/write to shared
def post(self, shared, prep, result):
    shared["history"].append({
        "role": "assistant",
        "content": result
    })
    return "done"
```

## Error Handling

```python
class SafeNode(Node):
    def exec(self, data):
        try:
            return risky_operation(data)
        except APIError as e:
            return {"error": str(e), "retry": True}

    def post(self, shared, prep, result) -> str:
        if result.get("error"):
            shared["last_error"] = result["error"]
            return "error" if not result.get("retry") else "retry"
        return "success"
```

## Best Practices Checklist
- [ ] Single responsibility per node
- [ ] Use shared store (not return values)
- [ ] Meaningful action names
- [ ] Implement custom LLM wrapper
- [ ] Use AsyncNode for I/O
- [ ] Handle errors gracefully
- [ ] Log important decisions
