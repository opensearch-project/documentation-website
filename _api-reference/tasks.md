---
layout: default
title: Tasks
nav_order: 85
redirect_from:
 - /opensearch/rest-api/tasks/
---

# Tasks
**Introduced 1.0**
{: .label .label-purple }

A task is any operation you run in a cluster. For example, searching your data collection of books for a title or author name is a task. When you run OpenSearch, a task is automatically created to monitor your cluster's health and performance. For more information about all of the tasks currently executing in your cluster, you can use the `tasks` API operation.

The following request returns information about all of your tasks:

```
GET _tasks
```
{% include copy-curl.html %}

By including a task ID, you can get information specific to a particular task. Note that a task ID consists of a node's identifying string and the task's numerical ID. For example, if your node's identifying string is `nodestring` and the task's numerical ID is `1234`, then your task ID is `nodestring:1234`. You can find this information by running the `tasks` operation:

```
GET _tasks/<task_id>
```
{% include copy-curl.html %}

Note that if a task finishes running, it won't be returned as part of your request. For an example of a task that takes a little longer to finish, you can run the [`_reindex`]({{site.url}}{{site.baseurl}}/opensearch/reindex-data) API operation on a larger document, and then run `tasks`.

#### Example response
```json
{
  "nodes": {
    "Mgqdm0r9SEGClWxp_RbnaQ": {
      "name": "opensearch-node1",
      "transport_address": "172.18.0.3:9300",
      "host": "172.18.0.3",
      "ip": "172.18.0.3:9300",
      "roles": [
        "data",
        "ingest",
        "master",
        "remote_cluster_client"
      ],
      "tasks": {
        "Mgqdm0r9SEGClWxp_RbnaQ:17416": {
          "node": "Mgqdm0r9SEGClWxp_RbnaQ",
          "id": 17416,
          "type": "transport",
          "action": "cluster:monitor/tasks/lists",
          "start_time_in_millis": 1613599752458,
          "running_time_in_nanos": 994000,
          "cancellable": false,
          "headers": {}
          }
        },
        "Mgqdm0r9SEGClWxp_RbnaQ:17413": {
          "node": "Mgqdm0r9SEGClWxp_RbnaQ",
          "id": 17413,
          "type": "transport",
          "action": "indices:data/write/bulk",
          "start_time_in_millis": 1613599752286,
          "running_time_in_nanos": 172846500,
          "cancellable": false,
          "parent_task_id": "Mgqdm0r9SEGClWxp_RbnaQ:17366",
          "headers": {}
        },
        "Mgqdm0r9SEGClWxp_RbnaQ:17366": {
          "node": "Mgqdm0r9SEGClWxp_RbnaQ",
          "id": 17366,
          "type": "transport",
          "action": "indices:data/write/reindex",
          "start_time_in_millis": 1613599750929,
          "running_time_in_nanos": 1529733100,
          "cancellable": true,
          "headers": {}
        }
      }
    }
  }
}
```

You can also use the following parameters with your query.

Parameter | Data type | Description |
:--- | :--- | :---
`nodes` | List | A comma-separated list of node IDs or names to limit the returned information. Use `_local` to return information from the node you're connecting to, specify the node name to get information from specific nodes, or keep the parameter empty to get information from all nodes.
`actions` | List | A comma-separated list of actions that should be returned. Keep empty to return all.
`detailed` | Boolean | Returns detailed task information. (Default: false)
`parent_task_id` | String | Returns tasks with a specified parent task ID (node_id:task_number). Keep empty or set to -1 to return all.
`wait_for_completion` | Boolean | Waits for the matching tasks to complete. (Default: false)
`group_by` | Enum | Groups tasks by parent/child relationships or nodes. (Default: nodes)
`timeout` | Time | An explicit operation timeout. (Default: 30 seconds)
`cluster_manager_timeout` | Time | The time to wait for a connection to the primary node. (Default: 30 seconds)

For example, this request returns tasks currently running on a node named `opensearch-node1`:

#### Example request

```json
GET /_tasks?nodes=opensearch-node1
```
{% include copy-curl.html %}

#### Example response

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

The following request returns detailed information about active search tasks:

#### Example request

```bash
curl -XGET "localhost:9200/_tasks?actions=*search&detailed
```
{% include copy.html %}

#### Example response

