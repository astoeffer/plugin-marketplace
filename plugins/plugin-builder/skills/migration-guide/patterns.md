# Migration Patterns Reference

Common patterns and solutions for plugin migration.

## Pattern: Bulk Skill Conversion

Convert all flat skill files at once:

```bash
# For each .md file directly in skills/
for file in skills/*.md; do
  # Extract base name
  name=$(basename "$file" .md)

  # Create directory
  mkdir -p "skills/$name"

  # Move file
  mv "$file" "skills/$name/SKILL.md"

  echo "Converted: $name"
done
```

## Pattern: Frontmatter Injection

Add frontmatter to files that lack it:

```python
import os
import re

def add_frontmatter(filepath, name):
    with open(filepath, 'r') as f:
        content = f.read()

    # Check if frontmatter exists
    if content.startswith('---'):
        return False

    # Extract first paragraph for description
    lines = content.split('\n')
    desc_lines = []
    for line in lines:
        if line.strip() and not line.startswith('#'):
            desc_lines.append(line.strip())
            if len(' '.join(desc_lines)) > 100:
                break

    description = ' '.join(desc_lines)[:200]

    # Create frontmatter
    frontmatter = f'''---
name: {name}
description: {description}
---

'''

    # Write back
    with open(filepath, 'w') as f:
        f.write(frontmatter + content)

    return True
```

## Pattern: Description Quality Check

Evaluate if description needs improvement:

```python
def needs_better_description(description):
    issues = []

    # Too short
    if len(description) < 20:
        issues.append("Description too short (< 20 chars)")

    # Too long
    if len(description) > 1024:
        issues.append("Description too long (> 1024 chars)")

    # Missing trigger phrases
    trigger_words = ['when', 'use', 'for', 'helps', 'provides']
    if not any(word in description.lower() for word in trigger_words):
        issues.append("Missing trigger phrases (when/use/for)")

    # Too vague
    vague_phrases = ['helps with things', 'does stuff', 'general purpose']
    if any(phrase in description.lower() for phrase in vague_phrases):
        issues.append("Description is too vague")

    return issues
```

## Pattern: Directory Structure Validation

Verify plugin follows correct structure:

```python
def validate_structure(plugin_path):
    issues = []

    # Check plugin.json location
    manifest = os.path.join(plugin_path, '.claude-plugin', 'plugin.json')
    if not os.path.exists(manifest):
        issues.append("Missing .claude-plugin/plugin.json")

    # Check no directories in .claude-plugin
    claude_plugin_dir = os.path.join(plugin_path, '.claude-plugin')
    if os.path.exists(claude_plugin_dir):
        for item in os.listdir(claude_plugin_dir):
            item_path = os.path.join(claude_plugin_dir, item)
            if os.path.isdir(item_path):
                issues.append(f"Directory in .claude-plugin/: {item}")

    # Check skill format
    skills_dir = os.path.join(plugin_path, 'skills')
    if os.path.exists(skills_dir):
        for item in os.listdir(skills_dir):
            item_path = os.path.join(skills_dir, item)
            if os.path.isfile(item_path) and item.endswith('.md'):
                issues.append(f"Flat skill file: skills/{item}")
            elif os.path.isdir(item_path):
                skill_md = os.path.join(item_path, 'SKILL.md')
                if not os.path.exists(skill_md):
                    issues.append(f"Missing SKILL.md in skills/{item}/")

    return issues
```

## Pattern: Safe File Operations

Perform migrations with backup:

```python
import shutil
from datetime import datetime

def safe_migrate(plugin_path):
    # Create backup
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = f"{plugin_path}_backup_{timestamp}"
    shutil.copytree(plugin_path, backup_path)

    try:
        # Perform migration
        migrate_skills(plugin_path)
        migrate_structure(plugin_path)
        add_missing_frontmatter(plugin_path)

        # Validate
        issues = validate_structure(plugin_path)
        if issues:
            raise Exception(f"Validation failed: {issues}")

        # Success - remove backup
        shutil.rmtree(backup_path)
        return True

    except Exception as e:
        # Restore from backup
        shutil.rmtree(plugin_path)
        shutil.move(backup_path, plugin_path)
        raise e
```

## Pattern: YAML Frontmatter Parsing

Extract and validate frontmatter:

```python
import re

def parse_frontmatter(content):
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return None, content

    frontmatter_text = match.group(1)
    body = content[match.end():].strip()

    # Parse YAML-like frontmatter
    frontmatter = {}
    for line in frontmatter_text.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            frontmatter[key.strip()] = value.strip()

    return frontmatter, body

def validate_skill_frontmatter(frontmatter):
    errors = []

    if not frontmatter:
        errors.append("No frontmatter found")
        return errors

    if 'name' not in frontmatter:
        errors.append("Missing 'name' field")
    elif not re.match(r'^[a-z][a-z0-9-]*$', frontmatter['name']):
        errors.append("Invalid name format")

    if 'description' not in frontmatter:
        errors.append("Missing 'description' field")
    elif len(frontmatter['description']) > 1024:
        errors.append("Description exceeds 1024 characters")

    return errors
```

## Pattern: Report Generation

Generate migration report:

```markdown
# Migration Report

**Plugin:** [plugin-name]
**Date:** [timestamp]
**Status:** [Success/Failed]

## Changes Made

### Skills Converted
- `my-skill.md` → `my-skill/SKILL.md`
- `another.md` → `another/SKILL.md`

### Frontmatter Added
- `skills/my-skill/SKILL.md`
- `agents/validator.md`

### Directories Moved
- `.claude-plugin/commands/` → `commands/`

### Empty Directories Removed
- `agents/` (was empty)

## Validation Results

- [ ] plugin.json valid
- [ ] All skills have SKILL.md
- [ ] All skills have frontmatter
- [ ] No flat skill files
- [ ] No directories in .claude-plugin/

## Recommendations

1. [Any remaining issues]
2. [Suggested improvements]
```
