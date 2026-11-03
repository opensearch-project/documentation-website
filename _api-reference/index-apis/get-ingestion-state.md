---
layout: default
title: Get ingestion state
parent: Pull-based ingestion management
grand_parent: Index APIs
nav_order: 30
---

# Get Ingestion State API
**Introduced 3.0**
{: .label .label-purple }

Returns the current ingestion state for each shard in one or more indexes that use [pull-based ingestion]({{site.url}}{{site.baseurl}}/im-plugin/pull-based-ingestion/index/). This API supports pagination.

## Endpoints

```json
GET /{index}/ingestion/_state
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `index` | String | Required | The index for which to return the ingestion state. Can be a comma-separated list of multiple index names. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `size` | Integer | The number of results to return per page. |
| `next_token` | String | The token for retrieving the next page of results. Use the `next_page_token` value from the previous response. |
| `timeout` | Time units | The amount of time to wait for a response from the cluster. Default is `30s`. |

## Example request: Retrieving the ingestion state

To get the ingestion state of `my-index`, send the following request:

<!-- spec_insert_start
component: example_code
rest: GET /my-index/ingestion/_state
-->
{% capture step1_rest %}
GET /my-index/ingestion/_state
{% endcapture %}

{% capture step1_python %}


response = client.ingestion.get_state(
  index = "my-index"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

The response contains the ingestion state of each shard in `my-index`. If a shard fails to return its state, the failure is listed in `_shards.failures`:

```json
{
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "ingestion_state": {
    "my-index": [
      {
        "shard": 0,
        "poller_state": "POLLING",
        "error_policy": "DROP",
        "poller_paused": false,
        "write_block_enabled": false,
        "batch_start_pointer": "KafkaOffset{offset=17735361}",
        "is_primary": true,
        "node": "node-a"
      }
    ]
  }
}
```

## Example request: Paginating results

To return 20 results per page, send the following request:

<!-- spec_insert_start
component: example_code
rest: GET /my-index/ingestion/_state?size=20
-->
{% capture step1_rest %}
GET /my-index/ingestion/_state?size=20
{% endcapture %}

{% capture step1_python %}


response = client.ingestion.get_state(
  index = "my-index",
  params = { "size": "20" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

If more results are available, the response contains a `next_page_token` field. To retrieve the next page, provide its value in the `next_token` query parameter:

<!-- spec_insert_start
component: example_code
rest: GET /my-index/ingestion/_state?size=20&next_token=<next_page_token>
-->
{% capture step1_rest %}
GET /my-index/ingestion/_state?size=20&next_token=<next_page_token>
{% endcapture %}

{% capture step1_python %}


response = client.ingestion.get_state(
  index = "my-index",
  params = { "size": "20", "next_token": "<next_page_token>" }
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
| `_shards` | Object | The number of shards that returned or failed to return their ingestion state. See [Shards](#shards). |
| `ingestion_state` | Object | The ingestion state of each requested index. Each key is an index name, and its value is an array containing the state of each shard in that index. See [Shard ingestion state](#shard-ingestion-state). |
| `next_page_token` | String | The token for retrieving the next page of results. Pass this value in the `next_token` query parameter. Returned only when more results are available. |

### Shards

The `_shards` object contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `total` | Integer | The total number of shards from which the ingestion state was requested. |
| `successful` | Integer | The number of shards that returned their ingestion state. |
| `failed` | Integer | The number of shards that failed to return their ingestion state. |
| `failures` | Array of objects | A list of shard failures. Returned only when at least one shard fails. See [Shard failures](#shard-failures). |

### Shard failures

Each object in the `_shards.failures` array contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `shard` | Integer | The shard number. |
| `index` | String | The name of the index containing the shard. |
| `status` | String | The HTTP status of the failure, such as `INTERNAL_SERVER_ERROR`. |
| `reason` | Object | The cause of the failure, containing the error `type` (for example, `timeout_exception`) and the error message in `reason`. |

### Shard ingestion state

Each object in an `ingestion_state` array contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `shard` | Integer | The shard number. |
| `poller_state` | String | The current state of the shard's poller. Valid values are `NONE`, `POLLING`, `PROCESSING`, `PAUSED`, and `CLOSED`. |
| `error_policy` | String | The policy for handling failed messages: `DROP` or `BLOCK`. See [Updating the error policy]({{site.url}}{{site.baseurl}}/im-plugin/pull-based-ingestion/index/#updating-the-error-policy). |
| `poller_paused` | Boolean | Whether ingestion for the shard is paused. |
| `write_block_enabled` | Boolean | Whether a write block is enabled for the shard. |
| `batch_start_pointer` | String | The position in the source from which the poller resumes during shard recovery, such as a Kafka offset or a Kinesis sequence number. |
| `is_primary` | Boolean | Whether the shard copy is a primary shard. |
| `node` | String | The name of the node that hosts the shard copy. |
