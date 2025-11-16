---
name: scaffold
description: "Scaffold a new Claude Code plugin with proper structure and best practices"
category: plugin-development
---

# /scaffold - Create New Claude Code Plugin

Creates a complete plugin structure following Claude Code best practices and validation rules.

## What This Command Does

1. **Creates proper directory structure** with all required folders
2. **Generates plugin.json** with correct metadata format
3. **Scaffolds example components** (commands, agents, skills)
4. **Includes validation** to ensure structure meets Claude Code requirements
5. **Adds README** with development guidelines

## Usage

```
/scaffold my-plugin-name
```

## Interactive Prompts

You'll be asked for:
- Plugin name (kebab-case)
- Description
- Author information
- Component types to include (commands/agents/skills)
- Keywords for searchability

## Generated Structure

```
my-plugin-name/
├── .claude-plugin/
│   └── plugin.json          # Metadata only, NO component paths
├── commands/                 # Auto-discovered command files
│   └── example.md
├── agents/                   # Auto-discovered agent definitions
│   └── example-agent.md
├── skills/                   # Auto-discovered skills
│   └── example-skill/
│       └── SKILL.md
├── references/               # Reference docs (optional)
├── examples/                 # Example usage (optional)
└── README.md
```

## Critical Best Practices (Applied Automatically)

✅ **plugin.json contains ONLY metadata** - no "commands", "agents", "skills" paths
✅ **Components are auto-discovered** from their directories
✅ **Proper JSON schema reference** in marketplace.json
✅ **Version and author fields** included
✅ **Keywords for searchability**

## Common Mistakes This Prevents

❌ **Never** include `"commands": "./commands"` in plugin.json
❌ **Never** include `"agents": "./agents"` in plugin.json
❌ **Never** include `"skills": "./skills"` in plugin.json

These cause validation errors: "must end with .md"

## Implementation Steps

1. Validate plugin name (kebab-case, no special chars)
2. Create directory structure
3. Generate plugin.json with metadata only
4. Create example command (if requested)
5. Create example agent (if requested)
6. Create example skill (if requested)
7. Generate comprehensive README
8. Run validation check
9. Display success message with next steps

## After Scaffolding

```bash
# Test locally
mkdir -p ~/.claude/plugins/local/my-plugin-name
cp -r my-plugin-name/* ~/.claude/plugins/local/my-plugin-name/

# Restart Claude Code to load plugin

# Validate structure
/validate my-plugin-name
```

## Example Output

```
✅ Plugin scaffolded: my-plugin-name

Structure created:
  ├── .claude-plugin/plugin.json ✓
  ├── commands/example.md ✓
  ├── agents/helper.md ✓
  ├── skills/my-skill/SKILL.md ✓
  └── README.md ✓

Next steps:
1. Edit components in commands/, agents/, skills/
2. Update plugin.json metadata
3. Test locally: cp -r to ~/.claude/plugins/local/
4. Restart Claude Code
5. Run /validate to check structure
```

## Notes

- Plugin names must be unique
- Use kebab-case (lowercase with hyphens)
- Avoid generic names like "helper" or "utils"
- Include descriptive keywords in plugin.json
- Test thoroughly before publishing
