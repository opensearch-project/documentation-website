---
layout: default
title: Shrink index
parent: Index APIs
nav_order: 65
redirect_from:
  - /opensearch/rest-api/index-apis/shrink-index/
---

# Shrink index
**Introduced 1.0**
{: .label .label-purple }

The shrink index API operation moves all of your data in an existing index into a new index with fewer primary shards.

## Example

```json
POST /my-old-index/_shrink/my-new-index
{
  "settings": {
    "index.number_of_replicas": 4,
    "index.number_of_shards": 3
  },
  "aliases":{
    "new-index-alias": {}
  }
}
```
{% include copy-curl.html %}

## Path and HTTP methods

```
POST /<index-name>/_shrink/<target-index>
PUT /<index-name>/_shrink/<target-index>
```

When creating new indexes with this operation, remember that OpenSearch indexes have the following naming restrictions:

- All letters must be lowercase.
- Index names can't begin with underscores (`_`) or hyphens (`-`).
- Index names can't contain spaces, commas, or the following characters:

  `:`, `"`, `*`, `+`, `/`, `\`, `|`, `?`, `#`, `>`, or `<`

## URL parameters

The shrink index API operation requires you to specify both the source index and the target index. All other parameters are optional.

Parameter | Type | description
:--- | :--- | :---
&lt;index-name&gt; | String | The index to shrink.
&lt;target-index&gt; | String | The target index to shrink the source index into.
wait_for_active_shards | String | Specifies the number of active shards that must be available before OpenSearch processes the request. Default is 1 (only the primary shard). Set to all or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have two replicas distributed across two additional nodes for the request to succeed.
cluster_manager_timeout | Time | How long to wait for a connection to the cluster manager node. Default is `30s`.
timeout | Time | How long to wait for the request to return a response. Default is `30s`.
wait_for_completion | Boolean | When set to `false`, the request returns immediately instead of after the operation is finished. To monitor the operation status, use the [Tasks API]({{site.url}}{{site.baseurl}}/api-reference/tasks/) with the task ID returned by the request. Default is `true`.
task_execution_timeout | Time | The explicit task execution timeout. Only useful when wait_for_completion is set to `false`. Default is `1h`.

## Request body

You can use the request body to configure some index settings for the target index. All fields are optional.

Field | Type | Description
:--- | :--- | :---
alias | Object | Sets an alias for the target index. Can have the fields `filter`, `index_routing`, `is_hidden`, `is_write_index`, `routing`, or `search_routing`. See [Index Aliases]({{site.url}}{{site.baseurl}}/api-reference/alias/#request-body).
settings | Object | Index settings you can apply to your target index. See [Index Settings]({{site.url}}{{site.baseurl}}/im-plugin/index-settings/).
[max_shard_size](#the-max_shard_size-parameter) | Bytes | Specifies the maximum size of a primary shard in the target index. Because `max_shard_size` conflicts with the `index.number_of_shards` setting, you cannot set both of them at the same time. 

### The `max_shard_size` parameter

The `max_shard_size` parameter specifies the maximum size of a primary shard in the target index. OpenSearch uses `max_shard_size` and the total storage for all primary shards in the source index to calculate the number of primary shards and their size for the target index. 

The primary shard count of the target index is the smallest factor of the source index's primary shard count for which the shard size does not exceed `max_shard_size`. For example, if the source index has 8 primary shards, they occupy a total of 400 GB of storage, and the `max_shard_size` is equal to 150 GB, OpenSearch calculates the number of primary shards in the target index using the following algorithm:

1. Calculate the minimum number of primary shards as 400/150, rounded to the nearest whole integer. The minimum number of primary shards is 3.
1. Calculate the number of primary shards as the smallest factor of 8 that is greater than 3. The number of primary shards is 4.

The maximum number of primary shards for the target index is equal to the number of primary shards in the source index because the shrink operation is used to reduce the primary shard count. As an example, consider a source index with 5 primary shards that occupy a total of 600 GB of storage. If `max_shard_size` is 100 GB, the minimum number of primary shards is 600/100, which is 6. However, because the number of primary shards in the source index is smaller than 6, the number of primary shards in the target index is set to 5.

The minimum number of primary shards for the target index is 1.
{: .note}

## Index codec considerations

For index codec considerations, see [Index codecs]({{site.url}}{{site.baseurl}}/im-plugin/index-codecs/#splits-and-shrinks).