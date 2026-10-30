---
layout: default
title: Correlation engine APIs
parent: Security Analytics APIs
nav_order: 55
---

# Correlation engine APIs

Correlation engine APIs allow you to create new correlation rules, view findings and correlations within a certain time window, and perform other tasks.

---

## Create correlation rules between log types

Creates a correlation rule that correlates findings from two or more log sources.

### Endpoints

```json
POST /_plugins/_security_analytics/correlation/rules
```

### Request body fields

The following table lists the available request body fields.

| Field | Data type | Description |
| :--- | :--- |:--- |
| `name` | String | The name of the correlation rule. Optional. |
| `correlate` | Array | The log sources to correlate. Provide at least two. Required. |
| `correlate.index` | String | The name of the index used as the log source. |
| `correlate.query` | String | The query used to filter security logs for correlation. |
| `correlate.category` | String | The log type associated with the log source. |
| `time_window` | Long | The window, in milliseconds, within which findings must occur to be correlated. Optional. If not specified, the `plugins.security_analytics.correlation_time_window` cluster setting applies. |
| `trigger` | Object | Generates a correlation alert and sends notifications when the rule correlates findings. Optional. |
| `trigger.name` | String | The name of the trigger. |
| `trigger.severity` | String | Severity level for the trigger expressed as an integer: 1 = highest; 2 = high; 3 = medium; 4 = low; 5 = lowest. |
| `trigger.actions` | Array | The notifications to send when the trigger generates an alert. |
| `trigger.actions.name` | String | The name of the action. Required for each action. |
| `trigger.actions.destination_id` | String | The ID of the notification channel that receives the message. |
| `trigger.actions.subject_template.source` | String | The subject of the notification message. Can include [correlation rule trigger variables](#correlation-rule-trigger-variables). |
| `trigger.actions.subject_template.lang` | String | The scripting language used to define the subject. Must be `mustache`. |
| `trigger.actions.message_template.source` | String | The body of the notification message. Can include [correlation rule trigger variables](#correlation-rule-trigger-variables). |
| `trigger.actions.message_template.lang` | String | The scripting language used to define the message. Must be `mustache`. |
| `trigger.actions.throttle_enabled` | Boolean | Whether to limit the number of notifications sent within a span of time. Default is `false`. |
| `trigger.actions.throttle.unit` | String | The unit of time used for throttling. |
| `trigger.actions.throttle.value` | Integer | The number of units of time used for throttling. |

### Example request

```json
POST /_plugins/_security_analytics/correlation/rules
{
  "correlate": [
    {
      "index": "vpc_flow",
      "query": "dstaddr:4.5.6.7 or dstaddr:4.5.6.6",
      "category": "network"
    },
    {
      "index": "windows",
      "query": "winlog.event_data.SubjectDomainName:NTAUTHORI*",
      "category": "windows"
    },
    {
      "index": "ad_logs",
      "query": "ResultType:50126",
      "category": "ad_ldap"
    },
    {
      "index": "app_logs",
      "query": "endpoint:/customer_records.txt",
      "category": "others_application"
    }
  ]
}
```
{% include copy-curl.html %}

### Example response

```json
{
  "_id": "DxKEUIkBpIjg64IK4nXg",
  "_version": 1,
  "rule": {
    "name": null,
    "correlate": [
      {
        "index": "vpc_flow",
        "query": "dstaddr:4.5.6.7 or dstaddr:4.5.6.6",
        "category": "network"
      },
      {
        "index": "windows",
        "query": "winlog.event_data.SubjectDomainName:NTAUTHORI*",
        "category": "windows"
      },
      {
        "index": "ad_logs",
        "query": "ResultType:50126",
        "category": "ad_ldap"
      },
      {
        "index": "app_logs",
        "query": "endpoint:/customer_records.txt",
        "category": "others_application"
      }
    ]
  }
}
```

### Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- |:--- |
| `_id` | String | The ID for the new rule. |

### Correlation rule triggers

Add a `trigger` to a correlation rule to generate a correlation alert and send a notification each time the rule correlates findings. The following request creates a rule with a trigger that notifies a channel when a network finding correlates with an Active Directory finding:

```json
POST /_plugins/_security_analytics/correlation/rules
{
  "name": "network-ad-correlation",
  "time_window": 300000,
  "correlate": [
    {
      "index": "vpc_flow",
      "query": "dstaddr:4.5.6.7",
      "category": "network"
    },
    {
      "index": "ad_logs",
      "query": "ResultType:50126",
      "category": "ad_ldap"
    }
  ],
  "trigger": {
    "name": "correlation-trigger",
    "severity": "1",
    "actions": [
      {
        "name": "notify-security-team",
        "destination_id": "6r8ZBoQBKW_6dKriacQb",
        "subject_template": {
          "source": {% raw %}"Correlation alert: {{ctx.correlationRuleName}}"{% endraw %},
          "lang": "mustache"
        },
        "message_template": {
          "source": {% raw %}"Rule {{ctx.correlationRuleName}} correlated finding {{ctx.sourceFinding}} with findings {{ctx.correlatedFindingIds}} within {{ctx.timeWindow}} ms."{% endraw %},
          "lang": "mustache"
        },
        "throttle_enabled": false
      }
    ]
  }
}
```
{% include copy-curl.html %}

The response contains the generated trigger and action IDs:

```json
{
  "_id": "7mBjhqABedeO5z2szdu9",
  "_version": 1,
  "rule": {
    "name": "network-ad-correlation",
    "correlate": [
      {
        "index": "vpc_flow",
        "category": "network",
        "query": "dstaddr:4.5.6.7"
      },
      {
        "index": "ad_logs",
        "category": "ad_ldap",
        "query": "ResultType:50126"
      }
    ],
    "time_window": 300000,
    "trigger": {
      "id": "62BjhqABedeO5z2szdss",
      "name": "correlation-trigger",
      "severity": "1",
      "actions": [
        {
          "id": "6mBjhqABedeO5z2szdsr",
          "name": "notify-security-team",
          "destination_id": "6r8ZBoQBKW_6dKriacQb",
          "message_template": {
            "source": {% raw %}"Rule {{ctx.correlationRuleName}} correlated finding {{ctx.sourceFinding}} with findings {{ctx.correlatedFindingIds}} within {{ctx.timeWindow}} ms."{% endraw %},
            "lang": "mustache"
          },
          "throttle_enabled": false,
          "subject_template": {
            "source": {% raw %}"Correlation alert: {{ctx.correlationRuleName}}"{% endraw %},
            "lang": "mustache"
          }
        }
      ]
    }
  }
}
```

Each action requires a `name`. A request that omits it fails with an `uninitialized_property_access_exception` error.
{: .note}

### Correlation rule trigger variables

The following table lists the variables available in the `subject_template` and `message_template` of a correlation rule trigger action. These variables differ from the ones available in alerting monitors, which are described in [Monitor variables]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/monitors/#monitor-variables).

| Variable | Data type | Description |
| :--- | :--- | :--- |
| `ctx.correlationRuleName` | String | The name of the correlation rule that generated the alert. |
| `ctx.sourceFinding` | String | The ID of the finding that initiated the correlation. |
| `ctx.correlatedFindingIds` | Array | The IDs of the findings correlated with the source finding. |
| `ctx.timeWindow` | Long | The correlation time window, in milliseconds. |

To see the entire context object, add {% raw %}`{{ctx}}`{% endraw %} to the message body.

---

## List all findings and correlations within a certain time window

Lists all findings and their correlations within a certain time window.

### Endpoints

```json
GET /_plugins/_security_analytics/correlations
```

### Query parameters

The following table lists the available query parameters. Both query parameters are required.

| Parameter | Data type | Description |
| :--- | :--- |:--- |
| `start_timestamp` | Number | Start time for the time window, in milliseconds. |
| `end_timestamp` | Number | End time for the time window, in milliseconds. |

### Example request

```json
GET /_plugins/_security_analytics/correlations?start_timestamp=1689289210000&end_timestamp=1689300010000
```
{% include copy-curl.html %}

### Example response

```json
{
  "findings": [
    {
      "finding1": "931de5f0-a276-45d5-9cdb-83e1045a3630",
      "logType1": "network",
      "finding2": "1e6f6a12-83f1-4a38-9bb8-648f196859cc",
      "logType2": "test_windows",
      "rules": [
        "nqI2TokBgL5wWFPZ6Gfu"
      ]
    }
  ]
}
```

### Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- |:--- |
| `finding1` | String | The ID for a first finding in the correlation. |
| `logType1` | String | The log type associated with the first finding. |
| `finding2` | String | The ID for a second finding in the correlation. |
| `logType2` | String | The log type associated with the second finding. |
| `rules` | Array | A list of correlation rule IDs associated with the correlated findings. |

---

## List correlations for a finding belonging to a log type

Lists the findings correlated with a given finding.

### Endpoints

```json
GET /_plugins/_security_analytics/findings/correlate
```

### Query parameters

The following table lists the available query parameters.

| Parameter | Data type | Description |
| :--- | :--- |:--- |
| `finding` | String | The finding ID. Required. |
| `detector_type` | String | The log type for the detector. Required. |
| `nearby_findings` | Number | The number of nearby findings with respect to the given finding ID. Optional. |
| `time_window` | String | Sets a time window in which all of the correlations must have occurred together. Optional. |

### Example request

```json
GET /_plugins/_security_analytics/findings/correlate?finding=425dce0b-f5ee-4889-b0c0-7d15669f0871&detector_type=ad_ldap&nearby_findings=20&time_window=10m
```
{% include copy-curl.html %}

### Example response

```json
{
  "findings": [
    {
      "finding": "5c661104-aaa9-484b-a91f-9cad4ae6d5f5",
      "detector_type": "others_application",
      "score": 0.000015182109564193524
    },
    {
      "finding": "2485b623-6573-42f4-a055-9b927e38a65f",
      "detector_type": "ad_ldap",
      "score": 0.000001615897872397909
    },
    {
      "finding": "051e00ad-5996-4c41-be20-f992451d1331",
      "detector_type": "windows",
      "score": 0.000016230604160227813
    },
    {
      "finding": "f11ca8a3-50d7-4074-a951-51439aa9e67b",
      "detector_type": "s3",
      "score": 0.000001759401811796124
    },
    {
      "finding": "9b86980e-5fb7-4c5a-bd1b-879a1e3baf12",
      "detector_type": "network",
      "score": 0.0000016306962606904563
    },
    {
      "finding": "e7dea5a1-164f-48f9-880e-4ba33e508713",
      "detector_type": "network",
      "score": 0.00001632626481296029
    }
  ]
}
```

### Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- |:--- |
| `finding` | String | The finding ID. |
| `detector_type` | String | The log type associated with the finding. |
| `score` | Number | The correlation score for the correlated finding. The score is based on the proximity of relevant findings in the threat scenario defined by the correlation rule. |

---

## List correlation alerts

Lists the alerts generated by correlation rule triggers.

### Endpoints

```json
GET /_plugins/_security_analytics/correlationAlerts
```

### Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- |:--- |
| `correlation_rule_id` | String | The correlation rule ID. |

### Example request

```json
GET /_plugins/_security_analytics/correlationAlerts?correlation_rule_id=VjY0MpABPzR_pcEveVRq
```
{% include copy-curl.html %}

### Example response

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
    "correlationAlerts": [
        {
            "correlated_finding_ids": [
                "4f867df9-c9cb-4dc1-84bb-6c8b575f1a54"
            ],
            "correlation_rule_id": "VjY0MpABPzR_pcEveVRq",
            "correlation_rule_name": "rule-corr",
            "user": null,
            "id": "8532c08b-3ab5-4e95-a1c2-5884c4cd41a5",
            "version": 1,
            "schema_version": 1,
            "trigger_name": "trigger1",
            "state": "ACTIVE",
            "error_message": null,
            "severity": "1",
            "action_execution_results": [],
            "start_time": "2024-06-19T20:37:08.257Z",
            "end_time": "2024-06-19T20:42:08.257Z",
            "acknowledged_time": null
        },
        {
            "correlated_finding_ids": [
                "30d2109f-76bb-44ad-8f68-6daa905e018d"
            ],
            "correlation_rule_id": "VjY0MpABPzR_pcEveVRq",
            "correlation_rule_name": "rule-corr",
            "user": null,
            "id": "8bba85d9-a7fc-4c87-b35e-a7236b87159f",
            "version": 1,
            "schema_version": 1,
            "trigger_name": "trigger1",
            "state": "ACTIVE",
            "error_message": null,
            "severity": "1",
            "action_execution_results": [],
            "start_time": "2024-06-19T20:43:08.208Z",
            "end_time": "2024-06-19T20:48:08.208Z",
            "acknowledged_time": null
        }
    ],
    "total_alerts": 2
}
```
</details>

### Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- |:--- |
| `correlationAlerts` | Array | The correlation alerts that match the request. |
| `correlationAlerts.correlated_finding_ids` | Array | The IDs of the findings correlated by the rule. |
| `correlationAlerts.correlation_rule_id` | String | The ID of the correlation rule that generated the alert. |
| `correlationAlerts.correlation_rule_name` | String | The name of the correlation rule that generated the alert. |
| `correlationAlerts.user` | Object | The user associated with the correlation rule. |
| `correlationAlerts.id` | String | The alert ID. |
| `correlationAlerts.version` | Integer | The alert version. |
| `correlationAlerts.schema_version` | Integer | The version of the alert index schema. |
| `correlationAlerts.trigger_name` | String | The name of the trigger that generated the alert. |
| `correlationAlerts.state` | String | The alert state. Valid values are `ACTIVE`, `ACKNOWLEDGED`, `COMPLETED`, `ERROR`, and `DELETED`. |
| `correlationAlerts.error_message` | String | The error message for the alert, if any. |
| `correlationAlerts.severity` | String | The severity level of the trigger that generated the alert. |
| `correlationAlerts.action_execution_results` | Array | The results of the notification actions that the trigger ran. |
| `correlationAlerts.start_time` | String | The time at which the alert was generated. |
| `correlationAlerts.end_time` | String | The time at which the correlation time window ended. |
| `correlationAlerts.acknowledged_time` | String | The time at which the alert was acknowledged. `null` if the alert has not been acknowledged. |
| `total_alerts` | Integer | The total number of alerts returned. |

---

## Acknowledge correlation alerts

Acknowledges one or more correlation alerts.

### Endpoints

```json
POST /_plugins/_security_analytics/_acknowledge/correlationAlerts
```

### Request body fields

The following table lists the available request body fields.

| Field | Data type | Description |
| :--- | :--- |:--- |
| `alertIds` | Array | The IDs of the correlation alerts to acknowledge. Required. |

### Example request

```json
POST /_plugins/_security_analytics/_acknowledge/correlationAlerts
{
   "alertIds": ["8532c08b-3ab5-4e95-a1c2-5884c4cd41a5", "8bba85d9-a7fc-4c87-b35e-a7236b87159f"]
}
```
{% include copy-curl.html %}

### Example response

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
    "acknowledged": [
        {
            "correlated_finding_ids": [
                "4f867df9-c9cb-4dc1-84bb-6c8b575f1a54"
            ],
            "correlation_rule_id": "VjY0MpABPzR_pcEveVRq",
            "correlation_rule_name": "rule-corr",
            "user": null,
            "id": "8532c08b-3ab5-4e95-a1c2-5884c4cd41a5",
            "version": 1,
            "schema_version": 1,
            "trigger_name": "trigger1",
            "state": "ACTIVE",
            "error_message": null,
            "severity": "1",
            "action_execution_results": [],
            "start_time": "2024-06-19T20:37:08.257Z",
            "end_time": "2024-06-19T20:42:08.257Z",
            "acknowledged_time": null
        },
        {
            "correlated_finding_ids": [
                "30d2109f-76bb-44ad-8f68-6daa905e018d"
            ],
            "correlation_rule_id": "VjY0MpABPzR_pcEveVRq",
            "correlation_rule_name": "rule-corr",
            "user": null,
            "id": "8bba85d9-a7fc-4c87-b35e-a7236b87159f",
            "version": 1,
            "schema_version": 1,
            "trigger_name": "trigger1",
            "state": "ACTIVE",
            "error_message": null,
            "severity": "1",
            "action_execution_results": [],
            "start_time": "2024-06-19T20:43:08.208Z",
            "end_time": "2024-06-19T20:48:08.208Z",
            "acknowledged_time": null
        }
    ],
    "failed": []
}
```
</details>

### Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- |:--- |
| `acknowledged` | Array | The correlation alerts that were acknowledged. |
| `failed` | Array | The correlation alerts that could not be acknowledged. |
