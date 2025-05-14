---
layout: default
title: Get Leader Stats API
parent: Replication APIs
nav_order: 35
---

# Get Leader Stats API
Introduced 1.0
{: .label .label-purple }

The Get Leader Stats API retrieves statistics about leader indexes in the replication process. This API provides detailed metrics about operations, data volumes, and performance during replication activities.

<!-- spec_insert_start
api: replication.leader_stats
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_replication/leader_stats
```
<!-- spec_insert_end -->

## Example request

The following example gets statistics about all leader indexes in the replication process:

```json
GET /_plugins/_replication/leader_stats
```
{% include copy-curl.html %}

## Example response

The following example shows a successful API response with statistics for two indexes:

```json
{
  "num_replicated_indices": 2,
  "operations_read": 1254,
  "operations_read_lucene": 1134,
  "operations_read_translog": 120,
  "bytes_read": 25678,
  "translog_size_bytes": 4582,
  "total_read_time_lucene_millis": 1450,
  "total_read_time_translog_millis": 235,
  "index_stats": {
    "customer-data": {
      "operations_read": 854,
      "operations_read_lucene": 784,
      "operations_read_translog": 70,
      "bytes_read": 18425,
      "translog_size_bytes": 3210,
      "total_read_time_lucene_millis": 980,
      "total_read_time_translog_millis": 120
    },
    "product-data": {
      "operations_read": 400,
      "operations_read_lucene": 350,
      "operations_read_translog": 50,
      "bytes_read": 7253,
      "translog_size_bytes": 1372,
      "total_read_time_lucene_millis": 470,
      "total_read_time_translog_millis": 115
    }
  }
}
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `bytes_read` | Integer | The total size in bytes read during replication. |
| `index_stats` | Object | Per-index statistics for all indexes being replicated. |
| `num_replicated_indices` | Float | The number of indexes being replicated. |
| `operations_read` | Float | The total number of operations read during replication. |
| `operations_read_lucene` | Float | The number of operations read from Lucene during replication. |
| `operations_read_translog` | Float | The number of operations read from the translog during replication. |
| `total_read_time_lucene_millis` | Integer or String | The total time in milliseconds spent reading from Lucene. |
| `total_read_time_translog_millis` | Integer or String | The total time in milliseconds spent reading from the translog. |
| `translog_size_bytes` | Integer | The size in bytes of the translog. |

<details markdown="block">
  <summary>
    Response body fields: <code>index_stats</code>
  </summary>
  {: .text-delta}

`index_stats` is a JSON object with index names as keys. Each index entry contains the following fields:

| Field | Data type | Description |
| :--- | :--- | :--- |
| `bytes_read` | Integer | The size in bytes read for this specific index. |
| `operations_read` | Float | The number of operations read for this index during replication. |
| `operations_read_lucene` | Float | The number of operations read from Lucene for this index during replication. |
| `operations_read_translog` | Float | The number of operations read from the translog for this index during replication. |
| `total_read_time_lucene_millis` | Integer or String | The total time in milliseconds spent reading from Lucene for this index. |
| `total_read_time_translog_millis` | Integer or String | The total time in milliseconds spent reading from the translog for this index. |
| `translog_size_bytes` | Integer | The size in bytes of the translog for this index. |
</details>