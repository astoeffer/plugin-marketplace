# Modular Loading Demonstration

This document demonstrates how the modular CLAUDE.md system works for token efficiency.

## Scenario 1: Moodle Plugin Development

**Project**: Create a new Moodle activity module

### Step 1: Copy Template
```bash
mkdir -p /path/to/mod_myactivity/.claude
cp project-templates/moodle-plugin/CLAUDE.md /path/to/mod_myactivity/.claude/CLAUDE.md
```

### Step 2: Template Contents (loaded automatically)
```markdown
# Project: Moodle Plugin Development

## Active Contexts
@~/.claude/contexts/moodle-core.md    ← PSR-12, Frankenstyle (~1,200 tokens)
@~/.claude/contexts/accessibility.md  ← WCAG, EN 301 549 (~800 tokens)

## Project Specifics
**Plugin Type**: mod
**Frankenstyle**: mod_myactivity
```

### Token Impact
- **Without modular**: ~8,000 tokens (full CLAUDE.md)
- **With modular**: ~2,500 tokens (base + 2 contexts)
- **Savings**: 69%

---

## Scenario 2: AI Chatbot on DGX H100

**Project**: Adapt ai-gateway-standalone for DGX H100 cluster

### Step 1: Copy Template
```bash
mkdir -p /path/to/dgx-chatbot/.claude
cp project-templates/dgx-h100-app/CLAUDE.md /path/to/dgx-chatbot/.claude/CLAUDE.md
```

### Step 2: Template Contents
```markdown
# Project: DGX-H100 AI Application

## Active Contexts
@~/.claude/contexts/pocketflow.md     ← Node/Flow patterns (~1,000 tokens)
@~/.claude/contexts/dgx-h100.md       ← SLURM, Docker, GPUs (~1,200 tokens)
@~/.claude/contexts/accessibility.md  ← WCAG, EN 301 549 (~800 tokens)
```

### Token Impact
- **Without modular**: ~8,000 tokens
- **With modular**: ~3,500 tokens (base + 3 contexts)
- **Savings**: 56%

---

## Scenario 3: Moodle Admin Tool

**Project**: Create webservice-based reporting tool

### Step 1: Copy Template
```bash
mkdir -p /path/to/local_myreport/.claude
cp project-templates/moodle-admin-tool/CLAUDE.md /path/to/local_myreport/.claude/CLAUDE.md
```

### Step 2: Template Contents
```markdown
# Project: Moodle Admin Tool

## Active Contexts
@~/.claude/contexts/moodle-core.md    ← PSR-12, APIs (~1,200 tokens)
@~/.claude/contexts/moodle-admin.md   ← Webservices, reporting (~800 tokens)
```

### Token Impact
- **Without modular**: ~8,000 tokens
- **With modular**: ~2,500 tokens (base + 2 contexts)
- **Savings**: 69%

---

## How It Works

### Context Loading Flow

```
┌────────────────────────────────────────────────────────────┐
│ 1. Claude Code starts in project folder                    │
│    └── Reads .claude/CLAUDE.md                            │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ 2. Parses @import directives                              │
│    @~/.claude/contexts/moodle-core.md                     │
│    @~/.claude/contexts/accessibility.md                   │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ 3. Loads only specified context modules                   │
│    ✓ moodle-core.md (1,200 tokens)                        │
│    ✓ accessibility.md (800 tokens)                        │
│    ✗ moodle-ai.md (not needed)                            │
│    ✗ pocketflow.md (not needed)                           │
│    ✗ dgx-h100.md (not needed)                             │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ 4. Total context: ~2,500 tokens (vs 8,000 full)           │
│    69% token savings                                       │
└────────────────────────────────────────────────────────────┘
```

### Dynamic Context Addition

If you're working on a Moodle plugin and need to add AI features:

```markdown
# In .claude/CLAUDE.md, add:
@~/.claude/contexts/moodle-ai.md      ← Add AI subsystem context
```

Context grows only when needed:
- Start: 2,500 tokens
- Add AI: 3,500 tokens
- Still 56% savings vs full CLAUDE.md

---

## Token Budget by Project Type

| Project Type | Contexts Loaded | Tokens | Savings |
|--------------|-----------------|--------|---------|
| Basic Moodle | moodle-core, accessibility | ~2,500 | 69% |
| Moodle + AI | moodle-core, moodle-ai, accessibility | ~3,500 | 56% |
| Admin Tool | moodle-core, moodle-admin | ~2,500 | 69% |
| AI Chatbot | pocketflow, frontend, accessibility | ~2,900 | 64% |
| DGX H100 App | pocketflow, dgx-h100, accessibility | ~3,500 | 56% |
| Full Stack | All contexts | ~7,000 | 13% |

---

## Plugin MCP Integration

When a plugin is installed, its MCP servers activate automatically:

```
┌────────────────────────────────────────────────────────────┐
│ Plugin: ai-app-dev                                         │
├────────────────────────────────────────────────────────────┤
│ Skills:                                                    │
│   ├── pocketflow-patterns                                  │
│   └── chatbot-integration                                  │
│                                                            │
│ MCP Servers (auto-configured):                            │
│   ├── context7 (library docs)                              │
│   ├── tavily (web search)                                  │
│   └── serena (code analysis)                               │
└────────────────────────────────────────────────────────────┘
```

---

## Best Practices

1. **Start minimal**: Begin with 1-2 contexts, add as needed
2. **Project templates**: Use templates for consistent setup
3. **Share contexts**: Same context files across all projects
4. **Plugin for MCPs**: Let plugins manage MCP configuration
5. **Budget monitoring**: Keep total under 5K tokens for efficiency

---

## Verification Commands

```bash
# List available contexts
ls ~/.claude/contexts/

# Check project template
cat project-templates/moodle-plugin/CLAUDE.md

# Estimate tokens (rough)
wc -w ~/.claude/contexts/*.md  # ~1 token per word

# Verify plugin structure
tree plugins/moodle-dev-pro/
```
