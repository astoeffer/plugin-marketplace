# Project: Moodle Plugin Development

> Auto-configured for Moodle plugin development with PSR-12 and accessibility.

## Active Contexts
@~/.claude/contexts/moodle-core.md
@~/.claude/contexts/accessibility.md

## Project Specifics

**Plugin Type**: [mod|block|local|tool|...]
**Frankenstyle**: [plugintype_pluginname]
**Moodle Version**: 4.x+

## Enabled Plugins
- moodle-dev-pro (standards, accessibility)

## Quality Gates
```bash
# Before commit
vendor/bin/phpcs --standard=moodle .
vendor/bin/phpunit
```
