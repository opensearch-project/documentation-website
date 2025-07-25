---
layout: default
title: Cluster health
parent: REST API reference
nav_order: 55
canonical_url: https://docs.opensearch.org/latest/api-reference/cluster-api/cluster-health/
---

# Cluster health
Introduced 1.0
{: .label .label-purple }

The most basic cluster health request returns a simple status of the health of your cluster. OpenSearch expresses cluster health in three colors: green, yellow, and red. A green status means all primary shards and their replicas are allocated to nodes. A yellow status means all primary shards are allocated to nodes, but some replicas aren't. A red status means at least one primary shard is not allocated to any node.

To get the status of a specific index, provide the index name.

## Example

This request waits 50 seconds for the cluster to reach the yellow status or better:

```
GET _cluster/health?wait_for_status=yellow&timeout=50s
```

If the cluster health becomes yellow or green before 50 seconds elapse, it returns a response immediately. Otherwise it returns a response as soon as it exceeds the timeout.

## Path and HTTP methods

```
GET _cluster/health
GET _cluster/health/<index>
```

## URL parameters

All cluster health parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
expand_wildcards | Enum | Expands wildcard expressions to concrete indices. Combine multiple values with commas. Supported values are `all`, `open`, `closed`, `hidden`, and `none`. Default is `open`.
level | Enum | The level of detail for returned health information. Supported values are `cluster`, `indices`, and `shards`. Default is `cluster`.
local | Boolean | Whether to return information from the local node only instead of from the master node. Default is false.
master_timeout | Time | The amount of time to wait for a connection to the master node. Default is 30 seconds.
timeout | Time | The amount of time to wait for a response. If the timeout expires, the request fails. Default is 30 seconds.
wait_for_active_shards | String | Wait until the specified number of shards is active before returning a response. `all` for all shards. Default is `0`.
wait_for_events | Enum | Wait until all currently queued events with the given priority are processed. Supported values are `immediate`, `urgent`, `high`, `normal`, `low`, and `languid`.
wait_for_no_relocating_shards | Boolean | Whether to wait until there are no relocating shards in the cluster. Default is false.
wait_for_no_initializing_shards | Boolean | Whether to wait until there are no initializing shards in the cluster. Default is false.
wait_for_status | Enum | Wait until the cluster is in a specific state or better. Supported values are `green`, `yellow`, and `red`.

<!-- wait_for_nodes | string | Wait until the specified number of nodes is available. Also supports operators <=, >=, <, and >
# Not working properly when tested -->

## Response

```json
{
  "cluster_name" : "opensearch-cluster",
  "status" : "green",
  "timed_out" : false,
  "number_of_nodes" : 2,
  "number_of_data_nodes" : 2,
  "active_primary_shards" : 6,
  "active_shards" : 12,
  "relocating_shards" : 0,
  "initializing_shards" : 0,
  "unassigned_shards" : 0,
  "delayed_unassigned_shards" : 0,
  "number_of_pending_tasks" : 0,
  "number_of_in_flight_fetch" : 0,
  "task_max_waiting_in_queue_millis" : 0,
  "active_shards_percent_as_number" : 100.0
}
```
