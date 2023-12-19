---
layout: default
title: test_procedures
parent: Workload reference
grand_parent: OpenSearch Benchmark Reference
nav_order: 100
---

# test_procedures

If your workload only defines one benchmarking scenario specify the schedule on top-level. Use the `test-procedures` element if you want to specify additional properties like a name or a description. You can think of a test procedure as a benchmarking scenario. If you have multiple test procedures, you can define an array of challenges.

This section contains one or more test procedures which describe the benchmark scenarios for this data set. A test procedure can reference all operations that are defined in the operations section.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`name` | Yes | String | The name of the test procedure. When naming the test procedure, do not use spaces so that the name is easy to enter on the command line.
`description` | No | String |  A human readable description of the test procedure.
`user-info` | No | String | A message that is printed at the beginning of the test intended to notify the user about important information related to the test, such as deprecations.
`default` | No | Boolean | When set to `true`, OpenSearch Benchmark selects this test procedure by default if the user did not specify another `test-procedure` on the command line. If your workload only defines one challenge, it is implicitly selected as default, otherwise you need to define `"default": true` on exactly one challenge.
[schedule](#schedule) | Yes | Array |  Defines the order in which tasks in the workload are run.


## schedule

The schedule element contains a list of a tasks, which are operations supported by OpenSearch Benchmark (OSB), run by the workload during the benchmark test. 

### Usage

The `schedule` element can define tasks in the following ways:

#### Using the operations element

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

#### Defining operations inline

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

### Task options

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

### Parallel tasks

The `parallel` element runs tasks wrapped inside the element concurrently. 

When running tasks in parallel, each task requires the `client` option to make sure clients inside your benchmark are reserved for that task. Otherwise, when the client option is specified inside the parallel element without a connection to the task, the benchmark will use that number of clients for all tasks.

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

The `parallel` element supports all `schedule` parameters, in addition to the following:

`tasks` | Yes | Array | Defines a list of tasks that should be executed concurrently. 
`completed-by` | No | String | Allows you to define the name of one task in the tasks list, or the value `any`. If `completed-by` is set to the name of one of the tasks in the list, the parallel task structure is considered complete once that specific task has been completed. If `completed-by` is set to `any`, the parallel task structure is considered complete when any of the tasks in the list has been completed. If `completed-by` is not explicitly defined, the parallel task structure is considered complete as soon as all of the tasks in the list has been completed.

### Iteration-based options

Iteration-based options determine the number of times an operation should run. It can also define the number of iterative runs when tasks are run in [parallel](#parallel-tasks). To configure an iteration-based schedule, use the following options.


Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`iterations` | No | Integer | The number of times a client should execute an operation. These are included in the measured results. Default is 1. 
`warmup-iterations` | No | Integer | The number of times a client should execute an operation for the purpose of warming up the benchmark candidate. Warmup iterations will not show up in the measurement results. Default is 0.

### Time-based options

Time-based options determines the duration of time, in seconds, that operations should run for. This is ideal for batch-style operations which may require an additional warmup period.

To configure a time-based schedule, use the following options.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`time-period` | No | Integer | The time period in seconds that OpenSearch Benchmark considers for measurement. This is not required for bulk-indexing as OpenSearch Benchmark will bulk index all documents and naturally measure all samples after the `warmup-time-period` specified.
`ramp-up-time-period` | No | Integer | The time period in seconds in which OpenSearch Benchmark gradually adds clients and reaches the total number of clients specified for the operation. 
`warmup-time-period` | No | Integer | The time period in seconds to warmup the benchmark candidate. All response data captured during the warmup period will not appear in the measurement results.


