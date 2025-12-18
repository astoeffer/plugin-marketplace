---
description: Generate or update plugin.json from discovered components
argument-hint: <plugin-path>
allowed-tools: Read, Write, Glob
---

# Generate Plugin Manifest

Generate or update the plugin.json manifest for the plugin at: $ARGUMENTS

## Discovery Process

### 1. Scan for Skills
Pattern: `skills/*/SKILL.md`

For each skill found:
- Extract `name` from frontmatter
- Extract `description` from frontmatter
- Note the skill path

### 2. Scan for Commands
Pattern: `commands/**/*.md`

For each command found:
- Extract `description` from frontmatter
- Note the command path
- Determine namespace from directory structure

### 3. Scan for Agents
Pattern: `agents/*.md`

For each agent found:
- Extract `name` from frontmatter
- Extract `description` from frontmatter
- Note the agent path

### 4. Scan for Hooks
Check for: `hooks/hooks.json`

### 5. Scan for MCP Servers
Check for: `.mcp.json`

## Generate plugin.json

```json
{
  "name": "[ask if not existing]",
  "version": "[increment patch if existing, else 1.0.0]",
  "description": "[ask if not existing]",
  "author": {
    "name": "[ask if not existing]"
  },
  "license": "MIT",
  "keywords": ["[derive from content]"],
  "commands": "./commands/",
  "agents": "./agents/",
  "skills": "./skills/"
}
```

## Update Existing Manifest

If plugin.json already exists:
1. Read current content
2. Preserve existing values
3. Update paths if components found
4. Increment version patch number (1.0.0 → 1.0.1)
5. Ask user to confirm changes

## Output

Show the generated/updated manifest and ask for confirmation before writing.

Display summary:
- Skills discovered: X
- Commands discovered: X
- Agents discovered: X
- Hooks: [yes/no]
- MCP servers: [yes/no]

## Marketplace Entry

Optionally generate a marketplace.json entry:

```json
{
  "name": "[plugin-name]",
  "source": "./plugins/[plugin-name]",
  "description": "[plugin description]",
  "version": "[version]",
  "keywords": ["[keywords]"]
}
```
