# Plugin Builder

A Claude Code plugin for developing error-free Claude Code plugins.

## Features

- **Validation**: Check plugin structure against Claude Code requirements
- **Scaffolding**: Create properly formatted skills, commands, and agents
- **Auto-fix**: Automatically repair common structure issues
- **Migration**: Convert legacy plugin formats to current standards
- **MCP Server**: Programmatic validation tools

## Installation

```bash
# Add the marketplace (if not already added)
/plugin marketplace add ./path/to/marketplace

# Install the plugin
/plugin install plugin-builder@your-marketplace
```

## Commands

All commands use the `pb:` prefix for namespacing.

### `/pb:validate <plugin-path>`

Validate a plugin's structure against Claude Code requirements.

```
/pb:validate ./plugins/my-plugin
```

Checks:
- plugin.json exists and is valid
- Skills use proper SKILL.md format
- Commands have correct structure
- Agents have required frontmatter
- No structural issues

### `/pb:create-skill <skill-name> [plugin-path]`

Create a new skill with proper SKILL.md structure.

```
/pb:create-skill api-reference ./plugins/my-plugin
```

Creates:
- `skills/api-reference/SKILL.md` with template
- Proper YAML frontmatter
- Guidance for description

### `/pb:create-command <command-name> [plugin-path]`

Create a new slash command.

```
/pb:create-command review ./plugins/my-plugin
```

For namespaced commands:
```
/pb:create-command git:commit ./plugins/my-plugin
```

### `/pb:create-agent <agent-name> [plugin-path]`

Create a new agent definition.

```
/pb:create-agent code-reviewer ./plugins/my-plugin
```

### `/pb:fix <plugin-path> [--dry-run]`

Auto-fix common plugin structure issues.

```
/pb:fix ./plugins/my-plugin
```

With dry-run to preview changes:
```
/pb:fix ./plugins/my-plugin --dry-run
```

Fixes:
- Converts flat skill files to SKILL.md directories
- Adds missing frontmatter
- Removes empty directories
- Moves misplaced directories to plugin root

### `/pb:manifest <plugin-path>`

Generate or update plugin.json from discovered components.

```
/pb:manifest ./plugins/my-plugin
```

## Skills

### plugin-structure

Knowledge about Claude Code plugin structure and requirements. Automatically used when working with plugin development tasks.

### manifest-generator

Templates and procedures for generating plugin.json and marketplace.json files.

### migration-guide

Procedures for migrating plugins from legacy formats to current standards.

## Agent

### plugin-validator

Expert debugging agent for plugin issues. Use when:
- Plugins fail to load
- Commands don't appear in `/help`
- Skills aren't discovered
- Preparing for distribution

## MCP Server

The plugin includes an MCP server for programmatic validation.

### Tools

- `validate_plugin_json` - Validate plugin.json content
- `validate_skill_md` - Validate SKILL.md content
- `validate_command_md` - Validate command file content
- `validate_agent_md` - Validate agent file content
- `scan_plugin_structure` - Scan and report plugin structure
- `generate_plugin_json` - Generate manifest from components

### Usage

The MCP server is automatically available when the plugin is installed. Use it through Claude:

```
Use the plugin-validator MCP to scan my plugin at ./plugins/my-plugin
```

## Quick Start

### Creating a New Plugin

1. Create the directory structure:
```bash
mkdir -p my-plugin/.claude-plugin
mkdir -p my-plugin/{skills,commands,agents}
```

2. Use `/pb:manifest` to generate plugin.json:
```
/pb:manifest ./my-plugin
```

3. Add skills with `/pb:create-skill`:
```
/pb:create-skill my-feature ./my-plugin
```

4. Validate before distribution:
```
/pb:validate ./my-plugin
```

### Fixing an Existing Plugin

1. Run validation to identify issues:
```
/pb:validate ./my-plugin
```

2. Auto-fix common issues:
```
/pb:fix ./my-plugin
```

3. Re-validate to confirm fixes:
```
/pb:validate ./my-plugin
```

## Plugin Structure Reference

Correct Claude Code plugin structure:

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json          # Required
├── commands/                # At root, NOT in .claude-plugin/
│   └── my-command.md
├── agents/                  # At root
│   └── my-agent.md
├── skills/                  # At root, with subdirectories
│   └── my-skill/
│       └── SKILL.md         # Required format
├── .mcp.json               # Optional MCP config
└── README.md               # Recommended
```

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Skill not discovered | Flat file format | Use `skills/name/SKILL.md` |
| Command not in /help | Wrong location | Place in `commands/` at root |
| Plugin won't load | Invalid plugin.json | Check required fields |
| Agent not invokable | Missing frontmatter | Add name and description |

## License

MIT
