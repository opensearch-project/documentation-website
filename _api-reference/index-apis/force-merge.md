---
layout: default
title: Force merge
parent: Index operations
grand_parent: Index APIs
nav_order: 40
---

# Force Merge API
**Introduced 1.0**
{: .label .label-purple }

The force merge API operation forces a merge on the shards of one or more indexes. For a data stream, the API forces a merge on the shards of the stream's backing indexes.

## Endpoints

```json
POST /_forcemerge
POST /{index}/_forcemerge
```

## The merge operation

In OpenSearch, a shard is a Lucene index, which consists of _segments_ (or segment files). Segments store the indexed data and are immutable. Periodically, OpenSearch merges smaller segments into a new, larger segment and then deletes the original segments. Merging reduces the overall number of segments on each shard and frees up disk space. 

OpenSearch performs background segment merges that produce segments no larger than `index.merge.policy.max_merged_segment` (the default is 5 GB).

## Deleted documents

When a document is deleted from an OpenSearch index, it is not deleted from the Lucene segment but is rather only marked to be deleted. When the segment files are merged, deleted documents are removed (or _expunged_). Thus, merging also frees up space occupied by documents marked as deleted.

OpenSearch retains a shard's history of operations, including deleted documents, for the period specified in the `index.soft_deletes.retention_lease.period` setting (default `12h`). A force merge does not expunge deleted documents that are still retained, so the number of deleted documents might not decrease immediately after a force merge. For more information, see [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/).

## Force Merge API

In addition to periodic merging, you can force a segment merge using the Force Merge API. By default, the merge policy determines which segments to merge, so a force merge request might not change the number of segments. To merge all segments of each shard into one segment, set `max_num_segments` to `1`.

Use the Force Merge API on an index only after all write requests sent to the index are completed. The force merge operation can produce very large segments. If write requests are still sent to the index, then the merge policy does not merge these segments until they primarily consist of deleted documents. This can increase disk space usage and lead to performance degradation.
{: .warning}

By default, the Force Merge API call does not return until the merge completes. If the connection is lost during this time, the force merge operation continues in the background. To run the operation asynchronously, set `wait_for_completion` to `false`.

Each node runs force merge operations in its `force_merge` thread pool. Force merge requests that arrive while all threads in the pool are busy are queued until a thread becomes available.

## Force merging multiple indexes

To force merge multiple indexes, you can call the Force Merge API on the following index combinations:

- Multiple indexes
- One or more data streams containing multiple backing indexes
- One or more index aliases pointing to multiple indexes
- All data streams and indexes in a cluster

When you force merge multiple indexes, each node merges its shards using the `force_merge` thread pool. The pool size is one-eighth of the node's allocated processors, with a minimum of 1, so on most nodes shards are merged one at a time. While the force merge operation is in progress, the storage for the shard temporarily increases so that all segments can be rewritten into a new segment. When `max_num_segments` is set to `1`, the storage for the shard can temporarily double.

## Force merging data streams

It can be useful to force merge data streams in order to manage a data stream's backing indexes, especially after a rollover operation. Time-based indexes receive indexing requests only during a specified time period. Once that time period has elapsed and the index receives no more write requests, you can force merge segments of all index shards into one segment. Searches on single-segment shards are more efficient because they use simpler data structures.


## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | String | A comma-separated list of indexes, data streams, or index aliases to which the operation is applied. Supports wildcard expressions (`*`). Use `_all` or `*` to specify all indexes and data streams in a cluster. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `allow_no_indices` | Boolean | If `false`, the request returns an error if a wildcard expression or index alias matches no open indexes. Default is `true`. |
| `expand_wildcards` | String | Specifies the types of indexes to which wildcard expressions can expand. Supports comma-separated values. Valid values are: <br> - `all`: Expand to all open and closed indexes, including hidden indexes. <br> - `open`: Expand to open indexes. <br> - `closed`: Expand to closed indexes. <br> - `hidden`: Include hidden indexes when expanding. Must be combined with `open`, `closed`, or both. <br> - `none`: Do not accept wildcard expressions. <br> Default is `open`. <br> Force merge cannot run on closed indexes, so requests that expand wildcards to closed indexes (`closed` or `all`) return an error unless `ignore_unavailable` is `true`. |
| `flush` | Boolean | Performs a flush on the indexes after the force merge. A flush ensures that the files are persisted to disk. Default is `true`. |
| `ignore_unavailable` | Boolean | If `true`, OpenSearch ignores missing or closed indexes. If `false`, OpenSearch returns an error if the force merge operation encounters missing or closed indexes. Default is `false`. |
| `max_num_segments` | Integer | The maximum number of segments per shard after the merge. Set this parameter to `1` to merge all segments of each shard into one segment. By default, segments are merged as determined by the merge policy. |
| `only_expunge_deletes` | Boolean | If `true`, the merge operation only expunges segments containing a certain percentage of deleted documents. The percentage is 10% by default and is configurable in the `index.merge.policy.expunge_deletes_allowed` setting. Using `only_expunge_deletes` does not produce segments larger than `index.merge.policy.max_merged_segment` (by default, 5 GB). Combining `only_expunge_deletes` with `max_num_segments` is deprecated. For more information, see [Deleted documents](#deleted-documents). Default is `false`. |
| `primary_only` | Boolean | If set to `true`, then the merge operation is performed only on the primary shards of an index. This can be useful when you want to take a snapshot of the index after the merge is complete. Snapshots only copy segments from the primary shards. Merging the primary shards can reduce resource consumption. Default is `false`. |
| `wait_for_completion` | Boolean | If `false`, OpenSearch runs the force merge operation asynchronously without waiting for it to complete. The request returns immediately, and the task continues in the background. You can monitor its progress using the [Tasks API]({{site.url}}{{site.baseurl}}/api-reference/tasks/). Default is `true`, which means the operation runs synchronously. |

## Example requests

The following examples show how to use the Force Merge API.

### Force merge a specific index

The following example force merges a specific index:

<!-- spec_insert_start
component: example_code
rest: POST /testindex1/_forcemerge
-->
{% capture step1_rest %}
POST /testindex1/_forcemerge
{% endcapture %}

{% capture step1_python %}


response = client.indices.forcemerge(
  index = "testindex1"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Force merge multiple indexes

The following example force merges multiple indexes:

<!-- spec_insert_start
component: example_code
rest: POST /testindex1,testindex2/_forcemerge
body: 
-->
{% capture step1_rest %}
POST /testindex1,testindex2/_forcemerge

{% endcapture %}

{% capture step1_python %}


response = client.indices.forcemerge(
  index = "testindex1,testindex2"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Force merge all indexes

The following example force merges all indexes:

<!-- spec_insert_start
component: example_code
rest: POST /_forcemerge
body: 
-->
{% capture step1_rest %}
POST /_forcemerge

{% endcapture %}

{% capture step1_python %}

response = client.indices.forcemerge()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Force merge a data stream's backing indexes into one segment

The following example force merges a data stream's backing indexes into one segment:

<!-- spec_insert_start
component: example_code
rest: POST /testindex-logs/_forcemerge?max_num_segments=1
-->
{% capture step1_rest %}
POST /testindex-logs/_forcemerge?max_num_segments=1
{% endcapture %}

{% capture step1_python %}


response = client.indices.forcemerge(
  index = "testindex-logs",
  params = { "max_num_segments": "1" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Force merge primary shards

The following example force merges an index's primary shards:

<!-- spec_insert_start
component: example_code
rest: POST /testindex-logs/_forcemerge?primary_only=true
-->
{% capture step1_rest %}
POST /testindex-logs/_forcemerge?primary_only=true
{% endcapture %}

{% capture step1_python %}


response = client.indices.forcemerge(
  index = "testindex-logs",
  params = { "primary_only": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

The `total` count includes both primary and replica shards. In the following example response, the index has one primary shard and one replica shard. The replica shard is unassigned, so the operation succeeded only on the primary shard:

```json
{
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  }
}
```

If `wait_for_completion` is `false`, the response contains the task ID, which you can use to monitor the task using the [Tasks API]({{site.url}}{{site.baseurl}}/api-reference/tasks/):

```json
{
  "task": "<node_id>:<task_number>"
}
```

## Response body fields

The following table lists all response fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `_shards` | Object | Contains information about the shards on which the request was executed. Returned when `wait_for_completion` is `true`. |
| `task` | String | The ID of the force merge task. Returned when `wait_for_completion` is `false`. |

The `_shards` object contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `total` | Integer | The number of shards on which the operation was executed. |
| `successful` | Integer | The number of shards on which the operation was successful. |
| `failed` | Integer | The number of shards on which the operation failed. |

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:admin/forcemerge`.
