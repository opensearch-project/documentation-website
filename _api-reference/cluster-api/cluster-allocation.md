---
layout: default
title: Cluster allocation explain
nav_order: 10
parent: Cluster APIs
has_children: false
redirect_from:
 - /opensearch/rest-api/cluster-allocation/
---

# Cluster Allocation Explain API
**Introduced 1.0**
{: .label .label-purple }

The Cluster Allocation Explain API provides detailed explanations for shard allocations in your cluster. Use this API to troubleshoot and diagnose shard allocation issues.

This API is particularly useful in the following scenarios:

- Understanding why a shard remains unassigned and cannot be allocated to any node.
- Determining why a shard was allocated to a particular node instead of another.
- Understanding why a shard remains on its current node rather than being rebalanced to another node.
- Verifying that allocation settings and filters are working as expected.

When called without a request body, the API finds the first unassigned shard and explains why it cannot be allocated. When called with specific shard information, it provides allocation details for that particular shard.


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
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `include_disk_info` | Boolean | When `true`, returns information about disk usage and shard sizes. _(Default: `false`)_ |
| `include_yes_decisions` | Boolean | When `true`, returns any `YES` decisions in the allocation explanation. `YES` decisions indicate when a particular shard allocation attempt was successful for the given node. _(Default: `false`)_ |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.allocation_explain
component: request_body_parameters
-->
## Request body fields

The index, shard, and primary flag for which to generate an explanation. Leave this empty to generate an explanation for the first unassigned shard.

The request body is optional. It is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `current_node` | String | Specifies the node ID or the name of the node to only explain a shard that is currently located on the specified node. |
| `index` | String | The name of the index that contains the shard for which to generate an explanation. |
| `primary` | Boolean | When `true`, returns a routing explanation for the primary shard based on the node ID. |
| `shard` | Integer | Specifies the ID of the shard that you would like an explanation for. |

<!-- spec_insert_end -->

## Example request

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/allocation/explain?include_yes_decisions=true
body: |
{
  "index": "movies",
  "shard": 0,
  "primary": true
}
-->
{% capture step1_rest %}
GET /_cluster/allocation/explain?include_yes_decisions=true
{
  "index": "movies",
  "shard": 0,
  "primary": true
}
{% endcapture %}

{% capture step1_python %}


