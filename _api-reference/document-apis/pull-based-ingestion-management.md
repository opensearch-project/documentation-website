---
layout: default
title: Pull-based ingestion management
parent: Pull-based ingestion
grand_parent: Document APIs
has_children: true
nav_order: 10
---

# Pull-based Ingestion Management API
**Introduced 3.0**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

OpenSearch provides the following APIs to manage pull-based ingestion.

## Pause ingestion

Pauses ingestion for one or more indexes. When paused, OpenSearch stops consuming data from the streaming source for all shards in the specified indexes.

### Endpoint

```json
POST /<index>/ingestion/_pause
```

### Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `index` | String | Required | The index to pause. Can be a comma-separated list of multiple index names. |

### Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- | 
| `cluster_manager_timeout` | Time units | The amount of time to wait for a connection to the cluster manager node. Default is `30s`. |
| `timeout` | Time units | The amount of time to wait for a response from the cluster. Default is `30s`. |

### Example request

```json
POST /my-index/ingestion/_pause
```
{% include copy-curl.html %}

## Resume ingestion

Resumes ingestion for one or more indexes. When resumed, OpenSearch continues consuming data from the streaming source for all shards in the specified indexes.

As part of the resume operation, you can optionally reset the stream consumer to start reading from a specific offset or timestamp. If reset settings are specified, all consumers for the selected shards are reset before the resume operation is applied to the index. Resetting a consumer also triggers an internal flush to persist the changes.

### Endpoint

```json
POST /<index>/ingestion/_resume
```

### Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `index` | String | Required | The index to resume ingestion for. Can be a comma-separated list of multiple index names. |

### Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type |  Description |
| :--- | :--- | :--- | :--- |
| `cluster_manager_timeout` | Time units | The amount of time to wait for a connection to the cluster manager node. Default is `30s`. |
| `timeout` | Time units | The amount of time to wait for a response from the cluster. Default is `30s`. |

### Request body fields

The following table lists the available request body fields.

| Field | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `reset_settings` | Array | Optional | A list of reset settings for each shard. If not provided, OpenSearch resumes ingestion from the current position for each shard in the specified index. |
| `reset_settings.shard` | Integer | Required | The shard to reset. |
| `reset_settings.mode` | String | Required | The reset mode. Valid values are `offset` (a positive integer offset) and `timestamp` (a Unix timestamp in milliseconds). |
| `reset_settings.value` | String | Required | &ensp;&#x2022; `offset`: The Apache Kafka offset or Amazon Kinesis sequence number<br>&ensp;&#x2022; `timestamp`: A Unix timestamp in milliseconds. |

### Example request

To resume ingestion without specifying reset settings, send the following request:

```json
POST /my-index/ingestion/_resume
```
{% include copy-curl.html %}

To provide reset settings when resuming ingestion, send the following request:

```json
POST /my-index/ingestion/_resume
{
  "reset_settings": [
    {
      "shard": 0,
      "mode": "offset",
      "value": "1"
    }
  ]
}
```
{% include copy-curl.html %}

## Get ingestion state

Returns the current ingestion state for one or more indexes. This API supports pagination.

### Endpoint

```json
GET /<index>/ingestion/_state
```

### Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `index` | String | Required | The index for which to return the ingestion state. Can be a comma-separated list of multiple index names. |

### Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `timeout` | Time units | The amount of time to wait for a response from the cluster. Default is `30s`. |

### Example request

The following is a request with the default settings:

```json
GET /my-index/ingestion/_state
```
{% include copy-curl.html %}

The following example shows a request with a page size of 20:

```json
GET /my-index/ingestion/_state?size=20
```
{% include copy-curl.html %}

The following example shows a request with a next page token:

```json
GET /my-index/ingestion/_state?size=20&next_token=<next_page_token>
```
{% include copy-curl.html %}

### Example response

```json
{
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0,
    "failures": [
      {
        "shard": 0,
        "index": "my-index",
        "status": "INTERNAL_SERVER_ERROR",
        "reason": {
          "type": "timeout_exception",
          "reason": "error message"
        }
      }
    ]
  },
  "next_page_token" : "page token if not on last page",
  "ingestion_state": {
    "indexName": [
      {
        "shard": 0,
        "poller_state": "POLLING",
        "error_policy": "DROP",
        "poller_paused": false
      }
    ]
  }
}
```