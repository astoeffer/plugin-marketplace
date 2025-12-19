---
name: plugin-structure
description: Claude Code plugin structure and requirements. Use when creating, validating, or troubleshooting plugins. Covers plugin.json schema, SKILL.md format, command frontmatter, and agent configuration.
allowed-tools: Read, Glob, Grep
---

# Claude Code Plugin Structure

This skill provides comprehensive knowledge about Claude Code plugin development, including directory structure, manifest formats, and component requirements.

## Plugin Directory Layout

A properly structured Claude Code plugin follows this hierarchy:

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json          # Required - Plugin manifest
├── commands/                # Optional - Slash commands
│   └── command-name.md
├── agents/                  # Optional - Custom agents
│   └── agent-name.md
├── skills/                  # Optional - Agent skills
│   └── skill-name/
│       └── SKILL.md
├── hooks/                   # Optional - Event handlers
│   └── hooks.json
├── .mcp.json               # Optional - MCP server config
└── README.md               # Recommended - Documentation
```

**Critical Rules:**
1. Directories (`commands/`, `agents/`, `skills/`, `hooks/`) MUST be at plugin root, NOT inside `.claude-plugin/`
2. Skills MUST use subdirectory format: `skills/skill-name/SKILL.md`
3. Empty directories should be removed

## plugin.json Schema

**Location:** `.claude-plugin/plugin.json`

### Required Fields

```json
{
  "name": "my-plugin",
  "description": "Brief description of plugin purpose",
  "version": "1.0.0",
  "author": {
    "name": "Your Name"
  }
}
```

| Field | Type | Requirements |
|-------|------|--------------|
| `name` | string | Lowercase, alphanumeric with hyphens only |
| `description` | string | Brief, clear purpose statement |
| `version` | string | Semantic versioning (e.g., "1.0.0") |
| `author.name` | string | Author's name |

### Optional Fields

| Field | Type | Purpose |
|-------|------|---------|
| `author.email` | string | Contact email |
| `license` | string | SPDX identifier (MIT, Apache-2.0, etc.) |
| `keywords` | array | Discovery tags |
| `repository` | string | Source code URL |
| `homepage` | string | Documentation URL |
| `commands` | string/array | Path(s) to command files |
| `agents` | string/array | Path(s) to agent files |
| `skills` | string/array | Path(s) to skill directories |
| `hooks` | string/object | Hooks configuration |
| `mcpServers` | string/object | MCP server configuration |

## SKILL.md Requirements

**Location:** `skills/skill-name/SKILL.md`

### Frontmatter (Required)

```yaml
---
name: skill-name
description: Brief description of what this skill does and when to use it.
allowed-tools: Read, Grep, Glob
---
```

| Field | Required | Max Length | Notes |
|-------|----------|------------|-------|
| `name` | Yes | 64 chars | Lowercase, alphanumeric, hyphens |
| `description` | Yes | 1024 chars | Include specific triggers |
| `allowed-tools` | No | - | Comma-separated tool names |

### Description Best Practices

**Good (specific triggers):**
```yaml
description: Extract text and tables from PDF files. Use when working with PDF files, forms, or document extraction.
```

**Bad (vague):**
```yaml
description: Helps with documents
```

### Skill Content

After frontmatter, include:
- Instructions for Claude
- Examples of usage
- Reference material (or link to separate reference.md)

## Command Requirements

**Location:** `commands/command-name.md` or `commands/prefix/command-name.md`

### Frontmatter (Optional but Recommended)

```yaml
---
description: What this command does
argument-hint: <required-arg> [optional-arg]
allowed-tools: Read, Write, Glob
model: sonnet
---
```

| Field | Purpose | Default |
|-------|---------|---------|
| `description` | Shown in /help | First line of content |
| `argument-hint` | Usage hint | None |
| `allowed-tools` | Restrict tools | Inherit all |
| `model` | Specific model | Inherit |
| `disable-model-invocation` | Prevent auto-invoke | false |

### Namespacing Commands

Use subdirectories for prefixed commands:
- `commands/pb/validate.md` → `/pb:validate`
- `commands/git/commit.md` → `/git:commit`

### Using Arguments

- `$ARGUMENTS` - All arguments as string
- `$1`, `$2`, etc. - Positional arguments

### Including External Content

- `@filepath` - Include file contents
- `!`backtick`command`backtick`` - Execute bash command

## Agent Requirements

**Location:** `agents/agent-name.md`

### Frontmatter (Required)

```yaml
---
name: agent-name
description: When to invoke this agent and what it does.
tools: Read, Grep, Glob, Bash
model: sonnet
permissionMode: default
skills: skill1, skill2
---
```

| Field | Required | Options/Notes |
|-------|----------|---------------|
| `name` | Yes | Lowercase, hyphens |
| `description` | Yes | Include invocation triggers |
| `tools` | No | Comma-separated; omit to inherit all |
| `model` | No | sonnet, opus, haiku, or 'inherit' |
| `permissionMode` | No | default, acceptEdits, bypassPermissions, plan, ignore |
| `skills` | No | Comma-separated skill names to auto-load |

### Agent Content

After frontmatter, include:
- Agent's role and expertise
- Step-by-step instructions
- Checklists and procedures

## Common Errors and Fixes

### Error: Skill not discovered

**Causes:**
1. Flat file format (`skills/my-skill.md`) instead of directory (`skills/my-skill/SKILL.md`)
2. Missing or invalid YAML frontmatter
3. Description doesn't match user queries

**Fixes:**
1. Convert to directory format with SKILL.md
2. Validate YAML syntax (check `---` delimiters)
3. Make description specific with trigger phrases

### Error: Command not appearing in /help

**Causes:**
1. Missing `.md` extension
2. Invalid frontmatter YAML
3. File in wrong location

**Fixes:**
1. Ensure file ends with `.md`
2. Validate YAML with proper `---` delimiters
3. Place in `commands/` at plugin root

### Error: Plugin not loading

**Causes:**
1. Invalid JSON in plugin.json
2. Missing required fields (name, description, version, author.name)
3. Directories inside `.claude-plugin/` instead of plugin root

**Fixes:**
1. Validate JSON syntax
2. Add all required fields
3. Move directories to plugin root level

### Error: Agent not invokable

**Causes:**
1. Missing `name` or `description` in frontmatter
2. File not in `agents/` directory
3. Missing `.md` extension

**Fixes:**
1. Add required frontmatter fields
2. Place file in `agents/` at plugin root
3. Ensure `.md` extension

## Validation Checklist

Before distributing a plugin:

- [ ] `.claude-plugin/plugin.json` exists with required fields
- [ ] All skills use `skills/name/SKILL.md` format
- [ ] All skills have valid YAML frontmatter
- [ ] All commands have `.md` extension
- [ ] All agents have name and description
- [ ] No empty directories (agents/, commands/)
- [ ] Directories are at plugin root, not in .claude-plugin/
- [ ] README.md documents usage

See [reference.md](reference.md) for complete JSON schemas and examples.
