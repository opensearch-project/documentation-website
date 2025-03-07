---
layout: default
title: List tasks
parent: Tasks API
nav_order: 10
---

# List tasks

The List Tasks API returns a list of tasks running inside the cluster. 

<!-- spec_insert_start 
api: tasks.list
component: endpoints
-->

<!-- spec_insert_end -->

<!-- spec_insert_start 
api: tasks.list
component: path_parameters
-->

<!-- spec_insert_end -->

<!-- spec_insert_start 
api: tasks.list
component: query_parameters
-->

<!-- spec_insert_end -->

## Example request

The following request returns tasks currently running on a node named `opensearch-node1`:

```json
GET /_tasks?nodes=opensearch-node1
```
{% include copy-curl.html %}

## Example response

The following example response shows information about running tasks:

```json
{
  "nodes": {
    "Mgqdm0r9SEGClWxp_RbnaQ": {
      "name": "opensearch-node1",
      "transport_address": "sample_address",
      "host": "sample_host",
      "ip": "sample_ip",
      "roles": [
        "data",
        "ingest",
        "master",
        "remote_cluster_client"
      ],
      "tasks": {
        "Mgqdm0r9SEGClWxp_RbnaQ:24578": {
          "node": "Mgqdm0r9SEGClWxp_RbnaQ",
          "id": 24578,
          "type": "transport",
          "action": "cluster:monitor/tasks/lists",
          "start_time_in_millis": 1611612517044,
          "running_time_in_nanos": 638700,
          "cancellable": false,
          "headers": {}
        },
        "Mgqdm0r9SEGClWxp_RbnaQ:24579": {
          "node": "Mgqdm0r9SEGClWxp_RbnaQ",
          "id": 24579,
          "type": "direct",
          "action": "cluster:monitor/tasks/lists[n]",
          "start_time_in_millis": 1611612517044,
          "running_time_in_nanos": 222200,
          "cancellable": false,
          "parent_task_id": "Mgqdm0r9SEGClWxp_RbnaQ:24578",
          "headers": {}
        }
      }
    }
  }
}
```

### The `resource_stats` object

The `resource_stats` object is only updated for tasks that support resource tracking. These stats are computed based on scheduled thread executions, including both threads that have finished working on the task and threads currently working on the task. Because the same thread may be scheduled to work on the same task multiple times, each instance of a given thread being scheduled to work on a given task is considered to be a single thread execution.

The following table lists all response fields in the `resource_stats` object. 

Response field | Description |
:--- | :--- |
`average` | The average resource usage across all scheduled thread executions. |
`total` | The sum of resource usages across all scheduled thread executions. |
`min` | The minimum resource usage across all scheduled thread executions. |
`max` | The maximum resource usage across all scheduled thread executions. |
`thread_info` | Thread-count-related stats.|
`thread_info.active_threads` | The number of threads currently working on the task. |
`thread_info.thread_executions` | The number of threads that have been scheduled to work on the task. |