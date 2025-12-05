# Moodle Admin & Webservices Context

> Webservices, Reporting, Analytics, Local Plugins

## Webservice Architecture

```
┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│   Client     │────▶│  Webservice │────▶│   External   │
│  (REST/SOAP) │     │   Layer     │     │   Function   │
└──────────────┘     └─────────────┘     └──────────────┘
                           │
                     Token Auth +
                     Capability Check
```

## Creating External Functions

### 1. Define Function (db/services.php)

```php
$functions = [
    'local_myplugin_get_report_data' => [
        'classname'     => 'local_myplugin\external\get_report_data',
        'description'   => 'Get report data for analytics',
        'type'          => 'read',
        'ajax'          => true,
        'capabilities'  => 'local/myplugin:viewreports',
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
use core_external\external_value;

class get_report_data extends external_api {

    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'courseid' => new external_value(PARAM_INT, 'Course ID'),
            'from' => new external_value(PARAM_INT, 'Start timestamp', VALUE_DEFAULT, 0),
            'to' => new external_value(PARAM_INT, 'End timestamp', VALUE_DEFAULT, 0),
        ]);
    }

    public static function execute(int $courseid, int $from = 0, int $to = 0): array {
        // Validate parameters.
        $params = self::validate_parameters(self::execute_parameters(), [
            'courseid' => $courseid,
            'from' => $from,
            'to' => $to,
        ]);

        // Context and capability check.
        $context = \context_course::instance($params['courseid']);
        self::validate_context($context);
        require_capability('local/myplugin:viewreports', $context);

        // Get data.
        $data = self::get_analytics_data($params);

        return [
            'success' => true,
            'data' => $data,
        ];
    }

    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'success' => new external_value(PARAM_BOOL, 'Success status'),
            'data' => new external_multiple_structure(
                new external_single_structure([
                    'metric' => new external_value(PARAM_TEXT, 'Metric name'),
                    'value' => new external_value(PARAM_FLOAT, 'Metric value'),
                ])
            ),
        ]);
    }
}
```

## Naming Convention for Webservices

```
{component}_{verb}_{noun}

Examples:
- core_user_get_users
- local_myplugin_create_report
- mod_forum_get_discussions
```

## Reporting SQL Patterns

### Safe Parameterized Queries

```php
global $DB;

// Named parameters (preferred)
$sql = "SELECT u.id, u.firstname, u.lastname, COUNT(l.id) as logincount
          FROM {user} u
          LEFT JOIN {logstore_standard_log} l ON l.userid = u.id
         WHERE l.timecreated > :starttime
           AND l.courseid = :courseid
      GROUP BY u.id, u.firstname, u.lastname
      ORDER BY logincount DESC";

$params = [
    'starttime' => $starttime,
    'courseid' => $courseid,
];

$records = $DB->get_records_sql($sql, $params, 0, 100);
```

### Analytics API Usage

```php
// Use Analytics API for complex reporting
$manager = \core_analytics\manager::get_all_models();

// Custom indicator
class login_frequency extends \core_analytics\local\indicator\binary {
    public static function get_name(): \lang_string {
        return new \lang_string('loginfrequency', 'local_myplugin');
    }

    protected function calculate_sample($sampleid, $sampleorigin, $starttime, $endtime) {
        // Calculate indicator value
    }
}
```

## Local Plugin Structure

```
local/myplugin/
├── classes/
│   ├── external/           # Webservice classes
│   │   └── get_report_data.php
│   ├── task/               # Scheduled tasks
│   │   └── sync_data.php
│   └── reportbuilder/      # Report builder sources
│       └── datasource.php
├── db/
│   ├── access.php          # Capabilities
│   ├── services.php        # Webservice definitions
│   ├── install.xml         # Database tables
│   └── tasks.php           # Scheduled tasks
├── lang/en/
│   └── local_myplugin.php
├── settings.php            # Admin settings
└── version.php
```

## Scheduled Tasks

```php
// db/tasks.php
$tasks = [
    [
        'classname' => 'local_myplugin\task\sync_data',
        'blocking' => 0,
        'minute' => '0',
        'hour' => '*/4',
        'day' => '*',
        'month' => '*',
        'dayofweek' => '*',
    ],
];

// classes/task/sync_data.php
namespace local_myplugin\task;

class sync_data extends \core\task\scheduled_task {
    public function get_name(): string {
        return get_string('synctask', 'local_myplugin');
    }

    public function execute(): void {
        mtrace('Starting data sync...');
        // Sync logic here
    }
}
```

## Admin Settings

```php
// settings.php
defined('MOODLE_INTERNAL') || die();

if ($hassiteconfig) {
    $settings = new admin_settingpage('local_myplugin', get_string('pluginname', 'local_myplugin'));

    $settings->add(new admin_setting_configtext(
        'local_myplugin/apikey',
        get_string('apikey', 'local_myplugin'),
        get_string('apikey_desc', 'local_myplugin'),
        ''
    ));

    $ADMIN->add('localplugins', $settings);
}
```

## Security Checklist for Admin Features

- [ ] All webservices check capabilities
- [ ] Token authentication required
- [ ] Input validation with PARAM_* constants
- [ ] SQL injection prevention (parameterized queries)
- [ ] Rate limiting for public endpoints
- [ ] Logging of admin actions

## Reference
- https://moodledev.io/docs/apis/subsystems/external
- https://moodledev.io/docs/apis/core/reportbuilder
- https://moodledev.io/docs/apis/subsystems/analytics
