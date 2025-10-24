---
layout: default
title: Recovery
parent: Index APIs
nav_order: 110
---

# Recovery API
Introduced 1.0
{: .label .label-purple }

The Recovery API provides information about any completed or ongoing shard recoveries for one or more indexes. If a data stream is listed, the API returns information about that data stream's backing indexes. 

Shard recovery involves creating a shard copy to restore a primary shard from a snapshot or to synchronize a replica shard. After the shard recovery process completes, the recovered shard becomes available for use in search and index operations.

Shard recovery occurs automatically in the following scenarios:

- Node startup, known as a local store recovery
- Replication of a primary shard
- Relocation of a shard to a different node within the same cluster
- Restoration of a snapshot
- Clone, shrink, or split operations

The Recovery API reports solely on completed recoveries for shard copies presently stored in the cluster. It reports only the most recent recovery for each shard copy and does not include historical information about previous recoveries or information about recoveries of shard copies that no longer exist. Consequently, if a shard copy completes a recovery and is subsequently relocated to a different node, then the information about the original recovery is not displayed in the Recovery API.


## Endpoints

```json
GET /_recovery
GET /<index>/_recovery/
```

## Path parameters

Parameter | Data type | Description 
:--- | :--- 
`index` |  String | A comma-separated list of indexes, data streams, or index aliases to which the operation is applied. Supports wildcard expressions (`*`). Use `_all` or `*` to specify all indexes and data streams in a cluster. |


## Query parameters

All of the following query parameters are optional.

Parameter | Data type | Description 
:--- | :--- | :---  
`active_only` | Boolean | When `true`, the response only includes active shard recoveries. Default is `false`.
`detailed` | Boolean | When `true`, provides detailed information about shard recoveries. Default is `false`.
`index`  | String | A comma-separated list or wildcard expression of index names used to limit the request.


## Example requests

The following examples demonstrate how to recover information using the Recovery API.

### Recover information from several or all indexes

The following example request returns recovery information about several indexes in a [human-readable format]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#human-readable-output):

<!-- spec_insert_start
component: example_code
rest: GET /index1,index2/_recovery?human
-->
{% capture step1_rest %}
GET /index1,index2/_recovery?human
{% endcapture %}

{% capture step1_python %}


