---
layout: default
title: Resume ingestion
parent: Pull-based ingestion management
grand_parent: Index APIs
nav_order: 20
---

# Resume Ingestion API
**Introduced 3.0**
{: .label .label-purple }

Resumes ingestion for one or more indexes that were paused using the [Pause Ingestion API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/pause-ingestion/). When resumed, OpenSearch continues consuming data from the streaming source for all shards in the specified indexes.

As part of the resume operation, you can optionally reset the stream consumer to start reading from a specific offset or timestamp. If reset settings are specified, all consumers for the selected shards are reset before the resume operation is applied to the index. Resetting a consumer also triggers an internal flush to persist the changes.

## Endpoints

```json
POST /{index}/ingestion/_resume
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `index` | String | Required | The index to resume ingestion for. Can be a comma-separated list of multiple index names. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | Time units | The amount of time to wait for a connection to the cluster manager node. Default is `30s`. |
| `timeout` | Time units | The amount of time to wait for a response from the cluster. Default is `30s`. |

## Request body fields

The following table lists the available request body fields.

| Field | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `reset_settings` | Array of objects | Optional | A list of reset settings, one for each shard to reset. If not provided, OpenSearch resumes ingestion from the current position for each shard in the specified index. See [Reset settings](#reset-settings). |

### Reset settings

Each object in the `reset_settings` array contains the following fields.

| Field | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `shard` | Integer | Required | The shard to reset. |
| `mode` | String | Required | The reset mode. Valid values are `offset` (a positive integer offset) and `timestamp` (a Unix timestamp in milliseconds). |
| `value` | String | Required | &ensp;&#x2022; `offset`: The Apache Kafka offset or Amazon Kinesis sequence number<br>&ensp;&#x2022; `timestamp`: A Unix timestamp in milliseconds. |

## Example request: Resuming ingestion from the current position

To resume ingestion without specifying reset settings, send the following request:

<!-- spec_insert_start
component: example_code
rest: POST /my-index/ingestion/_resume
-->
{% capture step1_rest %}
POST /my-index/ingestion/_resume
{% endcapture %}

{% capture step1_python %}


response = client.ingestion.resume(
  index = "my-index"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

```json
{
  "acknowledged": true,
  "shards_acknowledged": true
}
```

## Example request: Resuming ingestion from a specific offset

To reset shard `0` to offset `1` when resuming ingestion, send the following request:

<!-- spec_insert_start
component: example_code
rest: POST /my-index/ingestion/_resume
body: |
{
  "reset_settings": [
    {
      "shard": 0,
      "mode": "offset",
      "value": "1"
    }
  ]
}
-->
{% capture step1_rest %}
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
{% endcapture %}

{% capture step1_python %}


response = client.ingestion.resume(
  index = "my-index",
  body =   {
    "reset_settings": [
      {
        "shard": 0,
        "mode": "offset",
        "value": "1"
      }
    ]
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `acknowledged` | Boolean | Whether the resume request was acknowledged. |
| `shards_acknowledged` | Boolean | Whether the resume request was acknowledged by the individual shards. |
| `failures` | Array of objects | A list of shard-level failures. See [Failures](#failures). |
| `error` | String | The request-level error message, if any. |

### Failures

Each object in the `failures` array contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `shard` | Integer | The shard number. |
| `error` | String | The shard-level error message. |