```json
{
  "nodes" : {
    "CRqNwnEeRXOjeTSYYktw-A" : {
      "name" : "runTask-0",
      "transport_address" : "127.0.0.1:9300",
      "host" : "127.0.0.1",
      "ip" : "127.0.0.1:9300",
      "roles" : [
        "cluster_manager",
        "data",
        "ingest",
        "remote_cluster_client"
      ],
      "attributes" : {
        "testattr" : "test",
        "shard_indexing_pressure_enabled" : "true"
      },
      "tasks" : {
        "CRqNwnEeRXOjeTSYYktw-A:677" : {
          "node" : "CRqNwnEeRXOjeTSYYktw-A",
          "id" : 677,
          "type" : "transport",
          "action" : "indices:data/read/search",
          "description" : "indices[], search_type[QUERY_THEN_FETCH], source[{\"query\":{\"query_string\":<QUERY_STRING>}}]",
          "start_time_in_millis" : 1660106254525,
          "running_time_in_nanos" : 1354236,
          "cancellable" : true,
          "cancelled" : false,
          "headers" : { },
          "resource_stats" : {
            "average" : {
              "cpu_time_in_nanos" : 0,
              "memory_in_bytes" : 0
            },
            "total" : {
              "cpu_time_in_nanos" : 0,
              "memory_in_bytes" : 0
            },
            "min" : {
              "cpu_time_in_nanos" : 0,
              "memory_in_bytes" : 0
            },
            "max" : {
              "cpu_time_in_nanos" : 0,
              "memory_in_bytes" : 0
            },
            "thread_info" : {
              "thread_executions" : 0,
              "active_threads" : 0
            }
          }
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

## Task canceling

After getting a list of tasks, you can cancel all cancelable tasks with the following request:

```
POST _tasks/_cancel
```
{% include copy-curl.html %}

Note that not all tasks are cancelable. To see if a task is cancelable, refer to the `cancellable` field in the response to your `tasks` API request.

You can also cancel a task by including a specific task ID.

```
POST _tasks/<task_id>/_cancel
```
{% include copy-curl.html %}

The `cancel` operation supports the same parameters as the `tasks` operation. The following example shows how to cancel all cancelable tasks on multiple nodes.

```
POST _tasks/_cancel?nodes=opensearch-node1,opensearch-node2
```
{% include copy-curl.html %}

## Attaching headers to tasks

To associate requests with tasks for better tracking, you can provide a `X-Opaque-Id:<ID_number>` header as part of the HTTPS request reader of your `curl` command. The API will attach the specified header in the returned result.

Usage:

```bash
curl -i -H "X-Opaque-Id: 111111" "https://localhost:9200/_tasks" -u 'admin:admin' --insecure
```
{% include copy.html %}

The `_tasks` operation returns the following result.

```json
HTTP/1.1 200 OK
X-Opaque-Id: 111111
content-type: application/json; charset=UTF-8
content-length: 768

{
  "nodes": {
    "Mgqdm0r9SEGClWxp_RbnaQ": {
      "name": "opensearch-node1",
      "transport_address": "172.18.0.4:9300",
      "host": "172.18.0.4",
      "ip": "172.18.0.4:9300",
      "roles": [
        "data",
        "ingest",
        "master",
        "remote_cluster_client"
      ],
      "tasks": {
        "Mgqdm0r9SEGClWxp_RbnaQ:30072": {
          "node": "Mgqdm0r9SEGClWxp_RbnaQ",
          "id": 30072,
          "type": "direct",
          "action": "cluster:monitor/tasks/lists[n]",
          "start_time_in_millis": 1613166701725,
          "running_time_in_nanos": 245400,
          "cancellable": false,
          "parent_task_id": "Mgqdm0r9SEGClWxp_RbnaQ:30071",
          "headers": {
            "X-Opaque-Id": "111111"
          }
        },
        "Mgqdm0r9SEGClWxp_RbnaQ:30071": {
          "node": "Mgqdm0r9SEGClWxp_RbnaQ",
          "id": 30071,
          "type": "transport",
          "action": "cluster:monitor/tasks/lists",
          "start_time_in_millis": 1613166701725,
          "running_time_in_nanos": 658200,
          "cancellable": false,
          "headers": {
            "X-Opaque-Id": "111111"
          }
        }
      }
    }
  }
}
```
This operation supports the same parameters as the `tasks` operation. The following example shows how you can associate `X-Opaque-Id` with specific tasks:

```bash
curl -i -H "X-Opaque-Id: 123456" "https://localhost:9200/_tasks?nodes=opensearch-node1" -u 'admin:admin' --insecure
```
{% include copy.html %}
