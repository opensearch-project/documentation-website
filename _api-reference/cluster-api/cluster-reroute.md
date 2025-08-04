---
layout: default
title: Cluster reroute
nav_order: 46
parent: Cluster APIs
has_children: false
---

# Cluster Reroute API

The `/_cluster/reroute` API allows you to manually control the allocation of individual shards within the cluster. This includes moving, allocating, or canceling shard allocations. It's typically used for advanced scenarios, such as manual recovery or custom load balancing.

Shard movement is subject to cluster allocation deciders. Always test reroute commands using `dry_run=true` before applying them in production environments. Use the `explain=true` parameter to obtain detailed insight into allocation decisions, which can assist in understanding why a particular reroute request may or may not be allowed. If shard allocation fails because of prior issues or cluster instability, you can reattempt allocation using the `retry_failed=true` parameter.

For more information regarding shard distribution and cluster health, see [Cluster health]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-health/) and [Cluster allocation explain]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-allocation/).

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
| `metric`         | String    | Limits the returned metadata. See [Metric options](#metric-options) for a list of available options. Default is `_all`. |
| `cluster_manager_timeout` | Time      | The timeout for connection to the cluster manager node. Default is `30s`.                              |
| `timeout`        | Time      | The overall request timeout. Default is `30s`.                                                         |

### Metric options

The `metric` parameter filters the cluster state values returned by the Reroute API. This is useful for reducing response size or inspecting specific parts of the cluster state. This parameter supports the following values:

- `_all` _(Default)_: Returns all available cluster state sections. 
- `blocks`: Includes information about read- and write-level blocks in the cluster.
- `cluster_manager_node`: Shows which node is currently acting as the cluster manager.
- `metadata`: Returns index settings, mappings, and aliases. If specific indexes are targeted, only their metadata is returned.
- `nodes`: Includes all nodes in the cluster and their metadata.
- `routing_table`: Returns the routing information for all shards and replicas.
- `version`: Displays the cluster state version number.

You can combine values in a comma-separated list, such as `metric=metadata,nodes,routing_table`.

## Request body fields

The `commands` array in the request body defines actions to apply to shard allocation. It supports the following actions.

### Move

The `move` command moves a started shard (primary or replica) from one node to another. This can be used to balance load or drain a node before maintenance. The shard must be in the `STARTED` state. Both primary and replica shards can be moved using this command. 

The `move` command requires the following parameters:

* `index`: The name of the index.
* `shard`: The shard number.
* `from_node`: The name of the node to move the shard from.
* `to_node`: The name of the node to move the shard to.

### Cancel

The `cancel` command cancels allocation of a shard (including recovery). This command forces resynchronization by canceling existing allocations and letting the system reinitialize them. Replica shard allocations can be canceled by default, but canceling a primary shard requires `allow_primary=true` in order to prevent accidental data disruption.

The `cancel` command requires the following parameters:

* `index`: The name of the index.
* `shard`: The shard number.
* `node`: The name or node ID of the node to perform the action on.
* `allow_primary` _(Optional)_: If `true`, allows cancellation of primary shard allocations. Default is `false`.

### Allocate replica

The `allocate_replica` command assigns an unassigned replica to a specified node. This operation respects allocation deciders. Use this command to manually trigger allocation of replicas when automatic allocation fails.

The `allocate_replica` command requires the following parameters:

* `index`: The name of the index.
* `shard`: The shard number.
* `node`: The name or node ID of the node to perform the action on.

### Allocate stale primary

The `allocate_stale_primary` command force-allocates a primary shard to a node that holds a stale copy. 

This command should be used with extreme caution. It bypasses safety checks and may lead to **data loss**, especially if a more recent shard copy exists on another node that is temporarily offline. If that node rejoins the cluster later, its data will be deleted or replaced by the stale copy that was forcefully promoted.
{: .warning}

Use this command only when no up-to-date copies are available and you have no way to restore the original data.
{: .tip}

The `allocate_stale_primary` command requires the following parameters:

* `index`: The name of the index.
* `shard`: The shard number.
* `node`: The name or node ID of the node to perform the action on.
* `accept_data_loss`: Must be set to `true`.

### Allocate empty primary

The `allocate_empty_primary` command force-allocates a new empty primary shard to a node. This operation initializes a new primary shard without any existing data. 

Any previous data for the shard will be **permanently lost**. If a node with valid data for that shard later rejoins the cluster, its copy will be erased. This command is intended for disaster recovery when **no valid shard copies exist** and recovery from backup or a snapshot is not possible.
{: .warning}

The `allocate_empty_primary` command requires the following parameters:

* `index`: The name of the index.
* `shard`: The shard number.
* `node` : The name or node ID of the node to perform the action on.
* `accept_data_loss`: Must be set to `true`.

## Example

The following are examples of using the Cluster Reroute API.

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

If some shards failed to allocate because of previous issues, you can reattempt allocation:

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

The response includes cluster state metadata and, optionally, a `decisions` array if `explain=true` was used.

| Field                        | Data type | Description                                                             |
| ---------------------------- | --------- | ----------------------------------------------------------------------- |
| `acknowledged`               | Boolean   | States whether the reroute request was acknowledged.                           |
| `state.cluster_uuid`         | String    | The unique identifier of the cluster.                                       |
| `state.version`              | Integer   | The version of the cluster state.                                           |
| `state.state_uuid`           | String    | The UUID for this specific state version.                                   |
| `state.master_node`          | String    | As with `cluster_manager_node`, this is maintained for backward compatibility.                                 |
| `state.cluster_manager_node` | String    | The ID of the elected cluster manager node.  |
| `state.blocks`               | Object    | Any global or index-level cluster blocks.                               |
| `state.nodes`                | Object    | The cluster node's metadata, including its name and address.                      |
| `state.routing_table`        | Object    | The shard routing information for each index.                               |
| `state.routing_nodes`        | Object    | The shard allocation organized by node.                                     |
| `commands`                   | List      | A list of processed reroute commands.                                   |
| `explanations`               | List      | If `explain=true`, includes detailed explanations of the outcomes.          |

