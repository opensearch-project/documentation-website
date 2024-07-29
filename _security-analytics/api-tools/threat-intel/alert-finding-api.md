---
layout: default
title: Alerts and findings APIs
parent: API tools
nav_order: 50
---


# Threat Intelligence Alerts and findings APIs

The following APIs can be used for tasks related to alerts and findings.


---

## Get threat intelligence alerts

Provides an option for retrieving alerts related to a threat intelligence based monitor.

### Parameters

You can specify the following parameters when requesting an alert.

| Parameter       | Description                                                                                                      |
|:----------------|:-----------------------------------------------------------------------------------------------------------------|
| `severityLevel` | Used to filter by alert severity level. Optional.                                                                |
| `alertState`    | Used to filter by alert state. Possible values are ACTIVE, ACKNOWLEDGED, COMPLETED, ERROR, or DELETED. Optional. |
| `sortString`    | This field specifies which string Security Analytics uses to sort the alerts. Optional.                          |
| `sortOrder`     | The order used to sort the list of alerts. Possible values are `asc` or `desc`. Optional.                        |
| `missing`       | A list of fields for which there are no found alias mappings. Optional.                                          |
| `size`          | An optional limit for the maximum number of results returned in the response. Optional.                          |
| `startIndex`    | The pagination indicator. Optional.                                                                              |
| `searchString`  | The alert attribute you want returned in the search. Optional.                                                   |

### Example request

```
GET /_plugins/_security_analytics/threat_intel/alerts
```

### Example response

```json
{
    "alerts": [{
      "id": "906669ee-56e8-4f40-a12f-ab4c274d7521",
      "version": 1,
      "schema_version": 0,
      "seq_no": 0,
      "primary_term": 1,
      "trigger_id": "regwarg",
      "trigger_name": "regwarg",
      "state": "ACTIVE",
      "error_message": null,
      "ioc_value": "example-has00001",
      "ioc_type": "hashes",
      "severity": "high",
      "finding_ids": [
        "a9c10094-6139-42b3-81a8-867dffbe381d"
      ],
      "acknowledged_time": 1722038395105,
      "last_updated_time": null,
      "start_time": 1722038395105,
      "end_time": null
    }],
    "total_alerts": 1
}
```

#### Response fields

Alerts persist until you resolve the root cause and have the following states:

| State          | Description                                                                                                                                                                    |
|:---------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ACTIVE`       | The alert is ongoing and unacknowledged. Alerts remain in this state until you acknowledge them, delete the trigger associated with the alert, or delete the monitor entirely. |
| `ACKNOWLEDGED` | Someone has acknowledged the alert but not fixed the root cause.                                                                                                               |
| `COMPLETED`    | The alert is no longer ongoing. Alerts enter this state after the corresponding trigger evaluates to false.                                                                    |
| `DELETED`      | Someone deleted the monitor or trigger associated with this alert while the alert was ongoing.                                                                                 |

---

## Update alerts status API 

**Mark ACTIVE alerts as ACKNOWLEDGED**

API to update Alert status of alerts by their ids to `ACKNOWLEDGED`. Only alerts in ACTIVE state can be updated to state ACKNOWLEDGED. 

### Example request

```
PUT /plugins/security_analytics/threat_intel/alerts/status?state=ACKNOWLEDGED&alert_ids=906669ee-56e8-4f40-a12f-ab4c274d7521,56e8-4f40-a12f-ab4c274d7521-906669ee
```

### Example response

```json
{
  "updated_alerts": [
    {
      "id": "906669ee-56e8-4f40-a12f-ab4c274d7521",
      "version": 1,
      "schema_version": 0,
      "seq_no": 2,
      "primary_term": 1,
      "trigger_id": "regwarg",
      "trigger_name": "regwarg",
      "state": "ACKNOWLEDGED",
      "error_message": null,
      "ioc_value": "example-has00001",
      "ioc_type": "hashes",
      "severity": "high",
      "finding_ids": [
        "a9c10094-6139-42b3-81a8-867dffbe381d"
      ],
      "acknowledged_time": 1722039091209,
      "last_updated_time": 1722039091209,
      "start_time": 1722038395105,
      "end_time": null
    },
    {
      "id": "56e8-4f40-a12f-ab4c274d7521-906669ee",
      "version": 1,
      "schema_version": 0,
      "seq_no": 2,
      "primary_term": 1,
      "trigger_id": "regwarg",
      "trigger_name": "regwarg",
      "state": "ACKNOWLEDGED",
      "error_message": null,
      "ioc_value": "example-has00001",
      "ioc_type": "hashes",
      "severity": "high",
      "finding_ids": [
        "a9c10094-6139-42b3-81a8-867dffbe381d"
      ],
      "acknowledged_time": 1722039091209,
      "last_updated_time": 1722039091209,
      "start_time": 1722038395105,
      "end_time": null
    }
  ],
  "failure_messages": []
}
```
---

**Mark ACKNOWLEDGED alerts as COMPLETED**

API to update Alert status of alerts by their ids to `COMPLETED`. Only alerts in `ACKNOWLEDGED` state can be updated to state `COMPLETED`.

### Example request

```
PUT /plugins/security_analytics/threat_intel/alerts/status?state=COMPLETED&alert_ids=alert_ids=906669ee-56e8-4f40-a12f-ab4c274d7521,56e8-4f40-a12f-ab4c274d7521-906669ee

