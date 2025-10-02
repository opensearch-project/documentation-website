---
layout: default
title: Managing anomalies
nav_order: 60
parent: Anomaly detection
has_children: false
---

## Alert on anomalies

You can create an [Alerting monitor]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/) using either the Anomaly detector editor or the Extraction query editor. When you want to monitor an individual anomaly detector's results and notification condition thresholds on anomaly grade and confidence, use the Anomaly detector editor. Otherwise, use the Extraction query editor to monitor multiple detectors' results or write complex queries/trigger conditions.

<img src="{{site.url}}{{site.baseurl}}/images/anomaly-detection/alerting_editor.png" alt="Alerting editor" width="800" height="800">

### Example alert monitor

For example, the following is a monitor for a high-cardinality detector. You can modify the schedule, query, and aggregation to match your use case:

{% raw %}
```json
{
   "name": "ad-monitor",
   "type": "monitor",
   "monitor_type": "query_level_monitor",
   "enabled": true,
   "schedule": {
      "period": {
         "unit": "MINUTES",
         "interval": 2
      }
   },
   "inputs": [
      {
         "search": {
            "indices": [
               ".opendistro-anomaly-results*"
            ],
            "query": {
               "size": 1,
               "sort": [
                  {
                     "anomaly_grade": "desc"
                  },
                  {
                     "confidence": "desc"
                  }
               ],
               "query": {
                  "bool": {
                     "filter": [
                        {
                           "range": {
                              "execution_end_time": {
                                 "from": "{{period_end}}||-2m",
                                 "to": "{{period_end}}",
                                 "include_lower": true,
                                 "include_upper": true
                              }
                           }
                        },
                        {
                           "term": {
                              "detector_id": {
                                 "value": "oJzeoZkB8KmRTvydzJDF"
                              }
                           }
                        }
                     ]
                  }
               },
               "aggregations": {
                  "max_anomaly_grade": {
                     "max": {
                        "field": "anomaly_grade"
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
            "id": "i5zuoZkB8KmRTvydn5Hg",
            "name": "ad-trigger",
            "severity": "1",
            "condition": {
               "script": {
                  "source": "return ctx.results != null && ctx.results.length > 0 && ctx.results[0].aggregations != null && ctx.results[0].aggregations.max_anomaly_grade != null && ctx.results[0].hits.total.value > 0 && ctx.results[0].hits.hits[0]._source != null && ctx.results[0].hits.hits[0]._source.confidence != null && ctx.results[0].aggregations.max_anomaly_grade.value != null && ctx.results[0].aggregations.max_anomaly_grade.value > 0.7 && ctx.results[0].hits.hits[0]._source.confidence > 0.7",
                  "lang": "painless"
               }
            },
            "actions": [
               {
                  "id": "notification606448",
                  "name": "ad-action",
                  "destination_id": "fpzsoZkB8KmRTvydkZGQ",
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
                     "value": 2,
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
            "interval": 2
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
         "cronExpression": "0 */2 * * *"
      },
      "monitor_type": "query_level_monitor",
      "search": {
         "searchType": "ad",
         "timeField": "",
         "aggregations": [],
         "groupBy": [],
         "bucketValue": 1,
         "bucketUnitOfTime": "h",
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
| `execution_end_time` range `"now-2m"` → `now` | Filters on the result creation timestamp, which reflects when the forecast was generated. This avoids delays caused by ingestion lag. Avoid filtering on `data_end_time` if your index includes late-arriving data (such as backfilled logs). |
| `max(anomaly_grade)` as the metric | Detects the most severe anomaly. You can use any field in the anomaly result index for aggregation. For additional fields, see the [Anomaly result mapping]({{site.url}}{{site.baseurl}}/monitoring-plugins/ad/result-mapping/ |
| Index pattern `.opendistro-anomaly-results*` | Matches the default result index pattern. Update this pattern if you route results to a custom index, such as `opensearch-ad-plugin-result-abc*`. |
| Optional term filter on `detector_id` | Use this filter to target a specific detector and avoid matching unrelated anomalies. |
| Monitor every 2 min, query window 2 min | Evaluate results every two minutes to detect anomalies quickly. The 2-minute lookback increases resilience to timing delays. Combined with a 2-minute alert throttle, this avoids duplicate notifications for the same event. |
| Mustache block prints all entity dimensions | Displays both single-dimension (`host=server_3`) and multi-dimension (`host=server_3`, `service=auth`) entity values. You can also include a link to a pre-filtered dashboard for faster triage. |
| Trigger when `max_anomaly_grade > 0.7` and `confidence > 0.7` | Use Alerting's trigger to determine an appropriate threshold that reliably indicates anomalies. |


### Example alert

The following example shows a sample alert email generated by a monitor that detects when an anomaly breaches a defined threshold. In this case, the monitor is tracking a high-cardinality detector and has triggered an alert for a specific entity (`host = server_3`):

```
Monitor **ad-monitor** entered **ALERT** state — please investigate.

Trigger    : ad-trigger
Severity   : 1
Time range : 2025-10-01T23:42:33.699Z → 2025-10-01T23:44:33.699Z UTC

Entity
  • host = server_3
```