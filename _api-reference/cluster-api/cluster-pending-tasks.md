---
layout: default
title: Cluster pending tasks
nav_order: 45
parent: Cluster APIs
has_children: false
---

# Cluster Pending Tasks API

The `/_cluster/pending_tasks` API returns a list of cluster-level changes that have not yet been executed. These pending tasks are typically queued operations such as index creation, template updates, shard allocation changes, and other cluster state updates.

This API is useful for monitoring the state of the cluster and diagnosing delays in cluster state updates, especially when tasks are backed up or stuck.

## Endpoint

```json
GET /_cluster/pending_tasks
```

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter        | Data type | Description                                                                                                             |
| ---------------- | --------- | ----------------------------------------------------------------------------------------------------------------------- |
| `local`          | Boolean   | Whether to return information from the local node only instead of the elected cluster manager node. Default is `false`. |
| `cluster_manager_timeout` | Time      | Specifies the timeout for connecting to the cluster manager node. Default is `30s`.                                     |

## Example request

The following request returns the list of currently pending cluster state update tasks:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/pending_tasks
-->
{% capture step1_rest %}
GET /_cluster/pending_tasks
{% endcapture %}

{% capture step1_python %}

response = client.cluster.pending_tasks()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

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

The `_cluster/pending_tasks` API typically returns an empty array because the tasks are normally processed too quickly to be included in the response.
{: .note}  

## Response fields

The following table lists all response fields.

| Field                           | Data type | Description                                                        |
| ------------------------------- | --------- | ------------------------------------------------------------------ |
| `tasks`                         | Array     | The list of pending cluster state update tasks.                        |
| `tasks[n].insert_order`         | Integer   | The order in which the task was added to the queue.                    |
| `tasks[n].priority`             | String    | The priority level of the task (for example, `HIGH`, `URGENT`).               |
| `tasks[n].source`               | String    | The description of the operation that submitted the task.              |
| `tasks[n].executing`            | Boolean   | Confirmation of whether the task is currently being executed.                      |
| `tasks[n].time_in_queue_millis` | Integer   | The amount of time the task has been waiting in the queue (in milliseconds). |
| `tasks[n].time_in_queue`        | String    | A human-readable version of `time_in_queue_millis`.                  |
