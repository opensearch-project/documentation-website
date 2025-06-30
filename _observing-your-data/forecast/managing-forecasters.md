---
layout: default
title: Managing forecasters
nav_order: 8
parent: Forecasting
has_children: false
---

# Managing forecasters

After you [create a forecaster]({{site.url}}{{site.baseurl}}/observing-your-data/forecast/getting-started/), you can manage its lifecycle and configuration using the **Details** page. This includes starting or stopping the forecaster, updating its settings, or deleting it entirely. Use this page to monitor forecaster status, troubleshoot issues, and fine-tune behavior over time.

## Forecasters table

The **Forecasters** table provides an overview of every forecaster you have configured.

| Column | Description |
|--------|-------------|
| **Name** | The name you assigned when creating the forecaster. |
| **Status** | The current lifecycle state—for example, `Running`, `Initializing`, or `Test complete`. Click the <i class="euiIcon euiIcon--xs euiIcon--expand"></i> icon for more information, including the timestamp of the most recent status change and any failure messages. |
| **Index** | The source index or alias from which the forecaster reads. |
| **Last updated** | The timestamp of the most recent configuration change. |
| **Quick actions** | Context-aware buttons such as **Start**, **Stop**, or **Delete**, depending on the forecaster's current state. |

## Execution states

A forecaster (that is, the underlying forecasting job) can be in any of the following states. Transitions marked *automatic* happen without user action; others require you to manually select **Start** or **Stop**.

| State | Description | Typical trigger |
|-------|-------------|------------------|
| **Inactive** | The forecaster was created but never started. | None. |
| **Inactive: stopped** | The forecaster was manually stopped after running. | User selects **Stop forecasting**. |
| **Awaiting data to initialize forecast** | The job is trying to start but lacks enough historical data. | Automatic. |
| **Awaiting data to restart forecast** | The job is resuming after a data gap and is waiting for new data. | Automatic after a data outage. |
| **Initializing test** | The model is being built for a one-time backtest. | Automatic on **Create and test** or **Start test**. |
| **Test complete** | The backtest has finished and the job is no longer running. | Automatic. |
| **Initializing forecast** | The model is being trained for continuous real-time forecasting. | Automatic after selecting **Start forecasting**. |
| **Running** | The job is streaming live data and generating forecasts. | Automatic when initialization completes successfully. |
| **Initializing test failed** | The test failed, often due to insufficient data. | Automatic. |
| **Initializing forecast failed** | Real-time mode failed to initialize. | Automatic. |
| **Forecast failed** | The job started but encountered a runtime error, such as a shard failure. | Automatic but requires the user's attention. |

The following diagram illustrates the relationships and transitions between states.

<img src="{{site.url}}{{site.baseurl}}/images/forecast/state.png" alt="Forecast state diagram" width="1600" height="1600">

## Find and filter forecasters

If you have many forecasters, use the pagination controls at the bottom of the table to navigate between pages. You can also use the search bar to filter by **name**, **status**, or **index**, which can be helpful when managing large sets of forecasters.

## Alert on forecasted values

Because forecast result indexes are not system indexes, you can create an [Alerting monitor]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/) for the result indexes like you would for any other user index.

### Example alert monitor

For example, the following is a monitor for a high-cardinality forecaster. You can modify the schedule, query, and aggregation to match your use case:

