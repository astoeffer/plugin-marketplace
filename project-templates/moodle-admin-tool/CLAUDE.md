# Project: Moodle Admin Tool

> Auto-configured for Moodle admin plugins with webservices and reporting.

## Active Contexts
@~/.claude/contexts/moodle-core.md
@~/.claude/contexts/moodle-admin.md

## Project Specifics

**Plugin Type**: local|tool
**Frankenstyle**: [local_pluginname|tool_pluginname]
**Features**: [Webservices|Reports|Scheduled Tasks]

## Enabled Plugins
- moodle-admin (webservices, reporting, analytics)

## Webservice Naming
```
{component}_{verb}_{noun}
Example: local_myplugin_get_report
```

## Quality Gates
```bash
vendor/bin/phpcs --standard=moodle .
vendor/bin/phpunit
# Test webservices manually or via integration tests
```
