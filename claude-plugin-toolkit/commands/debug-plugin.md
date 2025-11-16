---
name: debug-plugin
description: "Debug plugin loading issues using Claude Code debug logs and system state"
category: plugin-development
---

# /debug-plugin - Plugin Loading Debugger

Analyzes Claude Code debug logs and system configuration to diagnose why a plugin isn't loading or appearing in the plugin manager.

## What This Command Does

1. **Scans debug logs** for plugin-related errors
2. **Checks system configuration** (installed_plugins.json, known_marketplaces.json)
3. **Validates marketplace registration**
4. **Identifies loading failures** and their causes
5. **Provides specific fixes** for each issue found

## Usage

```
/debug-plugin my-plugin
/debug-plugin my-plugin@my-marketplace
```

## Debug Process

### Step 1: Check Plugin Registration

```
Checking plugin registration...

installed_plugins.json:
  ❌ Plugin NOT found in registry
  → Plugin must be registered to appear in UI

known_marketplaces.json:
  ✓ Marketplace registered: my-marketplace
  ✓ Last updated: 2025-11-16T15:26:44.679Z
```

### Step 2: Scan Debug Logs

```
Scanning debug logs (~/.claude/debug/latest)...

Errors found:
  [ERROR] Plugin not available for MCP: my-plugin@my-marketplace
  [ERROR] Error type: generic-error
  [DEBUG] Validation errors: agents: Invalid input: must end with ".md"

Root cause identified:
  → plugin.json contains invalid "agents": "./agents" specification
  → This causes validation to fail during plugin loading
```

### Step 3: Verify File Structure

```
Checking plugin files...

Location: ~/.claude/plugins/marketplaces/my-marketplace/my-plugin

✓ .claude-plugin/plugin.json exists
✓ commands/ directory exists (3 files)
✓ agents/ directory exists (2 files)
❌ plugin.json contains disallowed fields
```

### Step 4: Check Marketplace Configuration

```
Checking marketplace configuration...

marketplace.json:
  ❌ Missing $schema field
  ❌ Missing version field
  ✓ Plugins array present

Plugin entry in marketplace.json:
  ✓ Name matches
  ✓ Source path correct
  ❌ Missing version field
  ❌ Missing author field
```

## Common Issues & Fixes

### Issue 1: Plugin Not in Registry

**Symptom**: Marketplace doesn't appear in plugin manager

**Debug Output**:
```
❌ Plugin not registered in installed_plugins.json
```

**Fix**:
```json
// Add to ~/.claude/plugins/installed_plugins.json
"my-plugin@my-marketplace": {
  "version": "1.0.0",
  "installedAt": "2025-11-16T15:14:37.313Z",
  "lastUpdated": "2025-11-16T15:14:37.313Z",
  "installPath": "~/.claude/plugins/marketplaces/my-marketplace/my-plugin",
  "gitCommitSha": "<current-commit-sha>",
  "isLocal": true
}
```

### Issue 2: Invalid Component Paths

**Symptom**: "Validation errors: agents: Invalid input: must end with .md"

**Debug Output**:
```
❌ plugin.json line 15: "agents": "./agents"
   Claude Code expects specific .md files or auto-discovery
```

**Fix**:
```json
// Remove these lines from plugin.json:
❌ "commands": "./commands"
❌ "agents": "./agents"
❌ "skills": "./skills"

// Components are auto-discovered from directories
```

### Issue 3: Wrong Marketplace Source Format

**Symptom**: Marketplace not appearing in list

**Debug Output**:
```
❌ known_marketplaces.json uses "git" source type
   Only "github" source type is recognized by UI
```

**Fix**:
```json
// In known_marketplaces.json, change:
❌ "source": { "source": "git", "url": "https://..." }

// To:
✅ "source": { "source": "github", "repo": "owner/repo" }
```

### Issue 4: Missing Marketplace Metadata

**Symptom**: Marketplace exists but doesn't show in UI

**Debug Output**:
```
❌ marketplace.json missing required fields:
   - $schema
   - version
   - description
   - owner.email
```

**Fix**:
```json
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "my-marketplace",
  "version": "1.0.0",
  "description": "Marketplace description",
  "owner": {
    "name": "Your Name",
    "email": "you@example.com"
  },
  "plugins": [...]
}
```

## Auto-Fix Mode

```
/debug-plugin --fix my-plugin@my-marketplace
```

Automatically applies fixes:
- Registers plugin in installed_plugins.json
- Removes invalid fields from plugin.json
- Corrects marketplace source format
- Adds missing marketplace metadata

## Debug Report

Generates comprehensive report:

```markdown
# Plugin Debug Report: my-plugin@my-marketplace

Generated: 2025-11-16 15:30:00

## Summary
- Status: ❌ Not Loading
- Errors: 3 critical, 1 warning
- Registry: Not registered
- Files: Present
- Marketplace: Partially configured

## Issues Found

### Critical
1. Invalid component paths in plugin.json
   - Location: .claude-plugin/plugin.json:24-26
   - Fix: Remove "agents", "commands", "skills" fields

2. Not registered in system
   - Location: ~/.claude/plugins/installed_plugins.json
   - Fix: Add plugin entry with proper metadata

3. Marketplace source format incorrect
   - Location: ~/.claude/plugins/known_marketplaces.json
   - Fix: Change "git" to "github" source type

### Warnings
1. Large README file (2.5MB)
   - Consider splitting documentation

## Debug Log Excerpts

[ERROR] Plugin not available for MCP: my-plugin@my-marketplace
[DEBUG] Validation errors: agents: Invalid input: must end with ".md"

## Recommended Actions

1. Run: /validate --fix my-plugin
2. Remove invalid fields from plugin.json
3. Register plugin in system (or use --fix flag)
4. Restart Claude Code
5. Verify in plugin manager
```

## Integration with Validate Command

```
/debug-plugin my-plugin  # Finds issues
/validate --fix my-plugin  # Fixes structure issues
/debug-plugin --fix my-plugin  # Fixes system registration
```

## Log Analysis

Automatically checks these log locations:
- `~/.claude/debug/latest` - Current session
- `~/.claude/debug/*.txt` - Recent sessions
- Filters for plugin-specific errors
- Identifies patterns in failure modes

## Exit Codes

- `0` - No issues (plugin loads correctly)
- `1` - Critical issues preventing loading
- `2` - Warnings (plugin may load but has issues)
- `3` - Plugin not found

## Notes

- Always check logs after restarting Claude Code
- Some issues require restart to verify fix
- Use --verbose for full debug log output
- Save reports for troubleshooting history
