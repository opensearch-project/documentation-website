---
layout: default
title: Force merge
parent: Index APIs
nav_order: 37
---

# Force merge
**Introduced 1.0**
{: .label .label-purple }

The force merge API operation forces a merge on the shards of one or more indexes. For a data stream, the API forces a merge on the shards of the stream's backing index.

## The merge operation

In OpenSearch, a shard is a Lucene index, which consists of _segments_ (or segment files). Segments store the indexed data. Periodically, smaller segments are merged into larger ones and the larger segments become immutable. Merging reduces the overall number of segments on each shard and frees up disk space. 

OpenSearch performs background segment merges that produce segments whose size equals to at most `index.merge.policy.max_merged_segment` (the default is 5 GB).

## Deleted documents

When a document is deleted from an OpenSearch index, it is not deleted from the Lucene segment but is rather only marked to be deleted. When the segment files are merged, deleted documents are removed (or _expunged_). Thus, merging also frees up space occupied by documents marked as deleted.

## Force Merge API

In addition to periodic merging, you can force a segment merge using the Force Merge API. 

Use the Force Merge API on an index only after all write requests sent to the index are completed. The force merge operation can produce very large segments. If write requests are still sent to the index, then the merge policy does not merge these segments until they primarily consist of deleted documents. This can increase disk space usage and lead to performance degradation.
{: .warning}

When you call the Force Merge API, the call is blocked until merge completion. If during this time the connection is lost, the force merge operation continues in the background. New force merge requests sent to the same index will be blocked until the currently running merge operation is complete.

## Force merging multiple indexes

To force merge multiple indexes, you can call the Force Merge API on the following index combinations:

- Multiple indexes
- One or more data streams containing multiple backing indexes
- One or more index aliases pointing to multiple indexes
- All data streams and indexes in a cluster

When you force merge multiple indexes, the merge operation is executed on each shard of a node sequentially. When the force merge operation is in progress, the storage for the shard temporarily increases so that all segments can be rewritten into a new segment. When `max_num_segments` is set to `1`, the storage for the shard temporarily doubles.

## Force merging data streams

It can be useful to force merge data streams in order to manage a data stream's backing indexes, especially after a rollover operation. Time-based indexes receive indexing requests only during a specified time period. Once that time period has elapsed and the index receives no more write requests, you can force merge segments of all index shards into one segment. Searches on single-segment shards are more efficient because they use simpler data structures.

## Path and HTTP methods

```json
POST /_forcemerge
POST /<index>/_forcemerge/
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `<index>` | String | A comma-separated list of indexes, data streams, or index aliases to which the operation is applied. Supports wildcard expressions (`*`). Use `_all` or `*` to specify all indexes and data streams in a cluster. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `allow_no_indices` | Boolean | If `false`, the request returns an error if any wildcard expression or index alias targets any closed or missing indexes. Default is `true`. |
| `expand_wildcards` | String | Specifies the types of indexes to which wildcard expressions can expand. Supports comma-separated values. Valid values are: <br> - `all`: Expand to all open and closed indexes, including hidden indexes. <br> - `open`: Expand to open indexes. <br> - `closed`: Expand to closed indexes. <br> - `hidden`: Include hidden indexes when expanding. Must be combined with `open`, `closed`, or both. <br> - `none`: Do not accept wildcard expressions. <br> Default is `open`. |
| `flush` | Boolean | Performs a flush on the indexes after the force merge. A flush ensures that the files are persisted to disk. Default is `true`. |
| `ignore_unavailable` | Boolean | If `true`, OpenSearch ignores missing or closed indexes. If `false`, OpenSearch returns an error if the force merge operation encounters missing or closed indexes. Default is `false`. |
| `max_num_segments` | Integer | The number of larger segments into which smaller segments are merged. Set this parameter to `1` to merge all segments into one segment. The default behavior is to perform the merge as necessary. |
| `only_expunge_deletes` | Boolean | If `true`, the merge operation only expunges segments containing a certain percentage of deleted documents. The percentage is 10% by default and is configurable in the `index.merge.policy.expunge_deletes_allowed` setting. Prior to OpenSearch 2.12, `only_expunge_deletes` ignored the `index.merge.policy.max_merged_segment` setting. Starting with OpenSearch 2.12, using `only_expunge_deletes` does not produce segments larger than `index.merge.policy.max_merged_segment` (by default, 5 GB). For more information, see [Deleted documents](#deleted-documents). Default is `false`. |

#### Example request: Force merge a specific index

```json
POST /testindex1/_forcemerge
```
{% include copy-curl.html %}

#### Example request: Force merge multiple indexes

```json
POST /testindex1,testindex2/_forcemerge
```
{% include copy-curl.html %}

#### Example request: Force merge all indexes

```json
POST /_forcemerge
```
{% include copy-curl.html %}

#### Example request: Force merge a data stream's backing indexes into one segment

```json
POST /.testindex-logs/_forcemerge?max_num_segments=1
```
{% include copy-curl.html %}

#### Example response

```json
{
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  }
}
```

## Response fields

The following table lists all response fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `shards` | Object | Contains information about the shards on which the request was executed. |
| `shards.total` | Integer | The number of shards on which the operation was executed. |
| `shards.successful` | Integer | The number of shards on which the operation was successful. |
| `shards.failed` | Integer | The number of shards on which the operation failed. |
