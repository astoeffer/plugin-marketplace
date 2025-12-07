# Zero One Theme Patterns Skill

UIkit patterns and Zero One theme extension for Kirby CMS.

## Trigger
- UI component development in Kirby
- Theme customization requests
- UIkit integration questions

## UIkit CSS Framework
Zero One uses UIkit 3 for styling. Key classes:

### Layout
```html
<div class="uk-container">
    <div class="uk-grid" uk-grid>
        <div class="uk-width-1-2@m">Content</div>
    </div>
</div>
```

### Cards
```html
<div class="uk-card uk-card-default uk-card-body">
    <h3 class="uk-card-title">Title</h3>
    <p>Content</p>
</div>
```

### Buttons
```html
<button class="uk-button uk-button-primary">Primary</button>
<button class="uk-button uk-button-default">Default</button>
```

## Zero One Customizations
Located in `/site/plugins/zero-one/`:

### Custom Variables
```scss
$global-primary-background: #6e66cc;
$global-secondary-background: #130a28;
$global-muted-background: #f7f7f7;
$base-body-font-family: "Outfit", sans-serif;
$global-border-radius: 12px;
```

### Component Overrides
```scss
.uk-button {
    border-radius: 500px;
    text-transform: none;
    letter-spacing: 0.5px;
}
```

## Template Patterns
```php
<?php snippet('header') ?>

<main class="uk-section">
    <div class="uk-container">
        <?= $page->text()->toBlocks() ?>
    </div>
</main>

<?php snippet('footer') ?>
```

## Block Rendering
```php
<?php foreach ($page->text()->toBlocks() as $block): ?>
    <div class="uk-margin-medium">
        <?= $block ?>
    </div>
<?php endforeach ?>
```
