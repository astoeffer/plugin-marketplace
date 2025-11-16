---
name: validate
description: "Validate Claude Code plugin structure and identify common issues"
category: plugin-development
---

# /validate - Plugin Structure Validation

Validates a Claude Code plugin against all requirements and checks for common mistakes that prevent loading.

## What This Command Does

1. **Checks directory structure** exists and is complete
2. **Validates plugin.json** format and required fields
3. **Scans for common errors** that prevent plugin loading
4. **Verifies component files** (commands, agents, skills)
5. **Tests JSON syntax** in all config files
6. **Provides actionable fixes** for any issues found

## Usage

```
/validate [path-to-plugin]
/validate ~/.claude/plugins/local/my-plugin
/validate /opt/moodle-dev/my-marketplace/my-plugin
```

## Validation Checks

### Critical Checks (Must Pass)

✅ **plugin.json exists** in `.claude-plugin/` directory
✅ **plugin.json is valid JSON**
✅ **Required fields present**: name, version, description, author
✅ **NO invalid component paths** - checks for `"commands": "./commands"` etc.
✅ **Directory structure** follows conventions

### Component Validation

✅ **Command files** end with `.md` and have proper frontmatter
✅ **Agent files** end with `.md` and have valid structure
✅ **Skill directories** contain `SKILL.md` file
✅ **No duplicate names** across components

### Common Error Detection

🔍 **Invalid path specifications**
```json
❌ "commands": "./commands"     // WRONG - causes validation error
❌ "agents": "./agents"         // WRONG - not auto-discovered
✅ No paths specified           // CORRECT - auto-discovery
```

🔍 **Missing required metadata**
```json
❌ { "name": "my-plugin" }                    // Missing version, description
✅ { "name": "my-plugin", "version": "1.0.0", // Complete
     "description": "...", "author": {...} }
```

🔍 **Invalid marketplace.json**
```json
❌ "source": { "source": "git", "url": "..." }     // Wrong format
✅ "source": { "source": "github", "repo": "..." } // Correct
```

## Validation Output

### Success

```
✅ Plugin validation passed: my-plugin v1.0.0

Structure:
  ✓ .claude-plugin/plugin.json (valid)
  ✓ commands/ (3 commands found)
  ✓ agents/ (2 agents found)
  ✓ skills/ (1 skill found)

Components:
  ✓ hello.md (command)
  ✓ task.md (command)
  ✓ helper.md (agent)
  ✓ my-skill/SKILL.md (skill)

No issues found. Plugin is ready to use.
```

### Errors Found

```
❌ Plugin validation failed: my-plugin

Issues found:

CRITICAL:
  ✗ plugin.json contains invalid "commands" field
    Location: .claude-plugin/plugin.json:15
    Fix: Remove "commands": "./commands" - components are auto-discovered

  ✗ plugin.json missing required field: version
    Fix: Add "version": "1.0.0" to plugin.json

WARNINGS:
  ⚠ Command file missing frontmatter: commands/broken.md
    Fix: Add YAML frontmatter with name and description

  ⚠ Large file detected: examples/data.json (5.2MB)
    Recommendation: Move large files to external storage

3 critical issues, 2 warnings
Run /fix-plugin to auto-fix common issues
```

## Auto-Fix Mode

```
/validate --fix my-plugin
```

Automatically fixes:
- Removes invalid component paths from plugin.json
- Adds missing required fields (prompts for values)
- Fixes JSON formatting
- Corrects file naming issues

## Integration with Debug Logs

Checks Claude Code debug logs for errors:

```
Checking debug logs for plugin errors...

Found in ~/.claude/debug/latest:
  [ERROR] Plugin not available: my-plugin - error type: generic-error
  [DEBUG] Validation errors: agents: Invalid input: must end with ".md"

Analysis:
  → plugin.json line 24: Remove "agents": "./agents"
  → Use auto-discovery instead of manual paths
```

## Validation Rules Reference

1. **plugin.json must contain ONLY**:
   - name, version, description
   - author (name, email)
   - Optional: homepage, repository, license, keywords

2. **plugin.json must NOT contain**:
   - commands, agents, skills, hooks paths (unless specific file refs)

3. **Component files**:
   - Commands: `commands/*.md` with YAML frontmatter
   - Agents: `agents/*.md` with proper structure
   - Skills: `skills/*/SKILL.md`

4. **Marketplace.json** (if creating marketplace):
   - Must have $schema reference
   - Must have version and description
   - Source must be "github" format, not "git"

## Exit Codes

- `0` - Validation passed
- `1` - Critical errors found
- `2` - Warnings only (still usable)

## Notes

- Run after making any structural changes
- Check debug logs if validation passes but plugin doesn't load
- Use `--verbose` for detailed component analysis
- Validation is non-destructive (doesn't modify files without --fix)
