---
name: test
description: Test plugin components in isolation or integration
argument-hint: [component-type] [component-name]
---

# Test Plugin Components

Test individual plugin components or run integration tests.

## Arguments
- **Component type:** $1 (command, agent, skill, hook, or "all")
- **Component name:** $2 (optional, tests all of type if omitted)

## Test Types

### 1. Command Testing
Test that a command:
- [ ] Has valid frontmatter
- [ ] Arguments are properly documented
- [ ] Instructions are clear and actionable
- [ ] No syntax errors in markdown

**Test command:**
```bash
# Dry-run the command
claude --dry-run /plugin-name:command-name test-arg
```

### 2. Agent Testing
Test that an agent:
- [ ] Has valid frontmatter
- [ ] Tools listed are available
- [ ] Model is valid
- [ ] System prompt is well-formed
- [ ] Can be spawned successfully

**Test agent:**
```bash
# Test agent spawn
claude task --agent plugin-name:agent-name "Test task"
```

### 3. Skill Testing
Test that a skill:
- [ ] Has valid SKILL.md
- [ ] Activation triggers work
- [ ] Allowed tools are valid
- [ ] Instructions are clear

**Test skill:**
```bash
# Trigger skill manually
claude skill plugin-name:skill-name
```

### 4. Hook Testing
Test that hooks:
- [ ] JSON is valid
- [ ] Commands execute successfully
- [ ] Timeouts are reasonable
- [ ] Exit codes are correct

**Test hooks:**
```bash
# Test hook command directly
bash -c "<hook-command>"
```

## Integration Testing

Run all tests for the entire plugin:

```
/plugin-dev:test all
```

This will:
1. Validate plugin structure
2. Test each command
3. Test each agent
4. Test each skill
5. Test each hook
6. Report results

## Output Format

```
Plugin Test Report: <plugin-name>
==================================

Commands:
  ✅ scaffold - passed
  ✅ validate - passed
  ⚠️  publish - warning (missing example)

Agents:
  ✅ plugin-architect - passed

Skills:
  ✅ plugin-validator - passed

Hooks:
  ✅ SessionStart - passed

Summary: 5 passed, 1 warning, 0 failed
```
