# Plugin Structure Reference

Complete JSON schemas and examples for Claude Code plugin development.

## plugin.json Complete Schema

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "Brief description",
  "author": {
    "name": "Your Name",
    "email": "email@example.com"
  },
  "license": "MIT",
  "keywords": ["keyword1", "keyword2"],
  "repository": "https://github.com/user/repo",
  "homepage": "https://docs.example.com",
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
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh"
          }
        ]
      }
    ]
  },
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/server/index.js"]
    }
  }
}
```

## marketplace.json Schema

```json
{
  "name": "my-marketplace",
  "owner": {
    "name": "Owner Name",
    "email": "owner@example.com"
  },
  "plugins": [
    {
      "name": "plugin-name",
      "source": "./plugins/plugin-name",
      "description": "Plugin description",
      "version": "1.0.0",
      "author": {
        "name": "Author Name"
      },
      "keywords": ["tag1", "tag2"],
      "strict": true
    }
  ]
}
```

### Plugin Source Options

**Relative path (same repo):**
```json
{
  "source": "./plugins/my-plugin"
}
```

**GitHub repository:**
```json
{
  "source": {
    "source": "github",
    "repo": "owner/plugin-repo"
  }
}
```

**Any Git URL:**
```json
{
  "source": {
    "source": "url",
    "url": "https://gitlab.com/team/plugin.git"
  }
}
```

## SKILL.md Examples

### Minimal Skill

```yaml
---
name: my-skill
description: What this skill does. Use when user needs X or asks about Y.
---

# My Skill

Instructions for Claude when this skill is active.
```

### Skill with Tool Restrictions

```yaml
---
name: safe-reader
description: Read-only file access. Use when examining code without modifications.
allowed-tools: Read, Grep, Glob
---

# Safe Reader

You have read-only access. Do not use Edit or Write tools.

## Instructions
1. Use Read to view file contents
2. Use Grep to search patterns
3. Use Glob to find files
```

### Skill with Reference Files

```yaml
---
name: api-reference
description: API documentation reference. Use when working with our REST API.
---

# API Reference

See [endpoints.md](endpoints.md) for endpoint details.
See [schemas.md](schemas.md) for data schemas.
```

## Command Examples

### Simple Command

```markdown
---
description: Greet the user
---

Say hello to the user and ask how you can help today.
```

### Command with Arguments

```markdown
---
description: Fix a GitHub issue
argument-hint: <issue-number> [priority]
allowed-tools: Read, Write, Edit, Bash
---

Fix GitHub issue #$1 with priority $2 (default: normal).

1. Read the issue details
2. Analyze the codebase
3. Implement the fix
4. Create appropriate tests
```

### Command with Bash Execution

```markdown
---
description: Create a git commit
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
---

## Current Status
!`git status`

## Recent Changes
!`git diff HEAD`

Based on these changes, create a descriptive commit message.
```

### Namespaced Command

File: `commands/db/migrate.md` → `/db:migrate`

```markdown
---
description: Run database migrations
argument-hint: [direction]
---

Run database migration in direction: $1 (default: up)
```

## Agent Examples

### Simple Agent

```yaml
---
name: code-reviewer
description: Expert code reviewer. Use proactively after code changes to review quality.
tools: Read, Grep, Glob
model: sonnet
---

You are a senior code reviewer. Analyze code for:
- Code quality and readability
- Security vulnerabilities
- Performance issues
- Best practices violations

Provide actionable feedback organized by severity.
```

### Agent with Full Configuration

```yaml
---
name: security-auditor
description: Security audit specialist. Use when reviewing code for vulnerabilities or preparing for security review.
tools: Read, Grep, Glob, Bash
model: opus
permissionMode: default
skills: security-patterns, owasp-reference
---

You are a security expert specializing in application security.

## Audit Process

1. **Reconnaissance**: Understand the application architecture
2. **Input Analysis**: Check all user input handling
3. **Authentication Review**: Verify auth mechanisms
4. **Authorization Check**: Confirm access controls
5. **Data Protection**: Review sensitive data handling
6. **Dependency Audit**: Check for vulnerable packages

## Report Format

Organize findings by:
- Critical (immediate action required)
- High (fix before release)
- Medium (fix in next sprint)
- Low (consider for improvement)
```

## Hooks Configuration

### File: `hooks/hooks.json`

```json
{
  "PostToolUse": [
    {
      "matcher": "Write|Edit",
      "hooks": [
        {
          "type": "command",
          "command": "npm run lint"
        }
      ]
    }
  ],
  "PreToolUse": [
    {
      "matcher": "Bash",
      "hooks": [
        {
          "type": "command",
          "command": "echo 'Executing bash command...'"
        }
      ]
    }
  ]
}
```

### Hook Types

- `PreToolUse`: Before tool execution
- `PostToolUse`: After tool execution
- `Notification`: Custom notifications

## MCP Server Configuration

### File: `.mcp.json` (at plugin root)

```json
{
  "mcpServers": {
    "my-database": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/servers/db-server.js"],
      "env": {
        "DB_HOST": "localhost",
        "DB_PORT": "5432"
      },
      "description": "Database query interface"
    },
    "my-api": {
      "command": "python",
      "args": ["${CLAUDE_PLUGIN_ROOT}/servers/api_server.py"],
      "description": "External API integration"
    }
  }
}
```

### Environment Variable

`${CLAUDE_PLUGIN_ROOT}` resolves to the plugin's installation directory at runtime.

## Validation Rules

### Name Validation
- Pattern: `^[a-z][a-z0-9-]*$`
- Max length: 64 characters
- Must start with lowercase letter

### Description Validation
- Max length: 1024 characters
- Should include trigger phrases
- Must clearly state purpose

### Version Validation
- Format: Semantic versioning
- Pattern: `^[0-9]+\.[0-9]+\.[0-9]+(-[a-z0-9.]+)?$`
- Examples: "1.0.0", "2.1.3-beta.1"
