---
description: Auto-fix common plugin structure issues
argument-hint: <plugin-path> [--dry-run]
allowed-tools: Read, Write, Glob, Grep, Bash
---

# Fix Plugin Structure

Auto-fix common Claude Code plugin structure issues at: $ARGUMENTS

## Fixes Applied

### 1. Convert Flat Skills to Directory Format

**Before:** `skills/my-skill.md`
**After:** `skills/my-skill/SKILL.md`

Process:
1. Read content of `skills/*.md` files
2. Create `skills/skill-name/` directory
3. Move content to `SKILL.md`
4. Add frontmatter if missing
5. Delete original flat file

### 2. Add Missing Frontmatter

For skills without proper frontmatter:
```yaml
---
name: [derived from filename]
description: [extracted from first paragraph or prompt user]
---
```

For agents without proper frontmatter:
```yaml
---
name: [derived from filename]
description: [extracted from content or prompt user]
tools: Read, Grep, Glob, Bash
model: sonnet
---
```

### 3. Remove Empty Directories

Remove directories with no content:
- Empty `agents/`
- Empty `commands/`
- Empty `hooks/`

### 4. Fix Directory Location

Move directories from inside `.claude-plugin/` to plugin root:
- `.claude-plugin/commands/` → `commands/`
- `.claude-plugin/agents/` → `agents/`
- `.claude-plugin/skills/` → `skills/`

### 5. Fix plugin.json

Add missing required fields:
- `name` (derived from directory name)
- `description` (prompt user)
- `version` (default "1.0.0")
- `author.name` (prompt user)

## Dry Run Mode

If `--dry-run` is specified:
- Report all issues found
- Show what changes WOULD be made
- Do NOT modify any files

## Output

For each fix:
```
[FIX] Description of what was fixed
  - From: original state
  - To: new state
```

At the end, summarize:
- Files modified: X
- Files created: X
- Files deleted: X
- Directories removed: X

Recommend running `/pb:validate` after fixes to verify.
