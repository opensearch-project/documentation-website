---
layout: default
title: Rethrottle
parent: Tasks APIs
nav_order: 40
canonical_url: https://docs.opensearch.org/latest/api-reference/tasks/rethrottle/
---

# Rethrottle API

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

### Example request: Rethrottle a running delete by query task

<!-- spec_insert_start
component: example_code
rest: POST /_delete_by_query/<YOUR_TASK_ID>/_rethrottle?requests_per_second=10
-->
{% capture step1_rest %}
POST /_delete_by_query/<YOUR_TASK_ID>/_rethrottle?requests_per_second=10
{% endcapture %}

{% capture step1_python %}


response = client.delete_by_query_rethrottle(
  task_id = "<YOUR_TASK_ID>",
  params = { "requests_per_second": "10" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->


### Example request: Rethrottle a running reindex task

<!-- spec_insert_start
component: example_code
rest: POST /_reindex/<YOUR_TASK_ID>/_rethrottle?requests_per_second=20
-->
{% capture step1_rest %}
POST /_reindex/<YOUR_TASK_ID>/_rethrottle?requests_per_second=20
{% endcapture %}

{% capture step1_python %}


response = client.reindex_rethrottle(
  task_id = "<YOUR_TASK_ID>",
  params = { "requests_per_second": "20" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Example request: Rethrottle a running update by query task

<!-- spec_insert_start
component: example_code
rest: POST /_update_by_query/<YOUR_TASK_ID>/_rethrottle?requests_per_second=5
-->
{% capture step1_rest %}
POST /_update_by_query/<YOUR_TASK_ID>/_rethrottle?requests_per_second=5
{% endcapture %}

{% capture step1_python %}


response = client.update_by_query_rethrottle(
  task_id = "<YOUR_TASK_ID>",
  params = { "requests_per_second": "5" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

The following response provides details regarding the active `update_by_query` task:

```
{
  "nodes": {
    "bvv8SKpiRhOhF9_Bu8gZ7w": {
      "name": "opensearch-node1",
      "transport_address": "172.18.0.4:9300",
      "host": "172.18.0.4",
      "ip": "172.18.0.4:9300",
      "roles": [
        "cluster_manager",
        "data",
        "ingest",
        "remote_cluster_client"
      ],
      "attributes": {
        "shard_indexing_pressure_enabled": "true"
      },
      "tasks": {
        "bvv8SKpiRhOhF9_Bu8gZ7w:640": {
          "node": "bvv8SKpiRhOhF9_Bu8gZ7w",
          "id": 640,
          "type": "transport",
          "action": "indices:data/write/update/byquery",
          "status": {
            "total": 4785,
            "updated": 1000,
            "created": 0,
            "deleted": 0,
            "batches": 1,
            "version_conflicts": 0,
            "noops": 0,
            "retries": {
              "bulk": 0,
              "search": 0
            },
            "throttled_millis": 0,
            "requests_per_second": 50,
            "throttled_until_millis": 2146
          },
          "description": "update-by-query [test-rethrottle] updated with Script{type=inline, lang='painless', idOrCode='ctx._source.new_field = 'updated'', options={}, params={}}",
          "start_time_in_millis": 1751310547697,
          "running_time_in_nanos": 9567425129,
          "cancellable": true,
          "cancelled": false,
          "headers": {
            "X-Opaque-Id": "1b911516-44cd-4920-8c1e-79368ea7cdfd"
          },
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
    }
  }
}
```

## Response body fields

The response provides detailed task- and node-level information about the rethrottled operation.

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
| `nodes.<node_id>.tasks.<task_id>.status.throttled_millis` | Integer | The time, in milliseconds, that the task was throttled. |
| `nodes.<node_id>.tasks.<task_id>.status.throttled_until_millis` | Integer | The time, in milliseconds, that the task is expected to remain throttled. |
| `nodes.<node_id>.tasks.<task_id>.description` | String | A human-readable description of the task. |
| `nodes.<node_id>.tasks.<task_id>.start_time_in_millis` | Integer | The task start time in epoch milliseconds. |
| `nodes.<node_id>.tasks.<task_id>.running_time_in_nanos` | Integer | The task runtime in nanoseconds. |
| `nodes.<node_id>.tasks.<task_id>.cancellable` | Boolean | Whether the task can be canceled. |
| `nodes.<node_id>.tasks.<task_id>.cancelled` | Boolean | Whether the task has been canceled. |
| `nodes.<node_id>.tasks.<task_id>.headers` | Object | Optional HTTP headers associated with the task. |
| `nodes.<node_id>.tasks.<task_id>.resource_stats` | Object | Statistics about resource usage. |