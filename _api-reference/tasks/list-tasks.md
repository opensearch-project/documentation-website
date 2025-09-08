---
layout: default
title: List tasks
parent: Tasks APIs
nav_order: 10
---

# List Tasks API
**Introduced 1.0**
{: .label .label-purple }

The List Tasks API returns a list of tasks running in the cluster. 

<!-- spec_insert_start
api: tasks.list
component: endpoints
-->
## Endpoints
```json
GET /_tasks
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: tasks.list
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `actions` | List or String | A comma-separated list of actions that should be returned. Keep empty to return all. | N/A |
| `detailed` | Boolean | When `true`, the response includes detailed information about shard recoveries. | `false` |
| `group_by` | String | Groups tasks by parent/child relationships or nodes. <br> Valid values are: `nodes`, `none`, and `parents`. | `nodes` |
| `nodes` | List | A comma-separated list of node IDs or names used to limit the returned information. Use `_local` to return information from the node you're connecting to, specify the node name to get information from a specific node, or keep the parameter empty to get information from all nodes. | N/A |
| `parent_task_id` | String | Returns tasks with a specified parent task ID (`node_id:task_number`). Keep empty or set to -1 to return all. | N/A |
| `timeout` | String | The amount of time to wait for a response. | N/A |
| `wait_for_completion` | Boolean | Waits for the matching task to complete. When `true`, the request is blocked until the task has completed. | `false` |

<!-- spec_insert_end -->

## Example request

The following request returns tasks currently running on a node named `opensearch-node1`:

<!-- spec_insert_start
component: example_code
rest: GET /_tasks?nodes=opensearch-node1
-->
{% capture step1_rest %}
GET /_tasks?nodes=opensearch-node1
{% endcapture %}

{% capture step1_python %}


response = client.tasks.list(
  params = { "nodes": "opensearch-node1" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

The following response provides information about running tasks:

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

The `resource_stats` object is only updated for tasks that support resource tracking. These statistics are computed based on scheduled thread executions, including both threads that have finished working on the task and threads currently working on the task. Because the same thread may be scheduled to work on the same task multiple times, each instance of a given thread being scheduled to work on a given task is considered to be a single thread execution.

The following table lists all response fields in the `resource_stats` object. 

Response field | Description |
:--- | :--- |
`average` | The average resource usage across all scheduled thread executions. |
`total` | The total resource usage across all scheduled thread executions. |
`min` | The minimum resource usage across all scheduled thread executions. |
`max` | The maximum resource usage across all scheduled thread executions. |
`thread_info` | Thread-count-related statistics.|
`thread_info.active_threads` | The number of threads currently working on the task. |
`thread_info.thread_executions` | The number of threads that have been scheduled to work on the task. |