{% raw %}
```json
{
   "name": "test",
   "type": "monitor",
   "monitor_type": "query_level_monitor",
   "enabled": true,
   "schedule": {
      "period": {
         "unit": "MINUTES",
         "interval": 1
      }
   },
   "inputs": [
      {
         "search": {
            "indices": [
               "opensearch-forecast-results*"
            ],
            "query": {
               "size": 1,
               "query": {
                  "bool": {
                     "filter": [
                        {
                           "range": {
                              "execution_end_time": {
                                 "from": "{{period_end}}||-15m",
                                 "to": "{{period_end}}",
                                 "include_lower": true,
                                 "include_upper": true,
                                 "format": "epoch_millis",
                                 "boost": 1
                              }
                           }
                        }
                     ],
                     "adjust_pure_negative": true,
                     "boost": 1
                  }
               },
               "aggregations": {
                  "metric": {
                     "max": {
                        "field": "forecast_upper_bound"
                     }
                  }
               }
            }
         }
      }
   ],
   "triggers": [
      {
         "query_level_trigger": {
            "id": "29oAl5cB5QuI4WJQ3hnx",
            "name": "breach",
            "severity": "1",
            "condition": {
               "script": {
                  "source": "return ctx.results[0].aggregations.metric.value == null ? false : ctx.results[0].aggregations.metric.value > 10000",
                  "lang": "painless"
               }
            },
            "actions": [
               {
                  "id": "notification378084",
                  "name": "email",
                  "destination_id": "2uzIlpcBMf-0-aT5HOtn",
                  "message_template": {
                     "source": "Monitor **{{ctx.monitor.name}}** entered **ALERT** state — please investigate.\n\nTrigger    : {{ctx.trigger.name}}\nSeverity   : {{ctx.trigger.severity}}\nTime range : {{ctx.periodStart}} → {{ctx.periodEnd}} UTC\n\nEntity\n{{#ctx.results.0.hits.hits.0._source.entity}}\n  • {{name}} = {{value}}\n{{/ctx.results.0.hits.hits.0._source.entity}}\n",
                     "lang": "mustache"
                  },
                  "throttle_enabled": true,
                  "subject_template": {
                     "source": "Alerting Notification action",
                     "lang": "mustache"
                  },
                  "throttle": {
                     "value": 15,
                     "unit": "MINUTES"
                  }
               }
            ]
         }
      }
   ],
   "ui_metadata": {
      "schedule": {
         "timezone": null,
         "frequency": "interval",
         "period": {
            "unit": "MINUTES",
            "interval": 1
         },
         "daily": 0,
         "weekly": {
            "tue": false,
            "wed": false,
            "thur": false,
            "sat": false,
            "fri": false,
            "mon": false,
            "sun": false
         },
         "monthly": {
            "type": "day",
            "day": 1
         },
         "cronExpression": "0 */1 * * *"
      },
      "monitor_type": "query_level_monitor",
      "search": {
         "searchType": "query",
         "timeField": "execution_end_time",
         "aggregations": [
            {
               "aggregationType": "max",
               "fieldName": "forecast_upper_bound"
            }
         ],
         "groupBy": [],
         "bucketValue": 15,
         "bucketUnitOfTime": "m",
         "filters": []
      }
   }
}
```
{% endraw %}
{% include copy-curl.html %}

### Monitor design

The following table explains each design choice used in the example alert monitor and why it matters.

| Design choice | Rationale |
|---------------|-----------|
| `size: 1` in the search input | Retrieves a single document so you can reference `ctx.results.0.hits.hits.0` in the notification to identify which entity (such as `host` or `service`) triggered the alert. |
| `execution_end_time` range `"now-15m"` → `now` | Filters on the result creation timestamp, which reflects when the forecast was generated. This avoids delays caused by ingestion lag. Avoid filtering on `data_end_time` if your index includes late-arriving data (such as backfilled logs). |
| `max(forecast_upper_bound)` as the metric | Detects upper-bound spikes. Alternatives include: <br> `min(forecast_lower_bound)` for sudden drops. <br> `avg(forecast_value)` for trend shifts. <br> For additional fields, see the [forecast result schema](https://github.com/opensearch-project/anomaly-detection/blob/main/src/main/resources/mappings/forecast-results.json). |
| Index pattern `opensearch-forecast-results*` | Matches the default result index pattern. Update this pattern if you route results to a custom index, such as `opensearch-forecast-result-abc*`. |
| Optional term filter on `forecaster_id` | Use this filter to target a specific forecaster and avoid matching unrelated forecasts. |
| Monitor every 1 min, query window 15 min | Evaluates forecasts every minute to detect anomalies quickly. The 15-minute lookback increases resilience to timing delays. Combined with a 15-minute alert throttle, this avoids duplicate notifications for the same event. |
| Mustache block prints all entity dimensions | Displays both single-dimension (`host=server_3`) and multi-dimension (`host=server_3`, `service=auth`) entity values. You can also include a link to a pre-filtered dashboard for faster triage. |
| Threshold | Use the OpenSearch Dashboards visual editor to analyze recent forecast values and determine an appropriate threshold that reliably indicates anomalies. |


### Example alert

The following example shows a sample alert email generated by a monitor that detects when a forecasted value breaches a defined threshold. In this case, the monitor is tracking a high-cardinality forecaster and has triggered an alert for a specific entity (`host = server_3`):

```
Monitor **test** entered **ALERT** state — please investigate.

Trigger    : breach
Severity   : 1
Time range : 2025-06-22T09:56:14.490Z → 2025-06-22T09:57:14.490Z UTC

Entity
  • host = server_3
```

## Next steps

After setting up and managing your forecasters, you may want to control who can access and modify them. To learn how to manage permissions, secure result indexes, and apply fine-grained access controls, see [the security page]({{site.url}}{{site.baseurl}}/observing-your-data/forecast/security/).


