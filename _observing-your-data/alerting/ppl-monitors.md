---
layout: default
title: PPL monitors
nav_order: 22
parent: Monitors
grand_parent: Alerting
has_children: false
---

# PPL monitors

PPL alert monitors use [Piped Processing Language (PPL)]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/) queries to monitor your data. They are [per query monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/per-query-bucket-monitors/) that use PPL instead of query DSL as the query language.

## Setup

The examples on this page use an `application_logs` index containing web request logs. To follow along, create the index with the following mapping:

```json
PUT /application_logs
{
  "mappings": {
    "properties": {
      "@timestamp": { "type": "date" },
      "endpoint": { "type": "keyword" },
      "service": { "type": "keyword" },
      "level": { "type": "keyword" },
      "response_time": { "type": "integer" }
    }
  }
}
```
{% include copy-curl.html %}

Index the sample documents:

```json
POST /application_logs/_bulk?refresh=true
{ "index": {} }
{ "@timestamp": "2026-01-15T10:00:00Z", "endpoint": "/api/orders", "service": "orders", "level": "ERROR", "response_time": 4200 }
{ "index": {} }
{ "@timestamp": "2026-01-15T10:01:00Z", "endpoint": "/api/orders", "service": "orders", "level": "ERROR", "response_time": 3600 }
{ "index": {} }
{ "@timestamp": "2026-01-15T10:02:00Z", "endpoint": "/api/checkout", "service": "checkout", "level": "ERROR", "response_time": 2500 }
```
{% include copy-curl.html %}

## Creating a PPL monitor in OpenSearch Dashboards

To create a PPL monitor, follow these steps:

1. Select **Alerting** > **Monitors** > **Create monitor**.
2. Select the **PPL monitor** option.
3. Enter a name for the monitor and configure the schedule (by time interval or custom cron expression). For more information about cron expressions, see [Cron expressions]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#cron-expressions).
4. In the **Query** section, enter your PPL query, for example:

   ```sql
   source = application_logs | stats avg(response_time) as avg_response by endpoint
   ```
   {% include copy.html %}

5. Add one or more triggers. For more information about configuring trigger conditions, see [PPL triggers](#ppl-triggers).
6. Add actions to specify notifications when triggers fire. For more information, see [Actions]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/actions/).
7. Select **Create**.

## PPL triggers

PPL monitors use `ppl_trigger` objects, which differ from the Painless-script-based triggers used by other monitor types. Each PPL monitor supports up to 10 triggers.

### Number of results trigger

A number of results trigger evaluates the total number of rows returned by the base PPL query against a threshold. The following comparison operators are supported.

Operator | Description
:--- | :---
`>` | Greater than
`>=` | Greater than or equal to
`<` | Less than
`<=` | Less than or equal to
`==` | Equal to
`!=` | Not equal to

For example, to trigger an alert when more than one result is returned, use the following trigger definition:

```json
{
  "ppl_trigger": {
    "name": "High result count",
    "severity": "1",
    "type": "number_of_results",
    "num_results_condition": ">",
    "num_results_value": 1,
    "actions": []
  }
}
```

### Custom condition trigger

A custom condition trigger appends a `where` clause to the base PPL query. If the modified query returns any results, the trigger fires. This allows you to define fine-grained conditions based on computed fields or aggregations. The custom condition is validated as a `where` statement during monitor creation.

For example, consider the following base query:

```sql
source = application_logs | stats max(response_time) as max_response by endpoint
```

To trigger an alert when any endpoint has a maximum response time above 3000 ms, use the following trigger definition:

```json
{
  "ppl_trigger": {
    "name": "Slow endpoint detected",
    "severity": "2",
    "type": "custom",
    "custom_condition": "where max_response > 3000",
    "actions": []
  }
}
```

## Template variables

PPL monitors provide the following additional template variable for use in [actions]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/actions/) and notification messages.

Variable | Data type | Description
:--- | :--- | :---
`ctx.ppl_query_results` | Array | A list of maps in which each element represents a PPL query result row. The keys in each map are field names from the query schema. For number of results triggers, the array contains the base query results. For custom condition triggers, it contains the results of the query with the custom condition applied.

### Mustache template example

The following example iterates over PPL query results and outputs the fields in each row:

{% raw %}
```
PPL Query Results:
{{#ctx.ppl_query_results}}
  Endpoint: {{endpoint}}, Average Response Time: {{avg_response}}
{{/ctx.ppl_query_results}}
```
{% endraw %}

## Query result format

PPL query results contain `schema` and `datarows` fields. For example, the query `source = application_logs | where level = 'ERROR' | stats count() as error_count by endpoint` returns the following response:

```json
{
  "schema": [
    {"name": "error_count", "type": "bigint"},
    {"name": "endpoint", "type": "string"}
  ],
  "datarows": [
    [1, "/api/checkout"],
    [2, "/api/orders"]
  ],
  "total": 2,
  "size": 2
}
```

