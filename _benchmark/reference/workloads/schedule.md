---
layout: default
title: schedule
parent: Anatomy of a workload
nav_order: 40
---

<!-- vale off -->
# schedule
<!-- vale on -->

The `schedule` element contains a list of tasks that are run in a specified order during the benchmark test. Each task is an operation supported by OpenSearch Benchmark.

You can define `schedule` in either of the following locations:

- At the top level of `workload.json`. Use this form when the workload defines a single benchmarking scenario. OpenSearch Benchmark treats the schedule as an implicit default test procedure.
- Inside a test procedure, in the [`test_procedures`]({{site.url}}{{site.baseurl}}/benchmark/reference/workloads/test-procedures/) element. Use this form when the workload defines multiple scenarios, each with its own name, description, and schedule.

## Example

The following `schedule` creates an index, waits for the cluster to become healthy, indexes documents in bulk, and then runs a `match_all` query:

```json
  "schedule": [
    {
      "operation": {
        "operation-type": "create-index"
      }
    },
    {
      "operation": {
        "operation-type": "cluster-health",
        "request-params": {
          "wait_for_status": "green"
        },
        "retry-until-success": true
      }
    },
    {
      "operation": {
        "operation-type": "bulk",
        "bulk-size": 5000
      },
      "warmup-time-period": 120,
      "clients": 8
    },
    {
      "operation": {
        "name": "query-match-all",
        "operation-type": "search",
        "body": {
          "query": {
            "match_all": {}
          }
        }
      },
      "iterations": 1000,
      "target-throughput": 100
    }
  ]
```

According to this `schedule`, the actions run in the following order:

1. The `create-index` operation creates an index. The index remains empty until the `bulk` operation adds documents with benchmarked data.
2. The `cluster-health` operation assesses the cluster's health before running the workload. In this example, the workload waits until the cluster's health status is `green`.
   - The `bulk` operation runs the `bulk` API to index `5000` documents simultaneously.
   - Before benchmarking, the workload waits until the specified `warmup-time-period` passes. In this example, the warmup period is `120` seconds.
3. The `clients` field defines the number of clients, in this example, eight, that run the bulk indexing operation concurrently.
4. The `search` operation runs a `match_all` query to match all documents after they have been indexed by the `bulk` API using the specified clients.
   - The `iterations` field defines the number of times each client runs the `search` operation. The benchmark report automatically adjusts the percentile numbers based on this number. To generate a precise percentile, the benchmark needs to run at least 1,000 iterations.
   - The `target-throughput` field defines the number of requests per second performed by each client. This setting can help reduce benchmark latency. For example, a `target-throughput` of 100 requests divided by 8 clients means that each client issues 12 requests per second. For more information about how target throughput is defined in OpenSearch Benchmark, see [Target throughput]({{site.url}}{{site.baseurl}}/benchmark/target-throughput/).

## Defining tasks

The `schedule` element defines tasks using the methods described in this section.

### Using the operations element

The following example defines a `force-merge` and `match-all` query task using the `operations` element. The `force-merge` operation does not use any parameters, so only the `name` and `operation-type` are needed. The `match-all-query` parameter requires a query `body` and `operation-type`.

Operations defined in the `operations` element can be reused in the schedule more than once:

```yml
{
  "operations": [
    {
      "name": "force-merge",
      "operation-type": "force-merge"
    },
    {
      "name": "match-all-query",
      "operation-type": "search",
      "body": {
        "query": {
          "match_all": {}
        }
      }
    }
  ],
  "schedule": [
    {
      "operation": "force-merge",
      "clients": 1
    },
    {
      "operation": "match-all-query",
      "clients": 4,
      "warmup-iterations": 1000,
      "iterations": 1000,
      "target-throughput": 100
    }
  ]
}
```

For the full list of available operation types, see [`operations`]({{site.url}}{{site.baseurl}}/benchmark/reference/workloads/operations/).

### Defining operations inline

If you don't want to reuse an operation in the schedule, you can define operations inside the `schedule` element, as shown in the following example:

```yml
{
  "schedule": [
    {
      "operation": {
        "name": "force-merge",
        "operation-type": "force-merge"
      },
      "clients": 1
    },
    {
      "operation": {
        "name": "match-all-query",
        "operation-type": "search",
        "body": {
          "query": {
            "match_all": {}
          }
        }
      },
      "clients": 4,
      "warmup-iterations": 1000,
      "iterations": 1000,
      "target-throughput": 100
    }
  ]
}
```

