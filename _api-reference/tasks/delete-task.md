---
layout: default
title: Delete task
parent: Tasks APIs
nav_order: 30
---

# Delete Task API
**Introduced 3.9**
{: .label .label-purple }

Use the Delete Task API to delete the stored result of a completed task. For example, when you run a supported operation and set `wait_for_completion=false`, OpenSearch stores the task result so that you can retrieve it later by using the [Get Task API]({{site.url}}{{site.baseurl}}/api-reference/tasks/get-tasks/). When you no longer need the result, delete it to free the associated storage.

The Delete Task API does not cancel or delete a running task. To stop a running task, use the [Cancel Tasks API]({{site.url}}{{site.baseurl}}/api-reference/tasks/cancel-tasks/).
{: .important }

<!-- spec_insert_start
api: tasks.delete
component: endpoints
-->
## Endpoint

```json
DELETE /_tasks/{task_id}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: tasks.delete
component: path_parameters
-->
## Path parameters

The following table lists the available path parameter.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `task_id` | **Required** | String | The task ID in the format `node_id:task_number`. |

<!-- spec_insert_end -->

## Example request

The following request deletes the stored result for task `JzrCxdtFTCO_RaINw8ckNA:54321`:

```json
DELETE /_tasks/JzrCxdtFTCO_RaINw8ckNA:54321
```
{% include copy-curl.html %}

## Example response

OpenSearch responds with an acknowledgment after deleting the stored result:

```json
{
  "acknowledged": true
}
```

After a successful deletion, the Get Task API returns a `404 Not Found` response for the task.

## Parent and child tasks

You cannot delete a stored task result while it has running child tasks or stored child task results. In a hierarchy of stored task results, delete the results from the leaves toward the root. For example, delete a grandchild result before its parent result, and then delete the root result.

OpenSearch returns a `409 Conflict` response if the task has running child tasks or stored child task results.

## Response codes

The following table lists common response codes.

| HTTP status code | Description |
| :--- | :--- |
| `200 OK` | The stored completed task result was deleted. |
| `404 Not Found` | The task is not running and has no stored result. |
| `409 Conflict` | The task is still running, is not marked as completed, has running child tasks, or has stored child task results. |

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:admin/tasks/delete`.
