---
layout: default
title: PPL monitors
nav_order: 10
parent: Monitors
grand_parent: Alerting
has_children: false
---

# PPL monitors

PPL monitors are a type of alert monitor that uses [Piped Processing Language (PPL)]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/) queries to monitor your data. They are essentially [per query monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/per-query-bucket-monitors/) that use PPL instead of DSL.

## Creating a PPL monitor

To create a PPL monitor, follow these steps:

1. Select **Alerting** > **Monitors** > **Create monitor**.
2. Select the **PPL monitor** option.
3. Enter a name for the monitor and configure the schedule (by time interval or custom cron expression).
4. In the **Query** section, enter your PPL query. For example:

   ```
   source = web_logs | stats avg(response_time) as avg_response by endpoint
   ```

5. Add one or more triggers. See [PPL triggers](#ppl-triggers) for details on configuring trigger conditions.
6. Add actions to specify notifications when triggers fire. See [Actions]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/actions/).
7. Select **Create**.

## PPL triggers

PPL monitors use `PPLTrigger` objects, which differ from the Painless script-based triggers used by other monitor types. Each PPL monitor supports up to 10 triggers.

### Number of results trigger

A number of results trigger evaluates the total number of rows returned by the base PPL query against a threshold. The following comparison operators are supported:

Operator | Description
:--- | :---
`>` | Greater than
`>=` | Greater than or equal to
`<` | Less than
`<=` | Less than or equal to
`==` | Equal to
`!=` | Not equal to

For example, to trigger an alert when more than 50 results are returned:

```json
{
  "ppl_trigger": {
    "name": "High result count",
    "severity": "1",
    "type": "number_of_results",
    "num_results_condition": ">",
    "num_results_value": 50,
    "actions": []
  }
}
```

### Custom condition trigger

A custom condition trigger appends a `where` clause to the base PPL query. If the modified query returns any results, the trigger fires. This allows you to define fine-grained conditions based on computed fields or aggregations.

For example, if your base query is:

```
source = web_logs | stats max(response_time) as max_response by endpoint
```

You can define a custom condition to trigger when any endpoint has a maximum response time above 3000 ms:

```json
{
  "ppl_trigger": {
    "name": "Slow endpoint detected",
    "severity": "2",
    "condition_type": "custom",
    "custom_condition": "where max_response > 3000",
    "actions": []
  }
}
```

The alerting plugin validates that the custom condition is a valid `where` statement during monitor creation.
{: .note}

## Template variables

PPL monitors provide the following additional template variable for use in [actions]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/actions/) and notification messages:

Variable | Data type | Description
:--- | :--- | :---
`ctx.ppl_query_results` | Array | A list of maps where each element represents a result row from the PPL query. Field names from the query schema serve as keys. For number of results triggers, this contains the base query results. For custom condition triggers, this contains the results of the query with the custom condition applied.

### Mustache template example

The following example iterates over PPL query results and outputs each row's fields:

{% raw %}
```
PPL Query Results:
{{#ctx.ppl_query_results}}
  Endpoint: {{endpoint}}, Average Response Time: {{avg_response}}
{{/ctx.ppl_query_results}}
```
{% endraw %}

## Query results format

The PPL plugin returns results in a schema/datarows format. The alerting plugin automatically transforms this into a list of maps for use in templates:

**Raw PPL response:**
```json
{
  "schema": [
    {"name": "endpoint", "type": "string"},
    {"name": "error_count", "type": "integer"}
  ],
  "datarows": [
    ["/api/orders", 3],
    ["/api/checkout", 1]
  ],
  "total": 2,
  "size": 2
}
```

**Transformed `ctx.ppl_query_results`:**
```json
[
  {"endpoint": "/api/orders", "error_count": 3},
  {"endpoint": "/api/checkout", "error_count": 1}
]
```

## API example

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
        "num_results_value": 10,
        "actions": [
          {
            "name": "Notify ops channel",
            "destination_id": "your-destination-id",
            "message_template": {
              "source": "Monitor {{ctx.monitor.name}} detected {{ctx.ppl_query_results.size}} services with errors."
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
        "custom_condition": "where error_count > 100",
        "actions": [
          {
            "name": "Page oncall",
            "destination_id": "your-destination-id",
            "message_template": {
              "source": "Critical error threshold exceeded:\n{{#ctx.ppl_query_results}}\n  Service: {{service}}, Errors: {{error_count}}\n{{/ctx.ppl_query_results}}"
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

## Settings

The following cluster settings control PPL monitor behavior. You can update these settings using the [cluster settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-settings/).

Setting | Default | Description
:--- | :--- | :---
`plugins.alerting.monitor.max_ppl_triggers` | 10 | The maximum number of triggers allowed per PPL monitor.
`plugins.alerting.ppl_query_max_execution_duration` | 30s | The maximum execution time allowed for a PPL query during monitor execution.
`plugins.alerting.ppl_monitor_max_query_length` | 2000 | The maximum character length of a PPL query.
`plugins.alerting.ppl_query_results_max_datarows` | 10000 | The maximum number of data rows to retrieve when executing a PPL query.
`plugins.alerting.ppl_query_results_max_size` | 3000 | The maximum size (in bytes, estimated) of query results stored in alerts and notifications. If the PPL query results exceed this size, the alert stops displaying the results and instead displays a message saying PPL query results were too large
