---
layout: default
title: Correlation engine APIs
parent: API tools
nav_order: 55
---


# Correlation engine APIs

Correlation engine APIs allow you to create new correlation rules, view findings and correlations within a certain time window, and perform other tasks.

---
## Create correlation rules between log types

This API is used to create correlation rules:

```json
POST /_plugins/_security_analytics/correlation/rules
```

### Request fields

| Field | Type | Description |
| :--- | :--- |:--- |
| `index` | String | The name of the index used as the log source. |
| `query` | String | The query used to filter security logs for correlation. |
| `category` | String | The log type associated with the log source. |

#### Example request

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

#### Example response

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

### Response fields

| Field | Type | Description |
| :--- | :--- |:--- |
| `_id` | String | The Id for the new rule. |

---
## List all findings and their correlations within a time window

This API provides a list of all findings and their correlations within a specified time window:

```json
GET /_plugins/_security_analytics/correlations?start_timestamp=<start time in milliseconds>&end_timestamp=<end time in milliseconds>
```

### Query parameters

| Parameter | Type | Description |
| :--- | :--- |:--- |
| `start_timestamp` | Number | Start time for the time window, in milliseconds. |
| `end_timestamp` | Number | End time for the time window, in milliseconds. |

#### Example request

```json
GET /_plugins/_security_analytics/correlations?start_timestamp=1689289210000&end_timestamp=1689300010000
```
{% include copy-curl.html %}

#### Example response

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

### Response fields

| Field | Type | Description |
| :--- | :--- |:--- |
| `finding1` | String | The Id for a first finding in the correlation. |
| `logType1` | String | The log type associated with the first finding. |
| `finding2` | String | The Id for a second finding in the correlation. |
| `logType2` | String | The log type associated with the second finding. |
| `rules` | Array | A list of correlation rule IDs associated with the correlated findings. |

---
## List correlations for a finding belonging to a log type

This API is used to list correlations for specific findings and the log types associated with them:

```json
GET /_plugins/_security_analytics/findings/correlate?finding=425dce0b-f5ee-4889-b0c0-7d15669f0871&detector_type=ad_ldap&nearby_findings=20&time_window=10m
```

### Query parameters

| Parameter | Type | Description |
| :--- | :--- |:--- |
| `finding` | String | The finding ID. |
| `detector_type` | String | The log type for the detector. |
| `nearby_findings` | Number | The number of nearby findings with respect to the given finding Id. |
| `time_window` | String | Sets a time window in which all of the correlations must have occurred together. |


#### Example request

```json
GET /_plugins/_security_analytics/findings/correlate?finding=425dce0b-f5ee-4889-b0c0-7d15669f0871&detector_type=ad_ldap&nearby_findings=20&time_window=10m
```
{% include copy-curl.html %}

#### Example response

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

### Response fields

| Field | Type | Description |
| :--- | :--- |:--- |
| `finding` | String | The finding ID. |
| `detector_type` | String | The log type associated with the finding. |
| `score` | Number | The correlation score for the correlated finding. The score is based on the proximity of relevant findings in the threat scenario defined by the correlation rule. |

