# Reporting & Analytics Skill

Build reports and analytics using Moodle's Report Builder and Analytics APIs.

## Trigger
- Creating custom reports
- Building analytics dashboards
- User requests data analysis

## Report Builder (Moodle 4.0+)

### 1. Create Data Source
```php
// classes/reportbuilder/datasource/my_datasource.php
namespace local_myplugin\reportbuilder\datasource;

use core_reportbuilder\datasource;
use core_reportbuilder\local\entities\user;
use local_myplugin\reportbuilder\local\entities\myentity;

class my_datasource extends datasource {

    public static function get_name(): string {
        return get_string('datasource', 'local_myplugin');
    }

    protected function initialise(): void {
        // Add main entity
        $myentity = new myentity();
        $myalias = $myentity->get_table_alias('local_myplugin_data');
        $this->add_entity($myentity);
        $this->set_main_table('local_myplugin_data', $myalias);

        // Join user entity
        $userentity = new user();
        $useralias = $userentity->get_table_alias('user');
        $this->add_entity($userentity
            ->add_join("LEFT JOIN {user} {$useralias}
                ON {$useralias}.id = {$myalias}.userid"));

        // Add columns, filters, conditions
        $this->add_columns_from_entity($myentity->get_entity_name());
        $this->add_filters_from_entity($myentity->get_entity_name());
        $this->add_conditions_from_entity($myentity->get_entity_name());
    }

    public function get_default_columns(): array {
        return [
            'myentity:name',
            'user:fullname',
            'myentity:timecreated',
        ];
    }
}
```

### 2. Create Entity
```php
// classes/reportbuilder/local/entities/myentity.php
namespace local_myplugin\reportbuilder\local\entities;

use core_reportbuilder\local\entities\base;
use core_reportbuilder\local\report\column;
use core_reportbuilder\local\report\filter;
use core_reportbuilder\local\filters\text;
use core_reportbuilder\local\filters\date;
use lang_string;

class myentity extends base {

    protected function get_default_table_aliases(): array {
        return ['local_myplugin_data' => 'lpd'];
    }

    protected function get_default_entity_title(): lang_string {
        return new lang_string('entity', 'local_myplugin');
    }

    public function initialise(): base {
        $columns = $this->get_all_columns();
        foreach ($columns as $column) {
            $this->add_column($column);
        }

        $filters = $this->get_all_filters();
        foreach ($filters as $filter) {
            $this->add_filter($filter);
            $this->add_condition($filter);
        }

        return $this;
    }

    protected function get_all_columns(): array {
        $alias = $this->get_table_alias('local_myplugin_data');

        $columns = [];

        $columns[] = (new column(
            'name',
            new lang_string('name'),
            $this->get_entity_name()
        ))
            ->add_joins($this->get_joins())
            ->set_type(column::TYPE_TEXT)
            ->add_field("{$alias}.name")
            ->set_is_sortable(true);

        $columns[] = (new column(
            'timecreated',
            new lang_string('timecreated'),
            $this->get_entity_name()
        ))
            ->add_joins($this->get_joins())
            ->set_type(column::TYPE_TIMESTAMP)
            ->add_field("{$alias}.timecreated")
            ->set_is_sortable(true);

        return $columns;
    }

    protected function get_all_filters(): array {
        $alias = $this->get_table_alias('local_myplugin_data');

        return [
            (new filter(
                text::class,
                'name',
                new lang_string('name'),
                $this->get_entity_name(),
                "{$alias}.name"
            )),
            (new filter(
                date::class,
                'timecreated',
                new lang_string('timecreated'),
                $this->get_entity_name(),
                "{$alias}.timecreated"
            )),
        ];
    }
}
```

## Custom SQL Reports

