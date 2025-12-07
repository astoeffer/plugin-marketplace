# Accessibility Audit Skill

Audit code for WCAG 2.1 AA and EN 301 549 compliance.

## Trigger
- HTML/template file changes
- JavaScript UI code
- User requests accessibility check
- Before PR/commit

## Checks

### 1. Keyboard Navigation
- [ ] All interactive elements focusable
- [ ] Tab order logical
- [ ] Focus indicators visible
- [ ] Escape closes modals
- [ ] No keyboard traps

### 2. ARIA Usage
- [ ] `aria-label` on icon-only buttons
- [ ] `aria-invalid` on error fields
- [ ] `aria-describedby` for error messages
- [ ] `aria-live` for dynamic content
- [ ] `aria-hidden` on decorative elements

### 3. Color & Contrast
- [ ] Text contrast ≥ 4.5:1
- [ ] Large text contrast ≥ 3:1
- [ ] Color not sole indicator
- [ ] Focus visible in all themes

### 4. Forms
- [ ] All inputs have labels
- [ ] Error messages associated
- [ ] Required fields indicated
- [ ] Validation accessible

### 5. Images & Media
- [ ] Alt text on images
- [ ] Decorative images hidden
- [ ] Captions on video
- [ ] Audio descriptions

## Quick Fixes

### Missing Label
```html
<!-- Before -->
<input type="text" name="search">

<!-- After -->
<label for="search" class="sr-only">Search</label>
<input type="text" id="search" name="search">
```

### Icon Button
```html
<!-- Before -->
<button><i class="fa fa-trash"></i></button>

<!-- After -->
<button aria-label="Delete item">
    <i class="fa fa-trash" aria-hidden="true"></i>
</button>
```

### Color-Only Error
```html
<!-- Before -->
<input style="border-color: red">

<!-- After -->
<input aria-invalid="true" aria-describedby="error">
<span id="error" role="alert">
    <i class="fa fa-warning" aria-hidden="true"></i>
    This field is required
</span>
```

## Testing Commands
```bash
# Automated scan
npx axe-cli http://localhost/page

# Lighthouse accessibility audit
npx lighthouse --only-categories=accessibility http://localhost/page
```

## Report Format
```
Accessibility Audit: [Page/Component Name]
==========================================
Critical: X issues
Serious:  X issues
Moderate: X issues

Issues Found:
1. [CRITICAL] Missing label on input#search
   - Line: 45
   - Fix: Add associated <label> element

2. [SERIOUS] Insufficient contrast (2.5:1)
   - Element: .btn-secondary
   - Fix: Increase contrast to 4.5:1
```