```

### Example response

```json
{
  "updated_alerts": [
    {
      "id": "906669ee-56e8-4f40-a12f-ab4c274d7521",
      "version": 1,
      "schema_version": 0,
      "seq_no": 2,
      "primary_term": 1,
      "trigger_id": "regwarg",
      "trigger_name": "regwarg",
      "state": "COMPLETED",
      "error_message": null,
      "ioc_value": "example-has00001",
      "ioc_type": "hashes",
      "severity": "high",
      "finding_ids": [
        "a9c10094-6139-42b3-81a8-867dffbe381d"
      ],
      "acknowledged_time": 1722039091209,
      "last_updated_time": 1722039091209,
      "start_time": 1722038395105,
      "end_time": null
    },
    {
      "id": "56e8-4f40-a12f-ab4c274d7521-906669ee",
      "version": 1,
      "schema_version": 0,
      "seq_no": 2,
      "primary_term": 1,
      "trigger_id": "regwarg",
      "trigger_name": "regwarg",
      "state": "COMPLETED",
      "error_message": null,
      "ioc_value": "example-has00001",
      "ioc_type": "hashes",
      "severity": "high",
      "finding_ids": [
        "a9c10094-6139-42b3-81a8-867dffbe381d"
      ],
      "acknowledged_time": 1722039091209,
      "last_updated_time": 1722039091209,
      "start_time": 1722038395105,
      "end_time": null
    }
  ],
  "failure_messages": []
}
```

---

## Get findings

The Get findings API returns threat intelligence ioc findings - when threat intelligence monitor finds a malicious IoC during a scan of data a finding is created.

### Parameters

You can specify the following parameters when getting findings.

| Parameter      | Description                                                                                 |
|:---------------|:--------------------------------------------------------------------------------------------|
| `sortString`   | This field specifies which string Security Analytics uses to sort the alerts. Optional.     |
| `sortOrder`    | The order used to sort the list of findings. Possible values are `asc` or `desc`. Optional. |
| `missing`      | A list of fields for which there are no found alias mappings. Optional.                     |
| `size`         | An optional limit for the maximum number of results returned in the response. Optional.     |
| `startIndex`   | The pagination indicator. Optional.                                                         |
| `searchString` | The alert attribute you want returned in the search. Optional.                              |

### Example request
```
GET /_plugins/_security_analytics/threat_intel/findings/_search?size=3
```

```json
{
  "total_findings": 10,
  "ioc_findings": [
    {
      "id": "a9c10094-6139-42b3-81a8-867dffbe381d",
      "related_doc_ids": [
        "Ccp88ZAB1vBjq44wmTEu:windows"
      ],
      "ioc_feed_ids": [
        {
          "ioc_id": "2",
          "feed_id": "Bsp88ZAB1vBjq44wiDGo",
          "feed_name": "my_custom_feed",
          "index": ""
        }
      ],
      "monitor_id": "B8p88ZAB1vBjq44wkjEy",
      "monitor_name": "Threat intelligence monitor",
      "ioc_value": "example-has00001",
      "ioc_type": "hashes",
      "timestamp": 1722038394501,
      "execution_id": "01cae635-93dc-4f07-9e39-31076b9535d1"
    },
    {
      "id": "8d87aee0-aaa4-4c12-b4e2-b4b1f4ec80f9",
      "related_doc_ids": [
        "GsqI8ZAB1vBjq44wXTHa:windows"
      ],
      "ioc_feed_ids": [
        {
          "ioc_id": "2",
          "feed_id": "Bsp88ZAB1vBjq44wiDGo",
          "feed_name": "my_custom_feed",
          "index": ""
        }
      ],
      "monitor_id": "B8p88ZAB1vBjq44wkjEy",
      "monitor_name": "Threat intelligence monitor",
      "ioc_value": "example-has00001",
      "ioc_type": "hashes",
      "timestamp": 1722039165824,
      "execution_id": "54899e32-aeeb-401e-a031-b1728772f0aa"
    },
    {
      "id": "2419f624-ba1a-4873-978c-760183b449b7",
      "related_doc_ids": [
        "H8qI8ZAB1vBjq44woDHU:windows"
      ],
      "ioc_feed_ids": [
        {
          "ioc_id": "2",
          "feed_id": "Bsp88ZAB1vBjq44wiDGo",
          "feed_name": "my_custom_feed",
          "index": ""
        }
      ],
      "monitor_id": "B8p88ZAB1vBjq44wkjEy",
      "monitor_name": "Threat intelligence monitor",
      "ioc_value": "example-has00001",
      "ioc_type": "hashes",
      "timestamp": 1722039182616,
      "execution_id": "32ad2544-4b8b-4c9b-b2b4-2ba6d31ece12"
    }
  ]
}

```
