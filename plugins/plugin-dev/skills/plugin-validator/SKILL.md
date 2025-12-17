---
name: plugin-validator
description: Automatically validate plugin structure and components when working with Claude Code plugin files. Activates when editing plugin.json, command/agent/skill files, or hooks.json.
allowed-tools: Read, Grep, Glob
---

# Plugin Validator Skill

Automatic validation for Claude Code plugin development.

## Activation Triggers

This skill activates when:
- User is editing or creating `plugin.json`
- User is working with files in `commands/`, `agents/`, `skills/`, or `hooks/`
- User mentions "plugin", "validate", or "check plugin"
- Files with `.claude-plugin` directory are detected

## Validation Actions

### When Editing plugin.json
1. Validate JSON syntax
2. Check required fields: name, version, description
3. Verify semver format for version
4. Validate kebab-case for name
5. Check path references exist

### When Editing Commands
1. Validate YAML frontmatter
2. Check required fields: name, description
3. Verify name matches filename
4. Check description length (max 200 chars)

### When Editing Agents
1. Validate YAML frontmatter
2. Check required fields: name, description, tools
3. Verify tools are valid Claude Code tools
4. Check model is valid (sonnet, opus, haiku)

### When Editing Skills
1. Validate SKILL.md structure
2. Check required frontmatter fields
3. Verify allowed-tools are valid
4. Check activation conditions are defined

### When Editing Hooks
1. Validate JSON syntax
2. Check event types are valid
3. Verify commands are safe
4. Check timeouts are set

## Feedback Format

When issues are found, provide:
```
Plugin Validation Issue Detected:

File: <filename>
Issue: <description>
Fix: <suggested correction>

Example:
  Before: "name": "My Plugin"
  After:  "name": "my-plugin"
```

## Non-Blocking Behavior

This skill provides warnings but does not block user actions. All validation is informational to help maintain plugin quality.
