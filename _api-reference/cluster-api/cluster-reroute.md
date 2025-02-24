---
layout: default
title: Cluster reroute
nav_order: 45
parent: Cluster APIs
---

# Cluster reroute 
**Introduced 1.0**
{: .label .label-purple }

The Cluster Reroute API changes the allocation of individual shards in the cluster.

<!-- spec_insert_start
api: cluster.reroute
component: endpoints
-->
## Endpoints
```json
POST /_cluster/reroute
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.reroute
component: query_parameters
include_deprecated: false
columns: Parameter, Data type, Description, Default
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `cluster_manager_timeout` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts "0" without a unit and "-1" to indicate an unspecified value. | N/A |
| `dry_run` | Boolean | When `true`, the request simulates the operation and returns the resulting state. | N/A |
| `explain` | Boolean | When `true`, the response contains an explanation of why certain commands can or cannot be executed. | N/A |
| `metric` | List or String | Limits the information returned to the specified metrics. <br> Valid values are: `_all`, `blocks`, `cluster_manager_node`, `master_node`, `metadata`, `nodes`, `routing_nodes`, `routing_table`, `version` | N/A |
| `retry_failed` | Boolean | When `true`, retries shard allocation if it was blocked because of too many subsequent failures. | N/A |
| `timeout` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts "0" without a unit and "-1" to indicate an unspecified value. | N/A |

<!-- spec_insert_end -->

## Request body fields

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `commands` | Array | A list of reroute commands to run. |
| `dry_run` | Boolean | When true, simulates the reroute without actually performing it. |
| `explain` | Boolean | When true, returns detailed explanations of command decisions. |
| `retry_failed` | Boolean | When true, retries allocation of shards that failed in previous reroute attempts. |
| `metric` | String/Array | Limits the information returned to specific metrics. |
| `timeout` | Time | The period of time to wait for a response. |

## Example request

```json
POST /_cluster/reroute
{
  "commands": [
    {
      "move": {
        "index": "my_index",
        "shard": 0,
        "from_node": "node1",
        "to_node": "node2"
      }
    },
    {
      "allocate_replica": {
        "index": "my_index",
        "shard": 1,
        "node": "node3"
      }
    },
    {
      "cancel": {
        "index": "my_index",
        "shard": 2,
        "node": "node4"
      }
    }
  ],
  "dry_run": false
}
```

## Example response

```json
{
  "acknowledged": true,
  "state": {
    "version": 101,
    "state_uuid": "8sj3yzsTSxKMrIhOzBoKRA",
    "cluster_manager_node": "node1",
    "blocks": {},
    "nodes": {
      "node1": {
        "name": "node1",
        "transport_address": "127.0.0.1:9300"
      },
      "node2": {
        "name": "node2",
        "transport_address": "127.0.0.2:9300"
      },
      "node3": {
        "name": "node3",
        "transport_address": "127.0.0.3:9300"
      },
      "node4": {
        "name": "node4",
        "transport_address": "127.0.0.4:9300"
      }
    },
    "routing_table": {
      "indices": {
        "my_index": {
          "shards": {
            "0": [
              {
                "state": "STARTED",
                "primary": true,
                "node": "node2",
                "relocating_node": null,
                "shard": 0,
                "index": "my_index"
              }
            ],
            "1": [
              {
                "state": "STARTED",
                "primary": true,
                "node": "node1",
                "relocating_node": null,
                "shard": 1,
                "index": "my_index"
              },
              {
                "state": "INITIALIZING",
                "primary": false,
                "node": "node3",
                "relocating_node": null,
                "shard": 1,
                "index": "my_index"
              }
            ],
            "2": [
              {
                "state": "STARTED",
                "primary": true,
                "node": "node1",
                "relocating_node": null,
                "shard": 2,
                "index": "my_index"
              }
            ]
          }
        }
      }
    }
  },
  "explanations": [
    {
      "command": "move",
      "parameters": {
        "index": "my_index",
        "shard": 0,
        "from_node": "node1",
        "to_node": "node2"
      },
      "accepted": true
    },
    {
      "command": "allocate_replica",
      "parameters": {
        "index": "my_index",
        "shard": 1,
        "node": "node3"
      },
      "accepted": true
    },
    {
      "command": "cancel",
      "parameters": {
        "index": "my_index",
        "shard": 2,
        "node": "node4"
      },
      "accepted": true
    }
  ]
}
```

## Response body fields

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `acknowledged` | Boolean | Indicates whether the request was acknowledged. |
| `state` | Object | The state of the current cluster after a reroute. |
| `explanations` | Array | The detailed explanations of command decisions when the `if explain` setting is `true`. |
| `state_uuid` | String | The UUID of the cluster state. |
| `cluster_manager_node` | String | The ID of the elected cluster manager node. |
| `version` | Integer | The version of the cluster state. |
| `blocks` | Object | The description of any cluster-level blocks. |
| `nodes` | Object | Any information about nodes in the cluster. |
| `routing_table` | Object | The current routing state of the cluster. |
| `routing_nodes` | Object | The node-level view of the routing table. |