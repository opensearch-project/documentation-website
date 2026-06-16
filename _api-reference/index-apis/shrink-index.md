---
layout: default
title: Shrink index
parent: Index operations
grand_parent: Index APIs
nav_order: 100
redirect_from:
  - /opensearch/rest-api/index-apis/shrink-index/
---

# Shrink Index API
**Introduced 1.0**
{: .label .label-purple }

The Shrink Index API reduces the number of primary shards in an existing index by creating a new target index with fewer shards. This is useful when an index was originally over-sharded and you want to reclaim resources or improve search performance by consolidating shards.

The target index's primary shard count must be a factor of the source index's primary shard count. For example, an index with 8 primary shards can be shrunk into 4, 2, or 1 primary shard. An index with a prime number of shards (such as 7) can only be shrunk into 1 primary shard.

## Prerequisites

Before you can shrink an index, it must meet the following conditions:

- The index must be read-only. To make the index read-only, set the [dynamic index-level index setting]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#dynamic-index-level-index-settings) `index.blocks.write` to `true`.
- A copy of every shard in the index (either primary or replica) must reside on the same node. You can use [shard allocation filtering]({{site.url}}{{site.baseurl}}/api-reference/index-apis/shard-allocation/) to move shards to the same node.
- The cluster health status must be green.

Additionally, the shrink operation enforces the following constraints:

- The target index must not already exist.
- The source index must have more primary shards than the target index.
- The number of primary shards in the target index must be a factor of the source index's primary shard count.
- The source index must not contain more than 2,147,483,519 documents across all shards that will be merged into a single target shard, because this is the maximum number of documents a single Lucene shard can hold.
- The node handling the shrink process must have sufficient free disk space to accommodate a second copy of the existing index.

The following request satisfies the first three conditions by routing all shards to a single node and blocking write operations:

```json
PUT /catalog-archive/_settings
{
  "settings": {
    "index.routing.allocation.require._name": "opensearch-node1",
    "index.blocks.write": true
  }
}
```
{% include copy-curl.html %}

Shard relocation may take time depending on index size. You can track progress using the [CAT recovery API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-recovery/) or wait for completion using the [Cluster Health API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-health/) with the `wait_for_no_relocating_shards` parameter.
{: .note}

Mappings cannot be specified in the shrink request. The target index inherits all mappings from the source index.
{: .important}

The shrink operation performs three steps:

1. Creates a new target index that has the same definition as the source index but contains fewer primary shards.
1. Creates hard links from source index segments to the target index. When the file system does not support hard links, segments are physically copied into the new index, which is a much more time-consuming process.
1. Recovers the target index using the same process applied when reopening a closed index.

When creating the target index, remember that OpenSearch index names have the following restrictions:

- All letters must be lowercase.
- Index names can't begin with underscores (`_`) or hyphens (`-`).
- Index names can't contain spaces, commas, or the following characters:

  `:`, `"`, `*`, `+`, `/`, `\`, `|`, `?`, `#`, `>`, or `<`

