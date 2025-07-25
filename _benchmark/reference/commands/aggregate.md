---
layout: default
title: aggregate
nav_order: 85
parent: Command reference
grand_parent: OpenSearch Benchmark Reference
redirect_from: 
  - /benchmark/commands/aggregate/
canonical_url: https://docs.opensearch.org/latest/benchmark/reference/commands/aggregate/
---

# aggregate

The `aggregate` command combines multiple test executions into a single aggregated result, providing a more streamlined way to conduct and analyze multiple test runs. There are two methods of aggregation:

- [Auto-aggregation](#auto-aggregation)
- [Manual aggregation](#manual-aggregation)

## Auto-aggregation

The auto-aggregation method runs multiple iterations of benchmark tests and automatically aggregates the results, all within a single command. You can use the flags outlined in this with the `execute` command.

### Usage

The following example runs the `geonames` workload and aggregates the results twice: 

```bash
opensearch-benchmark execute --test-iterations=2 --aggregate=true --workload=geonames --target-hosts=127.0.0.1:9200
```
{% include copy-curl.html %}

### Auto-aggregation flags

The following new flags can be used to customize the auto-aggregation method:

- `--test-iterations`: Specifies the number of times to run the workload (default is `1`).
- `--aggregate`: Determines whether to aggregate the results of multiple test executions (default is `true`).
- `--sleep-timer`: Specifies the number of seconds to sleep before starting the next test execution (default is `5`).
- `--cancel-on-error`: When set, stops executing tests if an error occurs in one of the test iterations (default is `false`).

## Manual aggregation

You can use the `aggregate` command to manually aggregate results from multiple test executions.

### Usage

To aggregate multiple test executions manually, specify the `test_execution_ids` you would like to aggregate, as shown in the following example:

```bash
opensearch-benchmark aggregate --test-executions=<test_execution_id1>,<test_execution_id2>,...
```
{% include copy-curl.html %}

### Response

OpenSearch Benchmark responds with the following:

```
   ____                  _____                      __       ____                  __                         __
  / __ \____  ___  ____ / ___/___  ____ ___________/ /_     / __ )___  ____  _____/ /_  ____ ___  ____ ______/ /__
 / / / / __ \/ _ \/ __ \\__ \/ _ \/ __ `/ ___/ ___/ __ \   / __  / _ \/ __ \/ ___/ __ \/ __ `__ \/ __ `/ ___/ //_/
/ /_/ / /_/ /  __/ / / /__/ /  __/ /_/ / /  / /__/ / / /  / /_/ /  __/ / / / /__/ / / / / / / / / /_/ / /  / ,<
\____/ .___/\___/_/ /_/____/\___/\__,_/_/   \___/_/ /_/  /_____/\___/_/ /_/\___/_/ /_/_/ /_/ /_/\__,_/_/  /_/|_|
    /_/

Aggregate test execution ID:  aggregate_results_geonames_9aafcfb8-d3b7-4583-864e-4598b5886c4f

-------------------------------
[INFO] SUCCESS (took 1 seconds)
-------------------------------
```

The results will be aggregated into one test execution and stored under the ID shown in the output:

- `--test-execution-id`: Define a unique ID for the aggregated test execution.
- `--results-file`: Write the aggregated results to the provided file.
- `--workload-repository`: Define the repository from which OpenSearch Benchmark will load workloads (default is `default`).

