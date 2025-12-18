---
description: Validate plugin structure against Claude Code requirements
argument-hint: <plugin-path>
allowed-tools: Read, Glob, Grep
---

# Validate Plugin Structure

Validate the Claude Code plugin at the specified path: $ARGUMENTS

## Validation Checklist

Perform these checks and report all issues found:

### 1. Plugin Manifest
- [ ] `.claude-plugin/plugin.json` exists
- [ ] JSON is valid
- [ ] Required fields present: name, description, version, author.name
- [ ] Name follows pattern: lowercase, alphanumeric, hyphens only

### 2. Skills
- [ ] Skills use directory format: `skills/skill-name/SKILL.md`
- [ ] No flat skill files (`skills/name.md`)
- [ ] Each SKILL.md has valid YAML frontmatter
- [ ] Frontmatter includes required: name, description
- [ ] Description is under 1024 characters

### 3. Commands
- [ ] Command files end with `.md`
- [ ] Commands are in `commands/` at plugin root (not in .claude-plugin/)
- [ ] Frontmatter YAML is valid if present

### 4. Agents
- [ ] Agent files end with `.md`
- [ ] Agents are in `agents/` at plugin root
- [ ] Each agent has name and description in frontmatter

### 5. Structure
- [ ] No directories inside `.claude-plugin/` (except plugin.json)
- [ ] No empty directories (agents/, commands/ without content)
- [ ] README.md exists (recommended)

## Output Format

Report findings as:

**PASS**: [check description]
**FAIL**: [check description] - [specific issue and fix]
**WARN**: [check description] - [recommendation]

At the end, provide a summary:
- Total checks: X
- Passed: X
- Failed: X
- Warnings: X

If any FAIL issues exist, suggest using `/pb:fix` to auto-repair.
