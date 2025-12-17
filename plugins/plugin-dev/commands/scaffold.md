---
name: scaffold
description: Scaffold a new Claude Code plugin with customizable components
argument-hint: <plugin-name> [--commands] [--agents] [--skills] [--hooks]
---

# Scaffold New Plugin

Create a new Claude Code plugin with best-practice structure.

## Arguments
- **Plugin name:** $1 (required, kebab-case)
- **Options:** $ARGUMENTS

## Validation Rules
1. Plugin name must be kebab-case (lowercase, hyphens only)
2. Maximum 64 characters
3. Must not already exist in target directory

## Steps

1. **Validate the plugin name**
   - Check kebab-case format: `^[a-z][a-z0-9-]*[a-z0-9]$`
   - Verify directory doesn't exist

2. **Determine components to include**
   Parse $ARGUMENTS for flags:
   - `--commands` → Create commands/ directory with example
   - `--agents` → Create agents/ directory with example
   - `--skills` → Create skills/ directory with example
   - `--hooks` → Create hooks/ directory with hooks.json

   If no flags, ask user which components they need.

3. **Create directory structure**
   ```
   <plugin-name>/
   ├── .claude-plugin/
   │   └── plugin.json
   ├── commands/         (if requested)
   ├── agents/           (if requested)
   ├── skills/           (if requested)
   ├── hooks/            (if requested)
   │   └── hooks.json
   └── README.md
   ```

4. **Generate plugin.json**
   Ask user for:
   - Description (required)
   - Author name (optional)
   - Keywords (optional)

5. **Create example components** based on flags

6. **Generate README.md** with:
   - Installation instructions
   - Component documentation
   - Usage examples

7. **Display success summary** with next steps
