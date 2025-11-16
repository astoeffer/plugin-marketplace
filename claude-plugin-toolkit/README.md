# Claude Plugin Toolkit

**Version**: 1.0.0
**Built from**: Real-world plugin debugging experience

Comprehensive toolkit for developing, validating, and testing Claude Code plugins. Every feature is based on actual debugging of plugin loading failures and system internals.

---

## Why This Plugin Exists

While developing the moodle-plugins-marketplace, we encountered multiple plugin loading failures:
- Validation errors: "agents: Invalid input: must end with .md"
- Invisible marketplaces in plugin manager UI
- Plugins not loading despite correct file structure
- "Generic error" messages with no clear cause

This plugin embodies **all lessons learned** from solving these real-world issues.

---

## Features

### Commands

#### `/scaffold [plugin-name]`
Create a new plugin with proper structure and validation-compliant configuration.

**What it prevents**:
- ❌ Invalid component paths in plugin.json
- ❌ Missing required metadata fields
- ❌ Incorrect directory structure
- ❌ Common validation errors

**Example**:
```bash
/scaffold my-awesome-plugin

✅ Created: my-awesome-plugin/
   ├── .claude-plugin/plugin.json (metadata only - NO paths!)
   ├── commands/example.md
   ├── agents/helper.md
   └── skills/best-practices/SKILL.md
```

#### `/validate [plugin-path]`
Validate plugin structure against Claude Code requirements.

**Checks**:
- ✅ plugin.json structure and required fields
- ✅ NO invalid component path specifications
- ✅ Component files follow naming conventions
- ✅ JSON syntax in all config files
- ✅ Marketplace configuration (if applicable)

**Example**:
```bash
/validate ~/.claude/plugins/local/my-plugin

❌ Issues found:
  - plugin.json contains invalid "agents" field
  - Missing "version" field
  - marketplace.json missing $schema

/validate --fix my-plugin  # Auto-fix issues
```

#### `/debug-plugin [plugin-name]`
Debug plugin loading issues using system logs and configuration.

**Analyzes**:
- 🔍 Debug logs for error patterns
- 🔍 Plugin registration status
- 🔍 Marketplace configuration
- 🔍 File structure integrity

**Example**:
```bash
/debug-plugin my-plugin@my-marketplace

Found in debug logs:
  [ERROR] Plugin not available: my-plugin
  [DEBUG] Validation errors: agents: must end with ".md"

Root cause:
  → plugin.json line 15: Remove "agents": "./agents"
  → Components are auto-discovered, not manually specified

Fix applied: ✅
Restart Claude Code to reload.
```

---

### Agents

#### `plugin-architect`
Expert plugin designer for architecture and component planning.

**Use for**:
- Designing new plugins from requirements
- Planning component breakdown
- Structuring marketplaces
- Refactoring existing plugins

**Example**:
```
User: "I need a plugin for database migrations"

Agent: Designs complete architecture with:
- 3 commands (migrate, rollback, status)
- 2 agents (validator, analyzer)
- 1 skill (migration patterns)
- Complete file structure
- plugin.json template
```

---

### Skills

#### `plugin-best-practices`
Comprehensive knowledge base of plugin development patterns and pitfalls.

**Includes**:
- ✅ Critical validation rules
- ✅ Component design patterns
- ✅ Common pitfalls and fixes
- ✅ Performance best practices
- ✅ Security considerations
- ✅ Testing strategies

**Based on**: Actual debugging of plugin system internals

---

## Installation

### From Marketplace

```bash
# Add marketplace (if not already added)
/plugin add marketplace https://github.com/astoeffer/moodle-plugin-marketplace

# Install toolkit
/plugin install claude-plugin-toolkit@moodle-plugins-marketplace
```

### Manual Installation

```bash
# Clone repository
git clone https://github.com/astoeffer/moodle-plugin-marketplace.git

# Copy to plugins directory
cp -r moodle-plugin-marketplace/claude-plugin-toolkit ~/.claude/plugins/local/

# Restart Claude Code
```

---

## Quick Start

### Create Your First Plugin

```bash
# 1. Scaffold new plugin
/scaffold my-first-plugin

# 2. Edit components
cd my-first-plugin
# Edit commands/example.md, agents/helper.md, etc.

# 3. Validate structure
/validate my-first-plugin

# 4. Test locally
cp -r my-first-plugin ~/.claude/plugins/local/
# Restart Claude Code

# 5. Verify loading
/help  # Check if commands appear
```

### Debug Existing Plugin

```bash
# Plugin not loading?
/debug-plugin my-broken-plugin

# Fix issues automatically
/validate --fix my-broken-plugin
/debug-plugin --fix my-broken-plugin

# Restart and verify
# Restart Claude Code, then check plugin manager
```

---

## Critical Knowledge

### The Golden Rules

1. **plugin.json = Metadata Only**
   ```json
   {
     "name": "my-plugin",
     "version": "1.0.0",
     "description": "...",
     "author": {...}
   }
   ```
   **NO** "commands", "agents", "skills" paths!

2. **Components = Auto-Discovered**
   - Commands: `commands/*.md`
   - Agents: `agents/*.md`
   - Skills: `skills/*/SKILL.md`

3. **Marketplace Source = "github"**
   ```json
   {
     "source": {
       "source": "github",
       "repo": "owner/repo"
     }
   }
   ```
   **NOT** "git" with URL!

4. **Complete Metadata Required**
   - marketplace.json needs `$schema`, `version`, `description`
   - plugin.json needs `version`, `author.email`

