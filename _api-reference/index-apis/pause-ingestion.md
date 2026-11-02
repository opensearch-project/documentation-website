---
layout: default
title: Pause ingestion
parent: Pull-based ingestion management
grand_parent: Index APIs
nav_order: 10
---

# Pause Ingestion API
**Introduced 3.0**
{: .label .label-purple }

Pauses ingestion for one or more indexes. When paused, OpenSearch stops consuming data from the streaming source for all shards in the specified indexes. To restart ingestion, use the [Resume Ingestion API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/resume-ingestion/).

## Endpoints

```json
POST /{index}/ingestion/_pause
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `index` | String | Required | The index to pause. Can be a comma-separated list of multiple index names. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- | 
| `cluster_manager_timeout` | Time units | The amount of time to wait for a connection to the cluster manager node. Default is `30s`. |
| `timeout` | Time units | The amount of time to wait for a response from the cluster. Default is `30s`. |

## Example request

<!-- spec_insert_start
component: example_code
rest: POST /my-index/ingestion/_pause
-->
{% capture step1_rest %}
POST /my-index/ingestion/_pause
{% endcapture %}

{% capture step1_python %}


response = client.ingestion.pause(
  index = "my-index"
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
| `acknowledged` | Boolean | Whether the pause request was acknowledged. |
| `shards_acknowledged` | Boolean | Whether the pause request was acknowledged by the individual shards. |
| `failures` | Array of objects | A list of shard-level failures. See [Failures](#failures). |
| `error` | String | The request-level error message, if any. |

### Failures

Each object in the `failures` array contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `shard` | Integer | The shard number. |
| `error` | String | The shard-level error message. |
