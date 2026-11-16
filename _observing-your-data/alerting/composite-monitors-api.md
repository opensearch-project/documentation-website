---
layout: default
title: Composite Monitor API
parent: Alerting
nav_order: 65
---

# Composite Monitor API

Use the Composite Monitor API to create and manage [composite monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/composite-monitors/) and their chained alerts. In the API, a composite monitor is called a _workflow_, and its ID is the workflow ID.

## Create Composite Monitor

Creates a composite monitor.

### Endpoints

```json
POST _plugins/_alerting/workflows
```

### Request body fields

The following table lists the available request body fields.

Field | Data type | Required | Description
:--- | :--- | :--- | :---
`name` | String | Required | The name of the composite monitor.
`workflow_type` | String | Required | Set to `composite`.
`schedule` | Object | Required | How often the composite monitor runs. See [The `schedule` object](#the-schedule-object).
`inputs` | Array | Required | The delegate monitors and the order in which they run. See [The `inputs` array](#the-inputs-array).
`triggers` | Array | Optional | The triggers that generate chained alerts. See [The `triggers` array](#the-triggers-array).
`enabled` | Boolean | Optional | Whether the composite monitor is enabled. Default is `true`.

### The `schedule` object

The `schedule` object contains the `period` object, which contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`interval` | Integer | The number of time units between runs.
`unit` | String | The time unit for the interval. Valid values are `MINUTES`, `HOURS`, and `DAYS`.

### The `inputs` array

The `inputs` array contains one object with the `composite_input.sequence.delegates` array. Each object in the `delegates` array contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`order` | Integer | The position of the delegate monitor in the sequence. Delegate monitors run in ascending order.
`monitor_id` | String | The ID of the delegate monitor. A composite monitor supports per query, per bucket, and per document monitors as delegate monitors.

### The `triggers` array

Each object in the `triggers` array contains a `chained_alert_trigger` object, which contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`id` | String | The trigger ID.
`name` | String | The trigger name.
`severity` | String | The alert severity, from `1` (highest) to `5` (lowest).
`condition` | Object | The trigger condition. Contains a `script` object, in which `source` is the Painless condition that generates a chained alert and `lang` is `painless`. See [Defining chained alert trigger conditions](#defining-chained-alert-trigger-conditions).
`actions` | Array | The actions to perform when the trigger condition is met. For the action fields, see [Actions]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/actions/).

### Defining chained alert trigger conditions

A chained alert trigger condition refers to delegate monitors using `monitor[id=<monitor-id>]`, which is `true` when the delegate monitor generates an alert in the current run. You can combine the references using the following operators:

- `&&` (AND)
- `||` (OR)
- `!` (NOT)
- `()` (precedence)

For example:

- `monitor[id=1] && monitor[id=2]` generates a chained alert when both monitor 1 and monitor 2 generate an alert.
- `monitor[id=1] || !monitor[id=2]` generates a chained alert when monitor 1 generates an alert or monitor 2 doesn't generate an alert.
- `monitor[id=1] && (monitor[id=2] || monitor[id=3])` generates a chained alert when monitor 1 generates an alert and either monitor 2 or monitor 3 generates an alert.

The order of the monitor IDs in a condition doesn't affect the order in which the delegate monitors run. The run order is set by the `order` field in the `delegates` array.
{: .note }

### Example request

The following request creates a composite monitor with two delegate monitors and two triggers. The `Both monitors` trigger generates a chained alert when both delegate monitors generate an alert. The `Either monitor` trigger generates a chained alert when at least one of them does:

```json
POST _plugins/_alerting/workflows
{
  "name": "Traffic and errors",
  "workflow_type": "composite",
  "enabled": true,
  "schedule": {
    "period": {
      "interval": 1,
      "unit": "MINUTES"
    }
  },
  "inputs": [
    {
      "composite_input": {
        "sequence": {
          "delegates": [
            {
              "order": 1,
              "monitor_id": "grsbCIcBvEHfkjWFeCqb"
            },
            {
              "order": 2,
              "monitor_id": "agasbCIcBvEHfkjWFeCqa"
            }
          ]
        }
      }
    }
  ],
  "triggers": [
    {
      "chained_alert_trigger": {
        "id": "m1ANDm2",
        "name": "Both monitors",
        "severity": "1",
        "condition": {
          "script": {
            "source": "(monitor[id=grsbCIcBvEHfkjWFeCqb] && monitor[id=agasbCIcBvEHfkjWFeCqa])",
            "lang": "painless"
          }
        },
        "actions": []
      }
    },
    {
      "chained_alert_trigger": {
        "id": "m1ORm2",
        "name": "Either monitor",
        "severity": "2",
        "condition": {
          "script": {
            "source": "(monitor[id=grsbCIcBvEHfkjWFeCqb] || monitor[id=agasbCIcBvEHfkjWFeCqa])",
            "lang": "painless"
          }
        },
        "actions": []
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Get Composite Monitor

Returns the configuration of a composite monitor.

### Endpoints

```json
GET _plugins/_alerting/workflows/{workflow_id}
```

### Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`workflow_id` | String | The workflow ID of the composite monitor. Required.

### Example request

```json
GET _plugins/_alerting/workflows/SX9egKEBrJhc2kcbnbU_
```
{% include copy-curl.html %}

## Update Composite Monitor

Replaces the configuration of a composite monitor. The request body fields are the same as for [Create Composite Monitor](#create-composite-monitor).

### Endpoints

```json
PUT _plugins/_alerting/workflows/{workflow_id}
```

### Example request

The following request changes the composite monitor to run every 5 minutes and keeps only the `Both monitors` trigger:

```json
PUT _plugins/_alerting/workflows/SX9egKEBrJhc2kcbnbU_
{
  "name": "Traffic and errors",
  "workflow_type": "composite",
  "enabled": true,
  "schedule": {
    "period": {
      "interval": 5,
      "unit": "MINUTES"
    }
  },
  "inputs": [
    {
      "composite_input": {
        "sequence": {
          "delegates": [
            {
              "order": 1,
              "monitor_id": "grsbCIcBvEHfkjWFeCqb"
            },
            {
              "order": 2,
              "monitor_id": "agasbCIcBvEHfkjWFeCqa"
            }
          ]
        }
      }
    }
  ],
  "triggers": [
    {
      "chained_alert_trigger": {
        "id": "m1ANDm2",
        "name": "Both monitors",
        "severity": "1",
        "condition": {
          "script": {
            "source": "(monitor[id=grsbCIcBvEHfkjWFeCqb] && monitor[id=agasbCIcBvEHfkjWFeCqa])",
            "lang": "painless"
          }
        },
        "actions": []
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Delete Composite Monitor

Deletes a composite monitor. The delegate monitors are not deleted.

### Endpoints

```json
DELETE _plugins/_alerting/workflows/{workflow_id}
```

### Example request

```json
DELETE _plugins/_alerting/workflows/SX9egKEBrJhc2kcbnbU_
```
{% include copy-curl.html %}

## Execute Composite Monitor

Runs a composite monitor immediately and returns the trigger results.

### Endpoints

```json
POST _plugins/_alerting/workflows/{workflow_id}/_execute
```

### Example request

```json
POST _plugins/_alerting/workflows/SX9egKEBrJhc2kcbnbU_/_execute
```
{% include copy-curl.html %}

### Example response

```json
{
    "execution_id": "I0GXeIgBYKBG2nHoiHCL_2023-06-01T20:18:48.511884_a9c1d055-9b70-49c2-b32a-716cff1f562e",
    "workflow_name": "scale_up",
    "workflow_id": "I0GXeIgBYKBG2nHoiHCL",
    "trigger_results": {
        "m1ANDm2": {
            "name": "jnkjn",
            "triggered": true,
            "action_results": {},
            "error": null
        },
        "m1ORm2": {
            "name": "jnkjn",
            "triggered": true,
            "action_results": {},
            "error": null
        }
    },
    "monitor_run_results": [{
            "monitor_name": "test triggers",
            "period_start": 1685650668501,
            "period_end": 1685650728501,
            "error": null,
            "input_results": {
                "results": [{
                    "bhjh": [
                        "OkGceIgBYKBG2nHoyHAn|test1",
                        "O0GceIgBYKBG2nHozHCW|test1"
                    ],
                    "nkjkj": [
                        "OkGceIgBYKBG2nHoyHAn|test1",
                        "O0GceIgBYKBG2nHozHCW|test1"
                    ],
                    "jknkjn": [
                        "OkGceIgBYKBG2nHoyHAn|test1",
                        "O0GceIgBYKBG2nHozHCW|test1"
                    ]
                }],
                "error": null
            },
            "trigger_results": {
                "NC3Dd4cBCDCIfBYtViLI": {
                    "name": "njkkj",
                    "triggeredDocs": [
                        "OkGceIgBYKBG2nHoyHAn|test1",
                        "O0GceIgBYKBG2nHozHCW|test1"
                    ],
                    "action_results": {},
                    "error": null
                }
            }
        },
        {
            "monitor_name": "test triggers 2",
            "period_start": 1685650668501,
            "period_end": 1685650728501,
            "error": null,
            "input_results": {
                "results": [{
                    "bhjh": [
                        "PEGceIgBYKBG2nHo1HCw|test",
                        "PUGceIgBYKBG2nHo3HA8|test"
                    ],
                    "nkjkj": [
                        "PEGceIgBYKBG2nHo1HCw|test",
                        "PUGceIgBYKBG2nHo3HA8|test"
                    ],
                    "jknkjn": [
                        "PEGceIgBYKBG2nHo1HCw|test",
                        "PUGceIgBYKBG2nHo3HA8|test"
                    ]
                }],
                "error": null
            },
            "trigger_results": {
                "NC3Dd4cBCDCIfBYtViLI": {
                    "name": "njkkj",
                    "triggeredDocs": [
                        "PEGceIgBYKBG2nHo1HCw|test",
                        "PUGceIgBYKBG2nHo3HA8|test"
                    ],
                    "action_results": {},
                    "error": null
                }
            }
        }
    ],
    "execution_start_time": "2023-06-01T20:18:48.511874Z",
    "execution_end_time": "2023-06-01T20:18:53.682405Z",
    "error": null
}
```

## Get Chained Alerts

Returns the chained alerts generated by composite monitors.

### Endpoints

```json
GET _plugins/_alerting/workflows/alerts
```

### Query parameters

The following table lists the available query parameters. All query parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`workflowIds` | String | A comma-separated list of workflow IDs. Returns only the alerts generated by these composite monitors.
`getAssociatedAlerts` | Boolean | When `true`, the response also contains the audit alerts generated by the delegate monitors. Default is `false`.

### Example request

```json
GET _plugins/_alerting/workflows/alerts?workflowIds=SX9egKEBrJhc2kcbnbU_&getAssociatedAlerts=true
```
{% include copy-curl.html %}

### Example response

```json
{
    "alerts": [
        {
            "id": "PbQoZokBfd2ci_FqMGi6",
            "version": 1,
            "monitor_id": "",
            "workflow_id": "G7QoZokBfd2ci_FqD2iZ",
            "workflow_name": "scale_up",
            "associated_alert_ids": [
                "4e8256c5-529a-484c-bf7b-d3980c03e9a4",
                "513a8cb3-44bc-4eee-8aac-131be10b399e"
            ],
            "schema_version": -1,
            "monitor_version": -1,
            "monitor_name": "",
            "execution_id": "G7QoZokBfd2ci_FqD2iZ_2023-07-17T23:20:55.244970_edd977d2-c02b-4cbe-8a79-2aa7991c4191",
            "trigger_id": "m1ANDm2",
            "trigger_name": "jnkjn",
            "finding_ids": [],
            "related_doc_ids": [],
            "state": "ACTIVE",
            "error_message": null,
            "alert_history": [],
            "severity": "1",
            "action_execution_results": [],
            "start_time": 1689636057269,
            "last_notification_time": 1689636057270,
            "end_time": null,
            "acknowledged_time": null
        },
        {
            "id": "PrQoZokBfd2ci_FqMGj8",
            "version": 1,
            "monitor_id": "",
            "workflow_id": "G7QoZokBfd2ci_FqD2iZ",
            "workflow_name": "scale_up",
            "associated_alert_ids": [
                "4e8256c5-529a-484c-bf7b-d3980c03e9a4",
                "513a8cb3-44bc-4eee-8aac-131be10b399e"
            ],
            "schema_version": -1,
            "monitor_version": -1,
            "monitor_name": "",
            "execution_id": "G7QoZokBfd2ci_FqD2iZ_2023-07-17T23:20:55.244970_edd977d2-c02b-4cbe-8a79-2aa7991c4191",
            "trigger_id": "m1ORm2",
            "trigger_name": "jnkjn",
            "finding_ids": [],
            "related_doc_ids": [],
            "state": "ACTIVE",
            "error_message": null,
            "alert_history": [],
            "severity": "1",
            "action_execution_results": [],
            "start_time": 1689636057340,
            "last_notification_time": 1689636057340,
            "end_time": null,
            "acknowledged_time": null
        }
    ],
    "associatedAlerts": [
        {
            "id": "4e8256c5-529a-484c-bf7b-d3980c03e9a4",
            "version": -1,
            "monitor_id": "DrQoZokBfd2ci_FqCWh8",
            "workflow_id": "G7QoZokBfd2ci_FqD2iZ",
            "workflow_name": "",
            "associated_alert_ids": [],
            "schema_version": 5,
            "monitor_version": 1,
            "monitor_name": "test triggers",
            "execution_id": "G7QoZokBfd2ci_FqD2iZ_2023-07-17T23:20:55.244970_edd977d2-c02b-4cbe-8a79-2aa7991c4191",
            "trigger_id": "NC3Dd4cBCDCIfBYtViLI",
            "trigger_name": "njkkj",
            "finding_ids": [
                "277afca7-d5aa-46ed-8023-5449ece65d36"
            ],
            "related_doc_ids": [
                "H7QoZokBfd2ci_FqFmii|test1"
            ],
            "state": "AUDIT",
            "error_message": null,
            "alert_history": [],
            "severity": "1",
            "action_execution_results": [],
            "start_time": 1689636056410,
            "last_notification_time": 1689636056410,
            "end_time": null,
            "acknowledged_time": null
        },
        {
            "id": "513a8cb3-44bc-4eee-8aac-131be10b399e",
            "version": -1,
            "monitor_id": "EbQoZokBfd2ci_FqCmiR",
            "workflow_id": "G7QoZokBfd2ci_FqD2iZ",
            "workflow_name": "",
            "associated_alert_ids": [],
            "schema_version": 5,
            "monitor_version": 1,
            "monitor_name": "test triggers 2",
            "execution_id": "G7QoZokBfd2ci_FqD2iZ_2023-07-17T23:20:55.244970_edd977d2-c02b-4cbe-8a79-2aa7991c4191",
            "trigger_id": "NC3Dd4cBCDCIfBYtViLI",
            "trigger_name": "njkkj",
            "finding_ids": [
                "6d185585-a077-4dde-8e43-b4c01b9f3102"
            ],
            "related_doc_ids": [
                "ILQoZokBfd2ci_FqGmhb|test"
            ],
            "state": "AUDIT",
            "error_message": null,
            "alert_history": [],
            "severity": "1",
            "action_execution_results": [],
            "start_time": 1689636056943,
            "last_notification_time": 1689636056943,
            "end_time": null,
            "acknowledged_time": null
        }
    ],
    "totalAlerts": 2
}
```

### Response body fields

The following table lists all response body fields.

Field | Data type | Description
:--- | :--- | :---
`alerts` | Array | The chained alerts generated by the composite monitors.
`associatedAlerts` | Array | The audit alerts generated by the delegate monitors. Returned only when `getAssociatedAlerts` is `true`.
`totalAlerts` | Integer | The total number of chained alerts.

## Acknowledge Chained Alerts

Acknowledges one or more active chained alerts. Alerts that are already in the `ERROR`, `COMPLETED`, or `ACKNOWLEDGED` state are returned in the `failed` array.

### Endpoints

```json
POST _plugins/_alerting/workflows/{workflow_id}/_acknowledge/alerts
```

### Request body fields

The following table lists the available request body fields.

Field | Data type | Required | Description
:--- | :--- | :--- | :---
`alerts` | Array of strings | Required | The IDs of the alerts to acknowledge. To get alert IDs, use [Get Chained Alerts](#get-chained-alerts).

### Example request

```json
POST _plugins/_alerting/workflows/SX9egKEBrJhc2kcbnbU_/_acknowledge/alerts
{
  "alerts": ["VH9egKEBrJhc2kcbnrU5"]
}
```
{% include copy-curl.html %}

### Example response

```json
{
  "success": ["VH9egKEBrJhc2kcbnrU5"],
  "failed": []
}
```
