---
layout: default
title: Flush
parent: Index operations
grand_parent: Index APIs
nav_order: 30
---

# Flush API

**Introduced 1.0**
{: .label .label-purple }

The Flush API stores all in-memory operations to segments on disk. Operations flushed to an index segment are no longer needed in transaction logs during a cluster restart because these operations are now stored in the Lucene index. 

OpenSearch automatically performs flushes in the background based on conditions like transaction log size, which is controlled by the `index.translog.flush_threshold_size` setting. Use the Flush API sparingly, for example, for manual restarts or to free up memory.

For more information about how flush relates to the transaction log, refresh, and merge operations, see [Flush]({{site.url}}{{site.baseurl}}/getting-started/concepts/#flush) in OpenSearch concepts.

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
| `expand_wildcards` | String | Specifies the types of indexes to which wildcard expressions can expand. Supports comma-separated values. Valid values are: <br> - `all`: Expand to all open and closed indexes, including hidden indexes. <br> - `open`: Expand to open indexes. <br> - `closed`: Expand to closed indexes. <br> - `hidden`: Include hidden indexes when expanding. Must be combined with `open`, `closed`, or both. <br> - `none`: Do not accept wildcard expressions. <br> Default is `open`. <br> The Flush API cannot flush closed indexes. If a wildcard expression expands to a closed index, the request fails unless `ignore_unavailable` is `true`, in which case closed indexes are skipped. |
| `force` | Boolean | When `true`, forces a flush to occur even when no changes to the index exist in-memory. If `true`, `wait_if_ongoing` must also be `true`; otherwise, the request is rejected. Default is `false`. |
| `ignore_unavailable` | Boolean | When `true`, OpenSearch ignores missing or closed indexes. If `false`, OpenSearch returns an error if the flush operation encounters missing or closed indexes. Default is `false`. |
| `wait_if_ongoing` | Boolean | When `true`, if another flush is in progress, OpenSearch waits for it to finish and then performs the flush. When `false`, if another flush is already running on a shard, that shard skips the flush without returning an error. Default is `true`. |

## Example request: Flushing a specific index

The following example flushes an index named `shakespeare`:

<!-- spec_insert_start
component: example_code
rest: POST /shakespeare/_flush
body: 
-->
{% capture step1_rest %}
POST /shakespeare/_flush

{% endcapture %}

{% capture step1_python %}


response = client.indices.flush(
  index = "shakespeare"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->


## Example request: Flushing all indexes

The following example flushes all indexes in a cluster:

<!-- spec_insert_start
component: example_code
rest: POST /_flush
body: 
-->
{% capture step1_rest %}
POST /_flush

{% endcapture %}

{% capture step1_python %}

response = client.indices.flush()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

OpenSearch responds with the number of shard copies targeted by the flush request (including unassigned replicas), the number of shard copies that completed the request, and the number of shard copies that failed:

```json
{
  "_shards": {
    "total": 10,
    "successful": 10,
    "failed": 0
  }
}
```

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:admin/flush` and `indices:admin/flush*`.
