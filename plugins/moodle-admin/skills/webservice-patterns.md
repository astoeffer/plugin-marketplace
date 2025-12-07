# Webservice Patterns Skill

Create and consume Moodle webservices for external integration.

## Trigger
- Creating external API endpoints
- Building integrations with external systems
- User requests webservice functionality

## Creating External Functions

### 1. Define in db/services.php
```php
$functions = [
    'local_myplugin_get_data' => [
        'classname'     => 'local_myplugin\external\get_data',
        'description'   => 'Get plugin data',
        'type'          => 'read',           // read|write
        'ajax'          => true,             // Allow AJAX calls
        'capabilities'  => 'local/myplugin:view',
        'services'      => [MOODLE_OFFICIAL_MOBILE_SERVICE],
    ],
];
```

### 2. Implement External Class
```php
namespace local_myplugin\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_single_structure;
use core_external\external_multiple_structure;
use core_external\external_value;

class get_data extends external_api {

    /**
     * Define parameters.
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'id' => new external_value(PARAM_INT, 'Record ID'),
            'options' => new external_single_structure([
                'includedetails' => new external_value(
                    PARAM_BOOL,
                    'Include details',
                    VALUE_DEFAULT,
                    false
                ),
            ], 'Options', VALUE_DEFAULT, []),
        ]);
    }

    /**
     * Execute the function.
     */
    public static function execute(int $id, array $options = []): array {
        global $DB;

        // 1. Validate parameters
        $params = self::validate_parameters(self::execute_parameters(), [
            'id' => $id,
            'options' => $options,
        ]);

        // 2. Get and validate context
        $record = $DB->get_record('local_myplugin', ['id' => $params['id']], '*', MUST_EXIST);
        $context = \context_system::instance();
        self::validate_context($context);

        // 3. Check capabilities
        require_capability('local/myplugin:view', $context);

        // 4. Process and return
        return [
            'id' => $record->id,
            'name' => $record->name,
            'success' => true,
        ];
    }

    /**
     * Define return structure.
     */
    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'id' => new external_value(PARAM_INT, 'Record ID'),
            'name' => new external_value(PARAM_TEXT, 'Name'),
            'success' => new external_value(PARAM_BOOL, 'Success'),
        ]);
    }
}
```

## Naming Convention

```
{component}_{verb}_{noun}

Verbs: get, create, update, delete, list
Nouns: user, course, data, report

Examples:
- local_myplugin_get_report
- local_myplugin_create_entry
- local_myplugin_list_items
```

## Parameter Types

| PARAM_* | Description | Use For |
|---------|-------------|---------|
| PARAM_INT | Integer | IDs, counts |
| PARAM_TEXT | Cleaned text | Names, descriptions |
| PARAM_RAW | No cleaning | HTML content (careful!) |
| PARAM_BOOL | Boolean | Flags |
| PARAM_FLOAT | Decimal | Scores, percentages |
| PARAM_ALPHA | Letters only | Codes |
| PARAM_ALPHANUMEXT | Letters, numbers, _, - | Identifiers |

## Return Structures

### Single Record
```php
return new external_single_structure([
    'id' => new external_value(PARAM_INT, 'ID'),
    'name' => new external_value(PARAM_TEXT, 'Name'),
]);
```

### Multiple Records
```php
return new external_multiple_structure(
    new external_single_structure([
        'id' => new external_value(PARAM_INT, 'ID'),
        'name' => new external_value(PARAM_TEXT, 'Name'),
    ])
);
```

### Nested Structure
```php
return new external_single_structure([
    'course' => new external_single_structure([
        'id' => new external_value(PARAM_INT, 'Course ID'),
        'name' => new external_value(PARAM_TEXT, 'Course name'),
    ]),
    'users' => new external_multiple_structure(
        new external_single_structure([
            'id' => new external_value(PARAM_INT, 'User ID'),
        ])
    ),
]);
```

## Consuming Webservices

### PHP Client
```php
$serverurl = 'https://moodle.example.com/webservice/rest/server.php';
$token = 'your_token_here';

$params = [
    'wstoken' => $token,
    'wsfunction' => 'local_myplugin_get_data',
    'moodlewsrestformat' => 'json',
    'id' => 123,
];

$response = file_get_contents($serverurl . '?' . http_build_query($params));
$data = json_decode($response, true);
```

### Python Client
```python
import requests

def call_moodle(function: str, **params):
    response = requests.post(
        "https://moodle.example.com/webservice/rest/server.php",
        data={
            "wstoken": TOKEN,
            "wsfunction": function,
            "moodlewsrestformat": "json",
            **params
        }
    )
    return response.json()

# Usage
data = call_moodle("local_myplugin_get_data", id=123)
```

## Security Checklist
- [ ] validate_parameters() called
- [ ] validate_context() called
- [ ] require_capability() checked
- [ ] PARAM_* types appropriate
- [ ] No SQL injection (use DML API)
- [ ] Session key validated for writes
- [ ] Rate limiting considered