```php
class report_generator {

    public function get_user_activity(int $courseid, int $from, int $to): array {
        global $DB;

        $sql = "SELECT
                    u.id,
                    u.firstname,
                    u.lastname,
                    COUNT(DISTINCT l.id) as actions,
                    MAX(l.timecreated) as lastaccess
                FROM {user} u
                JOIN {logstore_standard_log} l ON l.userid = u.id
                WHERE l.courseid = :courseid
                  AND l.timecreated BETWEEN :fromtime AND :totime
                GROUP BY u.id, u.firstname, u.lastname
                ORDER BY actions DESC";

        return $DB->get_records_sql($sql, [
            'courseid' => $courseid,
            'fromtime' => $from,
            'totime' => $to,
        ]);
    }

    public function get_completion_stats(int $courseid): array {
        global $DB;

        $sql = "SELECT
                    cm.id as cmid,
                    m.name as modname,
                    cm.instance,
                    COUNT(DISTINCT cmc.userid) as completed,
                    (SELECT COUNT(DISTINCT ue.userid)
                     FROM {user_enrolments} ue
                     JOIN {enrol} e ON e.id = ue.enrolid
                     WHERE e.courseid = :courseid2) as enrolled
                FROM {course_modules} cm
                JOIN {modules} m ON m.id = cm.module
                LEFT JOIN {course_modules_completion} cmc
                    ON cmc.coursemoduleid = cm.id
                    AND cmc.completionstate > 0
                WHERE cm.course = :courseid
                  AND cm.completion > 0
                GROUP BY cm.id, m.name, cm.instance";

        return $DB->get_records_sql($sql, [
            'courseid' => $courseid,
            'courseid2' => $courseid,
        ]);
    }
}
```

## Analytics API

### Create Custom Indicator
```php
// classes/analytics/indicator/login_frequency.php
namespace local_myplugin\analytics\indicator;

use core_analytics\local\indicator\binary;
use core_analytics\analysable;

class login_frequency extends binary {

    public static function get_name(): \lang_string {
        return new \lang_string('indicator:loginfrequency', 'local_myplugin');
    }

    protected function calculate_sample(
        int $sampleid,
        string $sampleorigin,
        int $starttime,
        int $endtime
    ) {
        global $DB;

        $logins = $DB->count_records_select(
            'logstore_standard_log',
            'userid = :userid AND action = :action AND timecreated BETWEEN :start AND :end',
            [
                'userid' => $sampleid,
                'action' => 'loggedin',
                'start' => $starttime,
                'end' => $endtime,
            ]
        );

        // Return -1 (no), 0 (unknown), or 1 (yes)
        $expectedlogins = ($endtime - $starttime) / WEEKSECS;
        return $logins >= $expectedlogins ? 1 : -1;
    }
}
```

### Register Indicator
```php
// classes/analytics/indicator/login_frequency.php
// Add to db/analytics.php if needed
$indicators = [
    '\local_myplugin\analytics\indicator\login_frequency',
];
```

## Scheduled Reports

```php
// classes/task/generate_report.php
namespace local_myplugin\task;

class generate_report extends \core\task\scheduled_task {

    public function get_name(): string {
        return get_string('generatereport', 'local_myplugin');
    }

    public function execute(): void {
        global $DB;

        mtrace('Generating report...');

        $generator = new \local_myplugin\report_generator();
        $courses = $DB->get_records('course', ['visible' => 1]);

        foreach ($courses as $course) {
            $stats = $generator->get_completion_stats($course->id);
            $this->store_stats($course->id, $stats);
        }

        mtrace('Report complete.');
    }

    private function store_stats(int $courseid, array $stats): void {
        global $DB;

        $record = new \stdClass();
        $record->courseid = $courseid;
        $record->data = json_encode($stats);
        $record->timecreated = time();

        $DB->insert_record('local_myplugin_reports', $record);
    }
}
```

## Dashboard Widget

```php
// classes/output/dashboard_widget.php
namespace local_myplugin\output;

use renderable;
use templatable;
use renderer_base;

class dashboard_widget implements renderable, templatable {

    private array $stats;

    public function __construct(array $stats) {
        $this->stats = $stats;
    }

    public function export_for_template(renderer_base $output): array {
        return [
            'total_users' => $this->stats['users'],
            'active_today' => $this->stats['active'],
            'completion_rate' => round($this->stats['completion'] * 100, 1),
            'chart_data' => json_encode($this->stats['trend']),
        ];
    }
}
```

## Checklist
- [ ] Report Builder entity properly defined
- [ ] SQL queries use parameterized statements
- [ ] Appropriate indexes on queried columns
- [ ] Pagination for large datasets
- [ ] Caching for expensive queries
- [ ] Scheduled task for batch processing
- [ ] Capability checks on report access
