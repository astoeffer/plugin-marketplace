# Moodle AI Subsystem Context

> AI Providers, Actions, Placements | Since Moodle 4.5

## Architecture Overview

```
┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│  Placements  │────▶│   Manager   │────▶│  Providers   │
│  (UI layer)  │     │ (mediator)  │     │ (AI bridge)  │
└──────────────┘     └─────────────┘     └──────────────┘
       │                    │                    │
       ▼                    ▼                    ▼
   User sees           Coordinates          Calls external
   AI features         & logs               AI (OpenAI, etc)
```

**Key Principle**: Placements ↔ Providers are decoupled (don't know about each other)

## Core Components

| Component | Purpose | Has UI? |
|-----------|---------|---------|
| **Placement** | User interaction point | Yes |
| **Action** | Operation definition (generate_text, etc) | No |
| **Provider** | External AI connector | Config only |
| **Manager** | Mediator, logging | No |

## Predefined Actions

- `generate_text` - Text generation
- `generate_image` - Image generation
- `summarise_text` - Content summarization

## Creating an Action

```php
// File: classes/aiactions/my_action.php
namespace mod_myplugin\aiactions;

class my_action extends \core_ai\aiactions\base {

    public function __construct(
        int $contextid,
        protected string $prompttext,
        protected array $options = []
    ) {
        parent::__construct($contextid);
    }

    public function store(): int {
        global $DB;
        $record = new \stdClass();
        $record->contextid = $this->contextid;
        $record->prompttext = $this->prompttext;
        $record->timecreated = time();
        return $DB->insert_record('ai_action_my_action', $record);
    }
}
```

## Creating a Response

```php
namespace mod_myplugin\aiactions\responses;

class my_action_response extends \core_ai\aiactions\responses\response_base {

    public ?string $generatedtext = null;
    public ?int $tokensused = null;

    public function set_response_data(array $response): void {
        $this->generatedtext = $response['text'] ?? null;
        $this->tokensused = $response['tokens'] ?? null;
    }

    public function get_response_data(): array {
        return [
            'text' => $this->generatedtext,
            'tokens' => $this->tokensused,
        ];
    }
}
```

## Using the Manager

```php
// Process an AI action
$action = new \mod_myplugin\aiactions\my_action(
    contextid: $context->id,
    prompttext: $userprompt
);

$manager = new \core_ai\manager();
$response = $manager->process_action($action);

if ($response->get_success()) {
    $data = $response->get_response_data();
    echo $data['text'];
}
```

## User Policy (REQUIRED)

```php
// Check policy acceptance
$policystatus = \core_ai\manager::get_user_policy_status($USER->id);

if (!$policystatus) {
    // Show policy acceptance UI
}

// Record acceptance
\core_ai\manager::user_policy_accepted($USER->id, $context->id);
```

## Webservices for AJAX

| Service | Purpose |
|---------|---------|
| `core_ai_get_policy_status` | Check user acceptance |
| `core_ai_set_policy_status` | Record acceptance |

## Database Table Pattern

```php
// db/install.xml - Table: ai_action_my_action
<TABLE NAME="ai_action_my_action">
    <FIELD NAME="id" TYPE="int" LENGTH="10" NOTNULL="true" SEQUENCE="true"/>
    <FIELD NAME="contextid" TYPE="int" LENGTH="10" NOTNULL="true"/>
    <FIELD NAME="prompttext" TYPE="text" NOTNULL="true"/>
    <FIELD NAME="timecreated" TYPE="int" LENGTH="10" NOTNULL="true"/>
</TABLE>
```

## Integration with Chatbot

For iframe/widget chatbot integration:
1. Create Placement for chat UI
2. Use `generate_text` action
3. Handle streaming via webservice
4. Check policy before first message

## Reference
- https://moodledev.io/docs/5.2/apis/subsystems/ai
