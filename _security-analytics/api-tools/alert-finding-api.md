---
layout: default
title: Alerts and findings APIs
parent: API tools
nav_order: 50
---


# Alerts and findings APIs

The following APIs can be used for tasks related to alerts and findings.


## Get alerts

Provides an option for retrieving alerts related to a specific detector type or detector ID.

### Parameters

You can specify the following parameters when requesting an alert.

Parameter | Description 
:--- | :---
`detectorId` | The ID of the detector used to fetch alerts. Optional when the `detectorType` is specified. Otherwise required.
`detectorType` | The type of detector used to fetch alerts. Optional when the `detectorId` is specified. Otherwise required.
`severityLevel` | Used to filter by alert severity level. Optional.
`alertState` | Used to filter by alert state. Possible values: ACTIVE, ACKNOWLEDGED, COMPLETED, ERROR, DELETED. Optional.
`sortString` | This field specifies which string security analytics uses to sort the alerts. Optional.
`sortOrder` | The order used to sort the list of findings, either `ascending` or `descending`. Optional.
`missing` | A list of fields for which there are no found alias mappings. Optional.
`size` | An optional limit for the maximum number of results returned in the response. Optional.
`startIndex` | The pagination indicator. Optional.
`searchString` | The alert attribute you want returned in the search. Optional.

### Sample request

```json
GET /_plugins/_security_analytics/alerts?detectorType=windows
```

### Sample response

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
    "detectorType": "windows"
}
```

#### Response fields

Alerts persist until you resolve the root cause and have the following states:

State | Description
:--- | :---
`ACTIVE` | The alert is ongoing and unacknowledged. Alerts remain in this state until you acknowledge them, delete the trigger associated with the alert, or delete the monitor entirely.
`ACKNOWLEDGED` | Someone has acknowledged the alert but not fixed the root cause.
`COMPLETED` | The alert is no longer ongoing. Alerts enter this state after the corresponding trigger evaluates to false.
`ERROR` | An error occurred while executing the trigger—usually the result of a a bad trigger or destination.
`DELETED` | Someone deleted the detector or trigger associated with this alert while the alert was ongoing.


## Acknowledge alerts

```json
POST /_plugins/_security_analytics/<detector_id>/_acknowledge/alerts
Request body {
    alerts : ["alertId1", "alertId2"]
}
{

}
```


## Get findings

The Get findings API based on detector attributes.

### Sample request

```json
GET /_plugins/_security_analytics/findings/_search?*detectorType*=
{
    "total_findings":2,
    "findings":[
       {
            "detectorId":"12345",
            "id":"2b9663f4-ae77-4df8-b84f-688a0195723b",
            "related_doc_ids":[
                "5"
            ],
            "index":"sbwhrzgdlg",
            "queries":[
                {
                    "id":"f1bff160-587b-4500-b60c-ab22c7abc652",
                    "name":"3",
                    "query":"test_field:\"us-west-2\"",
                    "tags":[
                        
                    ]
                }
            ],
            "timestamp":1664401088804,
            "document_list":[
                {
                    "index":"sbwhrzgdlg",
                    "id":"5",
                    "found":true,
                    "document":"{\n            \"message\" : \"This is an error from IAD region\",\n            \"test_strict_date_time\" : \"2022-09-28T21:38:02.888Z\",\n            \"test_field\" : \"us-west-2\"\n        }"
                }
            ]
        },
        {
            "detectorId":"12345",
            "id":"f43a2701-0ef5-4931-8254-bdf510f73952",
            "related_doc_ids":[
                "1"
            ],
            "index":"sbwhrzgdlg",
            "queries":[
                {
                    "id":"f1bff160-587b-4500-b60c-ab22c7abc652",
                    "name":"3",
                    "query":"test_field:\"us-west-2\"",
                    "tags":[
                        
                    ]
                }
            ],
            "timestamp":1664401088746,
            "document_list":[
                {
                    "index":"sbwhrzgdlg",
                    "id":"1",
                    "found":true,
                    "document":"{\n            \"message\" : \"This is an error from IAD region\",\n            \"test_strict_date_time\" : \"2022-09-28T21:38:02.888Z\",\n            \"test_field\" : \"us-west-2\"\n        }"
                }
            ]
        }
    ]
}
```

