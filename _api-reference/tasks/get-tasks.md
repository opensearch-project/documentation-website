---
layout: default
title: Get task
parent: Tasks APIs
nav_order: 20
---

# Get Task API
**Introduced 1.0**
{: .label .label-purple }

The Get Task API returns detailed information about a single general OpenSearch task (such as search, reindex, or bulk operations).

This API is different from the [Get ML Task API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/), which tracks machine learning tasks and has a different response format.
{: .important }

<!-- spec_insert_start
api: tasks.get
component: endpoints
-->
## Endpoints
```json
GET /_tasks/{task_id}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: tasks.get
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `task_id` | **Required** | String | The task ID. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: tasks.get
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `timeout` | String | The amount of time to wait for a response. | `30s` |
| `wait_for_completion` | Boolean | Waits for the matching task to complete. When `true`, the request is blocked until the task has completed. | `false` |

<!-- spec_insert_end -->

The API returns information about tasks that are currently running. After a task finishes, the API returns its information only if the task result was stored in the `.tasks` index. OpenSearch stores task results only for operations started using `wait_for_completion=false`. For a task that has finished without storing its result, the API returns an error.

## Example request

To obtain a task ID, start a long-running operation, such as a reindex or update by query, using `wait_for_completion=false`. The following request starts a throttled reindex operation:

```json
POST /_reindex?wait_for_completion=false&requests_per_second=50
{
  "source": {
    "index": "my-source-index"
  },
  "dest": {
    "index": "my-dest-index"
  }
}
```
{% include copy-curl.html %}

The response contains the task ID:

```json
{
  "task": "6It0uQ1AR06IDC4nMstPQw:1822891"
}
```

Alternatively, find the ID of a running task using the [List Tasks API]({{site.url}}{{site.baseurl}}/api-reference/tasks/list-tasks/), for example, `GET /_tasks?actions=*reindex`.

The following request returns information about the task:

```json
GET /_tasks/<task_id>
```
{% include copy-curl.html %}

## Example response

While the task is running, the response contains `"completed": false` and the current task status:

```json
{
  "completed": false,
  "task": {
    "node": "6It0uQ1AR06IDC4nMstPQw",
    "id": 1822891,
    "type": "transport",
    "action": "indices:data/write/reindex",
    "status": {
      "total": 2000,
      "updated": 0,
      "created": 1000,
      "deleted": 0,
      "batches": 1,
      "version_conflicts": 0,
      "noops": 0,
      "retries": {
        "bulk": 0,
        "search": 0
      },
      "throttled_millis": 0,
      "requests_per_second": 50.0,
      "throttled_until_millis": 16963
    },
    "description": "reindex from [my-source-index] to [my-dest-index]",
    "start_time_in_millis": 1792185761839,
    "running_time_in_nanos": 3241833543,
    "cancellable": true,
    "cancelled": false,
    "headers": {},
    "resource_stats": {
      "average": {
        "cpu_time_in_nanos": 0,
        "memory_in_bytes": 0
      },
      "total": {
        "cpu_time_in_nanos": 0,
        "memory_in_bytes": 0
      },
      "min": {
        "cpu_time_in_nanos": 0,
        "memory_in_bytes": 0
      },
      "max": {
        "cpu_time_in_nanos": 0,
        "memory_in_bytes": 0
      },
      "thread_info": {
        "thread_executions": 0,
        "active_threads": 0
      }
    }
  }
}
```

After the task finishes, the response contains `"completed": true` and the stored result of the operation in the `response` object:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "completed": true,
  "task": {
    "node": "6It0uQ1AR06IDC4nMstPQw",
    "id": 1822891,
    "type": "transport",
    "action": "indices:data/write/reindex",
    "status": {
      "total": 2000,
      "updated": 0,
      "created": 2000,
      "deleted": 0,
      "batches": 2,
      "version_conflicts": 0,
      "noops": 0,
      "retries": {
        "bulk": 0,
        "search": 0
      },
      "throttled_millis": 39999,
      "requests_per_second": 50.0,
      "throttled_until_millis": 0
    },
    "description": "reindex from [my-source-index] to [my-dest-index]",
    "start_time_in_millis": 1792185761839,
    "running_time_in_nanos": 40289441643,
    "cancellable": true,
    "cancelled": false,
    "headers": {}
  },
  "response": {
    "took": 40286,
    "timed_out": false,
    "total": 2000,
    "updated": 0,
    "created": 2000,
    "deleted": 0,
    "batches": 2,
    "version_conflicts": 0,
    "noops": 0,
    "retries": {
      "bulk": 0,
      "search": 0
    },
    "throttled": "39.9s",
    "throttled_millis": 39999,
    "requests_per_second": 50.0,
    "throttled_until": "0s",
    "throttled_until_millis": 0,
    "failures": []
  }
}
```
</details>

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `completed` | Boolean | Whether the task has finished. |
| `task` | Object | Information about the task. See [The `task` object](#the-task-object). |
| `response` | Object | The result of the operation. Returned only for a task that finished successfully and whose result was stored. The object contents depend on the operation. For example, a reindex task returns the same fields as the [Reindex API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) response. |
| `error` | Object | The error that caused the task to fail. Returned only for a task that failed and whose result was stored. |

### The `task` object

The `task` object contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `node` | String | The ID of the node on which the task runs. |
| `id` | Integer | The task ID on the node. The full task ID has the format `<node>:<id>`. |
| `type` | String | The task type, such as `transport`. |
| `action` | String | The action that the task performs, such as `indices:data/write/reindex`. |
| `status` | Object | The current status of the task. The object contents depend on the action. For example, a reindex task reports the number of documents processed and throttling information. Not returned for all actions. |
| `description` | String | A description of the task, such as the source and destination indexes of a reindex operation. |
| `start_time_in_millis` | Long | The time at which the task started, in milliseconds since the epoch. |
| `running_time_in_nanos` | Long | The amount of time for which the task has run, in nanoseconds. |
| `cancellable` | Boolean | Whether the task can be canceled. |
| `cancelled` | Boolean | Whether the task has been canceled. |
| `cancellation_time_millis` | Long | The time at which the task was canceled, in milliseconds since the epoch. Returned only for canceled tasks. |
| `parent_task_id` | String | The ID of the parent task. Returned only for child tasks, such as the slices of a sliced reindex operation. |
| `headers` | Object | The tracked request headers of the request that started the task, such as `X-Opaque-Id`. Other request headers are not included. |
| `resource_stats` | Object | Resource usage statistics for the task. Returned only for running tasks that support resource tracking. See [The `resource_stats` object](#the-resource_stats-object). |

### The `resource_stats` object

The `resource_stats` object is only updated for tasks that support resource tracking. These statistics are computed based on scheduled thread executions, including both threads that have finished working on the task and threads currently working on the task. Because the same thread may be scheduled to work on the same task multiple times, each instance of a given thread being scheduled to work on a given task is considered to be a single thread execution.

The `resource_stats` object contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `average` | Object | The average resource usage across all scheduled thread executions. |
| `total` | Object | The total resource usage across all scheduled thread executions. |
| `min` | Object | The minimum resource usage across all scheduled thread executions. |
| `max` | Object | The maximum resource usage across all scheduled thread executions. |
| `thread_info` | Object | Thread-count-related statistics. |

Each of the `average`, `total`, `min`, and `max` objects contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `cpu_time_in_nanos` | Long | The CPU time used, in nanoseconds. |
| `memory_in_bytes` | Long | The amount of memory used, in bytes. |

The `thread_info` object contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `thread_executions` | Integer | The number of threads that have been scheduled to work on the task. |
| `active_threads` | Integer | The number of threads currently working on the task. |

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:monitor/tasks/get`.
