---
layout: default
title: Alerts and findings APIs
parent: API tools
nav_order: 50
canonical_url: https://docs.opensearch.org/latest/security-analytics/api-tools/alert-finding-api/
---


# Alerts and findings APIs

The following APIs can be used for tasks related to alerts and findings.

---

## Get alerts

Provides an option for retrieving alerts related to a specific detector type or detector ID.

### Parameters

You can specify the following parameters when requesting an alert.

Parameter | Description 
:--- | :---
`detector_id` | The ID of the detector used to fetch alerts. Optional when the `detectorType` is specified. Otherwise required.
`detectorType` | The type of detector used to fetch alerts. Optional when the `detector_Id` is specified. Otherwise required.
`severityLevel` | Used to filter by alert severity level. Optional.
`alertState` | Used to filter by alert state. Possible values are ACTIVE, ACKNOWLEDGED, COMPLETED, ERROR, or DELETED. Optional.
`sortString` | This field specifies which string Security Analytics uses to sort the alerts. Optional.
`sortOrder` | The order used to sort the list of findings. Possible values are `asc` or `desc`. Optional.
`missing` | A list of fields for which there are no found alias mappings. Optional.
`size` | An optional limit for the maximum number of results returned in the response. Optional.
`startIndex` | The pagination indicator. Optional.
`searchString` | The alert attribute you want returned in the search. Optional.

### Example request

```json
GET /_plugins/_security_analytics/alerts?detectorType=windows
```

### Example response

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

#### Response body fields

Alerts persist until you resolve the root cause and have the following states:

State | Description
:--- | :---
`ACTIVE` | The alert is ongoing and unacknowledged. Alerts remain in this state until you acknowledge them, delete the trigger associated with the alert, or delete the monitor entirely.
`ACKNOWLEDGED` | Someone has acknowledged the alert but not fixed the root cause.
`COMPLETED` | The alert is no longer ongoing. Alerts enter this state after the corresponding trigger evaluates to false.
`ERROR` | An error occurred while executing the trigger. This error is usually the result of a bad trigger or destination.
`DELETED` | Someone deleted the detector or trigger associated with this alert while the alert was ongoing.

---

## Acknowledge alerts

Sends an acknowledgement when an alert is triggered.

### Example request

```json
POST /_plugins/_security_analytics/detectors/<detector_id>/_acknowledge/alerts

{"alerts":["4dc7f5a9-2c82-4786-81ca-433a209d5205"]}
```

### Example response

```json
{
  "acknowledged": [
    {
      "detector_id": "8YT5fYQBZ8IUM4axics6",
      "id": "4dc7f5a9-2c82-4786-81ca-433a209d5205",
      "version": 1,
      "schema_version": 4,
      "trigger_id": "1TP5fYQBMkkIGY6Pg-q8",
      "trigger_name": "test-trigger",
      "finding_ids": [
        "2e167f4b-8063-40ef-80f8-2afd9bf095b8"
      ],
      "related_doc_ids": [
        "1|windows"
      ],
      "state": "ACTIVE",
      "error_message": null,
      "alert_history": [],
      "severity": "1",
      "action_execution_results": [
        {
          "action_id": "BopdoIJKXd",
          "last_execution_time": 1668560817925,
          "throttled_count": 0
        }
      ],
      "start_time": "2022-11-16T01:06:57.748Z",
      "last_notification_time": "2022-11-16T01:06:57.748Z",
      "end_time": null,
      "acknowledged_time": null
    }
  ],
  "failed": [],
  "missing": []
}
```

---

## Get findings

The Get Findings API returns findings based on the detector attributes.

### Parameters

You can specify the following parameters when getting findings.

Parameter | Description 
:--- | :---
`detector_id` | The ID of the detector used to fetch alerts. Optional.
`detectorType` | The type of detector used to fetch alerts. Optional.
`sortOrder` | The order used to sort the list of findings. Possible values are `asc` or `desc`. Optional.
`size` | An optional limit for the maximum number of results returned in the response. Optional.
`startIndex` | The pagination indicator. Optional.
`detectionType` |  The detection rule type that dictates the retrieval type for the findings. When the detection type is `threat`, it fetches threat intelligence feeds. When the detection type is `rule`, findings are fetched based on the detector's rule. Optional.
`severity` |  The severity of the detector rule used to fetch alerts. Severity can be `critical`, `high`, `medium`, or `low`. Optional.

### Example request

