---
layout: default
title: schedule
parent: Workload reference
grand_parent: OpenSearch Benchmark Reference
nav_order: 100
---

# schedule

The schedule element contains a list of a tasks, which are operations supported by OpenSearch Benchmark (OSB), run by the workload during the benchmark test. 

## Usage

The `schedule` element can define tasks in the following ways:

### Using the operations element

The following example defines a `force-merge` and `match-all` query task using the `operations` element. The `force-merge` operation does not use any parameters, so only the `name` and `operation-type` is needed. `match-all-query` requires a query `body` and `operation-type`. 

Operations defined in the `operations` element can be reused more than once in the schedule:

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

### Defining operations inline

If you don't want reuse an operation in the schedule, you can also define operations inside the `schedule` element, as shown in the following example:

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
`operation` | Yes | List | Refers to either the name of an operation, defined in the `operations` element, or includes the entire operation inline.
`name` | No | String | Specifies a unique name for the task when multiple tasks use the same operation.
`tags` | No | String | Unique identifiers that can be used to filter between tasks.clients (optional, defaults to 1): The number of clients that should execute a task concurrently.
`clients` | No | Integer | The number of clients that concurrently run the task. Default is `1`.

### Target options

OpenSearch Benchmark requires one of the following options when running a task.

`target-throughput` | No | Integer | Defines the benchmark mode. When not defined, OpenSearch Benchmark assumes that this is a throughput benchmark and runs the task as fast as possible. This useful batch operations, where it is more important to achieve the best throughput as opposed to better latency. When defined, the target specifies the number of requests per second over all clients. For example, if you specify `target-throughput: 1000` with 8 clients, it means that each client will issue 125 (= 1000 / 8) requests per second. 
`target-interval` | No | Interval | Defines an internal of less 1 / target-throughput (in seconds) less than one operation per second. Define either target-throughput or target-interval but not both (otherwise Rally will raise an error).
`ignore-response-error-level` | No | Boolean | Controls whether to ignore errors encountered during the task when a benchmark is run with the `on-error=abort` command flag. 

## Parallel tasks

The `parallel` element runs tasks wrapped inside the element concurrently. 

When running tasks in parallel, each task requires the `client` option to make sure clients inside your benchmark are reserved for that task. Otherwise, when the client option is specified inside the parallel element without a connection to the task, the benchmark will use that number of clients for all tasks.

### Usage

In the following example, `parallel-task-1` and `parallel-task-2` execute a `bulk` operation concurrently:

```yml
{
  "name": "parallel-any",
  "description": "Track completed-by property",
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

### Options

The `parallel` element supports all `schedule` parameters, in addition to the following:

`tasks` | Yes | Array | Defines a list of tasks that should be executed concurrently. 
`completed-by` | No | String | Allows you define the name of one task in the tasks list, or the value `any`. If a specific task name has been provided then as soon as the named task has completed, the whole parallel task structure is considered completed. If the of value `any` is provided, then any task that completes first renders all other tasks specified in parallel structure complete. If this property is not explicitly defined, the parallel task structure is considered completed as soon as the tasks in the element complete.

## Iteration-based options

Iteration-based options allow you to warmup clients before the workload outputs benchmark data. It can also define the number of iterative runs when tasks are run in [parallel](#parallel-tasks).

`iterations` | No | Integer | Defines a default value for all tasks of the parallel element. Default is `1`.
`warmup-iterations` | No | Integer | Number of iterations that each client should execute to warmup the benchmark candidate. Warmup iterations will not show up in the measurement results. Default is `0`.

## Time-based options

Use the following time-based options with batch-style operations which may require an additional warmup period, including batch style operations.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`time-period` | No | Duration | The time period in seconds that OpenSearch Benchmark considers for measurement. Usually not required for bulk indexing, since OpenSearch Benchmark will index all documents at according to the `warmup-time-period`.
`ramp-up-time-period` | No | Integer | Determines the number of clients used at the end of the specified time period in seconds, which can help increase load gradually. This prevents load spikes from occurring before the benchmark is warmed up. This property requires a `warmup-time-period` to be set as well, which must be less then the ramp up time period. Default is `0`.
`warmup-time-period` | No | Integer | The time period in seconds to warmup of the benchmark candidate. All response data captured during the warmup period will not appear in the measurement results.


