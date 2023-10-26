---
layout: default
title: execute-test
nav_order: 65
parent: Command reference
grand_parent: OpenSearch Benchmark Reference
redirect_from: /benchmark/commands/execute-test/
---

# execute-test

Whether you're using the included [OpenSearch Benchmark workloads](https://github.com/opensearch-project/opensearch-benchmark-workloads) or a [custom workload]({{site.url}}{{site.baseurl}}/benchmark/creating-custom-workloads/), use the `execute-test` command to gather data about the performance of your OpenSearch cluster according to the selected workload. 

## Usage

The following example executes a test using the `geonames` workload in test mode: 

```
opensearch-benchmark execute-test --workload=geonames --test-mode 
```

After the test runs, OpenSearch Benchmark responds with a summary of the benchmark metrics: 

```
------------------------------------------------------
    _______             __   _____
   / ____(_)___  ____ _/ /  / ___/_________  ________
  / /_  / / __ \/ __ `/ /   \__ \/ ___/ __ \/ ___/ _ \
 / __/ / / / / / /_/ / /   ___/ / /__/ /_/ / /  /  __/
/_/   /_/_/ /_/\__,_/_/   /____/\___/\____/_/   \___/
------------------------------------------------------

|                         Metric |                 Task |     Value |   Unit |
|-------------------------------:|---------------------:|----------:|-------:|
|            Total indexing time |                      |   28.0997 |    min |
|               Total merge time |                      |   6.84378 |    min |
|             Total refresh time |                      |   3.06045 |    min |
|               Total flush time |                      |  0.106517 |    min |
|      Total merge throttle time |                      |   1.28193 |    min |
|               Median CPU usage |                      |     471.6 |      % |
|             Total Young Gen GC |                      |    16.237 |      s |
|               Total Old Gen GC |                      |     1.796 |      s |
|                     Index size |                      |   2.60124 |     GB |
|                  Total written |                      |   11.8144 |     GB |
|         Heap used for segments |                      |   14.7326 |     MB |
|       Heap used for doc values |                      |  0.115917 |     MB |
|            Heap used for terms |                      |   13.3203 |     MB |
|            Heap used for norms |                      | 0.0734253 |     MB |
|           Heap used for points |                      |    0.5793 |     MB |
|    Heap used for stored fields |                      |  0.643608 |     MB |
|                  Segment count |                      |        97 |        |
|                 Min Throughput |         index-append |   31925.2 | docs/s |
|              Median Throughput |         index-append |   39137.5 | docs/s |
|                 Max Throughput |         index-append |   39633.6 | docs/s |
|      50.0th percentile latency |         index-append |   872.513 |     ms |
|      90.0th percentile latency |         index-append |   1457.13 |     ms |
|      99.0th percentile latency |         index-append |   1874.89 |     ms |
|       100th percentile latency |         index-append |   2711.71 |     ms |
| 50.0th percentile service time |         index-append |   872.513 |     ms |
| 90.0th percentile service time |         index-append |   1457.13 |     ms |
| 99.0th percentile service time |         index-append |   1874.89 |     ms |
|  100th percentile service time |         index-append |   2711.71 |     ms |
|                           ...  |                  ... |       ... |    ... |
|                           ...  |                  ... |       ... |    ... |
|                 Min Throughput |     painless_dynamic |   2.53292 |  ops/s |
|              Median Throughput |     painless_dynamic |   2.53813 |  ops/s |
|                 Max Throughput |     painless_dynamic |   2.54401 |  ops/s |
|      50.0th percentile latency |     painless_dynamic |    172208 |     ms |
|      90.0th percentile latency |     painless_dynamic |    310401 |     ms |
|      99.0th percentile latency |     painless_dynamic |    341341 |     ms |
|      99.9th percentile latency |     painless_dynamic |    344404 |     ms |
|       100th percentile latency |     painless_dynamic |    344754 |     ms |
| 50.0th percentile service time |     painless_dynamic |    393.02 |     ms |
| 90.0th percentile service time |     painless_dynamic |   407.579 |     ms |
| 99.0th percentile service time |     painless_dynamic |   430.806 |     ms |
| 99.9th percentile service time |     painless_dynamic |   457.352 |     ms |
|  100th percentile service time |     painless_dynamic |   459.474 |     ms |

