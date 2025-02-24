---
layout: default
title: Cluster pending tasks
nav_order: 42
parent: Cluster APIs
---

# Cluster pending tasks

**Introduced 1.0**
{: .label .label-purple }

The Cluster Pending Tasks API returns a list of pending cluster-level tasks, such as index creation, mapping updates,
or new allocations.

<!-- spec_insert_start
api: cluster.pending_tasks
component: endpoints
-->
## Endpoints
```json
GET /_cluster/pending_tasks
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.pending_tasks
columns: Parameter, Data type, Description, Default
include_deprecated: false
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `cluster_manager_timeout` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts "0" without a unit and "-1" to indicate an unspecified value. | N/A |
| `local` | Boolean | When `true`, the request retrieves information from the local node only. When `false`, information is retrieved from the cluster manager node. | `false` |

<!-- spec_insert_end -->

## Example request

```json
GET /_cluster/pending_tasks
```

## Example response

```json
{
  "tasks": [
    {
      "insert_order": 101,
      "priority": "URGENT",
      "source": "create-index [new_index]",
      "time_in_queue_millis": 86,
      "time_in_queue": "86ms"
    },
    {
      "insert_order": 102,
      "priority": "HIGH",
      "source": "shard-started ([new_index][0], node[tMTocMvQQgGCkj7QDHl3OA], [P], s[INITIALIZING])",
      "time_in_queue_millis": 53,
      "time_in_queue": "53ms"
    },
    {
      "insert_order": 103,
      "priority": "HIGH",
      "source": "shard-started ([new_index][1], node[tMTocMvQQgGCkj7QDHl3OA], [P], s[INITIALIZING])",
      "time_in_queue_millis": 45,
      "time_in_queue": "45ms"
    },
    {
      "insert_order": 104,
      "priority": "NORMAL",
      "source": "refresh-mapping [new_index]",
      "time_in_queue_millis": 22,
      "time_in_queue": "22ms"
    }
  ]
}
```