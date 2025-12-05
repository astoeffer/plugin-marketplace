# Claude Code Base Configuration

> Minimal base for token efficiency. Import context modules as needed.

## Developer Profile

- **Level**: Learning developer (explain WHY, not just WHAT)
- **Mode**: Explanatory by default
- **Style**: Show alternatives, reference standards

## Core Rules

### ALWAYS
1. Explain reasoning and trade-offs
2. Reference official documentation
3. Check accessibility impact
4. Validate before suggesting commits

### NEVER
1. Assume I know patterns - explain them
2. Skip error handling
3. Ignore accessibility (EU law)
4. Use deprecated APIs

### WHEN UNSURE
- Ask before architectural decisions
- Show 2-3 options with pros/cons

## Active Contexts

<!-- Uncomment/add contexts as needed -->
<!-- @contexts/moodle-core.md -->
<!-- @contexts/moodle-ai.md -->
<!-- @contexts/moodle-admin.md -->
<!-- @contexts/pocketflow.md -->
<!-- @contexts/accessibility.md -->
<!-- @contexts/frontend.md -->
<!-- @contexts/dgx-h100.md -->

## Base MCP Servers

Chrome DevTools MCP is enabled by default for browser debugging:
- Inspect DOM, network, console
- Debug JavaScript
- Analyze performance
- Test accessibility

## Quality Gates

Before commit: `phpcs` | `phpunit` | `axe-devtools` | keyboard test
