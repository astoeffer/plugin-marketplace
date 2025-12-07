# EU Accessibility Context

> EN 301 549 | WCAG 2.1 AA | European Accessibility Act (June 2025)

## Legal Requirements

| Standard | Status | Applies To |
|----------|--------|------------|
| EN 301 549 V3.2.1 | Current EU standard | All ICT in EU |
| WCAG 2.1 Level AA | Referenced in EN 301 549 | Web content |
| EAA Enforcement | **June 28, 2025** | Products & services |

## POUR Principles

- **Perceivable**: Alt text, captions, contrast
- **Operable**: Keyboard nav, focus management
- **Understandable**: Clear language, predictable
- **Robust**: Valid HTML, ARIA, assistive tech

## Keyboard Requirements

```html
<!-- All interactive elements must be keyboard accessible -->

<!-- CORRECT -->
<button onclick="action()">Click</button>

<!-- WRONG - div not focusable -->
<div onclick="action()">Click</div>

<!-- If must use div -->
<div role="button" tabindex="0"
     onclick="action()"
     onkeydown="if(event.key==='Enter')action()">
    Click
</div>
```

## Focus Management

```javascript
// Modal/dialog focus
function openModal() {
    modal.style.display = 'block';
    modal.querySelector('button, input').focus();
}

// Escape to close
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Return focus on close
function closeModal() {
    modal.style.display = 'none';
    triggerButton.focus();
}
```

## ARIA Essentials

```html
<!-- Form validation -->
<input aria-invalid="true" aria-describedby="error">
<span id="error" role="alert">Required field</span>

<!-- Icon with meaning -->
<button aria-label="Delete">
    <i class="fa fa-trash" aria-hidden="true"></i>
</button>

<!-- Live region for updates -->
<div aria-live="polite" id="status"></div>
```

## Color Contrast

| Element | Minimum Ratio |
|---------|---------------|
| Normal text (<18px) | 4.5:1 |
| Large text (≥18px bold, ≥24px) | 3:1 |
| UI components | 3:1 |

**Tool**: WebAIM Contrast Checker

## Color + Additional Indicator

```html
<!-- WRONG: Color only -->
<input style="border-color: red">

<!-- CORRECT: Color + icon + text -->
<input aria-invalid="true" aria-describedby="err">
<span id="err">
    <i class="fa fa-warning" aria-hidden="true"></i>
    Required
</span>
```

## Moodle-Specific

```php
// Accessible notifications
\core\notification::success(get_string('saved'));
\core\notification::error(get_string('error'));

// Page title structure
$PAGE->set_title($specific . moodle_page::TITLE_SEPARATOR . $course);

// Use Moodle form API (handles labels)
$mform->addElement('text', 'name', get_string('name'));
```

## iframe/Widget Accessibility

```html
<iframe
    src="/chatbot"
    title="AI Chat Assistant"
    aria-label="Chat with AI assistant">
</iframe>
```

## Testing Checklist

- [ ] axe DevTools scan (0 critical errors)
- [ ] Keyboard only navigation
- [ ] Screen reader (NVDA/VoiceOver)
- [ ] 200% zoom (no content loss)
- [ ] Focus visible on all elements
- [ ] Color contrast passes

## Reference
- https://moodledev.io/general/development/policies/accessibility
- https://www.w3.org/WAI/WCAG21/quickref/
- https://www.wcag.com/compliance/en-301-549/