5. **Registration Required**
   - Plugins must be in `installed_plugins.json`
   - Marketplaces must be in `known_marketplaces.json`

---

## Common Errors & Fixes

### Error 1: "Validation errors: agents: must end with .md"

**Cause**: plugin.json contains `"agents": "./agents"`

**Fix**: Remove ALL component path specifications from plugin.json

**Command**: `/validate --fix my-plugin`

---

### Error 2: Marketplace Not Visible in UI

**Cause**: Wrong source format in known_marketplaces.json

**Fix**: Change from "git" to "github" format

**Before**:
```json
"source": { "source": "git", "url": "..." }
```

**After**:
```json
"source": { "source": "github", "repo": "owner/repo" }
```

---

### Error 3: Plugin Exists But Invisible

**Cause**: Not registered in installed_plugins.json

**Fix**: Add plugin entry with proper metadata

**Command**: `/debug-plugin --fix my-plugin`

---

### Error 4: "Generic Error" in Debug Logs

**Causes**: Multiple possible issues
- Invalid component paths
- Missing metadata fields
- Incorrect file structure

**Fix**: Run full diagnostic

**Commands**:
```bash
/debug-plugin my-plugin    # Identify issues
/validate --fix my-plugin  # Fix structure
/debug-plugin --fix my-plugin  # Fix registration
```

---

## Real-World Example

### Problem
"My moodle-plugins-marketplace isn't showing up in plugin manager!"

### Investigation
```bash
/debug-plugin moodle-dev-pro@moodle-plugins-marketplace

Found 3 issues:
1. ❌ plugin.json has "agents": "./agents" → Validation error
2. ❌ marketplace.json missing $schema → Not recognized
3. ❌ known_marketplaces.json uses "git" → UI doesn't show it
```

### Solution
```bash
# Fix structure
/validate --fix moodle-plugins-marketplace/*

# Fix registration
/debug-plugin --fix moodle-dev-pro@moodle-plugins-marketplace

# Result: All 3 plugins now load correctly
✅ server-ops
✅ moodle-dev-pro
✅ plugin-forge
```

---

## Advanced Usage

### Creating a Marketplace

```bash
# 1. Design marketplace structure
/agent plugin-architect "Design marketplace for my 5 plugins"

# 2. Create marketplace.json
cat > marketplace.json <<EOF
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "my-marketplace",
  "version": "1.0.0",
  "description": "My plugin collection",
  "owner": { "name": "...", "email": "..." },
  "plugins": [...]
}
EOF

# 3. Validate
/validate marketplace.json

# 4. Publish to GitHub
git add . && git commit -m "Create marketplace"
git push
```

### Testing Workflow

```bash
# 1. Scaffold plugin
/scaffold test-plugin

# 2. Implement features
# ... edit files ...

# 3. Validate continuously
/validate test-plugin

# 4. Test locally
cp -r test-plugin ~/.claude/plugins/local/
# Restart Claude Code

# 5. Debug if needed
/debug-plugin test-plugin

# 6. Iterate until working
```

---

## Development Workflow

```
Design → Scaffold → Implement → Validate → Test → Debug → Publish
   ↓         ↓          ↓          ↓         ↓       ↓        ↓
architect  /scaffold   code    /validate  local  /debug   GitHub
```

---

## Best Practices

### File Organization
```
my-plugin/
├── .claude-plugin/
│   └── plugin.json          # Metadata only
├── commands/                 # User-invoked actions
│   ├── main-task.md
│   └── helper-task.md
├── agents/                   # AI-invoked helpers
│   ├── validator.md
│   └── optimizer.md
├── skills/                   # Background knowledge
│   └── domain-knowledge/
│       └── SKILL.md
├── references/               # Reference docs
│   └── api-docs.md
├── examples/                 # Usage examples
│   └── tutorial.md
└── README.md                 # Documentation
```

### Command Design
- Clear, action-oriented names
- Comprehensive usage instructions
- Error handling examples
- Related command references

### Agent Design
- Focused expertise domain
- Clear role definition
- Example interactions
- Integration patterns

### Skill Design
- Organized knowledge structure
- Practical examples
- Anti-patterns highlighted
- Regular updates

---

## Troubleshooting

### Plugin Not Loading
1. Check debug logs: `tail -f ~/.claude/debug/latest`
2. Run validation: `/validate my-plugin`
3. Check registration: `grep my-plugin ~/.claude/plugins/installed_plugins.json`
4. Debug thoroughly: `/debug-plugin my-plugin`

### Marketplace Invisible
1. Verify source format: "github" not "git"
2. Check metadata: $schema, version, description
3. Validate structure: `/validate marketplace.json`

### Commands Not Appearing
1. Verify file naming: `*.md` in `commands/`
2. Check frontmatter: YAML with name and description
3. Restart Claude Code to reload

---

## Contributing

Based on real debugging experience. If you encounter new issues:

1. Document the problem
2. Capture debug logs
3. Identify root cause
4. Add to validation checks
5. Update best practices
6. Submit PR

---

## License

MIT License - See LICENSE file

---

## Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: andreas@learnforge.de

---

## Acknowledgments

Built from debugging the moodle-plugins-marketplace plugin system, incorporating lessons from:
- Plugin validation error patterns
- Marketplace registration issues
- Component auto-discovery mechanisms
- Claude Code system internals

Every feature solves a real problem encountered during development.

---

**Remember**: This toolkit exists because we debugged the hard way. Use it to avoid making the same mistakes!