These results are automatically transformed into a list of maps for use in templates and are available in `ctx.ppl_query_results`:

```json
[
  {"error_count": 1, "endpoint": "/api/checkout"},
  {"error_count": 2, "endpoint": "/api/orders"}
]
```

## Creating a PPL monitor using the API

The following example creates a PPL monitor with both trigger types:

```json
POST _plugins/_alerting/monitors
{
  "name": "PPL Error Rate Monitor",
  "type": "monitor",
  "monitor_type": "ppl_monitor",
  "enabled": true,
  "schedule": {
    "period": {
      "unit": "MINUTES",
      "interval": 5
    }
  },
  "inputs": [
    {
      "ppl_input": {
        "query": "source = application_logs | where level = 'ERROR' | stats count() as error_count by service",
        "query_language": "ppl"
      }
    }
  ],
  "triggers": [
    {
      "ppl_trigger": {
        "name": "Too many errors",
        "severity": "1",
        "type": "number_of_results",
        "num_results_condition": ">",
        "num_results_value": 1,
        "actions": [
          {
            "name": "Notify ops channel",
            "destination_id": "your-destination-id",
            "message_template": {
              "source": {% raw %}"Monitor {{ctx.monitor.name}} detected {{ctx.ppl_query_results.size}} services with errors."{% endraw %}
            },
            "subject_template": {
              "source": "Alert: High Error Rate Detected"
            }
          }
        ]
      }
    },
    {
      "ppl_trigger": {
        "name": "Critical service errors",
        "severity": "1",
        "type": "custom",
        "custom_condition": "where error_count > 1",
        "actions": [
          {
            "name": "Page oncall",
            "destination_id": "your-destination-id",
            "message_template": {
              "source": {% raw %}"Critical error threshold exceeded:\n{{#ctx.ppl_query_results}}\n  Service: {{service}}, Errors: {{error_count}}\n{{/ctx.ppl_query_results}}"{% endraw %}
            },
            "subject_template": {
              "source": "CRITICAL: Service Error Threshold Exceeded"
            }
          }
        ]
      }
    }
  ]
}
```
{% include copy-curl.html %}

The response confirms that the monitor was created and returns its `_id`. The monitor runs on its configured schedule, and each run evaluates the triggers against the latest query results. When a trigger's condition is met, it fires and runs its actions.

## Testing a PPL monitor

To run a monitor immediately instead of waiting for its next scheduled run, use the Execute API with the monitor ID. Add `?dryrun=true` to evaluate the triggers without creating alerts or running actions:

```json
POST _plugins/_alerting/monitors/<monitor_id>/_execute?dryrun=true
```
{% include copy-curl.html %}

The response reports the query results and, for each trigger, whether it fired. The `triggered` field indicates whether each trigger's condition was met. For custom condition triggers, `ppl_query_results` contains the rows that matched the condition:

```json
{
  "monitor_name": "PPL Error Rate Monitor",
  "period_start": 1787067810953,
  "period_end": 1787068110953,
  "error": null,
  "input_results": {
    "results": [],
    "ppl_query_results": [
      { "error_count": 1, "service": "checkout" },
      { "error_count": 2, "service": "orders" }
    ],
    "ppl_num_results": 2,
    "error": null
  },
  "trigger_results": {
    "too_many_errors": {
      "name": "Too many errors",
      "triggered": true,
      "action_results": {},
      "ppl_query_results": [],
      "error": null
    },
    "critical_service_errors": {
      "name": "Critical service errors",
      "triggered": true,
      "action_results": {},
      "ppl_query_results": [
        { "error_count": 2, "service": "orders" }
      ],
      "error": null
    }
  }
}
```

## Settings

OpenSearch supports the following PPL monitor settings. All settings are dynamic, so you can change them without restarting your cluster:

- `plugins.alerting.monitor.max_ppl_triggers` (Dynamic, integer): The maximum number of triggers allowed per PPL monitor. This is also the highest accepted value, so you can only lower it. Default is `10`.

- `plugins.alerting.ppl_query_max_execution_duration` (Dynamic, time unit): The maximum execution time allowed for a PPL query during monitor execution. Default is `30s`.

- `plugins.alerting.ppl_monitor_max_query_length` (Dynamic, long): The maximum number of characters for a PPL query. Default is `2000`.

- `plugins.alerting.ppl_query_results_max_datarows` (Dynamic, long): The maximum number of data rows to retrieve when executing a PPL query. Default is `10000`.

- `plugins.alerting.ppl_query_results_max_size` (Dynamic, long): The maximum estimated size, in bytes, of query results stored in alerts and notifications. If the results exceed this size, the alert replaces them with a message stating that the PPL query results were too large. Default is `3000`.

