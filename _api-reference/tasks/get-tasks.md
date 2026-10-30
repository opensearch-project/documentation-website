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

## Example request

The following request returns information about a reindex task:

```json
GET /_tasks/6It0uQ1AR06IDC4nMstPQw:908779
```
{% include copy-curl.html %}

## Example response

The task in this example has already completed, so the response contains the result of the reindex operation in the `response` object:

```json
{
  "completed": true,
  "task": {
    "node": "6It0uQ1AR06IDC4nMstPQw",
    "id": 908779,
    "type": "transport",
    "action": "indices:data/write/reindex",
    "status": {
      "total": 3,
      "updated": 0,
      "created": 3,
      "deleted": 0,
      "batches": 1,
      "version_conflicts": 0,
      "noops": 0,
      "retries": {
        "bulk": 0,
        "search": 0
      },
      "throttled_millis": 0,
      "requests_per_second": -1.0,
      "throttled_until_millis": 0
    },
    "description": "reindex from [products] to [products-copy]",
    "start_time_in_millis": 1793043339924,
    "running_time_in_nanos": 704592000,
    "cancellable": true,
    "cancelled": false,
    "headers": {}
  },
  "response": {
    "took": 434,
    "timed_out": false,
    "total": 3,
    "updated": 0,
    "created": 3,
    "deleted": 0,
    "batches": 1,
    "version_conflicts": 0,
    "noops": 0,
    "retries": {
      "bulk": 0,
      "search": 0
    },
    "throttled": "0s",
    "throttled_millis": 0,
    "requests_per_second": -1.0,
    "throttled_until": "0s",
    "throttled_until_millis": 0,
    "failures": []
  }
}
```

## Response body fields

The following table lists all response body fields.

Field | Data type | Description
:--- | :--- | :---
`completed` | Boolean | Whether the task has completed.
`task` | Object | Information about the task. See [The `task` object](#the-task-object).
`response` | Object | The result of the operation that the task ran. Present only after the task completes. The fields depend on the operation. For example, a reindex task returns the same fields as the [Reindex API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/).

### The `task` object

The following table lists all response fields in the `task` object.

Field | Data type | Description
:--- | :--- | :---
`node` | String | The ID of the node running the task.
`id` | Integer | The task ID on the node. The full task ID used in requests has the format `<node>:<id>`.
`type` | String | The task type, for example, `transport`.
`action` | String | The action that the task performs, for example, `indices:data/write/reindex`.
`status` | Object | The current state of the task. The fields depend on the task type. For example, a reindex task reports the number of documents processed so far.
`description` | String | A description of the task.
`start_time_in_millis` | Long | The time at which the task started, in milliseconds since the epoch.
`running_time_in_nanos` | Long | The amount of time for which the task has been running, in nanoseconds.
`cancellable` | Boolean | Whether the task can be canceled.
`cancelled` | Boolean | Whether the task has been canceled.
`headers` | Object | The tracked request headers of the request that started the task, such as `X-Opaque-Id`. Other request headers are not included.
`resource_stats` | Object | Resource usage statistics. Present only for running tasks that support resource tracking. See [The `resource_stats` object](#the-resource_stats-object).

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

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:monitor/tasks/get`.
