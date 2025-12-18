---
description: Create a new agent definition with proper frontmatter
argument-hint: <agent-name> [plugin-path]
allowed-tools: Read, Write, Glob
---

# Create New Agent

Create a new Claude Code agent with the name: $1
Target plugin path: $2 (defaults to current directory)

## Process

1. **Validate agent name**
   - Must be lowercase
   - Only alphanumeric and hyphens
   - Descriptive of the agent's role

2. **Create agent file**
   Location: `agents/$1.md`

3. **Generate template**

```yaml
---
name: $1
description: [Ask user - when should this agent be invoked and what does it do]
tools: Read, Grep, Glob, Bash
model: sonnet
permissionMode: default
skills: [Optional - which skills to auto-load]
---

# [Agent Role Title]

You are a [role description].

## Capabilities

[List what this agent can do]

## Process

[Step-by-step process the agent should follow]

## Checklist

[Verification checklist for the agent's work]
```

4. **Ask user for:**
   - Agent's role/expertise
   - When it should be invoked
   - Which tools it needs (or all)
   - Which model to use (sonnet default, opus for complex, haiku for simple)
   - Permission mode if special handling needed
   - Any skills to auto-load

## Model Options

| Model | Best For |
|-------|----------|
| `sonnet` | Default, balanced (recommended) |
| `opus` | Complex reasoning, nuanced tasks |
| `haiku` | Simple, fast tasks |
| `inherit` | Use same model as main conversation |

## Permission Modes

| Mode | Behavior |
|------|----------|
| `default` | Normal permission flow |
| `acceptEdits` | Auto-accept file edits |
| `bypassPermissions` | Skip permission checks |
| `plan` | Planning mode only |

## Validation

After creation, verify:
- [ ] File at `agents/$1.md`
- [ ] Has `name` in frontmatter
- [ ] Has `description` in frontmatter
- [ ] Description explains when to invoke
