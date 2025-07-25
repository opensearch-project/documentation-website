---
layout: default
title: Alerts and Findings API
parent: Threat intelligence APIs
grand_parent: Threat intelligence
nav_order: 50
canonical_url: https://docs.opensearch.org/latest/security-analytics/threat-intelligence/api/findings/
---


# Alerts and Findings API

The threat intelligence Alerts and Findings API retrieves information about alerts and findings from threat intelligence feeds.


---

## Get threat intelligence alerts

Retrieves any alerts related to threat intelligence monitors.

### Path and HTTP methods

```json
GET /_plugins/_security_analytics/threat_intel/alerts
```
{% include copy-curl.html %}


### Path parameters

You can specify the following parameters when requesting an alert.

Parameter | Description 
:--- | :---- 
`severityLevel` | Filter alerts by severity level. Optional.        
`alertState`    | Used to filter by alert state. Possible values are `ACTIVE`, `ACKNOWLEDGED`, `COMPLETED`, `ERROR`, or `DELETED`. Optional. 
`sortString`    | The string Security Analytics uses to sort the alerts. Optional.                          
`sortOrder`     | The order used to sort the list of alerts. Possible values are `asc` or `desc`. Optional.                        
`missing`       | A list of fields for which no alias mappings were found. Optional.                                          
`size`          | An optional maximum number of results to be returned in the response. Optional.                          
`startIndex`    | The pagination indicator. Optional.  
`searchString`  | The alert attribute you want returned in the search. Optional. 

### Example request

```json
GET /_plugins/_security_analytics/threat_intel/alerts
```
{% include copy-curl.html %}

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

### Response body fields

A threat intelligence alert can have one of the following states.

| State  | Description  |
| :---- | :--- |
| `ACTIVE`   | The alert is ongoing and unacknowledged. Alerts remain in this state until they are acknowledged, the trigger associated with the alert is deleted, or the threat intelligence monitor is deleted entirely. |
| `ACKNOWLEDGED` | The alert is acknowledged, but the root cause of the alert has not been addressed.  |
| `COMPLETED` | The alert is no longer ongoing. Alerts enter this state after the corresponding trigger evaluates to `false`.   |
| `DELETED` | The monitor or trigger for the alert was deleted while the alert was active.  |

---

## Update Alerts Status API 

Updates the status of the specified alerts to `ACKNOWLEDGED` or `COMPLETED`. Only alerts in the `ACTIVE` state can be updated. 

### Path and HTTP methods

```json
PUT /plugins/security_analytics/threat_intel/alerts/status
```

### Example requests

The following example updates the status of the specified alerts to `ACKNOWLEDGED`:

```json
PUT /plugins/security_analytics/threat_intel/alerts/status?state=ACKNOWLEDGED&alert_ids=<alert-id>,<alert-id>
```

The following example updates the status of the specified alerts to `COMPLETED`:

```json
PUT /plugins/security_analytics/threat_intel/alerts/status?state=COMPLETED&alert_ids=alert_ids=<alert-id>,<alert-id>
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

## Get findings

Returns threat intelligence indicator of compromise (IOC) findings. When the threat intelligence monitor finds a malicious IOC during a data scan, a finding is automatically generated.

### Path and HTTP methods

```json
GET /_plugins/_security_analytics/threat_intel/findings/
```

### Path parameters 

| Parameter      | Description                                                                                 |
|:---------------|:--------------------------------------------------------------------------------------------|
| `sortString`   | Specifies which string Security Analytics uses to sort the alerts. Optional.     |
| `sortOrder`    | The order used to sort the list of findings. Possible values are `asc` or `desc`. Optional. |
| `missing`      | A list of fields for which there were no alias mappings found. Optional.                     |
| `size`         | The maximum number of results to be returned in the response. Optional.     |
| `startIndex`   | The pagination indicator. Optional.                                                         |
| `searchString` | The alert attribute you want returned in the search. Optional.                              |

### Example request

```json
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
