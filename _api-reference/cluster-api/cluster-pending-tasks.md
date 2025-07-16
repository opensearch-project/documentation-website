---
layout: default
title: Cluster pending tasks
nav_order: 45
parent: Cluster APIs
has_children: false
---

# Pending cluster tasks API

The `/_cluster/pending_tasks` API returns a list of cluster-level changes that have not yet been executed. These pending tasks are typically queued operations such as index creation, template updates, shard allocation changes, and other cluster state updates.

This API is useful for monitoring the state of the cluster and diagnosing delays in cluster state updates, especially in cases where tasks are backed up or stuck.

## Endpoint

```json
GET /_cluster/pending_tasks
```

## Query parameters

All query parameters are optional.

| Parameter        | Data type | Description                                                                                                             |
| ---------------- | --------- | ----------------------------------------------------------------------------------------------------------------------- |
| `local`          | Boolean   | Whether to return information from the local node only instead of the elected cluster manager node. Default is `false`. |
| `master_timeout` | Time      | Specifies the timeout for connecting to the cluster manager node. Default is `30s`.                                     |

## Example

The following request returns the list of currently pending cluster state update tasks:

```json
GET /_cluster/pending_tasks
```

{% include copy-curl.html %}

### Example response

```json
{
  "tasks": [
    {
      "insert_order": 1234,
      "priority": "HIGH",
      "source": "create-index [logs-2025.07.15]",
      "executing": false,
      "time_in_queue_millis": 28,
      "time_in_queue": "28ms"
    },
    {
      "insert_order": 1235,
      "priority": "URGENT",
      "source": "shard-started shard id [logs-2025.07.15][0]",
      "executing": true,
      "time_in_queue_millis": 3,
      "time_in_queue": "3ms"
    }
  ]
}
```

Typically `_cluster/pending_tasks` API returns an empty array as the tasks are normally processed to quickly to catch this response.
{: .note}  

## Response fields

The following table lists all response fields.

| Field                           | Data type | Description                                                        |
| ------------------------------- | --------- | ------------------------------------------------------------------ |
| `tasks`                         | Array     | The list of pending cluster state update tasks.                        |
| `tasks[n].insert_order`         | Integer   | The order in which the task was added to the queue.                    |
| `tasks[n].priority`             | String    | The priority level of the task (e.g., `HIGH`, `URGENT`).               |
| `tasks[n].source`               | String    | The description of the operation that submitted the task.              |
| `tasks[n].executing`            | Boolean   | The confirmation whether the task is currently being executed.                      |
| `tasks[n].time_in_queue_millis` | Integer   | The time the task has been waiting in the queue (in milliseconds). |
| `tasks[n].time_in_queue`        | String    | Human-readable version of `time_in_queue_millis`.                  |
