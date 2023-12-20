---
layout: default
title: test_procedures
parent: Workload reference
grand_parent: OpenSearch Benchmark Reference
nav_order: 100
---

# test_procedures

If your workload only defines one benchmarking scenario, specify the schedule at the top level. Use the `test-procedures` element to specify additional properties, such as a name or description. A test procedure is like a benchmarking scenario. If you have multiple test procedures, you can define a variety of challenges.

The following table lists test procedures for the benchmarking scenarios in this dataset. A test procedure can reference all operations that are defined in the operations section.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`name` | Yes | String | The name of the test procedure. When naming the test procedure, do not use spaces; this ensures that the name can be easily entered on the command line.
`description` | No | String |  Describes the test procedure in a human-readable format.
`user-info` | No | String | Outputs a message at the start of the test to notify you about important test-related information, for example, deprecations.
`default` | No | Boolean | When set to `true`, selects the default test procedure if you did not specify a test procedure on the command line. If the workload only defines one test procedure, it is implicitly selected as the default. Otherwise, you must define `"default": true` on exactly one challenge.
[`schedule`](#Schedule) | Yes | Array |  Defines the order in which workload tasks are run.


## schedule

The `schedule` element contains a list of a tasks, which are operations supported by OpenSearch Benchmark, that are run by the workload during the benchmark test. 

### Usage

The `schedule` element defines tasks using the methods described in this section.

#### Using the operations element

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

#### Defining operations inline

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

### Task options

Each task contains the following options.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`operation` | Yes | List | Either refers to the name of an operation, defined in the `operations` element, or includes the entire operation inline.
`name` | No | String | Specifies a unique name for the task when multiple tasks use the same operation.
`tags` | No | String | Unique identifiers that can be used to filter between `tasks.clients` or the number of clients that should execute a task concurrently. Default is 1.
`clients` | No | Integer | Specifies the number of clients that will run the task concurrently. Default is `1`.

### Target options

OpenSearch Benchmark requires one of the following options when running a task:

`target-throughput` | No | Integer | Defines the benchmark mode. When not defined, OpenSearch Benchmark assumes that it is a throughput benchmark and runs the task as fast as possible. This is useful for batch operations, where achieving better throughput is preferred over better latency. When defined, the target specifies the number of requests per second across all clients. For example, if you specify `target-throughput: 1000` with 8 clients, each client issues 125 (= 1000 / 8) requests per second. 
`target-interval` | No | Interval | Defines an interval of 1 divided by the target-throughput (in seconds) when the `target-throughput` is less than one operation per second. Define either `target-throughput` or `target-interval` but not both, otherwise OpenSearch Benchmark raises an error.
`ignore-response-error-level` | No | Boolean | Controls whether to ignore errors encountered during the task when a benchmark is run with the `on-error=abort` command flag. 

### Iteration-based options

Iteration-based options determine the number of times that an operation should run. It can also define the number of iterative runs when tasks are run in [parallel](#parallel-tasks). To configure an iteration-based schedule, use the following options.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`iterations` | No | Integer | Specifies the number of times that a client should execute an operation. All iterations are included in the measured results. Default is `1`. 
`warmup-iterations` | No | Integer | Specifies the number of times that a client should execute an operation in order to warm up the benchmark candidate. The `warmup-iterations` do not appear in the measurement results. Default is `0`.

### Parallel tasks

The `parallel` element concurrently runs tasks wrapped inside the element. 

When running tasks in parallel, each task requires the `client` option in order to ensure that clients inside your benchmark are reserved for that task. Otherwise, when the `client` option is specified inside the `parallel` element without a connection to the task, the benchmark uses that number of clients for all tasks.

#### Usage

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

#### Options

The `parallel` element supports all `schedule` parameters, in addition to the following options.

`tasks` | Yes | Array | Defines a list of tasks that should be executed concurrently. 
`completed-by` | No | String | Allows you to define the name of one task in the task list or the value `any`. If `completed-by` is set to the name of one task in the list, the `parallel-task` structure is considered to be complete once that specific task has been completed. If `completed-by` is set to `any`, the `parallel-task` structure is considered to be complete when any one of the tasks in the list has been completed. If `completed-by` is not explicitly defined, the `parallel-task` structure is considered to be complete as soon as all of the tasks in the list have been completed.

### Time-based options

Time-based options determine the duration of time, in seconds, for which operations should run. This is ideal for batch-style operations, which may require an additional warmup period.

To configure a time-based schedule, use the following options.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`time-period` | No | Integer | Specifies the time period, in seconds, that OpenSearch Benchmark considers for measurement. This is not required for bulk indexing because OpenSearch Benchmark bulk indexes all documents and naturally measures all samples after the specified `warmup-time-period`.
`ramp-up-time-period` | No | Integer | Specifies the time period, in seconds, during which OpenSearch Benchmark gradually adds clients and reaches the total number of clients specified for the operation. 
`warmup-time-period` | No | Integer | Specifies the amount of time, in seconds, to warm up the benchmark candidate. None of the response data captured during the warmup period appears in the measurement results.

