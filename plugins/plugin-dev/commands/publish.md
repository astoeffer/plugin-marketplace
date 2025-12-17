---
name: publish
description: Prepare and publish a plugin to a marketplace repository
argument-hint: [plugin-directory] [--marketplace <url>]
---

# Publish Plugin

Prepare a plugin for distribution and publish to a marketplace.

## Arguments
- **Plugin directory:** $1 (default: current directory)
- **Marketplace:** --marketplace <url> (optional)

## Pre-publish Checklist

Before publishing, verify:

### 1. Plugin Quality
- [ ] Run `/plugin-dev:validate` - must pass with no errors
- [ ] README.md is comprehensive
- [ ] All components have descriptions
- [ ] No sensitive data in files

### 2. Version Management
- [ ] Version in plugin.json is updated
- [ ] CHANGELOG.md exists (recommended)
- [ ] Git tag matches version

### 3. Documentation
- [ ] Installation instructions clear
- [ ] Usage examples provided
- [ ] All commands/agents documented

## Publishing Steps

1. **Validate plugin**
   ```
   /plugin-dev:validate .
   ```

2. **Update version if needed**
   Prompt user to bump version: patch, minor, or major

3. **Generate distribution files**
   - Ensure all paths in plugin.json are relative
   - Verify no absolute paths or local references

4. **Create git commit and tag**
   ```bash
   git add .
   git commit -m "Release v<version>"
   git tag v<version>
   ```

5. **Push to repository**
   ```bash
   git push origin main --tags
   ```

6. **Update marketplace manifest** (if applicable)
   Add/update entry in marketplace.json:
   ```json
   {
     "name": "<plugin-name>",
     "description": "<description>",
     "version": "<version>",
     "path": "plugins/<plugin-name>"
   }
   ```

## Success Output

```
✅ Plugin Published Successfully!

Plugin: <plugin-name> v<version>
Repository: <git-url>
Tag: v<version>

Installation:
  claude plugin install <git-url>

Marketplace Registration:
  [Instructions for marketplace registration]
```
