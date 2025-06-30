---
layout: default
title: Rethrottle
parent: Tasks API
nav_order: 40
---

# Rethrottle

You can use the following APIs to dynamically change the `requests_per_second` for [`_reindex`]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/), [`_update_by_query`]({{site.url}}{{site.baseurl}}/api-reference/document-apis/update-by-query/), or [`_delete_by_query`]({{site.url}}{{site.baseurl}}/api-reference/document-apis/delete-by-query/) operations that are already running.

## Endpoints

```json
POST /_delete_by_query/{task_id}/_rethrottle
POST /_reindex/{task_id}/_rethrottle
POST /_update_by_query/{task_id}/_rethrottle
```

## Path parameters

Parameter | Data type | Description
:--- | :--- | :---
`task_id` | String | The unique identifier for the running task that you want to rethrottle.

## Query parameters

Parameter | Data type | Description
:--- | :--- | :---
`requests_per_second` | Float | The new throttle value to apply to the task. Use `-1` to disable throttling. Optional.

### Example request: Re-throttle a running delete by query task

```bash
curl -X POST "localhost:9200/_delete_by_query/<YOUR_TASK_ID>/_rethrottle?requests_per_second=10" -H 'Content-Type: application/json'
```

### Example request: Re-throttle a running reindex task

```bash
curl -X POST "localhost:9200/_reindex/<YOUR_TASK_ID>/_rethrottle?requests_per_second=20" -H 'Content-Type: application/json'
```

### Example request: Re-throttle a running update by query task

```bash
curl -X POST "localhost:9200/_update_by_query/<YOUR_TASK_ID>/_rethrottle?requests_per_second=5" -H 'Content-Type: application/json'
```

## Response body fields

The response provides detailed task and node-level information about the rethrottled operation.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `nodes` | Object | A map of node IDs to details about the task on each node. |
| `nodes.<node_id>.name` | String | The name of the node on which the task is running. |
| `nodes.<node_id>.transport_address` | String | The transport address of the node. |
| `nodes.<node_id>.host` | String | The host IP address. |
| `nodes.<node_id>.ip` | String | The IP address and port. |
| `nodes.<node_id>.roles` | Array | The roles assigned to the node. |
| `nodes.<node_id>.attributes` | Object | Node-level attributes. |
| `nodes.<node_id>.tasks` | Object | A map of task IDs to detailed information about each task. |
| `nodes.<node_id>.tasks.<task_id>.type` | String | The task type, such as `transport`. |
| `nodes.<node_id>.tasks.<task_id>.action` | String | The specific action being performed (for example, `reindex`). |
| `nodes.<node_id>.tasks.<task_id>.status` | Object | The current status of the task. |
| `nodes.<node_id>.tasks.<task_id>.status.total` | Integer | The total number of documents to process. |
| `nodes.<node_id>.tasks.<task_id>.status.created` | Integer | The number of documents created. |
| `nodes.<node_id>.tasks.<task_id>.status.updated` | Integer | The number of documents updated. |
| `nodes.<node_id>.tasks.<task_id>.status.deleted` | Integer | The number of documents deleted. |
| `nodes.<node_id>.tasks.<task_id>.status.batches` | Integer | The number of batches processed. |
| `nodes.<node_id>.tasks.<task_id>.status.version_conflicts` | Integer | The number of version conflicts. |
| `nodes.<node_id>.tasks.<task_id>.status.noops` | Integer | The number of no-op updates. |
| `nodes.<node_id>.tasks.<task_id>.status.retries` | Object | Retry stats for bulk and search operations. |
| `nodes.<node_id>.tasks.<task_id>.status.requests_per_second` | Float | Current throttle rate in requests per second. |
| `nodes.<node_id>.tasks.<task_id>.status.throttled_millis` | Integer | The time, in milliseconds, the task was throttled. |
| `nodes.<node_id>.tasks.<task_id>.status.throttled_until_millis` | Integer | The time, in milliseconds, the task is expected to remain throttled. |
| `nodes.<node_id>.tasks.<task_id>.description` | String | A human-readable description of the task. |
| `nodes.<node_id>.tasks.<task_id>.start_time_in_millis` | Integer | The task start time in epoch milliseconds. |
| `nodes.<node_id>.tasks.<task_id>.running_time_in_nanos` | Integer | The task runtime in nanoseconds. |
| `nodes.<node_id>.tasks.<task_id>.cancellable` | Boolean | Whether the task can be canceled. |
| `nodes.<node_id>.tasks.<task_id>.cancelled` | Boolean | Whether the task has been canceled. |
| `nodes.<node_id>.tasks.<task_id>.headers` | Object | Optional HTTP headers associated with the task. |
| `nodes.<node_id>.tasks.<task_id>.resource_stats` | Object | Statistics about resource usage. |