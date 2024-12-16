---
layout: default
title: Flush
parent: Index APIs
nav_order: 36
---

# Flush

**Introduced 1.0**
{: .label .label-purple }

The Flush API stores all in-memory operations to segments on disk. Operations flushed to an index segment are no longer needed in transaction logs during a cluster restart because these operations are now stored in the Lucene index. 

OpenSearch automatically performs flushes in the background based on conditions like transaction log size, which is controlled by the `index.translog.flush_threshold_size` setting. Use the Flush API sparingly, for example, for manual restarts or to free up memory.

## Endpoints

The Flush API supports the following paths:

```json
GET /_flush
POST /_flush
GET /{index}/_flush
POST /{index}/_flush
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `<index>` | String | A comma-separated list of indexes, data streams, or index aliases to which the operation is applied. Supports wildcard expressions (`*`). Use `_all` or `*` to specify all indexes and data streams in a cluster. |

## Query parameters

All parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `allow_no_indices` | Boolean | When `false`, the request returns an error if any wildcard expression or index alias targets any closed or missing indexes. Default is `true`. |
| `expand_wildcards` | String | Specifies the types of indexes to which wildcard expressions can expand. Supports comma-separated values. Valid values are: <br> - `all`: Expand to all open and closed indexes, including hidden indexes. <br> - `open`: Expand to open indexes. <br> - `closed`: Expand to closed indexes. <br> - `hidden`: Include hidden indexes when expanding. Must be combined with `open`, `closed`, or both. <br> - `none`: Do not accept wildcard expressions. <br> Default is `open`. |
| `force` | Boolean | When `true`, forces a flush to occur even when no changes to the index exist in-memory. Default is `true`. |
| `ignore_unavailable` | Boolean | When `true`, OpenSearch ignores missing or closed indexes. If `false`, OpenSearch returns an error if the force merge operation encounters missing or closed indexes. Default is `false`. |
| `wait_if_ongoing` | Boolean | When `true`, the Flush API does not run while another flush request is active. When `false`, OpenSearch returns an error if another flush request is active. Default is `true`. |

## Example requests

### Flush a specific index

The following example flushes an index named `shakespeare`:

```json
POST /shakespeare/_flush
```
{% include copy-curl.html %}


### Flush all indexes

The following example flushes all indexes in a cluster:

```json
POST /_flush
```
{% include copy-curl.html %}

## Example response

OpenSearch responds with the number of shards that acknowledged the flush request, the number of shards that completed the request, and the number of shards that failed:

```
{
  "_shards": {
    "total": 10,
    "successful": 10,
    "failed": 0
  }
}
```


