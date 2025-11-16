# Moodle Plugin Marketplace for Claude Code

A curated collection of Claude Code plugins for Moodle development, server administration, and plugin creation.

## 📦 Available Plugins

### 1. **moodle-dev-pro** - Comprehensive Moodle Development
Professional Moodle plugin and theme development with multi-version Docker support, accessibility focus, and UX best practices.

**Features:**
- 🏗️ **Commands**: `/task`, `/implement`, `/git`, `/test`, `/troubleshoot`
- 🤖 **Agents**: Moodle Architect, Accessibility Specialist (WCAG 2.1 AA), Docker Operations
- 🎯 **Skills**: PSR-12 Moodle Standards, WCAG Validator
- 🪝 **Hooks**: Pre-commit validation, auto-formatting, accessibility reminders
- 📱 **Mobile App Support**: Moodle Mobile app compatibility checking
- 🔄 **Multi-Version**: Support for Moodle 4.1, 4.5, 5.1 parallel development

### 2. **plugin-forge** - Meta-Plugin Development Tool
Create, validate, and test Claude Code plugins with scaffolding and best practices enforcement.

**Features:**
- 🏗️ **Commands**: `/plugin-new`, `/plugin-validate`
- 🤖 **Agents**: Plugin Architect
- ⚡ **Capabilities**:
  - Scaffold new plugin structures
  - Validate plugin.json manifests
  - Generate commands, agents, and skills templates
  - Best practices enforcement

### 3. **server-ops** - Server Administration & DevOps
Server management, Docker automation, monitoring, and DevOps tasks for multi-version Moodle environments.

**Features:**
- 🏗️ **Commands**: `/monitor`, `/logs`, `/moodle-cache`
- 🤖 **Agents**: Server Admin
- 🎯 **Skills**: Defensive Bash scripting
- 🐳 **Docker**: Multi-container management and troubleshooting
- 📊 **Monitoring**: System resources, logs, performance

---

## 🚀 Installation

### Step 1: Add Marketplace to Claude Code

```bash
/plugin marketplace add https://github.com/astoeffer/moodle-plugin-marketplace
```

### Step 2: Install Plugins

Install all three plugins:

```bash
/plugin install moodle-dev-pro@moodle-plugin-marketplace
/plugin install plugin-forge@moodle-plugin-marketplace
/plugin install server-ops@moodle-plugin-marketplace
```

Or install only what you need:

```bash
# For Moodle development only
/plugin install moodle-dev-pro@moodle-plugin-marketplace

# For plugin development only
/plugin install plugin-forge@moodle-plugin-marketplace

# For server administration only
/plugin install server-ops@moodle-plugin-marketplace
```

### Step 3: Restart Claude Code

Exit Claude Code completely and restart to activate the plugins.

### Step 4: Verify Installation

```bash
/plugin
```

You should see all installed plugins listed.

---

## 📖 Usage Examples

### Moodle Development (moodle-dev-pro)

```bash
# Implement a new feature with PSR-12 compliance
/implement "Add file picker to activity module settings"

# Run comprehensive tests
/test --phpunit --behat --codechecker

# Troubleshoot an issue
/troubleshoot "Plugin shows 'Missing from disk' error"

# Manage git workflow
/git commit "Add multilanguage support"

# Complex task management
/task "Create web service API for mobile app"
```

**Using Agents:**
- "Use Moodle Architect to design a new activity module structure"
- "Use Accessibility Specialist to audit my template for WCAG 2.1 AA compliance"
- "Use Docker Operations to troubleshoot PHP-FPM socket issues"

### Plugin Development (plugin-forge)

```bash
# Create a new Claude Code plugin
/plugin-new my-awesome-plugin

# Validate plugin structure
/plugin-validate ./my-plugin
```

**Using Agents:**
- "Use Plugin Architect to design a command structure for my plugin"

### Server Operations (server-ops)

