# Moodle Core Development Context

> PSR-12 with Moodle exceptions | Frankenstyle naming | Core APIs

## Coding Standards Summary

**Base**: PSR-12 + PSR-1 with Moodle overrides

| Rule | Moodle Standard |
|------|-----------------|
| Line length | 132 ideal, 180 max |
| Arrays | `[]` only (not `array()`) |
| Else | `else if` (two words) |
| Closing tag | NEVER use `?>` |
| Indentation | 4 spaces (no tabs) |

## Naming Conventions

```
Variables:    $lowercase (no underscores between words)
Functions:    component_function_name() (Frankenstyle prefix)
Classes:      lowercase_with_underscores
Constants:    COMPONENT_CONSTANT_NAME
Files:        lowercase.php (whole English words)
```

## Required File Header

```php
<?php
// GPL header (no blank line after <?php)
defined('MOODLE_INTERNAL') || die();
```

## Namespace Pattern

```php
// File: mod/myplugin/classes/manager.php
namespace mod_myplugin;

class manager {
    // Use \stdClass or import with 'use'
}
```

## PHPDoc Requirements

- `@package` tag MANDATORY
- `@param` with type hints
- `@return` if method returns value
- `@throws` for exceptions

## Essential APIs

| API | Use For |
|-----|---------|
| DML | Database operations (`$DB->get_record()`) |
| Output | Rendering (`$OUTPUT->header()`) |
| Form | User input (`moodleform`) |
| String | i18n (`get_string()`) |
| Access | Permissions (`has_capability()`) |

## Type Hints (MANDATORY)

```php
public function get_user(int $userid): ?stdClass {
    return $DB->get_record('user', ['id' => $userid]);
}
```

## Reference
- https://moodledev.io/general/development/policies/codingstyle
- https://moodledev.io/docs/apis