<!-- spec_insert_start
api: indices.shrink
component: endpoints
-->
## Endpoints
```json
POST /{index}/_shrink/{target}
PUT  /{index}/_shrink/{target}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `index` | **Required** | String | The name of the source index to shrink. |
| `target` | **Required** | String | The name of the target index to create. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `wait_for_active_shards` | String | The number of active shard copies that must be available before OpenSearch returns a response. Because the shrink operation creates a new index, the [wait for active shards]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/#wait-for-active-shards) setting on index creation applies here as well. Set to `all` or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have two replicas distributed across two additional nodes for the request to succeed. | `1` |
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
| `max_shard_size` | String | The maximum size of a primary shard in the target index. OpenSearch calculates the optimal shard count based on total storage and this limit. Cannot be used together with `index.number_of_shards`. See [The `max_shard_size` parameter](#the-max_shard_size-parameter). |

### The `max_shard_size` parameter

The `max_shard_size` parameter specifies the maximum size of a primary shard in the target index. OpenSearch uses `max_shard_size` and the total storage for all primary shards in the source index to calculate the number of primary shards and their size for the target index.

The primary shard count of the target index is the smallest factor of the source index's primary shard count for which the shard size does not exceed `max_shard_size`. For example, if the source index has 8 primary shards that occupy a total of 400 GB of storage and `max_shard_size` is 150 GB, OpenSearch calculates the number of primary shards using the following steps:

1. Calculate the minimum number of primary shards as 400/150, rounded to the nearest whole integer. The minimum number of primary shards is 3.
1. Find the smallest factor of 8 that is greater than or equal to 3. The number of primary shards is 4.

The maximum number of primary shards for the target index is equal to the number of primary shards in the source index. For example, if the source index has 5 primary shards that occupy 600 GB and `max_shard_size` is 100 GB, the minimum is 600/100 = 6. Because 6 exceeds the source shard count of 5, the target retains 5 primary shards.

The minimum number of primary shards for the target index is 1.
{: .note}

## Monitoring the shrink process

The shrink API returns as soon as the target index has been added to the cluster state — it does not wait for the shrink operation to complete. The shrink process proceeds through the following shard states:

1. **Unassigned** — All shards in the target index begin in this state immediately after the API returns.
1. **Initializing** — Once the primary shard is allocated to the shrink node, it transitions to this state and the data consolidation begins.
1. **Active** — When the shrink completes, the shard becomes active. OpenSearch then attempts to allocate any configured replicas and may relocate the primary shard to another node for balancing.

You can track the progress of shard recovery using the [CAT recovery API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-recovery/), or use the [Cluster Health API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-health/) with `wait_for_status=yellow` to wait until all primary shards have been allocated.

## Index codec considerations

For index codec considerations, see [Index codecs]({{site.url}}{{site.baseurl}}/im-plugin/index-codecs/#splits-and-shrinks).

## Example: Shrinking an index

The following example shrinks the `catalog-archive` index from 4 primary shards into 2, clears the allocation requirement and write block copied from the source, and attaches an alias:

<!-- spec_insert_start
component: example_code
rest: POST /catalog-archive/_shrink/catalog-archive-shrunk
body: |
{
  "settings": {
    "index.number_of_shards": 2,
    "index.number_of_replicas": 0,
    "index.routing.allocation.require._name": null,
    "index.blocks.write": null
  },
  "aliases": {
    "catalog-current": {}
  }
}
-->
{% capture step1_rest %}
POST /catalog-archive/_shrink/catalog-archive-shrunk
{
  "settings": {
    "index.number_of_shards": 2,
    "index.number_of_replicas": 0,
    "index.routing.allocation.require._name": null,
    "index.blocks.write": null
  },
  "aliases": {
    "catalog-current": {}
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.shrink(
  index = "catalog-archive",
  target = "catalog-archive-shrunk",
  body =   {
    "settings": {
      "index.number_of_shards": 2,
      "index.number_of_replicas": 0,
      "index.routing.allocation.require._name": null,
      "index.blocks.write": null
    },
    "aliases": {
      "catalog-current": {}
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Shrinking using `max_shard_size`

Instead of specifying an exact shard count, you can let OpenSearch determine the optimal number of shards based on a maximum shard size. The following example shrinks the `catalog-source` index so that no primary shard exceeds 100 MB:

<!-- spec_insert_start
component: example_code
rest: POST /catalog-source/_shrink/catalog-source-compact
body: |
{
  "max_shard_size": "100mb",
  "settings": {
    "index.number_of_replicas": 0,
    "index.routing.allocation.require._name": null,
    "index.blocks.write": null
  }
}
-->
{% capture step1_rest %}
POST /catalog-source/_shrink/catalog-source-compact
{
  "max_shard_size": "100mb",
  "settings": {
    "index.number_of_replicas": 0,
    "index.routing.allocation.require._name": null,
    "index.blocks.write": null
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.shrink(
  index = "catalog-source",
  target = "catalog-source-compact",
  body =   {
    "max_shard_size": "100mb",
    "settings": {
      "index.number_of_replicas": 0,
      "index.routing.allocation.require._name": null,
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
  "acknowledged": true,
  "shards_acknowledged": true,
  "index": "catalog-archive-shrunk"
}
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `acknowledged` | Boolean | Indicates whether the request was acknowledged by all relevant nodes in the cluster. |
| `shards_acknowledged` | Boolean | Indicates whether the required number of shard copies were started before the request timed out. |
| `index` | String | The name of the target index that was created. |
