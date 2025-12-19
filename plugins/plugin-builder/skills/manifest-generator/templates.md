# Manifest Templates

Ready-to-use templates for Claude Code plugin manifests.

## plugin.json Templates

### Minimal Plugin

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "A brief description of what this plugin does",
  "author": {
    "name": "Your Name"
  }
}
```

### Full Plugin (All Fields)

```json
{
  "name": "my-full-plugin",
  "version": "1.0.0",
  "description": "A comprehensive plugin with all features",
  "author": {
    "name": "Your Name",
    "email": "your@email.com"
  },
  "license": "MIT",
  "keywords": ["productivity", "automation", "development"],
  "repository": "https://github.com/user/my-plugin",
  "homepage": "https://docs.example.com/my-plugin",
  "commands": "./commands/",
  "agents": "./agents/",
  "skills": "./skills/",
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/lint.sh"
          }
        ]
      }
    ]
  },
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/server/index.js"],
      "description": "Custom MCP server"
    }
  }
}
```

### Skills-Only Plugin

```json
{
  "name": "knowledge-base",
  "version": "1.0.0",
  "description": "Collection of domain knowledge skills",
  "author": {
    "name": "Your Name"
  },
  "license": "MIT",
  "keywords": ["knowledge", "reference", "documentation"],
  "skills": "./skills/"
}
```

### Commands-Only Plugin

```json
{
  "name": "workflow-commands",
  "version": "1.0.0",
  "description": "Collection of workflow automation commands",
  "author": {
    "name": "Your Name"
  },
  "license": "MIT",
  "keywords": ["workflow", "automation", "commands"],
  "commands": "./commands/"
}
```

## marketplace.json Templates

### Simple Marketplace

```json
{
  "name": "my-marketplace",
  "owner": {
    "name": "Your Name"
  },
  "plugins": [
    {
      "name": "plugin-one",
      "source": "./plugins/plugin-one",
      "description": "First plugin"
    },
    {
      "name": "plugin-two",
      "source": "./plugins/plugin-two",
      "description": "Second plugin"
    }
  ]
}
```

### Full Marketplace

```json
{
  "name": "enterprise-plugins",
  "owner": {
    "name": "Enterprise Team",
    "email": "team@company.com"
  },
  "metadata": {
    "description": "Official enterprise plugin collection",
    "version": "2.0.0",
    "pluginRoot": "./plugins"
  },
  "plugins": [
    {
      "name": "code-standards",
      "source": "./plugins/code-standards",
      "description": "Enforce company coding standards",
      "version": "1.2.0",
      "author": {
        "name": "DevOps Team"
      },
      "keywords": ["standards", "linting", "quality"],
      "category": "development",
      "strict": true
    },
    {
      "name": "deployment-tools",
      "source": {
        "source": "github",
        "repo": "company/deployment-plugin"
      },
      "description": "Deployment automation tools",
      "version": "2.1.0",
      "keywords": ["deployment", "ci-cd", "automation"]
    }
  ]
}
```

### GitHub-Based Marketplace

```json
{
  "name": "github-plugins",
  "owner": {
    "name": "Organization"
  },
  "plugins": [
    {
      "name": "external-plugin",
      "source": {
        "source": "github",
        "repo": "org/plugin-repo"
      },
      "description": "Plugin from GitHub repository"
    },
    {
      "name": "specific-branch",
      "source": {
        "source": "github",
        "repo": "org/plugin-repo",
        "ref": "v2.0.0"
      },
      "description": "Plugin from specific tag/branch"
    }
  ]
}
```

## SKILL.md Template

```yaml
---
name: skill-name
description: Brief description of what this skill does. Use when [specific triggers]. Helps with [use cases].
allowed-tools: Read, Grep, Glob
---

# Skill Title

## Overview

[What this skill provides and why it's useful]

## When to Use

- [Trigger condition 1]
- [Trigger condition 2]
- [Trigger condition 3]

## Instructions

[Step-by-step guidance for Claude]

1. First step
2. Second step
3. Third step

## Examples

### Example 1: [Scenario]

[Concrete example with code/commands]

### Example 2: [Scenario]

[Another example]

## Reference

See [reference.md](reference.md) for detailed documentation.
```

## Command Template

```yaml
---
description: What this command does in one sentence
argument-hint: <required-arg> [optional-arg]
allowed-tools: Read, Write, Edit, Bash
model: sonnet
---

# Command Purpose

Execute this command with: $ARGUMENTS

## Process

1. [First step]
2. [Second step]
3. [Third step]

## Arguments

- `$1` - First argument: [description]
- `$2` - Second argument: [description]
- `$ARGUMENTS` - All arguments as string

## Example Usage

```
/command-name value1 value2
```
```

## Agent Template

```yaml
---
name: agent-name
description: Expert [role] agent. Use when [trigger conditions]. Helps with [capabilities].
tools: Read, Grep, Glob, Bash
model: sonnet
permissionMode: default
skills: relevant-skill-1, relevant-skill-2
---

# Agent Role Title

You are an expert [role description].

## Capabilities

- [Capability 1]
- [Capability 2]
- [Capability 3]

## Process

When invoked, follow this process:

1. **Assessment**: [What to evaluate first]
2. **Analysis**: [How to analyze the situation]
3. **Action**: [What actions to take]
4. **Verification**: [How to verify success]

## Checklist

- [ ] [Verification item 1]
- [ ] [Verification item 2]
- [ ] [Verification item 3]

## Output Format

[How to format responses]
```