----------------------------------
[INFO] SUCCESS (took 2634 seconds)
----------------------------------
```

## Options

Use the following options to customize the `execute-test` command for your use case. Options in this section are categorized by their use case. 

## General settings

The following options shape how each test runs and how results appear: 

- `--test-mode`: Runs the given workload in test mode, which is useful when checking a workload for errors.
- `--user-tag`: Defines user-specific key-value pairs to be used in metric record as meta information, for example, `intention:baseline-ticket-12345`.
- `--results-format`: Defines the output format for the command line results, either `markdown` or `csv`. Default is `markdown`.
- `--results-number-align`: Defines the column number alignment for when the `compare` command outputs results. Default is `right`. 
- `--results-file`: When provided a file path, writes the compare results to the file indicated in the path.
- `--show-in-results`: Determines whether or not to include the comparison in the results file. 


### Distributions

The following options set which version of OpenSearch and the OpenSearch plugins the benchmark test uses: 

- `--distribution-version`: Downloads the specified OpenSearch distribution based on version number. For a list of released OpenSearch versions, see [Version history](https://opensearch.org/docs/version-history/). 
- `--distribution-repository`: Defines the repository from where the OpenSearch distribution should be downloaded. Default is `release`.
- `--revision`: Defines the current source code revision to use for running a benchmark test. Default is `current`.
   - `current`: Uses the source tree's current revision based on your OpenSearch distribution. 
   - `latest`: Fetches the latest revision from the main branch of the source tree. 
   - You can also use a timestamp or commit ID from the source tree. When using a timestamp, specify `@ts`, where "ts" is a valid ISO 8601 timestamp, for example, `@2013-07-27T10:37:00Z`. 
-  `--opensearch-plugins`: Defines which [OpenSearch plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/) to install. By default, no plugins are installed.
- `--plugin-params:` Defines a comma-separated list of key:value pairs that are injected verbatim into all plugins as variables.
- `--runtime-jdk`: The major version of JDK to use. 
- `--client-options`: Defines a comma-separated list of clients to use. All options are passed to the OpenSearch Python client. Default is `timeout:60`.

### Cluster

The following option relates to the target cluster of the benchmark.

- `--target-hosts`: Defines a comma-separated list of host-port pairs that should be targeted if using the pipeline `benchmark-only`. Default is `localhost:9200`. 


### Distributed workload generation

The following options help those who want to use multiple hosts to generate load to the benchmark cluster: 

- `--load-worker-coordinator-hosts`: Defines a comma-separated list of hosts that coordinate loads. Default is `localhost`.
- `--enable-worker-coordinator-profiling`: Enables an analysis of the performance of OpenSearch Benchmark's worker coordinator. Default is `false`.

### Provisioning

The following options help customize how OpenSearch Benchmark provisions OpenSearch and workloads: 

- `--provision-config-repository`: Defines the repository from which OpenSearch Benchmark loads `provision-configs` and `provision-config-instances`. 
- `--provision-config-path`: Defines the path to the `--provision-config-instance` and any OpenSearch plugin configurations to use.
- `--provision-config-revision`: Defines a specific Git revision in the `provision-config` that OpenSearch Benchmark should use.
- `--provision-config-instance`: Defines the `--provision-config-instance` to use. You can see possible configuration instances using the command `opensearch-benchmark list provision-config-instances`. 
- `--provision-config-instance-params`: A comma-separated list of key-value pairs injected verbatim as variables for the `provision-config-instance`. 


### Workload

The following options determine which workload is used to run the test:

- `--workload-repository`: Defines the repository from which OpenSearch Benchmark loads workloads. 
- `--workload-path`: Defines the path to a downloaded or custom workload.
- `--workload-revision`: Defines a specific revision from the workload source tree that OpenSearch Benchmark should use.
- `--workload`: Defines the workload to use based on the workload's name. You can find a list of preloaded workloads using `opensearch-benchmark list workloads`.

### Test procedures

The following options define what test procedures the test uses and which operations are contained inside the procedure: 

- `--test-execution-id`: Defines a unique ID for this test run.
- `--test-procedure`: Defines a test procedure to use. You can find a list of test procedures using `opensearch-benchmark list test-procedures`.
- `--include-tasks`: Defines a comma-separated list of test procedure tasks to run. By default, all tasks listed in a test procedure array are run.
- `--exclude-tasks`: Defines a comma-separated list of test procedure tasks not to run.
- `--enable-assertions`: Enables assertion checks for tasks. Default is `false`. 

### Pipelines

The `--pipeline` option selects a pipeline to run. You can find a list of pipelines supported by OpenSearch Benchmark by running `opensearch-benchmark list pipelines`.


### Telemetry

The following options enable telemetry devices on OpenSearch Benchmark: 
 
- `--telemetry`: Enables the provided telemetry devices when the devices are provided using a comma-separated list. You can find a list of possible telemetry devices by using `opensearch-benchmark list telemetry`.
- `--telemetry-params`: Defines a comma-separated list of key-value pairs that are injected verbatim into the telemetry devices as parameters.


### Errors

The following options set how OpenSearch Benchmark handles errors when running tests: 

- `--on-error`: Controls how OpenSearch Benchmark responds to errors. Default is `continue`. 
  - `continue`: Continues to run the test despite the error.
  - `abort`: Aborts the test when an error occurs.
- `--preserve-install`: Keeps the Benchmark candidate and its index. Default is `false`.
- `--kill-running-processes`: When set to `true`, stops any OpenSearch Benchmark processes currently running and allows OpenSearch Benchmark to continue to run. Default is `false`. 
