---
layout: default
title: Cluster allocation explain
nav_order: 10
parent: Cluster APIs
has_children: false
redirect_from:
 - /opensearch/rest-api/cluster-allocation/
---

# Cluster allocation explain
**Introduced 1.0**
{: .label .label-purple }

The Cluster Allocation Explain API explains how shards are allocated in the cluster and why unassigned shards cannot be assigned to a node.


<!-- spec_insert_start
api: cluster.allocation_explain
component: endpoints
-->
## Endpoints
```json
GET  /_cluster/allocation/explain
POST /_cluster/allocation/explain
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: cluster.allocation_explain
columns: Parameter, Data type, Description, Default
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `include_disk_info` | Boolean | When `true`, returns information about disk usage and shard sizes. | `false` |
| `include_yes_decisions` | Boolean | When `true`, returns any `YES` decisions in the allocation explanation. | `false` |

<!-- spec_insert_end -->


## Request body fields

All cluster allocation explain fields are optional.

Field | Type | Description
:--- | :--- | :---
`current_node` | String | Specifies a node name to return an explanation only if the shard is on that node.
`index` | String | The name of the shard's index.
`primary` | Boolean | Whether to provide an explanation for the primary shard (`true`) or its first replica (`false`), both of which share the same shard ID.
`shard` | Integer | The shard ID that you want an explanation for.

## Example request

```json
GET _cluster/allocation/explain?include_yes_decisions=true
{
  "index": "movies",
  "shard": 0,
  "primary": true
}
```
{% include copy-curl.html %}


## Example response

```json
{
  "index": "movies",
  "shard": 0,
  "primary": true,
  "current_state": "started",
  "current_node": {
    "id": "d8jRZcW1QmCBeVFlgOJx5A",
    "name": "opensearch-node1",
    "transport_address": "172.24.0.4:9300",
    "weight_ranking": 1
  },
  "can_remain_on_current_node": "yes",
  "can_rebalance_cluster": "yes",
  "can_rebalance_to_other_node": "no",
  "rebalance_explanation": "cannot rebalance as no target node exists that can both allocate this shard and improve the cluster balance",
  "node_allocation_decisions": [{
    "node_id": "vRxi4uPcRt2BtHlFoyCyTQ",
    "node_name": "opensearch-node2",
    "transport_address": "172.24.0.3:9300",
    "node_decision": "no",
    "weight_ranking": 1,
    "deciders": [{
        "decider": "max_retry",
        "decision": "YES",
        "explanation": "shard has no previous failures"
      },
      {
        "decider": "replica_after_primary_active",
        "decision": "YES",
        "explanation": "shard is primary and can be allocated"
      },
      {
        "decider": "enable",
        "decision": "YES",
        "explanation": "all allocations are allowed"
      },
      {
        "decider": "node_version",
        "decision": "YES",
        "explanation": "can relocate primary shard from a node with version [1.0.0] to a node with equal-or-newer version [1.0.0]"
      },
      {
        "decider": "snapshot_in_progress",
        "decision": "YES",
        "explanation": "no snapshots are currently running"
      },
      {
        "decider": "restore_in_progress",
        "decision": "YES",
        "explanation": "ignored as shard is not being recovered from a snapshot"
      },
      {
        "decider": "filter",
        "decision": "YES",
        "explanation": "node passes include/exclude/require filters"
      },
      {
        "decider": "same_shard",
        "decision": "NO",
        "explanation": "a copy of this shard is already allocated to this node [[movies][0], node[vRxi4uPcRt2BtHlFoyCyTQ], [R], s[STARTED], a[id=x8w7QxWdQQa188HKGn0iMQ]]"
      },
      {
        "decider": "disk_threshold",
        "decision": "YES",
        "explanation": "enough disk for shard on node, free: [35.9gb], shard size: [15.1kb], free after allocating shard: [35.9gb]"
      },
      {
        "decider": "throttling",
        "decision": "YES",
        "explanation": "below shard recovery limit of outgoing: [0 < 2] incoming: [0 < 2]"
      },
      {
        "decider": "shards_limit",
        "decision": "YES",
        "explanation": "total shard limits are disabled: [index: -1, cluster: -1] <= 0"
      },
      {
        "decider": "awareness",
        "decision": "YES",
        "explanation": "allocation awareness is not enabled, set cluster setting [cluster.routing.allocation.awareness.attributes] to enable it"
      }
    ]
  }]
}
```