```bash
# Monitor system resources
/monitor

# View logs with filtering
/logs nginx --tail 100 --follow

# Purge Moodle cache across all versions
/moodle-cache purge --all
```

**Using Agents:**
- "Use Server Admin to diagnose why Moodle 4.5 is responding slowly"

---

## 🔧 Requirements

- **Claude Code**: Latest version
- **Moodle Environment** (for moodle-dev-pro):
  - Docker with multi-version Moodle setup (4.1, 4.5, 5.1)
  - PHP 8.1-8.3
  - MariaDB/MySQL
  - Nginx or Apache

---

## 🎯 Use Cases

### For Moodle Plugin Developers
✅ **moodle-dev-pro** + **plugin-forge**
- Develop plugins with PSR-12 compliance
- Test across multiple Moodle versions
- Ensure WCAG 2.1 AA accessibility
- Create additional Claude Code plugins for your workflow

### For Moodle Theme Developers
✅ **moodle-dev-pro**
- Build accessible themes
- Test responsive designs
- Validate mobile app compatibility
- Enforce UX best practices

### For DevOps/System Administrators
✅ **server-ops** + **moodle-dev-pro**
- Manage multi-version Moodle instances
- Monitor server resources
- Troubleshoot Docker containers
- Automate deployment tasks

### For Claude Code Plugin Developers
✅ **plugin-forge**
- Create new plugins with proper structure
- Validate manifests and configurations
- Follow Claude Code best practices

---

## 📚 Documentation

Each plugin includes comprehensive documentation:

- **moodle-dev-pro**: `/opt/moodle-dev/moodle-plugins-marketplace/moodle-dev-pro/README.md`
- **plugin-forge**: `/opt/moodle-dev/moodle-plugins-marketplace/plugin-forge/README.md`
- **server-ops**: `/opt/moodle-dev/moodle-plugins-marketplace/server-ops/README.md`

---

## 🤝 Contributing

### Reporting Issues
Open an issue on GitHub: https://github.com/astoeffer/moodle-plugin-marketplace/issues

### Contributing Plugins
1. Fork this repository
2. Add your plugin to the appropriate directory
3. Update `.claude-plugin/marketplace.json`
4. Submit a pull request

### Plugin Structure Requirements
```
your-plugin/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── commands/               # Optional: Command definitions
│   └── *.md
├── agents/                 # Optional: Agent definitions
│   └── *.md
├── skills/                 # Optional: Skill definitions
│   └── */SKILL.md
├── hooks/                  # Optional: Hooks configuration
│   └── hooks.json
└── README.md              # Plugin documentation
```

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 👤 Author

**Andreas Stöffer**
- Email: andreas@learnforge.de
- GitHub: [@astoeffer](https://github.com/astoeffer)

---

## 🙏 Acknowledgments

Built with [Claude Code](https://claude.com/claude-code) by Anthropic

---

## 🔗 Links

- **Repository**: https://github.com/astoeffer/moodle-plugin-marketplace
- **Issues**: https://github.com/astoeffer/moodle-plugin-marketplace/issues
- **Claude Code Documentation**: https://docs.claude.com/claude-code

---

## 📊 Plugin Overview

| Plugin | Commands | Agents | Skills | Hooks | Size |
|--------|----------|--------|--------|-------|------|
| **moodle-dev-pro** | 6 | 3 | 2 | ✓ | Large |
| **plugin-forge** | 2 | 1 | 0 | ✗ | Small |
| **server-ops** | 3 | 1 | 1 | ✗ | Small |

---

## 🚦 Version Compatibility

| Plugin | Claude Code | Status |
|--------|-------------|--------|
| moodle-dev-pro v1.0.0 | Latest | ✅ Stable |
| plugin-forge v1.0.0 | Latest | ✅ Stable |
| server-ops v1.0.0 | Latest | ✅ Stable |

---

**Happy Coding! 🚀**
