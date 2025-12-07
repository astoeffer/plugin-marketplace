# Kirby Core Development Skill

Kirby CMS plugin and template development for Cloodle.

## Trigger
- Kirby plugin creation
- Blueprint or template modifications
- Block type development

## Server Paths
- **Kirby root**: `/opt/cloodle/apps/kirby/`
- **Plugins**: `/opt/cloodle/apps/kirby/site/plugins/`
- **Content**: `/opt/cloodle/apps/kirby/content/`

## Plugin Structure
```
site/plugins/my-plugin/
├── index.php           # Plugin registration
├── blueprints/
│   └── pages/         # Page blueprints
├── templates/         # PHP templates
├── snippets/          # Reusable snippets
└── controllers/       # Page controllers
```

## Plugin Registration
```php
<?php
Kirby::plugin('cloodle/my-plugin', [
    'blueprints' => [
        'pages/custom' => __DIR__ . '/blueprints/pages/custom.yml'
    ],
    'templates' => [
        'custom' => __DIR__ . '/templates/custom.php'
    ],
    'routes' => [
        [
            'pattern' => 'api/my-endpoint',
            'action'  => function () {
                return ['status' => 'ok'];
            }
        ]
    ]
]);
```

## Blueprint Example
```yaml
title: Custom Page
fields:
  text:
    type: blocks
    fieldsets:
      - heading
      - text
      - image
```

## Existing Cloodle Plugins
- `cloodle/` - Portal dashboard
- `moodle-export/` - IMSCP export
- `zero-one/` - Theme plugin
- `oauth/` - Authentik integration
