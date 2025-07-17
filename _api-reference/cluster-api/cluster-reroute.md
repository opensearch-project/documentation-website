---
layout: default
title: Cluster reroute
nav_order: 46
parent: Cluster APIs
has_children: false
---

# Cluster reroute API

The `/_cluster/reroute` API allows you to manually control the allocation of individual shards within the cluster. This includes moving, allocating, or canceling shard allocations. It's typically used for advanced scenarios, such as manual recovery or custom load balancing.

Shard movement is subject to cluster allocation deciders. Always test reroute commands using `dry_run=true` before applying them in production environments. Use the `explain=true` parameter to obtain detailed insight into allocation decisions, which can assist in understanding why a particular reroute request may or may not be allowed. If shard allocation fails because of prior issues or cluster instability, you can reattempt allocation using the `retry_failed=true` parameter.

For more information regarding shard distribution and cluster health, see [Cluster health API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-health/) and [Allocation explain API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-allocation/).

## Endpoints

```json
POST /_cluster/reroute
```

## Query parameters

| Parameter        | Data type | Description                                                                                        |
| ---------------- | --------- | -------------------------------------------------------------------------------------------------- |
| `dry_run`        | Boolean   | If `true`, validates and simulates the reroute request without applying it. Default is `false`.    |
| `explain`        | Boolean   | If `true`, returns an explanation of why the command was accepted or rejected. Default is `false`. |
| `retry_failed`   | Boolean   | If `true`, retries allocation of shards that previously failed. Default is `false`.                |
| `metric`         | String    | Limits the returned metadata. See [metric options](#metric-options) for list of available options. Default is `_all` |
| `master_timeout` | Time      | The timeout for connection to the cluster manager node. Default is `30s`.                              |
| `timeout`        | Time      | The overall request timeout. Default is `30s`.                                                         |

### Metric options

The `metric` parameter narrows the parts of the cluster state returned by the reroute API. This is useful for reducing response size or inspecting specific parts of the cluster state. The possible options are the following:

- `_all`: Returns all available cluster state sections. _(Default)_
- `blocks`: Includes information about read/write level blocks in the cluster.
- `master_node`: Shows which node is currently acting as cluster manager.
- `metadata`: Returns index settings, mappings, and aliases. If specific indexes are targeted, only their metadata is returned.
- `nodes`: Includes all nodes in the cluster and their metadata.
- `routing_table`: Returns the routing information for all shards and replicas.
- `version`: Displays the cluster state version number.

You can combine values in a comma-separated list, such as `metric=metadata,nodes,routing_table`.

## Request body fields

The `commands` array in the request body defines actions to apply to shard allocation. Supported actions include:

### Move

Moves a started shard (primary or replica) from one node to another. This can be used to balance load or drain a node before maintenance. The shard must be in the `STARTED` state. Both primary and replica shards can be moved using this command. 

`move` command requires the following parameters:

* `index`: The name of the index.
* `shard`: Shard number.
* `from_node`: Name of the node to move the shard from.
* `to_node`: Name of the node to move the shard to.

### Cancel

Cancels allocation of a shard (including recovery). This command forces resynchronization by canceling existing allocations and letting the system reinitialize them. Replica shard allocations can be canceled by default, but canceling a primary shard requires `allow_primary=true` to prevent accidental data disruption

`cancel` command requires the following parameters:

* `index`: The name of the index.
* `shard`: The shard number.
* `node`: The name or node ID of the node to perform action on.
* `allow_primary` (optional: If `true`, allows cancelling primary shard allocations. Default is `false`).

### Allocate_replica

Assigns an unassigned replica to a specified node. This operation respects allocation deciders. Use this command to manually trigger allocation of replicas when automatic allocation fails.

`allocate_replica` command requires the following parameters:

* `index`: The name of the index.
* `shard`: The shard number.
* `node`: The name or node ID of the node to perform action on.

### Allocate_stale_primary

Force-allocates a primary shard to a node that holds a stale copy. This command should be used with extreme caution. It bypasses safety checks and may lead to **data loss**, especially if a more recent shard copy exists on another node that is temporarily offline. If that node rejoins the cluster later, its data will be deleted or replaced by the stale copy that was forcefully promoted.

Use this only when no up-to-date copies are available and you have no way to restore the original data.

`allocate_stale_primary` command requires the following parameters:

* `index`: The name of the index.
* `shard`: The shard number.
* `node`: The name or node ID of the node to perform action on.
* `accept_data_loss`: Must be `true`

### Allocate_empty_primary

Force-allocates a new empty primary shard to a node. This operation initializes a new primary shard without any existing data. Any previous data for the shard will be **permanently lost**. If a node with valid data for that shard later rejoins the cluster, its copy will be erased. This command is intended for disaster recovery when **no valid shard copies exist** and recovery from snapshot or backup is not an option.

`allocate_empty_primary` command required the following parameters:

* `index`: The name of the index.
* `shard`: The shard number.
* `node` : The name or node ID of the node to perform action on.
* `accept_data_loss`: Must be `true`

## Example

See following examples using `reroute` API.

### Moving a shard

Create a sample index:

```json
PUT /test-cluster-index
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1
  }
}
```
{% include copy-curl.html %}

Run the following reroute command to move shard `0` of the index `test-cluster-index` from node `node1` to node `node2`:

```json
POST /_cluster/reroute
{
  "commands": [
    {
      "move": {
        "index": "test-cluster-index",
        "shard": 0,
        "from_node": "node1",
        "to_node": "node2"
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Simulating a reroute

To simulate a reroute without executing it, set `dry_run=true`:

```json
POST /_cluster/reroute?dry_run=true
{
  "commands": [
    {
      "move": {
        "index": "test-cluster-index",
        "shard": 0,
        "from_node": "node1",
        "to_node": "node2"
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Retrying failed allocations

If some shards failed to allocate due to previous issues, you can reattempt allocation:

```json
POST /_cluster/reroute?retry_failed=true
```

{% include copy-curl.html %}

### Explaining reroute decisions

To understand why a reroute command is accepted or rejected, add `explain=true`:

```json
POST /_cluster/reroute?explain=true
{
  "commands": [
    {
      "move": {
        "index": "test-cluster-index",
        "shard": 0,
        "from_node": "node1",
        "to_node": "node3"
      }
    }
  ]
}
```
{% include copy-curl.html %}

This returns a `decisions` array explaining the outcome:

```json
"decisions": [
        {
          "decider": "max_retry",
          "decision": "YES",
          "explanation": "shard has no previous failures"
        },
        {
          "decider": "replica_after_primary_active",
          "decision": "YES",
          "explanation": "shard is primary and can be allocated"
        },
        ...
        {
          "decider": "remote_store_migration",
          "decision": "YES",
          "explanation": "[none migration_direction]: primary shard copy can be relocated to a non-remote node for strict compatibility mode"
        }
      ]
```

## Response body fields

The response includes cluster state metadata and optionally a `decisions` array if `explain=true` was used.

| Field                        | Data type | Description                                                             |
| ---------------------------- | --------- | ----------------------------------------------------------------------- |
| `acknowledged`               | Boolean   | States whether the reroute request was acknowledged.                           |
| `state.cluster_uuid`         | String    | The unique identifier of the cluster.                                       |
| `state.version`              | Integer   | The version of the cluster state.                                           |
| `state.state_uuid`           | String    | The UUID for this specific state version.                                   |
| `state.master_node`          | String    | The ID of the elected cluster manager node.                                 |
| `state.cluster_manager_node` | String    | Same as `master_node`; OpenSearch includes both for legacy and clarity. |
| `state.blocks`               | Object    | Any global or index-level cluster blocks.                               |
| `state.nodes`                | Object    | The cluster nodes metadata including name and address.                      |
| `state.routing_table`        | Object    | The shard routing information for each index.                               |
| `state.routing_nodes`        | Object    | The shard allocation organized by node.                                     |
| `commands`                   | List      | A list of processed reroute commands.                                   |
| `explanations`               | List      | If `explain=true`, includes detailed explanations of the outcomes.          |

