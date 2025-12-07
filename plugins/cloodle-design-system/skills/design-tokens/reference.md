# Cloodle Design Tokens

Quick reference for the Cloodle design system tokens. Use these consistently across all implementations.

## Colors

### Earth Palette (Primary)
```css
:root {
  /* Warm, grounding tones */
  --cloodle-terracotta: #C4A484;
  --cloodle-forest: #2D4A3E;
  --cloodle-sand: #E8DED1;

  /* Activation (use sparingly) */
  --cloodle-coral: #E07A5F;
  --cloodle-ocean: #3D5A80;

  /* Neutrals */
  --cloodle-white: #FAF8F5;
  --cloodle-charcoal: #4A4A4A;
  --cloodle-mist: #B8B8B8;

  /* Semantic */
  --cloodle-success: #10B981;
  --cloodle-warning: #F59E0B;
  --cloodle-error: #EF4444;
  --cloodle-info: #3B82F6;
}
```

### Color Usage
| Purpose | Token | Notes |
|---------|-------|-------|
| Page background | `--cloodle-white` | Warm, not stark |
| Card background | `#FFFFFF` | Pure white for lift |
| Primary text | `--cloodle-charcoal` | Not pure black |
| Secondary text | `--cloodle-mist` | Muted but readable |
| Primary CTA | `--cloodle-coral` | Warm, inviting |
| Secondary CTA | `--cloodle-forest` | Grounded, trustworthy |
| Links | `--cloodle-ocean` | Clear but calm |
| Accent/highlight | `--cloodle-terracotta` | Warm emphasis |

## Typography

### Font Stack
```css
:root {
  --font-display: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body: 'Source Serif Pro', Georgia, serif;
  --font-ui: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### Scale (1.25 ratio)
```css
:root {
  --text-xs: 0.64rem;    /* 10.24px */
  --text-sm: 0.8rem;     /* 12.8px */
  --text-base: 1rem;     /* 16px */
  --text-md: 1.125rem;   /* 18px */
  --text-lg: 1.25rem;    /* 20px */
  --text-xl: 1.563rem;   /* 25px */
  --text-2xl: 1.953rem;  /* 31px */
  --text-3xl: 2.441rem;  /* 39px */
  --text-4xl: 3.052rem;  /* 49px */
}
```

### Type Styles
| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| H1 | Display | 3xl-4xl | 600 | 1.1 |
| H2 | Display | 2xl-3xl | 600 | 1.2 |
| H3 | Display | xl-2xl | 500 | 1.3 |
| H4 | Display | lg-xl | 500 | 1.4 |
| Body | Body | md | 400 | 1.6 |
| Lead | Body | lg | 400 | 1.5 |
| UI Labels | UI | base | 500 | 1.4 |
| Small | UI | sm | 400 | 1.4 |
| Metadata | UI | xs | 400 | 1.3 |

## Spacing (Breath-Based)

```css
:root {
  --space-breath: 8px;    /* Base unit */
  --space-pause: 16px;    /* 2× - micro pause */
  --space-rest: 24px;     /* 3× - visual rest */
  --space-settle: 32px;   /* 4× - section break */
  --space-ground: 48px;   /* 6× - major division */
  --space-expand: 64px;   /* 8× - page sections */
  --space-hold: 96px;     /* 12× - container padding */
}
```

### Spacing Usage
| Context | Token |
|---------|-------|
| Icon to label | `--space-breath` |
| Between related items | `--space-pause` |
| Inside cards | `--space-rest` |
| Between cards | `--space-settle` |
| Between sections | `--space-ground` |
| Page section padding | `--space-expand` |
| Container padding | `--space-hold` |

## Border Radius

```css
:root {
  --radius-sm: 4px;       /* Small elements */
  --radius-md: 8px;       /* Buttons, inputs */
  --radius-lg: 12px;      /* Cards, containers */
  --radius-xl: 16px;      /* Large cards */
  --radius-full: 9999px;  /* Pills, avatars */
}
```

## Shadows

```css
:root {
  /* Subtle elevation */
  --shadow-sm: 0 1px 2px rgba(77, 77, 77, 0.05);

  /* Card default */
  --shadow-md: 0 4px 12px rgba(77, 77, 77, 0.1);

  /* Hover lift */
  --shadow-lg: 0 8px 24px rgba(77, 77, 77, 0.12);

  /* Modal/overlay */
  --shadow-xl: 0 16px 48px rgba(77, 77, 77, 0.15);
}
```

## Animation

### Durations
```css
:root {
  --duration-instant: 100ms;
  --duration-quick: 200ms;
  --duration-settle: 400ms;
  --duration-emerge: 600ms;
  --duration-breathe: 4000ms;
}
```

### Easings
```css
:root {
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Animation Patterns
```css
/* Breathing pulse */
@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.02); opacity: 1; }
}

/* Gentle fade in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Card hover lift */
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  transition: all var(--duration-settle) var(--ease-out);
}
```

## Container Widths

```css
:root {
  --width-focus: 42rem;   /* 672px - reading */
  --width-work: 56rem;    /* 896px - working */
  --width-stage: 72rem;   /* 1152px - full stage */
  --width-theatre: 90rem; /* 1440px - maximum */
}
```

## Z-Index Scale

```css
:root {
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-toast: 500;
  --z-tooltip: 600;
}
```

## Component Quick Reference

### Button Styles
```css
.btn-primary {
  background: var(--cloodle-coral);
  color: white;
  padding: var(--space-pause) var(--space-rest);
  border-radius: var(--radius-full);
  font-family: var(--font-ui);
  font-weight: 500;
  transition: all var(--duration-quick) var(--ease-out);
}

.btn-primary:hover {
  background: #C66B52; /* Darker coral */
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: var(--cloodle-forest);
  border: 2px solid var(--cloodle-forest);
}

.btn-secondary:hover {
  background: var(--cloodle-forest);
  color: white;
}
```

### Card Pattern
```css
.card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-rest);
  transition: all var(--duration-settle) var(--ease-out);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### Input Fields
```css
.input {
  font-family: var(--font-ui);
  font-size: var(--text-base);
  padding: var(--space-pause);
  border: 2px solid var(--cloodle-mist);
  border-radius: var(--radius-md);
  transition: border-color var(--duration-quick) var(--ease-out);
}

.input:focus {
  outline: none;
  border-color: var(--cloodle-ocean);
  box-shadow: 0 0 0 3px rgba(61, 90, 128, 0.1);
}
```

## Accessibility Requirements

- Color contrast minimum: 4.5:1 for text
- Focus states visible for all interactive elements
- Touch targets minimum: 44×44px
- Respect `prefers-reduced-motion`
- All images need alt text
- Form fields need associated labels
