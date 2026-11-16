---
layout: default
title: Blocks
parent: Index blocks and allocation
grand_parent: Index APIs
nav_order: 10
---

# Blocks API
**Introduced 1.0**
{: .label .label-purple }

Use the Blocks API to limit certain operations on a specified index. Different types of blocks allow you to restrict index write, read, or metadata operations. 
For example, adding a `write` block through the API ensures that all index shards have properly accounted for the block before returning a successful response. Any in-flight write operations to the index must be complete before the `write` block takes effect.

## Endpoints

```json
PUT /{index}/_block/{block}
```

## Path parameters

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | String | A comma-separated list of index names. Wildcard expressions (`*`) are supported. To target all indexes in the cluster, use `_all` or `*`. Data stream names are not supported, and you cannot add a block to the write index of a data stream. Required. |
| `block` | String | The type of block to apply to the index. Required. Valid values are: <br> - `metadata`: Blocks both retrieving and changing index metadata. For example, you cannot close the index or get its settings. <br> - `read`: Blocks read operations. <br> - `read_only`: Blocks write operations and metadata changes. <br> - `write`: Blocks write operations but allows metadata changes. <br> - `search_only`: Blocks indexing and write operations while allowing read-only access through search replicas. <br> OpenSearch automatically manages this block through the Scale API as part of the reader-writer separation mechanism. Therefore, do not set this parameter manually. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `ignore_unavailable` | Boolean | When `false`, the request returns an error when it targets a missing or closed index. Default is `false`. |
| `allow_no_indices` | Boolean | When `false`, the request returns an error when a wildcard expression, index alias, or `_all` does not match any indexes. Default is `true`. |
| `expand_wildcards` | String | The type of index that wildcard expressions can match. Supports comma-separated values, such as `open,hidden`. Valid values are `all`, `open`, `closed`, `hidden`, and `none`. Default is `open`. |
| `cluster_manager_timeout` | Time | The amount of time to wait for a connection to the cluster manager node. Default is `30s`. |
| `timeout` | Time | The amount of time to wait for the request to return. Default is `30s`. |

## Example request

The following example request disables any `write` operations made to the test index:

<!-- spec_insert_start
component: example_code
rest: PUT /test-index/_block/write
-->
{% capture step1_rest %}
PUT /test-index/_block/write
{% endcapture %}

{% capture step1_python %}


response = client.indices.add_block(
  block = "write",
  index = "test-index"
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
  "indices" : [ {
    "name" : "test-index",
    "blocked" : true
  } ]
}
```

## Removing a block

The Blocks API only adds blocks. To remove a block, set the corresponding index setting to `false` using the Update Index Settings API. The setting name follows the block name: `index.blocks.read`, `index.blocks.read_only`, `index.blocks.metadata`, or `index.blocks.write`. For more information, see [Update Index Settings API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/update-settings/).

The following example request removes the `write` block from the test index:

```json
PUT /test-index/_settings
{
  "index.blocks.write": false
}
```
{% include copy-curl.html %}

If an index has a `read_only`, `read_only_allow_delete`, or `metadata` block, the request that removes the block must contain only that block setting. Remove the block in a separate request before updating any other settings.

OpenSearch adds the `index.blocks.read_only_allow_delete` block to indexes that have shards on a node whose disk usage exceeds the flood-stage watermark. OpenSearch removes the block when disk usage falls below the high watermark. For more information, see [Cluster-level routing and allocation settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/cluster-settings/#cluster-level-routing-and-allocation-settings).

OpenSearch manages the `search_only` block through the Scale API, so do not remove it using the Update Index Settings API. To disable search-only mode, see [Scale API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/scale/).