response = client.indices.recovery(
  index = "index1,index2",
  params = { "human": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The following example request returns recovery information about all indexes in a human-readable format:

<!-- spec_insert_start
component: example_code
rest: GET /_recovery?human
-->
{% capture step1_rest %}
GET /_recovery?human
{% endcapture %}

{% capture step1_python %}


response = client.indices.recovery(
  params = { "human": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Recover detailed information

The following example request returns detailed recovery information:

<!-- spec_insert_start
component: example_code
rest: GET /_recovery?human&detailed=true
-->
{% capture step1_rest %}
GET /_recovery?human&detailed=true
{% endcapture %}

{% capture step1_python %}


response = client.indices.recovery(
  params = { "human": "true", "detailed": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

The following response returns detailed recovery information about an index named `shakespeare`:

```json
{
  "shakespeare": {
    "shards": [
      {
        "id": 0,
        "type": "EXISTING_STORE",
        "stage": "DONE",
        "primary": true,
        "start_time": "2024-07-01T18:06:47.415Z",
        "start_time_in_millis": 1719857207415,
        "stop_time": "2024-07-01T18:06:47.538Z",
        "stop_time_in_millis": 1719857207538,
        "total_time": "123ms",
        "total_time_in_millis": 123,
        "source": {
          "bootstrap_new_history_uuid": false
        },
        "target": {
          "id": "uerS7REgRQCbBF3ImY8wOQ",
          "host": "172.18.0.3",
          "transport_address": "172.18.0.3:9300",
          "ip": "172.18.0.3",
          "name": "opensearch-node2"
        },
        "index": {
          "size": {
            "total": "17.8mb",
            "total_in_bytes": 18708764,
            "reused": "17.8mb",
            "reused_in_bytes": 18708764,
            "recovered": "0b",
            "recovered_in_bytes": 0,
            "percent": "100.0%"
          },
          "files": {
            "total": 7,
            "reused": 7,
            "recovered": 0,
            "percent": "100.0%",
            "details": [
              {
                "name": "_1.cfs",
                "length": "9.8mb",
                "length_in_bytes": 10325945,
                "reused": true,
                "recovered": "0b",
                "recovered_in_bytes": 0
              },
              {
                "name": "_0.cfe",
                "length": "479b",
                "length_in_bytes": 479,
                "reused": true,
                "recovered": "0b",
                "recovered_in_bytes": 0
              },
              {
                "name": "_0.si",
                "length": "333b",
                "length_in_bytes": 333,
                "reused": true,
                "recovered": "0b",
                "recovered_in_bytes": 0
              },
              {
                "name": "_1.cfe",
                "length": "479b",
                "length_in_bytes": 479,
                "reused": true,
                "recovered": "0b",
                "recovered_in_bytes": 0
              },
              {
                "name": "_1.si",
                "length": "333b",
                "length_in_bytes": 333,
                "reused": true,
                "recovered": "0b",
                "recovered_in_bytes": 0
              },
              {
                "name": "_0.cfs",
                "length": "7.9mb",
                "length_in_bytes": 8380790,
                "reused": true,
                "recovered": "0b",
                "recovered_in_bytes": 0
              },
              {
                "name": "segments_3",
                "length": "405b",
                "length_in_bytes": 405,
                "reused": true,
                "recovered": "0b",
                "recovered_in_bytes": 0
              }
            ]
          },
          "total_time": "6ms",
          "total_time_in_millis": 6,
          "source_throttle_time": "-1",
          "source_throttle_time_in_millis": 0,
          "target_throttle_time": "-1",
          "target_throttle_time_in_millis": 0
        },
        "translog": {
          "recovered": 0,
          "total": 0,
          "percent": "100.0%",
          "total_on_start": 0,
          "total_time": "113ms",
          "total_time_in_millis": 113
        },
        "verify_index": {
          "check_index_time": "0s",
          "check_index_time_in_millis": 0,
          "total_time": "0s",
          "total_time_in_millis": 0
        }
      },
      {
        "id": 0,
        "type": "PEER",
        "stage": "DONE",
        "primary": false,
        "start_time": "2024-07-01T18:06:47.693Z",
        "start_time_in_millis": 1719857207693,
        "stop_time": "2024-07-01T18:06:47.744Z",
        "stop_time_in_millis": 1719857207744,
        "total_time": "50ms",
        "total_time_in_millis": 50,
        "source": {
          "id": "uerS7REgRQCbBF3ImY8wOQ",
          "host": "172.18.0.3",
          "transport_address": "172.18.0.3:9300",
          "ip": "172.18.0.3",
          "name": "opensearch-node2"
        },
        "target": {
          "id": "HFYKietmTO6Ud9COgP0k9Q",
          "host": "172.18.0.2",
          "transport_address": "172.18.0.2:9300",
          "ip": "172.18.0.2",
          "name": "opensearch-node1"
        },
        "index": {
          "size": {
            "total": "0b",
            "total_in_bytes": 0,
            "reused": "0b",
            "reused_in_bytes": 0,
            "recovered": "0b",
            "recovered_in_bytes": 0,
            "percent": "0.0%"
          },
          "files": {
            "total": 0,
            "reused": 0,
            "recovered": 0,
            "percent": "0.0%",
            "details": []
          },
          "total_time": "1ms",
          "total_time_in_millis": 1,
          "source_throttle_time": "-1",
          "source_throttle_time_in_millis": 0,
          "target_throttle_time": "-1",
          "target_throttle_time_in_millis": 0
        },
        "translog": {
          "recovered": 0,
          "total": 0,
          "percent": "100.0%",
          "total_on_start": -1,
          "total_time": "42ms",
          "total_time_in_millis": 42
        },
        "verify_index": {
          "check_index_time": "0s",
          "check_index_time_in_millis": 0,
          "total_time": "0s",
          "total_time_in_millis": 0
        }
      }
    ]
  }
}
```

## Response body fields

The API responds with the following information about the recovery shard.

Parameter | Data type | Description 
:--- | :--- | :--- 
`id` | Integer | The ID of the shard. 
`type` | String | The recovery source for the shard. Returned values include: <br> - `EMPTY_STORE`: An empty store. Indicates a new primary shard or the forced allocation of an empty primary shard using the Cluster Reroute API. <br> - `EXISTING_STORE`: The store of an existing primary shard. Indicates that the recovery is related to node startup or the allocation of an existing primary shard. <br> - `LOCAL_SHARDS`: Shards belonging to another index on the same node. Indicates that the recovery is related to a clone, shrink, or split operation. <br> - `PEER`: A primary shard on another node. Indicates that the recovery is related to shard replication. <br> - `SNAPSHOT`: A snapshot. Indicates that the recovery is related to a snapshot restore operation. 
`STAGE` | String | The recovery stage. Returned values can include: <br> - `INIT`: Recovery has not started. <br> - `INDEX`: Reading index metadata and copying bytes from the source to the destination. <br> - `VERIFY_INDEX`: Verifying the integrity of the index. <br> - `TRANSLOG`: Replaying the transaction log. <br> - `FINALIZE`: Cleanup. <br> - `DONE`: Complete. 
`primary` | Boolean | When `true`, the shard is a primary shard. 
`start_time` | String | The timestamp indicating when the recovery started. 
`stop_time` | String | The timestamp indicating when the recovery completed. 
`total_time_in_millis` | String | The total amount of time taken to recover a shard, in milliseconds. 
`source` | Object | The recovery source. This can include a description of the repository (if the recovery is from a snapshot) or a description of the source node. 
`target` | Object | The destination node. 
`index` | Object | Statistics about the physical index recovery. 
`translog` | Object | Statistics about the translog recovery. 
 `start` | Object | Statistics about the amount of time taken to open and start the index. 