## Task options

Each task contains the following options.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`operation` | Yes | List | Either refers to the name of an operation, defined in the `operations` element, or includes the entire operation inline.
`name` | No | String | Specifies a unique name for the task when multiple tasks use the same operation.
`tags` | No | String | Unique identifiers that can be used to filter between `tasks.clients` or the number of clients that should execute a task concurrently. Default is 1.
`clients` | No | Integer | Specifies the number of clients that will run the task concurrently. Default is `1`.

## Target options

OpenSearch Benchmark requires one of the following options when running a task.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`target-throughput` | No | Integer | Defines the benchmark mode. When not defined, OpenSearch Benchmark assumes that it is a throughput benchmark and runs the task as fast as possible. This is useful for batch operations, where achieving better throughput is preferred over better latency. When defined, the target specifies the number of requests per second across all clients. For example, if you specify `target-throughput: 1000` with 8 clients, each client issues 125 (= 1000 / 8) requests per second.
`target-interval` | No | Interval | Defines an interval of 1 divided by the `target-throughput` (in seconds) when the `target-throughput` is less than 1 operation per second. Define either `target-throughput` or `target-interval` but not both, otherwise OpenSearch Benchmark raises an error.
`ignore-response-error-level` | No | Boolean | Controls whether to ignore errors encountered during the task when a benchmark is run with the `on-error=abort` command flag.

## Iteration-based options

Iteration-based options determine the number of times that an operation should run. They can also define the number of iterative runs when tasks are run in [parallel](#parallel-tasks). To configure an iteration-based schedule, use the following options.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`iterations` | No | Integer | Specifies the number of times that a client should execute an operation. All iterations are included in the measured results. Default is `1`.
`warmup-iterations` | No | Integer | Specifies the number of times that a client should execute an operation in order to warm up the benchmark candidate. The `warmup-iterations` do not appear in the measurement results. Default is `0`.

## Time-based options

Time-based options determine the duration of time, in seconds, for which operations should run. This is ideal for batch-style operations, which may require an additional warmup period.

To configure a time-based schedule, use the following options.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`time-period` | No | Integer | Specifies the time period, in seconds, that OpenSearch Benchmark considers for measurement. This is not required for bulk indexing because OpenSearch Benchmark bulk indexes all documents and naturally measures all samples after the specified `warmup-time-period`.
`ramp-up-time-period` | No | Integer | Specifies the time period, in seconds, during which OpenSearch Benchmark gradually adds clients and reaches the total number of clients specified for the operation.
`warmup-time-period` | No | Integer | Specifies the amount of time, in seconds, to warm up the benchmark candidate. None of the response data captured during the warmup period appears in the measurement results.

## Parallel tasks

The `parallel` element concurrently runs tasks wrapped inside the element.

When running tasks in parallel, each task requires the `client` option in order to ensure that clients inside your benchmark are reserved for that task. Otherwise, when the `client` option is specified inside the `parallel` element without a connection to the task, the benchmark uses that number of clients for all tasks.

In the following example, `parallel-task-1` and `parallel-task-2` execute a `bulk` operation concurrently:

```yml
{
  "name": "parallel-any",
  "description": "Workload completed-by property",
  "schedule": [
    {
      "parallel": {
        "tasks": [
          {
            "name": "parellel-task-1",
            "operation": {
              "operation-type": "bulk",
              "bulk-size": 1000
            },
            "clients": 8
          },
          {
            "name": "parellel-task-2",
            "operation": {
              "operation-type": "bulk",
              "bulk-size": 500
            },
            "clients": 8
          }
        ]
      }
    }
  ]
}
```

The `parallel` element supports all `schedule` parameters, in addition to the following options.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`tasks` | Yes | Array | Defines a list of tasks that should be executed concurrently.
`completed-by` | No | String | Allows you to define the name of one task in the task list or the value `any`. If `completed-by` is set to the name of one task in the list, the `parallel-task` structure is considered to be complete once that specific task has been completed. If `completed-by` is set to `any`, the `parallel-task` structure is considered to be complete when any one of the tasks in the list has been completed. If `completed-by` is not explicitly defined, the `parallel-task` structure is considered to be complete as soon as all of the tasks in the list have been completed.
