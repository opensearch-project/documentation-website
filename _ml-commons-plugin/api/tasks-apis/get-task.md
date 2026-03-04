---
layout: default
title: Get ML task
parent: ML Tasks APIs
grand_parent: ML Commons APIs
nav_order: 10
---

# Get ML Task API

You can retrieve information about a machine learning (ML) task (such as model training, deployment, or prediction tasks) using the `task_id`.

This API is different from the [general Tasks API]({{site.url}}{{site.baseurl}}/api-reference/tasks/get-tasks/), which tracks general OpenSearch operations and has a different response format.
{: .important }

## Endpoints

```json
GET /_plugins/_ml/tasks/<task_id>
```

## Example request

```json
GET /_plugins/_ml/tasks/MsBi1YsB0jLkkocYjD5f
```
{% include copy-curl.html %}

## Example responses

The response format depends on the task state. Different ML operations (for example, model training, deployment, or registration) return different response formats based on their current status.

### Task in progress

While a task is still running, the response includes task details but excludes the `model_id`:

```json
{
  "task_type": "DEPLOY_MODEL",
  "function_name": "TEXT_EMBEDDING",
  "state": "CREATED",
  "worker_node": ["KfEEGG7_SsKZVFqI4ko2FA"],
  "create_time": 1767030135146,
  "last_update_time": 1767030135771,
  "is_async": true
}
```

### Task completed

When a task completes successfully, the response includes the `model_id` and full task details:

**Model deployment task**:

```json
{
  "model_id": "Qr1YbogBYOqeeqR7sI9L",
  "task_type": "DEPLOY_MODEL",
  "function_name": "TEXT_EMBEDDING",
  "state": "COMPLETED",
  "worker_node": [
    "N77RInqjTSq_UaLh1k0BUg"
  ],
  "create_time": 1685478486057,
  "last_update_time": 1685478491090,
  "is_async": true
}
```

**Model registration task**:

```json
{
  "model_id": "aVeif4oB5Vm0Tdw8zYO2",
  "task_type": "REGISTER_MODEL",
  "function_name": "TEXT_EMBEDDING",
  "state": "COMPLETED",
  "worker_node": [
    "4p6FVOmJRtu3wehDD74hzQ"
  ],
  "create_time": 1694358489722,
  "last_update_time": 1694358499139,
  "is_async": true
}
```

**Model training task**:

```json
{
  "model_id" : "l7lamX8BO5w8y8Ra2oty",
  "task_type" : "TRAINING",
  "function_name" : "KMEANS",
  "state" : "COMPLETED",
  "input_type" : "SEARCH_QUERY",
  "worker_node" : "54xOe0w8Qjyze00UuLDfdA",
  "create_time" : 1647545342556,
  "last_update_time" : 1647545342587,
  "is_async" : true
}
```

## Response fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `model_id` | String | The unique identifier for the ML model. Available when task is completed. |
| `task_type` | String | The type of ML operation (for example, `REGISTER_MODEL`, `DEPLOY_MODEL`, or `TRAINING`). |
| `function_name` | String | The ML function type (for example, `TEXT_EMBEDDING` or `KMEANS`). |
| `state` | String | The current task state. Valid values are `CREATED` (task created), `RUNNING` (task actively executing), `COMPLETED` (task finished successfully), `FAILED` (task encountered an error), `CANCELLED` (task was canceled), `COMPLETED_WITH_ERROR` (task completed with errors), `CANCELLING` (task being canceled), `EXPIRED` (task expired), and `UNREACHABLE` (task node unreachable). |
| `worker_node` | Array | An array of node IDs of nodes on which the task is running. |
| `create_time` | Long | The timestamp when the task was created, in milliseconds since epoch. |
| `last_update_time` | Long | The timestamp of the last status update, in milliseconds since epoch. |
| `is_async` | Boolean | Whether the task runs asynchronously. Usually `true` for ML tasks. |
| `input_type` | String | The input type for training tasks (for example, `SEARCH_QUERY`). |
