---
name: design-tokens
description: Manage design tokens for consistent theming across platforms. Use when defining colors, typography, spacing, or other design system values.
allowed-tools: Read, Write, Grep, Glob
---

# Design Tokens Skill

Zero One (UIkit) to Bootstrap 5 design token mapping.

## Trigger
- Theme color or typography changes
- Cross-platform consistency requests
- Design system updates

## Zero One Palette
```scss
// Primary
$cloodle-primary: #6e66cc;
$cloodle-primary-hover: #5c53c6;
$cloodle-primary-light: #e2e0f5;

// Secondary
$cloodle-secondary: #130a28;
$cloodle-heading: #130a28;

// Text
$cloodle-text: #423653;
$cloodle-text-muted: #aeaeae;

// Background
$cloodle-bg-light: #f7f7f7;
$cloodle-border: #dedbe0;

// Semantic
$cloodle-success: #6BC116;
$cloodle-danger: #E84646;
```

## Typography
```scss
$font-family-sans-serif: "Outfit", sans-serif;
$font-size-base: 1rem;
$headings-font-weight: 700;
$h1-font-size: 2.55rem;
$h2-font-size: 1.7rem;
```

## Spacing
```scss
$border-radius: 12px;
$border-radius-pill: 500px;
$btn-padding-y: 0.75rem;
$btn-padding-x: 1.875rem;
```

## UIkit to Bootstrap Mapping
| UIkit Class | Bootstrap Equivalent |
|-------------|---------------------|
| `uk-button-primary` | `btn btn-primary` |
| `uk-card` | `card` |
| `uk-input` | `form-control` |
| `uk-section-muted` | `bg-light` |
