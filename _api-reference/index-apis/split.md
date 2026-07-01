---
layout: default
title: Split index
parent: Index operations
grand_parent: Index APIs
nav_order: 110
redirect_from:
  - /opensearch/rest-api/index-apis/split/
---

# Split Index API
**Introduced 1.0**
{: .label .label-purple }

The Split Index API increases the number of primary shards in an existing index by creating a new target index where each original primary shard is divided into two or more primary shards. This is useful when an index has outgrown its original shard count and needs additional capacity to handle increased data volume or query load.

The number of primary shards in the target index must be a multiple of the source index's primary shard count. For example, an index with 2 primary shards can be split into 4, 6, 8, or any other multiple of 2. An index with a single primary shard can be split into any number of shards.

The maximum number of splits an index supports depends on the `index.number_of_routing_shards` setting. This setting defines the total hashing space across which documents are distributed using consistent hashing. Only multiplicative factors are supported because consistent hashing requires each new shard to map to a complete, contiguous subset of the original hash space; incremental resharding (N to N+1) would require rebalancing documents across all shards, which is prohibitively expensive for search-oriented data structures. For example, an index with 2 shards and `number_of_routing_shards` set to 12 (2 x 2 x 3) supports the following split paths:

- `2` -> `4` -> `12` (split by 2, then by 3)
- `2` -> `6` -> `12` (split by 3, then by 2)
- `2` -> `12` (split by 6)

When not explicitly configured, `number_of_routing_shards` defaults to a value that permits repeated doubling up to a maximum of 1,024 shards.

## Prerequisites

Before you can split an index, it must meet the following conditions:

- The index must be read-only. To make the index read-only, set the [dynamic index-level index setting]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#dynamic-index-level-index-settings) `index.blocks.write` to `true`.
- The cluster health status must be green.

Additionally, the split operation enforces the following constraints:

- The target index must not already exist.
- The source index must have fewer primary shards than the target index.
- The number of primary shards in the target index must be a multiple of the source index's primary shard count.
- The node handling the split process must have sufficient free disk space to accommodate a second copy of the existing index.

The following request makes the `catalog-logs` index read-only to prepare it for splitting:

```json
PUT /catalog-logs/_settings
{
  "settings": {
    "index.blocks.write": true
  }
}
```
{% include copy-curl.html %}

Mappings cannot be specified in the split request. The target index inherits all mappings from the source index.
{: .important}

The split operation performs the following steps:

1. Allocates a new target index with an identical mapping and configuration but a higher primary shard count.
1. Establishes hard links from the source segments into the target index directory. If the file system lacks hard-link support, a full byte-level copy occurs instead, which takes significantly longer.
1. Runs a rehashing pass that reassigns each document to its correct target shard based on the new routing layout and removes documents that no longer belong.
1. Initiates shard recovery on the target index, similar to the process that runs when a closed index is reopened.

## Monitoring the split process

The split API returns as soon as the target index has been added to the cluster state; it does not wait for the split operation to complete. The split process proceeds through the following shard states:

1. **Unassigned** -- All shards in the target index begin in this state immediately after the API returns.
1. **Initializing** -- Once the primary shard is allocated to the node, it transitions to this state and the data redistribution begins.
1. **Active** -- When the split completes, the shard becomes active. OpenSearch then attempts to allocate any configured replicas and may relocate the primary shard to another node for balancing.

You can track the progress of shard recovery using the [CAT recovery API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-recovery/), or use the [Cluster Health API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-health/) with `wait_for_status=yellow` to wait until all primary shards have been allocated.

When creating the target index, remember that OpenSearch index names have the following restrictions:

- All letters must be lowercase.
- Index names can't begin with underscores (`_`) or hyphens (`-`).
- Index names can't contain spaces, commas, or the following characters:

  `:`, `"`, `*`, `+`, `/`, `\`, `|`, `?`, `#`, `>`, or `<`