```json
GET /_plugins/_security_analytics/findings/_search
{
  "total_findings": 2,
  "findings": [
    {
      "detectorId": "b9ZN040Bjlggkcgx1d1W",
      "id": "35efb736-c5d9-499d-b9b5-31f0a7d61251",
      "related_doc_ids": [
        "1"
      ],
      "index": "smallidx",
      "queries": [
        {
          "id": "QdZN040Bjlggkcgxdd3X",
          "name": "QdZN040Bjlggkcgxdd3X",
          "fields": [],
          "query": "field1: *value1*",
          "tags": [
            "high",
            "ad_ldap"
          ]
        }
      ],
      "timestamp": 1708647166500,
      "document_list": [
        {
          "index": "smallidx",
          "id": "1",
          "found": true,
          "document": "{\n  \"field1\": \"value1\"\n}\n"
        }
      ]
    },
    {
      "detectorId": "O9ZM040Bjlggkcgx6N1S",
      "id": "a5022930-4503-4ca8-bf0a-320a2b1fb433",
      "related_doc_ids": [
        "1"
      ],
      "index": "smallidx",
      "queries": [
        {
          "id": "KtZM040Bjlggkcgxkd04",
          "name": "KtZM040Bjlggkcgxkd04",
          "fields": [],
          "query": "field1: *value1*",
          "tags": [
            "critical",
            "ad_ldap"
          ]
        }
      ],
      "timestamp": 1708647166500,
      "document_list": [
        {
          "index": "smallidx",
          "id": "1",
          "found": true,
          "document": "{\n  \"field1\": \"value1\"\n}\n"
        }
      ]
    }
  ]
}

```

```json
GET /_plugins/_security_analytics/findings/_search?severity=high
{
    "total_findings": 1,
    "findings": [
        {
            "detectorId": "b9ZN040Bjlggkcgx1d1W",
            "id": "35efb736-c5d9-499d-b9b5-31f0a7d61251",
            "related_doc_ids": [
                "1"
            ],
            "index": "smallidx",
            "queries": [
                {
                    "id": "QdZN040Bjlggkcgxdd3X",
                    "name": "QdZN040Bjlggkcgxdd3X",
                    "fields": [],
                    "query": "field1: *value1*",
                    "tags": [
                        "high",
                        "ad_ldap"
                    ]
                }
            ],
            "timestamp": 1708647166500,
            "document_list": [
                {
                    "index": "smallidx",
                    "id": "1",
                    "found": true,
                    "document": "{\n  \"field1\": \"value1\"\n}\n"
                }
            ]
        }
    ]
}
        
```

```json
GET /_plugins/_security_analytics/findings/_search?detectionType=rule
{
    "total_findings": 2,
    "findings": [
        {
            "detectorId": "b9ZN040Bjlggkcgx1d1W",
            "id": "35efb736-c5d9-499d-b9b5-31f0a7d61251",
            "related_doc_ids": [
                "1"
            ],
            "index": "smallidx",
            "queries": [
                {
                    "id": "QdZN040Bjlggkcgxdd3X",
                    "name": "QdZN040Bjlggkcgxdd3X",
                    "fields": [],
                    "query": "field1: *value1*",
                    "tags": [
                        "high",
                        "ad_ldap"
                    ]
                }
            ],
            "timestamp": 1708647166500,
            "document_list": [
                {
                    "index": "smallidx",
                    "id": "1",
                    "found": true,
                    "document": "{\n  \"field1\": \"value1\"\n}\n"
                }
            ]
        },
        {
            "detectorId": "O9ZM040Bjlggkcgx6N1S",
            "id": "a5022930-4503-4ca8-bf0a-320a2b1fb433",
            "related_doc_ids": [
                "1"
            ],
            "index": "smallidx",
            "queries": [
                {
                    "id": "KtZM040Bjlggkcgxkd04",
                    "name": "KtZM040Bjlggkcgxkd04",
                    "fields": [],
                    "query": "field1: *value1*",
                    "tags": [
                        "critical",
                        "ad_ldap"
                    ]
                }
            ],
            "timestamp": 1708647166500,
            "document_list": [
                {
                    "index": "smallidx",
                    "id": "1",
                    "found": true,
                    "document": "{\n  \"field1\": \"value1\"\n}\n"
                }
            ]
        }
    ]
}


```
```json
GET /_plugins/_security_analytics/findings/_search?detectionType=rule&severity=high
{
    "total_findings": 1,
    "findings": [
        {
            "detectorId": "b9ZN040Bjlggkcgx1d1W",
            "id": "35efb736-c5d9-499d-b9b5-31f0a7d61251",
            "related_doc_ids": [
                "1"
            ],
            "index": "smallidx",
            "queries": [
                {
                    "id": "QdZN040Bjlggkcgxdd3X",
                    "name": "QdZN040Bjlggkcgxdd3X",
                    "fields": [],
                    "query": "field1: *value1*",
                    "tags": [
                        "high",
                        "ad_ldap"
                    ]
                }
            ],
            "timestamp": 1708647166500,
            "document_list": [
                {
                    "index": "smallidx",
                    "id": "1",
                    "found": true,
                    "document": "{\n  \"field1\": \"value1\"\n}\n"
                }
            ]
        }
    ]
}
        
```

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

