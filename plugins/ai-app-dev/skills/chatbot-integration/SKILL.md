---
name: chatbot-integration
description: Build chatbot backends that integrate with Moodle and web frontends. Use when building chat widgets, AI integrations, or conversational interfaces.
allowed-tools: Read, Write, Grep, Glob
---

# Chatbot Integration Skill

Build chatbot backends that integrate with Moodle and web frontends.

## Trigger
- Building chatbot/widget backends
- Integrating AI with web applications
- User requests chat functionality

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│   LLM API    │
│  (Widget)    │     │ (PocketFlow) │     │   (Claude)   │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │
       ▼                    ▼
   iframe/embed        Session Store
   WebSocket/SSE       Context Memory
```

## Backend Flow

```python
from pocketflow import Node, Flow

class LoadContextNode(Node):
    """Load user/course context from Moodle"""
    def exec(self, params):
        return moodle_api.get_context(
            user_id=params["user_id"],
            course_id=params.get("course_id")
        )

class PolicyCheckNode(Node):
    """Verify AI policy acceptance"""
    def exec(self, context):
        return moodle_api.check_ai_policy(context["user_id"])

    def post(self, shared, ctx, accepted) -> str:
        if not accepted:
            shared["response"] = {
                "type": "policy_required",
                "message": "Please accept AI policy"
            }
            return "policy_required"
        return "proceed"

class GenerateNode(Node):
    """Generate response with context"""
    def prep(self, shared):
        return {
            "history": shared.get("history", []),
            "context": shared.get("context", {}),
            "message": shared["user_message"]
        }

    def exec(self, data):
        prompt = build_prompt(
            system=get_system_prompt(data["context"]),
            history=data["history"],
            message=data["message"]
        )
        return call_llm(prompt)

    def post(self, shared, prep, response) -> str:
        shared["history"].append({"role": "user", "content": prep["message"]})
        shared["history"].append({"role": "assistant", "content": response})
        shared["response"] = {"type": "message", "content": response}
        return "done"

# Build flow
context = LoadContextNode()
policy = PolicyCheckNode()
generate = GenerateNode()

context >> policy
policy - "proceed" >> generate
policy - "policy_required" >> EndNode()

chatbot_flow = Flow(start=context)
```

## API Endpoint

```python
from fastapi import FastAPI, WebSocket
from pocketflow import Flow

app = FastAPI()

@app.post("/chat")
async def chat(request: ChatRequest):
    shared = {
        "user_id": request.user_id,
        "course_id": request.course_id,
        "user_message": request.message,
        "history": get_session_history(request.session_id),
    }

    flow = chatbot_flow
    result = flow.run(shared)

    save_session_history(request.session_id, shared["history"])

    return shared["response"]

@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    session = create_session()

    while True:
        message = await websocket.receive_text()
        shared = {"user_message": message, **session}

        # Stream response
        async for chunk in stream_flow(shared):
            await websocket.send_text(chunk)

        session["history"] = shared["history"]
```

## Moodle Webservice Integration

```python
class MoodleAPI:
    def __init__(self, base_url: str, token: str):
        self.base_url = base_url
        self.token = token

    def call(self, function: str, **params):
        response = requests.post(
            f"{self.base_url}/webservice/rest/server.php",
            data={
                "wstoken": self.token,
                "wsfunction": function,
                "moodlewsrestformat": "json",
                **params
            }
        )
        return response.json()

    def get_context(self, user_id: int, course_id: int = None):
        user = self.call("core_user_get_users_by_field",
                        field="id", values=[user_id])
        context = {"user": user[0]}

        if course_id:
            course = self.call("core_course_get_courses",
                             options={"ids": [course_id]})
            context["course"] = course[0]

        return context

    def check_ai_policy(self, user_id: int):
        result = self.call("core_ai_get_policy_status",
                          userid=user_id)
        return result.get("accepted", False)
```

## Session Management

```python
from datetime import datetime, timedelta
import redis

class SessionStore:
    def __init__(self, redis_url: str):
        self.redis = redis.from_url(redis_url)
        self.ttl = timedelta(hours=24)

    def get_history(self, session_id: str) -> list:
        data = self.redis.get(f"chat:{session_id}")
        return json.loads(data) if data else []

    def save_history(self, session_id: str, history: list):
        self.redis.setex(
            f"chat:{session_id}",
            self.ttl,
            json.dumps(history)
        )

    def clear_session(self, session_id: str):
        self.redis.delete(f"chat:{session_id}")
```

## Streaming Responses

```python
async def stream_flow(shared: dict):
    """Stream LLM response chunks"""
    prompt = build_prompt(shared)

    async for chunk in stream_llm(prompt):
        shared["partial_response"] = shared.get("partial_response", "") + chunk
        yield json.dumps({"type": "chunk", "content": chunk})

    # Final response
    shared["history"].append({
        "role": "assistant",
        "content": shared["partial_response"]
    })
    yield json.dumps({"type": "done"})
```

## Checklist
- [ ] Context loading from Moodle
- [ ] Policy check before AI
- [ ] Session history management
- [ ] Error handling for API failures
- [ ] Streaming support for long responses
- [ ] Rate limiting
- [ ] Logging and monitoring