<!-- spec_insert_start
api: indices.split
component: endpoints
-->
## Endpoints
```json
POST /{index}/_split/{target}
PUT  /{index}/_split/{target}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `index` | **Required** | String | The name of the source index to split. |
| `target` | **Required** | String | The name of the target index to create. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `wait_for_active_shards` | String | The number of active shard copies that must be available before OpenSearch returns a response. Because the split operation creates a new index, the [wait for active shards]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/#wait-for-active-shards) setting on index creation applies here as well. Set to `all` or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have two replicas distributed across two additional nodes for the request to succeed. | `1` |
| `cluster_manager_timeout` | String | The amount of time to wait for a connection to the cluster manager node. | `30s` |
| `timeout` | String | The amount of time to wait for a response. If no response is received before the timeout expires, the request fails and returns an error. | `30s` |
| `wait_for_completion` | Boolean | When set to `false`, the request returns immediately instead of after the operation is finished. To monitor the operation status, use the [Tasks API]({{site.url}}{{site.baseurl}}/api-reference/tasks/) with the task ID returned by the request. | `true` |
| `task_execution_timeout` | String | The amount of time to wait for the task to complete. Only applicable when `wait_for_completion` is set to `false`. | `1h` |

## Request body fields

The following table lists the available request body fields. All fields are optional.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `settings` | Object | Index settings to apply to the target index. See [Index settings]({{site.url}}{{site.baseurl}}/im-plugin/index-settings/). |
| `aliases` | Object | Aliases to associate with the target index. See [Alias APIs]({{site.url}}{{site.baseurl}}/api-reference/alias/). |

## Index codec considerations

For index codec considerations, see [Index codecs]({{site.url}}{{site.baseurl}}/im-plugin/index-codecs/#splits-and-shrinks).

## Example: Splitting an index

The following example splits the `catalog-logs` index from 2 primary shards into 4, removes the write block, and attaches an alias:

<!-- spec_insert_start
component: example_code
rest: POST /catalog-logs/_split/catalog-logs-split
body: |
{
  "settings": {
    "index.number_of_shards": 4,
    "index.number_of_replicas": 0,
    "index.blocks.write": null
  },
  "aliases": {
    "catalog-logs-current": {}
  }
}
-->
{% capture step1_rest %}
POST /catalog-logs/_split/catalog-logs-split
{
  "settings": {
    "index.number_of_shards": 4,
    "index.number_of_replicas": 0,
    "index.blocks.write": null
  },
  "aliases": {
    "catalog-logs-current": {}
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.split(
  index = "catalog-logs",
  target = "catalog-logs-split",
  body =   {
    "settings": {
      "index.number_of_shards": 4,
      "index.number_of_replicas": 0,
      "index.blocks.write": null
    },
    "aliases": {
      "catalog-logs-current": {}
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Splitting a single-shard index

An index with a single primary shard can be split into any number of shards. The following example splits the `catalog-events` index from 1 shard into 3:

<!-- spec_insert_start
component: example_code
rest: POST /catalog-events/_split/catalog-events-expanded
body: |
{
  "settings": {
    "index.number_of_shards": 3,
    "index.number_of_replicas": 0,
    "index.blocks.write": null
  }
}
-->
{% capture step1_rest %}
POST /catalog-events/_split/catalog-events-expanded
{
  "settings": {
    "index.number_of_shards": 3,
    "index.number_of_replicas": 0,
    "index.blocks.write": null
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.split(
  index = "catalog-events",
  target = "catalog-events-expanded",
  body =   {
    "settings": {
      "index.number_of_shards": 3,
      "index.number_of_replicas": 0,
      "index.blocks.write": null
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

```json
{
  "acknowledged" : true,
  "shards_acknowledged" : true,
  "index" : "catalog-logs-split"
}
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `acknowledged` | Boolean | Indicates whether the request was acknowledged by all relevant nodes in the cluster. |
| `shards_acknowledged` | Boolean | Indicates whether the required number of shard copies were started before the request timed out. |
| `index` | String | The name of the target index that was created. |
