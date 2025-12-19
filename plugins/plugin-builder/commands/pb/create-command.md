---
description: Create a new slash command with proper frontmatter
argument-hint: <command-name> [plugin-path]
allowed-tools: Read, Write, Glob
---

# Create New Command

Create a new Claude Code slash command with the name: $1
Target plugin path: $2 (defaults to current directory)

## Process

1. **Parse command name**
   - If contains `:`, use prefix subdirectory (e.g., `git:commit` → `commands/git/commit.md`)
   - Otherwise, create in `commands/` directly

2. **Validate command name**
   - Lowercase recommended
   - No special characters except hyphens

3. **Create command file**

```yaml
---
description: [Ask user for description]
argument-hint: [Ask if command takes arguments]
allowed-tools: [Ask which tools needed]
model: [Optional - ask if specific model needed]
---

# Command Purpose

[Ask user for the command instructions]

## Arguments

- `$ARGUMENTS` - All arguments as string
- `$1`, `$2`, etc. - Positional arguments

## Instructions

[What should Claude do when this command is invoked]
```

4. **Ask user for:**
   - What the command should do
   - What arguments it accepts (if any)
   - Which tools it needs access to
   - Whether to use a specific model

## Namespacing Guide

For prefixed commands like `/prefix:command`:
- Create `commands/prefix/command.md`
- This appears as `/prefix:command` in help

## Validation

After creation, verify:
- [ ] File ends with `.md`
- [ ] Frontmatter YAML is valid
- [ ] Description is clear
- [ ] Argument placeholders are documented
