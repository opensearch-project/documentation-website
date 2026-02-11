---
layout: default
title: Search shards
parent: Search APIs
nav_order: 85
canonical_url: https://docs.opensearch.org/latest/api-reference/search-apis/search-shards/
---

# Search shards API

The `_search_shards` API provides information about which shards OpenSearch would route a search request to if the request were executed. This helps you understand how OpenSearch plans to distribute the query across shards without actually running the search. This API does not execute the search but allows you to inspect routing decisions, shard distribution, and the nodes that would handle the request. 

## Endpoints

```json
GET /_search_shards
GET /<index>/_search_shards
POST /_search_shards
POST /<index>/_search_shards
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Date type   | Description                                            |
| --------- | ------ | ------------------------------------------------------ |
| `<index>` | String | A comma-separated list of target index names. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| `allow_no_indices` | Boolean | If `true`, the request does not fail if a wildcard expression or index alias resolves to no concrete indexes. Default is `true`. |
| `expand_wildcards` | String | Controls how wildcard expressions are expanded. Options are: `open` (default), `closed`, `hidden`, `none`, or `all`. |
| `ignore_unavailable` | Boolean | If `true`, missing or closed indexes are ignored. Default is `false`. |
| `local` | Boolean | If `true`, the operation is performed only on the local node, without retrieving the state from the cluster manager node. Default is `false`. |
| `preference` | String | Specifies a preference in selecting which shards or nodes to target. See [The `preference` query parameter]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/#the-preference-query-parameter) for more information. |
| `routing` | String | A comma-separated list of specific routing values used for shard selection. |


## Request body fields

The request body can include a full search query to simulate how the request would be routed:

```json
{
  "query": {
    "term": {
      "user": "alice"
    }
  }
}
```

## Example

Create an index:

```json
PUT /logs-demo
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 0
  },
  "mappings": {
    "properties": {
      "user": { "type": "keyword" },
      "message": { "type": "text" },
      "@timestamp": { "type": "date" }
    }
  }
}
```
{% include copy-curl.html %}

Index the first document with `routing=user1`:

<!-- spec_insert_start
component: example_code
rest: POST /logs-demo/_doc?routing=user1
body: |
{
  "@timestamp": "2025-05-23T10:00:00Z",
  "user": "user1",
  "message": "User login successful"
}
-->
{% capture step1_rest %}
POST /logs-demo/_doc?routing=user1
{
  "@timestamp": "2025-05-23T10:00:00Z",
  "user": "user1",
  "message": "User login successful"
}
{% endcapture %}

{% capture step1_python %}


response = client.index(
  index = "logs-demo",
  params = { "routing": "user1" },
  body =   {
    "@timestamp": "2025-05-23T10:00:00Z",
    "user": "user1",
    "message": "User login successful"
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

Index the second document with `routing=user2`:

<!-- spec_insert_start
component: example_code
rest: POST /logs-demo/_doc?routing=user2
body: |
{
  "@timestamp": "2025-05-23T10:01:00Z",
  "user": "user2",
  "message": "User login failed"
}
-->
{% capture step1_rest %}
POST /logs-demo/_doc?routing=user2
{
  "@timestamp": "2025-05-23T10:01:00Z",
  "user": "user2",
  "message": "User login failed"
}
{% endcapture %}

{% capture step1_python %}


response = client.index(
  index = "logs-demo",
  params = { "routing": "user2" },
  body =   {
    "@timestamp": "2025-05-23T10:01:00Z",
    "user": "user2",
    "message": "User login failed"
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Example request

Simulate routing with `_search_shards`:

<!-- spec_insert_start
component: example_code
rest: POST /logs-demo/_search_shards?routing=user1
body: |
{
  "query": {
    "term": {
      "user": "user1"
    }
  }
}
-->
{% capture step1_rest %}
POST /logs-demo/_search_shards?routing=user1
{
  "query": {
    "term": {
      "user": "user1"
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.search_shards(
  index = "logs-demo",
  params = { "routing": "user1" },
  body =   {
    "query": {
      "term": {
        "user": "user1"
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->


### Example response

The response displays the node and shard that would be searched if the search were executed:

```json
{
  "nodes": {
    "12ljrWLsQyiWHLzhFZgL9Q": {
      "name": "opensearch-node3",
      "ephemeral_id": "-JPvYKPMSGubd0VmSEzlbw",
      "transport_address": "172.18.0.4:9300",
      "attributes": {
        "shard_indexing_pressure_enabled": "true"
      }
    }
  },
  "indices": {
    "logs-demo": {}
  },
  "shards": [
    [
      {
        "state": "STARTED",
        "primary": true,
        "node": "12ljrWLsQyiWHLzhFZgL9Q",
        "relocating_node": null,
        "shard": 1,
        "index": "logs-demo",
        "allocation_id": {
          "id": "HwEjTdYQQJuULdQn10FRBw"
        }
      }
    ]
  ]
}
```

## Response body fields

The following table lists all response body fields.

| Field | Date type | Description |
| `nodes` | Object | Contains a map of node IDs to node metadata, such as name and transport address.  |
| `indices` | Object | Contains a map of index names included in the request. |
| `shards` | Array of arrays | Nested arrays representing shard copies (primary/replica) for the request. |
| `shards.index` | String | The index name. |
| `shards.shard` | Integer | The shard number. |
| `shards.node`  | String | The node ID of the node containing this shard. |
| `shards.primary` | Boolean | Whether this is a primary shard. |
| `shards.state` | String | The current shard state. |
| `shards.allocation_id.id` | String | A unique ID for this shard allocation. |
