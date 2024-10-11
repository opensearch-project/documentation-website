---
layout: default
title: aggregate
nav_order: 85
parent: Command reference
grand_parent: OpenSearch Benchmark Reference
redirect_from: 
  - /benchmark/commands/aggregate/
---

# Aggregation

OpenSearch Benchmark now supports result aggregation, allowing users to combine multiple test executions into a single aggregated result. This feature enhances the benchmarking workflow by providing a more streamlined way to conduct and analyze multiple test runs.

## Auto-aggregation

OpenSearch Benchmark allows users to run multiple iterations of benchmark tests and automatically aggregate the results, all within a single command. New flags have been added to the existing `execute` command to support this functionality.

### Usage

To use auto-aggregation, you can use the `execute` command with the new flags:

```bash
opensearch-benchmark execute --test-iterations=<number> --aggregate=true [other_options]
```

For example:
```
opensearch-benchmark execute --test-iterations=2 --aggregate=true --workload=geonames --target-hosts=127.0.0.1:9200
```

This command will run the geonames workload twice and aggregate the results.

### New Flags

The following new flags have been added to support auto-aggregation:

- `--test-iterations`: Specifies the number of times to run the workload (default: 1).
- `--aggregate`: Determines whether to aggregate the results of multiple test executions (default: true).
- `--sleep-timer`: Specifies the number of seconds to sleep before starting the next test execution (default: 5).
- `--cancel-on-error`: When set, stops executing tests if an error occurs in one of the test iterations (default: false).
All existing arguments and flags for test execution remain compatible with these new options, allowing users to customize their benchmark runs as needed. For instance:
```
opensearch-benchmark execute --test-iterations=2 --aggregate=true --workload=geonames --target-hosts=127.0.0.1:9200 --test-mode --kill-running-processes
```

## Manual Aggregation

In addition to auto-aggregation, OpenSearch Benchmark also allows users to manually aggregate results from multiple test executions that have already been run.

### Usage

To aggregate multiple test executions manually, you can use the aggregate command:
```
opensearch-benchmark aggregate --test-executions=<test_execution_id1>,<test_execution_id2>,...
```

Sample Output
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

The results will be aggregated into one test execution and stored under the ID shown in the output.

Additional Options

- `--test-execution-id`: Define a unique ID for the aggregated test execution.
- `--results-file`: Write the aggregated results to the provided file.
- `--workload-repository`: Define the repository from where OpenSearch Benchmark will load workloads (default: default).

