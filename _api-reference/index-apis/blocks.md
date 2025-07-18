---
layout: default
title: Blocks
parent: Index APIs
nav_order: 10
---

# Blocks
**Introduced 1.0**
{: .label .label-purple }

Use the Blocks API to limit certain operations on a specified index. Different types of blocks allow you to restrict index write, read, or metadata operations. 
For example, adding a `write` block through the API ensures that all index shards have properly accounted for the block before returning a successful response. Any in-flight write operations to the index must be complete before the `write` block takes effect.

## Endpoints

```json
PUT /<index>/_block/<block>
```

## Path parameters

| Parameter | Data type | Description |
:--- | :--- | :---
| `index` | String | A comma-delimited list of index names. Wildcard expressions (`*`) are supported. To target all data streams and indexes in a cluster, use `_all` or `*`. Optional. |
| `<block>` | String | Specifies the type of block to apply to the index. Valid values are: <br> - `metadata`: Blocks metadata changes, such as closing the index. <br> - `read`: Blocks read operations. <br> - `read_only`: Blocks write operations and metadata changes. <br> - `write`: Blocks write operations but allows metadata changes. <br> - `search_only`: Blocks indexing and write operations while allowing read-only access through search replicas. <br> OpenSearch automatically manages this block through the Scale API as part of the reader-writer separation mechanism. Therefore, do not set this parameter manually. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `ignore_unavailable` | Boolean | When `false`, the request returns an error when it targets a missing or closed index. Default is `false`.
| `allow_no_indices` | Boolean | When `false`, the Refresh Index API returns an error when a wildcard expression, index alias, or `_all` targets only closed or missing indexes, even when the request is made against open indexes. Default is `true`. |
| `expand_wildcards` | String | The type of index that the wildcard patterns can match. If the request targets data streams, this argument determines whether the wildcard expressions match any hidden data streams. Supports comma-separated values, such as `open,hidden`. Valid values are `all`, `open`, `closed`, `hidden`, and `none`. |
`cluster_manager_timeout` | Time | The amount of time to wait for a connection to the cluster manager node. Default is `30s`.
`timeout` | Time | The amount of time to wait for the request to return. Default is `30s`. |

## Example request

The following example request disables any `write` operations made to the test index:

```json
PUT /test-index/_block/write
```
{% include copy.html %}

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