response = client.cluster.allocation_explain(
  params = { "include_yes_decisions": "true" },
  body =   {
    "index": "movies",
    "shard": 0,
    "primary": true
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->


## Example response

The following response shows an assigned primary shard with allocation decisions for other nodes in the cluster:

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

## Example: Explaining the first unassigned shard

To get an explanation for the first unassigned shard found by OpenSearch, send an empty request body:

<!-- spec_insert_start
component: example_code
rest: POST /_cluster/allocation/explain
body: {}
-->
{% capture step1_rest %}
POST /_cluster/allocation/explain
{}
{% endcapture %}

{% capture step1_python %}


response = client.cluster.allocation_explain(
  body =   {}
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

#### Example response

The following response shows an unassigned replica shard in a single-node cluster:

```json
{
  "index" : "research_papers",
  "shard" : 0,
  "primary" : false,
  "current_state" : "unassigned",
  "unassigned_info" : {
    "reason" : "CLUSTER_RECOVERED",
    "at" : "2026-02-17T16:43:13.339Z",
    "last_allocation_status" : "no_attempt"
  },
  "can_allocate" : "no",
  "allocate_explanation" : "cannot allocate because allocation is not permitted to any of the nodes",
  "node_allocation_decisions" : [
    {
      "node_id" : "KfEEGG7_SsKZVFqI4ko2FA",
      "node_name" : "opensearch-node1",
      "transport_address" : "172.18.0.2:9300",
      "node_attributes" : {
        "shard_indexing_pressure_enabled" : "true"
      },
      "node_decision" : "no",
      "deciders" : [
        {
          "decider" : "same_shard",
          "decision" : "NO",
          "explanation" : "a copy of this shard is already allocated to this node [[research_papers][0], node[KfEEGG7_SsKZVFqI4ko2FA], [P], s[STARTED], a[id=SfxnuSLESQSI0Htcv0N3vA]]"
        }
      ]
    }
  ]
}
```

The response contains the following fields:
- `current_state`: The shard is `unassigned`.
- `unassigned_info.reason`: The shard became unassigned during cluster recovery (`CLUSTER_RECOVERED`).
- `can_allocate`: Set to `no` because the shard cannot be allocated to any available node.
- `node_decision`: Set to `no` for the only node in the cluster.
- `decider`: The `same_shard` allocator blocks allocation because the primary shard is already on this node.

This is a typical situation in single-node clusters where replica shards cannot be allocated because OpenSearch does not allow a primary and its replica to coexist on the same node.

## Example: Explaining a specific assigned shard

To understand why an assigned shard remains on its current node, specify the shard details:

<!-- spec_insert_start
component: example_code
rest: POST /_cluster/allocation/explain
body: |
{
  "index": "books",
  "shard": 0,
  "primary": true
}
-->
{% capture step1_rest %}
POST /_cluster/allocation/explain
{
  "index": "books",
  "shard": 0,
  "primary": true
}
{% endcapture %}

{% capture step1_python %}


response = client.cluster.allocation_explain(
  body =   {
    "index": "books",
    "shard": 0,
    "primary": true
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

#### Example response

```json
{
  "index" : "books",
  "shard" : 0,
  "primary" : true,
  "current_state" : "started",
  "current_node" : {
    "id" : "KfEEGG7_SsKZVFqI4ko2FA",
    "name" : "opensearch-node1",
    "transport_address" : "172.18.0.2:9300",
    "attributes" : {
      "shard_indexing_pressure_enabled" : "true"
    },
    "weight_ranking" : 1
  },
  "can_remain_on_current_node" : "yes",
  "can_rebalance_cluster" : "no",
  "can_rebalance_cluster_decisions" : [
    {
      "decider" : "rebalance_only_when_active",
      "decision" : "NO",
      "explanation" : "rebalancing is not allowed until all replicas in the cluster are active"
    },
    {
      "decider" : "cluster_rebalance",
      "decision" : "NO",
      "explanation" : "the cluster has unassigned shards and cluster setting [cluster.routing.allocation.allow_rebalance] is set to [indices_all_active]"
    }
  ],
  "can_rebalance_to_other_node" : "no",
  "rebalance_explanation" : "rebalancing is not allowed"
}
```

The response contains the following fields:
- `current_state`: The shard is `started` and functioning normally.
- `current_node`: Contains details about the node hosting this shard.
- `can_remain_on_current_node`: Set to `yes` because the shard is allowed to stay on its current node.
- `can_rebalance_cluster`: Set to `no` because rebalancing is disabled when the cluster has unassigned shards.
- `can_rebalance_cluster_decisions`: Lists the deciders that prevent rebalancing.

## Example: Including disk information

Use the `include_disk_info` parameter to get detailed disk usage statistics:

<!-- spec_insert_start
component: example_code
rest: POST /_cluster/allocation/explain?include_disk_info=true
body: |
{
  "index": "books",
  "shard": 0,
  "primary": true
}
-->
{% capture step1_rest %}
POST /_cluster/allocation/explain?include_disk_info=true
{
  "index": "books",
  "shard": 0,
  "primary": true
}
{% endcapture %}

{% capture step1_python %}


response = client.cluster.allocation_explain(
  params = { "include_disk_info": "true" },
  body =   {
    "index": "books",
    "shard": 0,
    "primary": true
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

#### Example response

The response includes additional `cluster_info` with disk usage and shard size details:

```json
{
  "index" : "books",
  "shard" : 0,
  "primary" : true,
  "current_state" : "started",
  "current_node" : {
    "id" : "KfEEGG7_SsKZVFqI4ko2FA",
    "name" : "opensearch-node1",
    "transport_address" : "172.18.0.2:9300",
    "attributes" : {
      "shard_indexing_pressure_enabled" : "true"
    },
    "weight_ranking" : 1
  },
  "cluster_info" : {
    "nodes" : {
      "KfEEGG7_SsKZVFqI4ko2FA" : {
        "node_name" : "opensearch-node1",
        "least_available" : {
          "path" : "/usr/share/opensearch/data/nodes/0",
          "total_bytes" : 62671097856,
          "used_bytes" : 14324834304,
          "free_bytes" : 48346263552,
          "free_disk_percent" : 77.1,
          "used_disk_percent" : 22.9
        },
        "most_available" : {
          "path" : "/usr/share/opensearch/data/nodes/0",
          "total_bytes" : 62671097856,
          "used_bytes" : 14324834304,
          "free_bytes" : 48346263552,
          "free_disk_percent" : 77.1,
          "used_disk_percent" : 22.9
        },
        "node_resource_usage_stats" : {
          "KfEEGG7_SsKZVFqI4ko2FA" : {
            "timestamp" : 1771438387501,
            "cpu_utilization_percent" : "0.5",
            "memory_utilization_percent" : "57.9",
            "io_usage_stats" : {
              "max_io_utilization_percent" : "0.0"
            }
          }
        }
      }
    },
    "shard_sizes" : {
      "[books][0][p]_bytes" : 5312,
      "[movies][0][p]_bytes" : 4862,
      "[research_papers][0][p]_bytes" : 7367
    },
    "shard_paths" : {
      "[books][0], node[KfEEGG7_SsKZVFqI4ko2FA], [P], s[STARTED], a[id=Vu7arTEfRrG9lnikaClzDg]" : "/usr/share/opensearch/data/nodes/0",
      "[movies][0], node[KfEEGG7_SsKZVFqI4ko2FA], [P], s[STARTED], a[id=f9QNud7NSACyM0YedYGfDg]" : "/usr/share/opensearch/data/nodes/0",
      "[research_papers][0], node[KfEEGG7_SsKZVFqI4ko2FA], [P], s[STARTED], a[id=SfxnuSLESQSI0Htcv0N3vA]" : "/usr/share/opensearch/data/nodes/0"
    },
    "reserved_sizes" : [ ]
  },
  "can_remain_on_current_node" : "yes",
  "can_rebalance_cluster" : "no",
  "can_rebalance_cluster_decisions" : [
    {
      "decider" : "rebalance_only_when_active",
      "decision" : "NO",
      "explanation" : "rebalancing is not allowed until all replicas in the cluster are active"
    },
    {
      "decider" : "cluster_rebalance",
      "decision" : "NO",
      "explanation" : "the cluster has unassigned shards and cluster setting [cluster.routing.allocation.allow_rebalance] is set to [indices_all_active]"
    }
  ],
  "can_rebalance_to_other_node" : "no",
  "rebalance_explanation" : "rebalancing is not allowed"
}
```

The `cluster_info` object provides:
- `nodes`: Disk usage statistics for each node, including free and used disk space percentages, and resource utilization metrics (CPU, memory, and I/O).
- `shard_sizes`: The size of each shard in the cluster in bytes (response shows a sample; actual responses include all shards).
- `shard_paths`: The file system path where each shard is stored on the node (response shows a sample; actual responses include all shards).
- `reserved_sizes`: Reserved disk space for ongoing shard operations.

This information is useful when diagnosing disk-related allocation issues or understanding how disk space affects allocation decisions.

## Example: Specifying a node with current_node

Use the `current_node` parameter to get an explanation only if the shard is located on a specific node:

<!-- spec_insert_start
component: example_code
rest: POST /_cluster/allocation/explain
body: |
{
  "index": "books",
  "shard": 0,
  "primary": false,
  "current_node": "opensearch-node1"
}
-->
{% capture step1_rest %}
POST /_cluster/allocation/explain
{
  "index": "books",
  "shard": 0,
  "primary": false,
  "current_node": "opensearch-node1"
}
{% endcapture %}

{% capture step1_python %}


response = client.cluster.allocation_explain(
  body =   {
    "index": "books",
    "shard": 0,
    "primary": false,
    "current_node": "opensearch-node1"
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

This query returns an explanation only if the replica shard 0 of the `books` index is currently on the `opensearch-node1` node. If the shard is on a different node or is unassigned, the API returns an error.

## Response fields

The API returns different fields depending on whether the shard is assigned or unassigned.

### Common response fields

The following table lists the common response fields.

Field | Description
:--- | :---
`index` | The name of the index containing the shard.
`shard` | The shard ID within the index.
`primary` | Whether this is a primary shard (`true`) or replica shard (`false`).
`current_state` | The current state of the shard: `started`, `unassigned`, `initializing`, or `relocating`.

### Fields for assigned shards

The following table lists the response fields for assigned shards.

Field | Description
:--- | :---
`current_node` | Information about the node where the shard is currently allocated, including node ID, name, transport address, and custom attributes.
`can_remain_on_current_node` | Whether the shard is allowed to remain on its current node: `yes`, `no`, or `decision_not_taken`.
`can_rebalance_cluster` | Whether rebalancing is allowed in the cluster: `yes`, `no`, or `decision_not_taken`.
`can_rebalance_to_other_node` | Whether the shard can be rebalanced to another node: `yes` or `no`.
`rebalance_explanation` | A human-readable explanation for the rebalancing decision.
`can_remain_decisions` | An array of deciders that determined whether the shard can remain on its current node. Included only when `can_remain_on_current_node` is `no`.
`can_rebalance_cluster_decisions` | An array of deciders that determined whether cluster rebalancing is allowed. Included only when `can_rebalance_cluster` is `no`.
`node_allocation_decisions` | An array of potential target nodes with allocation decisions for each node.

### Fields for unassigned shards

The following table lists the response fields for unassigned shards.

Field | Description
:--- | :---
`unassigned_info` | Information about why the shard is unassigned, including the reason, timestamp, and last allocation attempt.
`unassigned_info.reason` | The reason the shard became unassigned, such as `INDEX_CREATED`, `CLUSTER_RECOVERED`, `NODE_LEFT`, or `REPLICA_ADDED`.
`unassigned_info.at` | The timestamp (ISO 8601 format) when the shard became unassigned.
`unassigned_info.last_allocation_status` | The result of the last allocation attempt: `no_attempt`, `no`, `throttled`, or `no_valid_shard_copy`.
`unassigned_info.details` | Additional details about why the shard became unassigned. Included only when additional details are available.
`can_allocate` | Whether the shard can be allocated: `yes`, `no`, `throttled`, `no_valid_shard_copy`, or `allocation_delayed`.
`allocate_explanation` | A human-readable explanation for why the shard cannot be allocated.
`configured_delay` | The configured delay before allocating the shard. Included only when `can_allocate` is `allocation_delayed`.
`configured_delay_in_millis` | The configured delay in milliseconds. Included only when `can_allocate` is `allocation_delayed`.
`remaining_delay` | The remaining time before the shard can be allocated. Included only when `can_allocate` is `allocation_delayed`.
`remaining_delay_in_millis` | The remaining delay in milliseconds. Included only when `can_allocate` is `allocation_delayed`.
`node_allocation_decisions` | An array of nodes with allocation decisions for each node.

### Node allocation decision fields

The following table lists the fields in the node allocation decisions array.

Field | Description
:--- | :---
`node_id` | The unique identifier of the node.
`node_name` | The name of the node.
`transport_address` | The transport address of the node.
`node_attributes` | Custom attributes assigned to the node, such as Availability Zone or instance type.
`node_decision` | The allocation decision for this node: `yes`, `no`, `throttled`, `worse_balance`, or `awaiting_info`.
`weight_ranking` | The relative weight ranking for this node in allocation decisions. Lower values indicate higher preference. Included only when nodes are ranked for allocation decisions.
`deciders` | An array of allocators that made decisions about whether to allocate the shard to this node.
`store` | Information about shard data found on the node (for replica shards). Includes `matching_size` and `matching_size_in_bytes`. Included only when shard store information is available.

### Decider fields

Each decider in the `deciders` array contains the following fields.

Field | Description
:--- | :---
`decider` | The name of the allocator that made the decision.
`decision` | The decision made by the allocator: `YES`, `NO`, or `THROTTLE`.
`explanation` | A detailed explanation of why the allocator made this decision, including any relevant settings or constraints.

## Common allocators

The following table lists common allocators that affect shard allocation decisions.

Allocator | Description
:--- | :---
`same_shard` | Prevents a primary shard and its replica from being allocated to the same node.
`disk_threshold` | Checks whether the node has sufficient disk space for the shard based on low and high watermark thresholds.
`filter` | Applies allocation filters based on index settings like `index.routing.allocation.include`, `exclude`, or `require`.
`awareness` | Enforces shard allocation awareness based on node attributes, distributing shards across Availability Zones or racks.
`enable` | Checks whether shard allocation is enabled at the cluster, index, or shard level using the `cluster.routing.allocation.enable` setting.
`throttling` | Limits the number of concurrent shard recoveries based on `cluster.routing.allocation.node_concurrent_recoveries`.
`shards_limit` | Enforces the maximum number of shards per node (`cluster.routing.allocation.total_shards_per_node`) or per index.
`max_retry` | Prevents repeated allocation attempts for shards that have failed allocation multiple times.
`node_version` | Ensures that shards are allocated to nodes with compatible OpenSearch versions, preventing version downgrades.
`snapshot_in_progress` | Prevents shard allocation when a snapshot operation is in progress for that shard.
`restore_in_progress` | Controls allocation during shard restoration from a snapshot.
`rebalance_only_when_active` | Prevents rebalancing when not all shard copies (primaries and replicas) are active in the cluster.
`cluster_rebalance` | Controls when cluster rebalancing is allowed based on the `cluster.routing.allocation.allow_rebalance` setting: `always`, `indices_primaries_active`, or `indices_all_active`.
`replica_after_primary_active` | Ensures that replica shards are only allocated after their primary shard is active.
