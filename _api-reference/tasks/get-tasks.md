---
layout: default
title: Get task
parent: Tasks API
nav_order: 20
---

# Get task

The Get Task API returns detailed information about a single task.

<!-- spec_insert_start 
api: tasks.get
component: endpoints
-->

<!-- spec_insert_end -->

<!-- spec_insert_start 
api: tasks.get
component: path_parameters
-->

<!-- spec_insert_end -->

<!-- spec_insert_start 
api: tasks.get
component: query_parameters
-->

<!-- spec_insert_end -->

## Example request

The following request returns detailed information about active search tasks:

```bash
curl -XGET "localhost:9200/_tasks?actions=*search&detailed
```
{% include copy.html %}

## Example response

The following response returns detailed information about the `transport` task:

```json
{
  "nodes": {
    "JzrCxdtFTCO_RaINw8ckNA": {
      "name": "node-1",
      "transport_address": "127.0.0.1:9300",
      "host": "127.0.0.1",
      "ip": "127.0.0.1:9300",
      "roles": [
        "data",
        "ingest",
        "cluster_manager",
        "remote_cluster_client"
      ],
      "tasks": {
        "JzrCxdtFTCO_RaINw8ckNA:54321": {
          "node": "JzrCxdtFTCO_RaINw8ckNA",
          "id": 54321,
          "type": "transport",
          "action": "indices:data/read/search",
          "status": {
            "total": 1000,
            "created": 0,
            "updated": 0,
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
          "description": "indices[test_index], types[_doc], search_type[QUERY_THEN_FETCH], source[{\"query\":{\"match_all\":{}}}]",
          "start_time_in_millis": 1625145678901,
          "running_time_in_nanos": 2345678,
          "cancellable": true
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