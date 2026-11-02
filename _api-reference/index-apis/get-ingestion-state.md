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

## Example: Getting the ingestion state

The following is a request with the default settings:

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

The response contains the ingestion state of each shard. If a shard fails to return its state, the failure is listed in `_shards.failures`:

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
        "poller_paused": false,
        "write_block_enabled" : false,
        "batch_start_pointer" : "KafkaOffset{offset=2}",
        "is_primary" : true,
        "node" : "node_name"
      }
    ]
  }
}
```

## Example: Paginating results

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

To retrieve the next page, provide the `next_page_token` value from the previous response in the `next_token` query parameter:

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
