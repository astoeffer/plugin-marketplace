---
name: validate
description: Validate Claude Code plugin structure, manifest, and components
argument-hint: [plugin-directory]
---

# Validate Plugin

Thoroughly validate a Claude Code plugin for correctness and best practices.

## Arguments
- **Plugin directory:** $1 (default: current directory)

## Validation Checks

### 1. Structure Validation
- [ ] `.claude-plugin/plugin.json` exists
- [ ] Plugin name matches directory name
- [ ] Version follows semver format
- [ ] Description is present and meaningful (10-1024 chars)

### 2. Manifest Validation (plugin.json)
Required fields:
- `name` (string, kebab-case)
- `version` (string, semver)
- `description` (string, 10-1024 chars)

Optional but recommended:
- `author.name` (string)
- `author.email` (valid email)
- `keywords` (array of strings)
- `license` (string, valid SPDX identifier)

### 3. Commands Validation
For each `.md` file in commands/:
- [ ] Has valid YAML frontmatter
- [ ] `name` field matches filename (without .md)
- [ ] `description` is present (max 200 chars)
- [ ] Content provides clear instructions

### 4. Agents Validation
For each `.md` file in agents/:
- [ ] Has valid YAML frontmatter
- [ ] Required: `name`, `description`
- [ ] `tools` lists valid tool names
- [ ] `model` is valid (sonnet, opus, haiku)
- [ ] System prompt is well-structured

### 5. Skills Validation
For each skill in skills/:
- [ ] Has SKILL.md with valid frontmatter
- [ ] `name` and `description` present
- [ ] `allowed-tools` lists valid tools
- [ ] Activation conditions are clear

### 6. Hooks Validation
If hooks/hooks.json exists:
- [ ] Valid JSON structure
- [ ] Hook types are valid (SessionStart, PreToolUse, PostToolUse, etc.)
- [ ] Matchers are valid patterns
- [ ] Commands are safe and have timeouts

## Output Format

```
Plugin Validation Report: <plugin-name>
========================================

✅ Structure: Valid
✅ Manifest: Valid (all required fields present)
⚠️  Commands: 2 issues found
   - example.md: description exceeds 200 chars
   - helper.md: missing name field
✅ Agents: Valid
✅ Skills: Valid
❌ Hooks: Invalid
   - hooks.json: invalid JSON at line 15

Summary: 2 warnings, 1 error
```

## Exit Codes
- 0: All validations passed
- 1: Warnings only (plugin usable)
- 2: Errors found (plugin may not work)
