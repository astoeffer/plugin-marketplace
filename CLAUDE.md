# Claude Code Configuration for Learning Developer

> **Profile**: Learning developer building Moodle plugins and AI applications
> **Mode**: Explanatory - ALWAYS explain WHY, not just WHAT
> **Standards**: Moodle (PSR-12 + exceptions), PocketFlow, EU Accessibility (EN 301 549)

---

## Table of Contents

1. [Developer Profile](#developer-profile)
2. [Moodle Plugin Development](#moodle-plugin-development)
3. [PocketFlow / AI Agent Development](#pocketflow--ai-agent-development)
4. [EU Accessibility Requirements](#eu-accessibility-requirements)
5. [Frontend / UI Development](#frontend--ui-development)
6. [Behavioral Rules](#behavioral-rules)
7. [Quality Gates](#quality-gates)
8. [References](#references)

---

## Developer Profile

### About Me
- **Experience Level**: Learning developer (can read/adjust code, prefer guidance over assumptions)
- **Goal**: Build production-ready Moodle plugins and AI-based applications
- **Communication**: Technical terms in English, explanations can be detailed

### What I Need from Claude
1. **Explain decisions** - Show WHY this approach, not just HOW
2. **Show alternatives** - Present 2-3 options with trade-offs
3. **Reference standards** - Link to official documentation
4. **Comment complex code** - Help me understand patterns
5. **Be patient** - I'm learning, not rushing

### My Projects
| Project | Stack | Focus |
|---------|-------|-------|
| Moodle Plugins | PHP, JavaScript, MySQL | LMS extensions |
| Moodle Chatbot | PocketFlow, Python, iframe/widget | AI-powered chat |
| Frontend UIs | HTML, CSS, JS | Accessible interfaces |

---

## Moodle Plugin Development

### Coding Standards Overview

Moodle follows **PSR-12 and PSR-1** with specific exceptions. When Moodle rules differ from PSR, Moodle rules take precedence.

**Reference**: https://moodledev.io/general/development/policies/codingstyle

### PHP File Structure

```php
<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Short description of the file.
 *
 * Longer description if needed.
 *
 * @package    plugintype_pluginname
 * @copyright  2025 Your Name <your@email.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

// Your code here...
// NO closing ?> tag!
```

### Key Moodle Exceptions to PSR-12

| Rule | PSR-12 | Moodle |
|------|--------|--------|
| Line length | 120 chars | 132 ideal, 180 max |
| Array syntax | Both allowed | `[]` only (not `array()`) |
| Else if | `elseif` | `else if` (two words) |
| Closing tag | Optional | NEVER include `?>` |

### Naming Conventions

#### Variables
```php
// CORRECT
$courseid = 123;              // Lowercase, no underscores between words
$items = [];                  // Plural for arrays
$isvalid = true;              // Positive naming (not $isinvalid)

// WRONG
$course_id = 123;             // No underscores
$courseID = 123;              // No camelCase
$item = [];                   // Use plural for arrays
```

#### Functions (Legacy - outside classes)
```php
// Frankenstyle prefix required: {plugintype}_{pluginname}_functionname()
function mod_forum_get_discussions($forumid) {
    // Activity modules: just module name as prefix
}

function block_myblock_get_data($blockid) {
    // Other plugins: full frankenstyle
}
```

#### Classes
```php
// CORRECT - lowercase with underscores
class mod_forum_post_form extends moodleform {
}

// Classes MUST be in /classes directory for namespaces
// File: mod/forum/classes/post_form.php
namespace mod_forum;

class post_form extends \moodleform {
}
```

#### Constants
```php
// UPPERCASE with Frankenstyle prefix
define('MOD_FORUM_TRACKING_OFF', 0);
define('MOD_FORUM_TRACKING_ON', 1);
```

#### Files
- Lowercase only
- Whole English words
- Short but descriptive
- Extensions: `.php`, `.html`, `.js`, `.css`, `.xml`

### Control Structures

```php
// ALWAYS use braces, even for single lines
if ($condition) {
    do_something();
}

// else if as TWO WORDS (Moodle exception)
if ($a) {
    // code
} else if ($b) {
    // code
} else {
    // code
}

// Space before parenthesis in control structures
if ($condition) {    // CORRECT
if($condition) {     // WRONG

// NO space for function calls
do_something($param);   // CORRECT
do_something ($param);  // WRONG
```

### Type Hints (MANDATORY for new code)

```php
/**
 * Get user's full name.
 *
 * @param stdClass $user The user object
 * @param bool $override Whether to override format
 * @return string The formatted name
 */
public function get_fullname(stdClass $user, bool $override = false): string {
    // Implementation
}

// Nullable types
public function find_user(?int $userid): ?stdClass {
    if ($userid === null) {
        return null;
    }
    // ...
}
```

### PHPDoc Requirements

```php
/**
 * Class for handling forum posts.
 *
 * This class provides methods to create, read, update and delete
 * forum posts within a Moodle course.
 *
 * @package    mod_forum
 * @copyright  2025 Your Name <your@email.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class post_manager {

    /** @var int The forum instance ID */
    protected int $forumid;

    /** @var stdClass The current course object */
    protected stdClass $course;

    /**
     * Constructor.
     *
     * @param int $forumid The forum instance ID
     * @param stdClass $course The course object
     */
    public function __construct(int $forumid, stdClass $course) {
        $this->forumid = $forumid;
        $this->course = $course;
    }
}
```

### Essential Moodle APIs

| API | Purpose | When to Use |
|-----|---------|-------------|
| **DML API** | Database operations | Reading/writing to DB safely |
| **Output API** | HTML rendering | All page output |
| **Form API** | User input forms | Any user data collection |
| **String API** | Language strings | ALL user-facing text |
| **File API** | File handling | Upload/download/storage |
| **Access API** | Permissions | Capability checks |
| **Navigation API** | Menu structure | Adding navigation items |
| **Page API** | Page setup | $PAGE configuration |

### Database Operations (DML API)

```php
global $DB;

// Get single record
$user = $DB->get_record('user', ['id' => $userid], '*', MUST_EXIST);

// Get multiple records
$users = $DB->get_records('user', ['deleted' => 0], 'lastname ASC');

// Insert
$record = new stdClass();
$record->name = 'Test';
$record->timecreated = time();
$newid = $DB->insert_record('mytable', $record);

// Update
$record->id = $existingid;
$record->name = 'Updated';
$DB->update_record('mytable', $record);

// Delete
$DB->delete_records('mytable', ['id' => $recordid]);

// Custom SQL (use sparingly)
$sql = "SELECT u.id, u.firstname, u.lastname
          FROM {user} u
          JOIN {role_assignments} ra ON ra.userid = u.id
         WHERE ra.roleid = :roleid";
$users = $DB->get_records_sql($sql, ['roleid' => $roleid]);
```

### Language Strings

```php
// In lang/en/plugintype_pluginname.php
$string['pluginname'] = 'My Plugin';
$string['greeting'] = 'Hello {$a}!';
$string['items'] = 'You have {$a->count} items in {$a->location}.';

// Usage in code
echo get_string('pluginname', 'plugintype_pluginname');
echo get_string('greeting', 'plugintype_pluginname', $username);
echo get_string('items', 'plugintype_pluginname', (object)[
    'count' => 5,
    'location' => 'your basket'
]);
```

### Output API

```php
global $OUTPUT, $PAGE;

// Set up page
$PAGE->set_url(new moodle_url('/mod/myplugin/view.php', ['id' => $cmid]));
$PAGE->set_context($context);
$PAGE->set_title($title);
$PAGE->set_heading($course->fullname);

// Output
echo $OUTPUT->header();
echo $OUTPUT->heading(get_string('welcome', 'mod_myplugin'));
echo $OUTPUT->box('Content here');
echo $OUTPUT->footer();

// NEVER use echo for HTML directly in production code
// Always use renderers or templates
```

### Inline Comments Style

```php
// Single line comment with capital letter and period.

// TODO MDL-12345 This needs refactoring.

// Long comments should be wrapped at a reasonable length
// and continue on the next line with the same format.

/*
 * Multi-line block comments use this format
 * when explaining complex logic that spans
 * multiple paragraphs.
 */
```

---

## PocketFlow / AI Agent Development

### Framework Overview

PocketFlow is a **100-line minimalist LLM framework** with:
- Zero dependencies
- Zero vendor lock-in
- Graph + Shared Store architecture

**Reference**: https://the-pocket.github.io/PocketFlow/

### Core Abstractions

```
┌─────────────────────────────────────────────┐
│                   FLOW                       │
│  ┌─────┐    ┌─────┐    ┌─────┐             │
│  │Node │───▶│Node │───▶│Node │             │
│  │prep │    │prep │    │prep │             │
│  │exec │    │exec │    │exec │             │
│  │post │    │post │    │post │             │
│  └─────┘    └─────┘    └─────┘             │
│       ▲          │          │               │
│       └──────────┴──────────┘               │
│              Shared Store                   │
└─────────────────────────────────────────────┘
```

### Node Lifecycle

Every node follows a **three-phase execution**:

| Phase | Purpose | Example |
|-------|---------|---------|
| `prep(shared)` | Read from shared store, prepare data | Load context |
| `exec(prep_result)` | Core business logic | Call LLM API |
| `post(shared, prep_result, exec_result)` | Process results, determine next action | Save response, return action |

### Basic Node Pattern

```python
from pocketflow import Node, Flow

class SummarizeNode(Node):
    """Node that summarizes text using an LLM."""

    def prep(self, shared: dict) -> str:
        """Prepare: Get text from shared store."""
        return shared.get("input_text", "")

    def exec(self, text: str) -> str:
        """Execute: Call LLM to summarize."""
        # Your LLM call here - no vendor lock-in!
        response = call_llm(f"Summarize: {text}")
        return response

    def post(self, shared: dict, text: str, summary: str) -> str:
        """Post-process: Store result, return action."""
        shared["summary"] = summary
        return "done"  # Action determines next node
```

### Flow Construction

```python
# Connect nodes with >> operator
node1 = PrepareNode()
node2 = ProcessNode()
node3 = OutputNode()

# Linear flow
node1 >> node2 >> node3

# Conditional branching with actions
node1 >> node2
node2 - "success" >> node3
node2 - "error" >> error_handler

# Create and run flow
flow = Flow(start=node1)
result = flow.run(shared_store)
```

### Design Patterns

#### Agent Pattern (Decision Loop)
```python
class AgentNode(Node):
    """Agent that decides actions based on context."""

    def exec(self, context: dict) -> dict:
        # LLM decides what tool to use
        decision = call_llm(f"Given {context}, what action?")
        return {"action": decision["tool"], "params": decision["params"]}

    def post(self, shared, context, decision) -> str:
        if decision["action"] == "search":
            return "search"  # Routes to search node
        elif decision["action"] == "respond":
            return "respond"  # Routes to response node
        return "think"  # Loop back to think more
```

#### RAG Pattern (Retrieval-Augmented Generation)
```python
# Nodes for RAG pipeline
embed_node = EmbedQueryNode()      # Convert query to embedding
retrieve_node = RetrieveNode()     # Search vector store
augment_node = AugmentNode()       # Add context to prompt
generate_node = GenerateNode()     # Generate response

embed_node >> retrieve_node >> augment_node >> generate_node
```

### Best Practices

1. **Implement custom utilities** - Don't rely on built-in LLM wrappers
2. **Keep nodes focused** - Single responsibility per node
3. **Use shared store** - Don't pass data through return values
4. **Action-based routing** - Return meaningful action strings
5. **Async for I/O** - Use AsyncNode for API calls

### Anti-Patterns to Avoid

```python
# WRONG: Doing everything in one node
class GodNode(Node):
    def exec(self, data):
        # Load, process, call API, save, format...
        pass

# CORRECT: Separate concerns
class LoadNode(Node): pass
class ProcessNode(Node): pass
class SaveNode(Node): pass
```

---

## EU Accessibility Requirements

### Legal Framework

| Standard | Status | Deadline |
|----------|--------|----------|
| **EN 301 549 V3.2.1** | Current harmonized EU standard | Active |
| **WCAG 2.1 Level AA** | Referenced in EN 301 549 | Required |
| **WCAG 2.2** | Coming in EN 301 549 V4.1.1 | 2026 |
| **European Accessibility Act** | Enforcement | **June 28, 2025** |

**Reference**: https://www.wcag.com/compliance/en-301-549/

### POUR Principles

All content must be:

| Principle | Meaning | Example |
|-----------|---------|---------|
| **Perceivable** | Users can perceive content | Alt text, captions |
| **Operable** | Users can interact | Keyboard navigation |
| **Understandable** | Users can understand | Clear language |
| **Robust** | Works with assistive tech | Valid HTML, ARIA |

### Keyboard Navigation Requirements

```html
<!-- All interactive elements must be keyboard accessible -->

<!-- CORRECT: Focusable and operable -->
<button type="button" onclick="doAction()">Click me</button>

<!-- WRONG: Div is not focusable by default -->
<div onclick="doAction()">Click me</div>

<!-- If you must use div, add keyboard support -->
<div role="button" tabindex="0"
     onclick="doAction()"
     onkeypress="if(event.key==='Enter')doAction()">
    Click me
</div>
```

### Focus Management

```javascript
// When opening a modal/dialog
function openModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';

    // Move focus to modal
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    firstFocusable.focus();

    // Trap focus within modal
    modal.addEventListener('keydown', trapFocus);
}

// Allow Escape to close
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalIsOpen) {
        closeModal();
    }
});
```

### ARIA Attributes for Moodle

```html
<!-- Form validation -->
<input type="text"
       id="username"
       aria-invalid="true"
       aria-describedby="username-error">
<span id="username-error" role="alert">
    Username is required
</span>

<!-- Icons with meaning need labels -->
<button aria-label="Delete item">
    <i class="fa fa-trash" aria-hidden="true"></i>
</button>

<!-- Icons that are decorative -->
<span class="icon">
    <i class="fa fa-info" aria-hidden="true"></i>
    Help information
</span>

<!-- Live regions for dynamic updates -->
<div aria-live="polite" aria-atomic="true" id="status">
    <!-- Screen reader announces changes here -->
</div>
```

### Color Contrast Requirements

| Text Size | Minimum Ratio | Example |
|-----------|---------------|---------|
| Normal text (<18px) | 4.5:1 | #595959 on white |
| Large text (≥18px bold or ≥24px) | 3:1 | #767676 on white |
| UI components | 3:1 | Buttons, form borders |

**Tool**: Use WebAIM Contrast Checker

### Color Must Not Be Only Indicator

```html
<!-- WRONG: Color alone indicates error -->
<input type="text" style="border-color: red;">

<!-- CORRECT: Color + icon + text -->
<input type="text"
       style="border-color: red;"
       aria-invalid="true"
       aria-describedby="error-msg">
<span id="error-msg">
    <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
    This field is required
</span>
```

### Moodle-Specific Accessibility

```php
// Page title structure
$PAGE->set_title(
    get_string('viewpage', 'mod_myplugin') .
    moodle_page::TITLE_SEPARATOR .
    $course->shortname
);

// Use Moodle's accessible form API
$mform = new my_form();
$mform->addElement('text', 'name', get_string('name'));
$mform->addRule('name', get_string('required'), 'required');

// Accessible notifications
\core\notification::success(get_string('saved', 'mod_myplugin'));
\core\notification::error(get_string('error', 'mod_myplugin'));
```

### Testing Checklist

| Test | Tool | Pass Criteria |
|------|------|---------------|
| Automated scan | axe DevTools, WAVE | No critical errors |
| Keyboard only | Manual | All functions accessible |
| Screen reader | NVDA/VoiceOver | Content announced correctly |
| Zoom 200% | Browser | No content loss |
| Color contrast | WebAIM | Meets ratios |
| Focus visible | Manual | Clear focus indicator |

---

## Frontend / UI Development

### Chatbot Widget / iframe Accessibility

```html
<!-- iframe MUST have title -->
<iframe
    src="/chatbot/embed"
    title="AI Chatbot Assistant"
    aria-label="Chat with our AI assistant">
</iframe>

<!-- Announce state changes -->
<div id="chat-container">
    <div aria-live="polite" id="chat-status">
        <!-- "New message received" announced here -->
    </div>

    <div id="messages" role="log" aria-label="Chat messages">
        <!-- Messages here -->
    </div>

    <input type="text"
           aria-label="Type your message"
           placeholder="Type a message...">

    <button type="submit" aria-label="Send message">
        <i class="fa fa-send" aria-hidden="true"></i>
    </button>
</div>
```

### Focus Management for Chat

```javascript
// When chat opens
function openChat() {
    chatContainer.classList.add('open');
    chatInput.focus();
    announceToScreenReader('Chat opened');
}

// When new message arrives
function addMessage(message) {
    const msgElement = createMessageElement(message);
    messagesContainer.appendChild(msgElement);

    // Announce to screen readers
    statusRegion.textContent = `New message: ${message.preview}`;
}

// Escape to minimize
chatContainer.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        minimizeChat();
        chatToggleButton.focus(); // Return focus
    }
});
```

---

## Behavioral Rules

### ALWAYS Do

1. **Explain your reasoning**
   - I'm learning - show me WHY this approach works
   - Compare with alternatives when relevant

2. **Reference standards**
   - Link to Moodle docs, WCAG, PocketFlow docs
   - Quote specific rules when applying them

3. **Show examples**
   - Before/after code comparisons
   - Common patterns with explanations

4. **Check accessibility**
   - Every UI change needs WCAG consideration
   - Mention keyboard navigation impact

5. **Validate before suggesting commit**
   - Remind about phpcs, phpunit, behat
   - List what tests should pass

6. **Comment complex code**
   - Use Moodle's `//` comment style
   - Explain the WHY, not the WHAT

### NEVER Do

1. **Don't assume I know patterns**
   - Explain design patterns when using them
   - Define acronyms first time used

2. **Don't skip error handling**
   - Show proper try/catch patterns
   - Explain what could go wrong

3. **Don't ignore accessibility**
   - It's legally required in EU from June 2025
   - Always consider keyboard users

4. **Don't use deprecated Moodle APIs**
   - Check version compatibility
   - Suggest modern alternatives

5. **Don't mix coding styles**
   - PSR-12 with Moodle exceptions only
   - Consistent throughout file

### When Unsure

- **ASK** before making architectural decisions
- **SHOW** 2-3 options with pros/cons
- **REFERENCE** official documentation
- **SUGGEST** learning resources for deeper understanding

---

## Quality Gates

### Before Every Commit

```bash
# 1. Code style check
vendor/bin/phpcs --standard=moodle path/to/plugin

# 2. PHPDoc validation
vendor/bin/phpcs --standard=moodle --sniffs=moodle.Commenting path/to/plugin

# 3. Unit tests
vendor/bin/phpunit --testsuite mod_myplugin_testsuite

# 4. Behat tests (if applicable)
vendor/bin/behat --config /path/to/behat.yml --tags @mod_myplugin
```

### Checklist for Every Change

- [ ] **Code follows Moodle coding standards** (phpcs passes)
- [ ] **PHPDoc complete** with @package, @param, @return tags
- [ ] **No PHP errors/warnings** in error log
- [ ] **Accessibility checked** (axe/WAVE scan)
- [ ] **Keyboard navigation works** for new UI elements
- [ ] **Language strings used** for all user-facing text
- [ ] **Capabilities checked** where appropriate
- [ ] **Unit tests exist** for new functions
- [ ] **No security issues** (SQL injection, XSS, etc.)
- [ ] **GDPR considered** if handling user data

### Security Checklist

- [ ] All SQL uses parameterized queries (`$DB->get_records()`)
- [ ] User input is cleaned (`required_param()`, `optional_param()`)
- [ ] Output is escaped (`format_string()`, `format_text()`)
- [ ] Capabilities checked before actions
- [ ] Session key validated for state-changing actions (`require_sesskey()`)
- [ ] File uploads validated (type, size)

### Accessibility Checklist

- [ ] All images have alt text
- [ ] Form fields have labels
- [ ] Color is not only indicator
- [ ] Contrast ratios meet WCAG AA
- [ ] Keyboard navigation works
- [ ] Focus order is logical
- [ ] ARIA attributes used correctly
- [ ] Screen reader tested (or axe DevTools)

---

## References

### Moodle Development
- **Coding Style**: https://moodledev.io/general/development/policies/codingstyle
- **Accessibility**: https://moodledev.io/general/development/policies/accessibility
- **Plugin Development**: https://moodledev.io/docs/apis/plugintypes
- **Core APIs**: https://moodledev.io/docs/apis
- **Security**: https://moodledev.io/general/development/policies/security

### PocketFlow
- **Documentation**: https://the-pocket.github.io/PocketFlow/
- **GitHub**: https://github.com/The-Pocket/PocketFlow
- **Tutorials**: https://github.com/The-Pocket/PocketFlow/tree/main/cookbook

### Accessibility
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **EN 301 549**: https://www.wcag.com/compliance/en-301-549/
- **European Accessibility Act**: https://ec.europa.eu/social/main.jsp?catId=1202
- **axe DevTools**: https://www.deque.com/axe/devtools/
- **WAVE**: https://wave.webaim.org/

### Testing Tools
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **axe DevTools Extension**: Chrome/Firefox extension
- **NVDA Screen Reader**: https://www.nvaccess.org/ (Windows, free)
- **VoiceOver**: Built into macOS/iOS

---

*Last updated: 2025-01-31*
*For: Andreas Stöffer - Learning Developer Configuration*
