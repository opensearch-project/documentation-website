---
layout: default
title: Alerts and findings APIs
parent: API tools
nav_order: 50
---


# Alerts and findings APIs

The following APIs can be used for tasks related to alerts and findings.

## Get alerts

Provides an option for fetching alerts related to a detector.

```json
GET _plugins/_security_analytics/detectors/alerts?detectorType=
```

## Sample request

```json
{
    "alerts": [{
        "detector_id": "detector_12345",
        "id": "alert_id_1",
        "version": -3,
        "schema_version": 0,
        "trigger_id": "trigger_id_1",
        "trigger_name": "my_trigger",
        "finding_ids": ["finding_id_1"],
        "related_doc_ids": ["docId1"],
        "state": "ACTIVE",
        "error_message": null,
        "alert_history": [],
        "severity": null,
        "action_execution_results": [{
            "action_id": "action_id_1",
            "last_execution_time": 1665693544996,
            "throttled_count": 0
        }],
        "start_time": "2022-10-13T20:39:04.995023Z",
        "last_notification_time": "2022-10-13T20:39:04.995028Z",
        "end_time": "2022-10-13T20:39:04.995027Z",
        "acknowledged_time": "2022-10-13T20:39:04.995028Z"
    }],
    "total_alerts": 1,
    "detectorType": "detector_12345"
}
```

See issue 55  details


### Parameters

You can specify the following parameters when requesting an alert.

Parameter | Type | Description 
:--- | :--- |:--- |:--- |
`detectorType` | The type of detector used to fetch alerts. Optional when the `detector_id` is specified. Otherwise required.
`total_alerts` | Integer | Total number of alerts that match the request.
`alerts` | Object | Object that provides fields to specify the alert.
`alerts`<br>&nbsp;&nbsp;&nbsp;&nbsp;`detector_id` | String | ID for the detector used to fetch alerts. Optional when the `detectorType` is specified. Otherwise required.

`type` | String | The type is specified as "detector".
`name` | String | Name of the detector.
`detector_type` | Object | The log type that defines the detector.
`schedule`<br>&nbsp;&nbsp;&nbsp;&nbsp;`period` | Object | the frequency at which the detector runs in repetition.
`schedule`<br>&nbsp;&nbsp;&nbsp;&nbsp;`period`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`interval` | Integer | The duration of the period expressed as a number.
`schedule`<br>&nbsp;&nbsp;&nbsp;&nbsp;`period`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`unit` | String | The unit of measure for the interval.
`inputs` | Object | TBD
`inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;`detector_inputs` | Object | TBD
`inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;`detector_inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`description` | String | TBD
`inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;`detector_inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`custom_rules` | Object | TBD

### Response fields

Alerts persist until you resolve the root cause and have the following states:

State | Description
:--- | :---
`ACTIVE` | The alert is ongoing and unacknowledged. Alerts remain in this state until you acknowledge them, delete the trigger associated with the alert, or delete the monitor entirely.
`ACKNOWLEDGED` | Someone has acknowledged the alert but not fixed the root cause.
`COMPLETED` | The alert is no longer ongoing. Alerts enter this state after the corresponding trigger evaluates to false.
`ERROR` | An error occurred while executing the trigger—usually the result of a a bad trigger or destination.
`DELETED` | Someone deleted the detector or trigger associated with this alert while the alert was ongoing.



## Acknowledge alerts

## Get findings



