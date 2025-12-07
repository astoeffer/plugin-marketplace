# Project: Moodle AI Plugin Development

> Auto-configured for Moodle plugins with AI subsystem integration.

## Active Contexts
@~/.claude/contexts/moodle-core.md
@~/.claude/contexts/moodle-ai.md
@~/.claude/contexts/accessibility.md

## Project Specifics

**Plugin Type**: [local|mod|...]
**Frankenstyle**: [plugintype_pluginname]
**Moodle Version**: 4.5+ (AI Subsystem)
**AI Features**: [Actions|Providers|Placements]

## Enabled Plugins
- moodle-dev-pro (standards, AI integration, accessibility)

## AI Checklist
- [ ] User policy check implemented
- [ ] Action class with store() method
- [ ] Response class defined
- [ ] Database table created

## Quality Gates
```bash
vendor/bin/phpcs --standard=moodle .
vendor/bin/phpunit
```
