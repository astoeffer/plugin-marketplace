# Plugin Dev - Claude Code Plugin Development Toolkit

Comprehensive toolkit for creating, validating, testing, and publishing Claude Code plugins.

## Installation

```bash
claude plugin install https://github.com/astoeffer/plugin-marketplace --subdir plugins/plugin-dev
```

Or from local marketplace:
```bash
claude plugin install /path/to/plugin-marketplace --subdir plugins/plugin-dev
```

## Features

### Commands

| Command | Description |
|---------|-------------|
| `/plugin-dev:scaffold` | Create a new plugin with customizable components |
| `/plugin-dev:validate` | Validate plugin structure and components |
| `/plugin-dev:test` | Test plugin components in isolation |
| `/plugin-dev:publish` | Prepare and publish plugin to marketplace |

### Agents

| Agent | Description |
|-------|-------------|
| `plugin-dev:plugin-architect` | Expert plugin designer for architecture decisions |
| `plugin-dev:component-generator` | Generate well-structured components from descriptions |

### Skills

| Skill | Description |
|-------|-------------|
| `plugin-validator` | Auto-validates plugin files while editing |

### Hooks

- **SessionStart**: Detects plugin context and shows available commands
- **PostToolUse**: Validates plugin.json and command files after writes

## Usage

### Create a New Plugin

```bash
# Interactive scaffolding
/plugin-dev:scaffold my-awesome-plugin

# With specific components
/plugin-dev:scaffold my-plugin --commands --agents --skills --hooks
```

### Validate a Plugin

```bash
# Validate current directory
/plugin-dev:validate

# Validate specific plugin
/plugin-dev:validate /path/to/plugin
```

### Test Plugin Components

```bash
# Test all components
/plugin-dev:test all

# Test specific type
/plugin-dev:test commands

# Test specific component
/plugin-dev:test command scaffold
```

### Publish Plugin

```bash
# Prepare for publication
/plugin-dev:publish

# Publish to specific marketplace
/plugin-dev:publish --marketplace https://github.com/user/marketplace
```

## Plugin Structure Reference

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json      # Plugin manifest
├── commands/            # Slash commands
│   └── example.md
├── agents/              # Sub-agents
│   └── example-agent.md
├── skills/              # Auto-activating skills
│   └── example-skill/
│       └── SKILL.md
├── hooks/               # Event hooks
│   └── hooks.json
└── README.md            # Documentation
```

## Component Templates

### Command Template
```markdown
---
name: my-command
description: Brief description (max 200 chars)
argument-hint: <required-arg> [optional-arg]
---

# Command Title

Instructions for Claude to execute this command.
```

### Agent Template
```markdown
---
name: my-agent
description: What this agent specializes in
tools: Read, Write, Bash
model: sonnet
---

# Agent Name

You are an expert in [domain].

## Capabilities
- Capability 1
- Capability 2
```

### Skill Template
```markdown
---
name: my-skill
description: When this skill activates and what it does
allowed-tools: Read, Grep
---

# Skill Name

## Activation Triggers
- Trigger 1
- Trigger 2

## Actions
What the skill does when activated.
```

### Hooks Template
```json
{
  "SessionStart": [
    {
      "matcher": "*",
      "hooks": [
        {
          "type": "command",
          "command": "#!/bin/bash\necho 'Hello'\nexit 0\n",
          "timeout": 5000
        }
      ]
    }
  ]
}
```

## Best Practices

1. **Naming**: Use kebab-case for all names
2. **Descriptions**: Keep under 200 characters, be specific
3. **Tools**: Only request tools that are actually needed
4. **Hooks**: Always set timeouts, use `exit 0` for success
5. **Documentation**: Include usage examples in README

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `/plugin-dev:validate` to check
5. Submit a pull request

## License

MIT License - See LICENSE file for details.
