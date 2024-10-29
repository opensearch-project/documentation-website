---
layout: default
title: Command flags
nav_order: 51
parent: Command reference
redirect_from: 
  - /benchmark/commands/command-flags/
grand_parent: OpenSearch Benchmark Reference
---

# Command flags
OpenSearch Benchmark uses command line flags to change Benchmark's behavior. Not all flags can be used with each command. To find out which flags are supported by a specific command, enter `opensearch-benchmark <command> --h`.

All command flags are added to a command using the following syntax:

```bash
opensearch-benchmark <command> --<command-flag>
```

Flags that accept comma-separated values, such `--telemetry`, can also accept a JSON array. This can be defined by passing a file path ending in `.json` or inline as a JSON string.

- Comma-seperated values: `opensearch-benchmark ... --test-procedure="ingest-only,search-aggregations"`
- JSON file: `opensearch-benchmark ... --workload-params="params.json"`
- JSON inline string: `opensearch-benchmark  ... --telemetry='["node-stats", "recovery-stats"]'`

<!-- vale off -->
## workload-path
<!-- vale on -->

This can be either a directory that contains a `workload.json` file or a `.json` file with an arbitrary name that contains a workload specification. `--workload-path` and `--workload-repository` as well as `--workload` are mutually exclusive.

<!-- vale off -->
## workload-repositor
<!-- vale on -->

This defines the repository from which OpenSearch Benchmark loads workloads. `--workload-path` and `--workload-repository` as well as `--workload` are mutually exclusive.

<!-- vale off -->
## workload-revision
<!-- vale on -->

Defines a specific revision from the workload source tree that OpenSearch Benchmark should use. 

<!-- vale off -->
## workload
<!-- vale on -->

Defines the workload to use based on the workload's name. You can find a list of preloaded workloads using `opensearch-benchmark list workloads`. `--workload-path` and `--workload-repository` as well as `--workload` are mutually exclusive.

<!-- vale off -->
## workload-params
<!-- vale on -->

Defines which variables to inject into the workload. Variables injected must be available in the workload. To see which parameters are valid in the official workloads, select the workload from [the workloads repository](https://github.com/opensearch-project/opensearch-benchmark-workloads).

<!-- vale off -->
## test-procedure
<!-- vale on -->

Defines the test procedures to use with each workload. You can find a list of test procedures that the workload supports by specifying the workload in the `info` command, for example, `opensearch-benchmark info --workload=<workload_name>`. To look up information on a specific test procedure, use the command `opensearch-benchmark info --workload=<workload_name> --test-procedure=<test-procedure>`.

<!-- vale off -->
## test-execution-id
<!-- vale on -->

Defines a unique ID for the test run.

<!-- vale off -->
## include-tasks
<!-- vale on -->

Defines a comma-separated list of test procedure tasks to run. By default, all tasks listed in a test procedure array are run.

Tests are executed in the order they are defined in `test-procedure`---not in the order they are defined in the command. 

All task filters are case sensitive.

<!-- vale off -->
## exclude-tasks
<!-- vale on -->

Defines a comma-separated list of test procedure tasks not to run.

<!-- vale off -->
## baseline
<!-- vale on -->

The baseline TestExecution ID used to compare the contender TestExecution.  

<!-- vale off -->
## contender
<!-- vale on -->

The TestExecution ID for the contender being compared to the baseline. 

<!-- vale off -->
## results-format
<!-- vale on -->

Defines the output format for the command line results, either `markdown` or `csv`. Default is `markdown`.


<!-- vale off -->
## results-number-align
<!-- vale on -->

Defines the column number alignment for when the `compare` command outputs results. Default is `right`.

<!-- vale off -->
## results-file
<!-- vale on -->

When provided a file path, writes the compare results to the file indicated in the path. 

<!-- vale off -->
## show-in-results
<!-- vale on -->

Determines whether or not to include the comparison in the results file. 

<!-- vale off -->
## provision-config-repository
<!-- vale on -->

Defines the repository from which OpenSearch Benchmark loads `provision-configs` and `provision-config-instances`. 

<!-- vale off -->
## provision-config-revision
<!-- vale on -->

Defines the specific Git revision in the `provision-config` that OpenSearch Benchmark should use. 

<!-- vale off -->
## provision-config-path
<!-- vale on -->

Defines the path to the `--provision-config-instance` and any OpenSearch plugin configurations to use. 

<!-- vale off -->
## distribution-version
<!-- vale on -->

Downloads the specified OpenSearch distribution based on version number. For a list of released OpenSearch versions, see [Version history](https://opensearch.org/docs/version-history/).

<!-- vale off -->
## distribution-repository
<!-- vale on -->

Defines the repository from which the OpenSearch distribution should be downloaded. Default is `release`.

<!-- vale off -->
## provision-config-instance
<!-- vale on -->

Defines the `--provision-config-instance` to use. You can view possible configuration instances by using the command `opensearch-benchmark list provision-config-instances`.  

<!-- vale off -->
## provision-config-instance-params
<!-- vale on -->

A comma-separated list of key-value pairs injected verbatim as variables for the `provision-config-instance`.

<!-- vale off -->
## target-hosts
<!-- vale on -->

Defines a comma-separated list of host-port pairs that should be targeted if using the pipeline `benchmark-only`. Default is `localhost:9200`. 

<!-- vale off -->
## target-os
<!-- vale on -->

The target operating system (OS) for which the OpenSearch artifact should be downloaded. Default is the current OS.

<!-- vale off -->
## target-arch
<!-- vale on -->

The name of the CPU architecture for which an artifact should be downloaded. 

<!-- vale off -->
## revision
<!-- vale on -->

Defines the current source code revision to use for running a benchmark test. Default is `current`.

This command flag can use the following options:

   - `current`: Uses the source tree's current revision based on your OpenSearch distribution. 
   - `latest`: Fetches the latest revision from the main branch of the source tree. 

You can also use a timestamp or commit ID from the source tree. When using a timestamp, specify `@ts`, where "ts" is a valid ISO 8601 timestamp, for example, `@2013-07-27T10:37:00Z`. 

<!-- vale off -->
## opensearch-plugins
<!-- vale on -->

Defines which [OpenSearch plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/) to install. By default, no plugins are installed.

<!-- vale off -->
## plugin-params
<!-- vale on -->

Defines a comma-separated list of key-value pairs that are injected verbatim into all plugins as variables.

<!-- vale off -->
## runtime-jdk
<!-- vale on -->

The major version of JDK to use. 


<!-- vale off -->
## client-options
<!-- vale on -->

Defines a comma-separated list of clients to use. All options are passed to the OpenSearch Python client. Default is `timeout:60`.

<!-- vale off -->
## load-worker-coordinator-hosts
<!-- vale on -->

Defines a comma-separated list of hosts that coordinate loads. Default is `localhost`.

<!-- vale off -->
## enable-worker-coordinator-profiling
<!-- vale on -->

Enables a performance analysis of OpenSearch Benchmark's worker coordinator. Default is `false`.

<!-- vale off -->
## pipeline
<!-- vale on -->

The `--pipeline` option selects a pipeline to run. You can find a list of pipelines supported by OpenSearch Benchmark by running `opensearch-benchmark list pipelines`.

<!-- vale off -->
## telemetry
<!-- vale on -->

Enables the provided telemetry devices when the devices are provided using a comma-separated list. You can find a list of possible telemetry devices by using `opensearch-benchmark list telemetry`.

<!-- vale off -->
## telemetry-params
<!-- vale on -->

Enables setting parameters for telemetry devices. Accepts a list of comma-separated key-value pairs, each of which are delimited by a colon or a JSON file name. 

<!-- vale off -->
## on-error
<!-- vale on -->

Controls how OpenSearch Benchmark responds to errors. Default is `continue`. 

You can use the following options with this command flag:

- `continue`: Continues to run the test despite the error.
- `abort`: Aborts the test when an error occurs.

<!-- vale off -->
## preserve-install
<!-- vale on -->

Keeps the Benchmark candidate and its index. Default is `false`.

<!-- vale off -->
## kill-running-processes
<!-- vale on -->

When set to `true`, stops any OpenSearch Benchmark processes currently running and allows Benchmark to continue to run. Default is `false`. 

<!-- vale off -->
## chart-spec-path
<!-- vale on -->

Sets the path to the JSON files containing chart specifications that can be used to generate charts.

<!-- vale off -->
## chart-type
<!-- vale on -->

Generates the indicated chart type, either `time-series` or `bar`. Default is `time-series`.

<!-- vale off -->
## output-path
<!-- vale on -->

The name and path used for the chart's output. Default is `stdout`. 

<!-- vale off -->
## limit
<!-- vale on -->

Limits the number of search results for recent test runs. Default is `10`.

<!-- vale off -->
## latency-percentiles
<!-- vale on -->

Specifies a comma-separated list of latency percentiles to report after the workload runs. Accepts `ints` or `floats` with values between `0` and `100` inclusive. Does not accept `min`, `median`, `mean`, or `max`. Default is `50,90,99,99.9,99.99,100`. 

<!-- vale off -->
## throughput-percentiles
<!-- vale on -->

Specifies a list of throughput percentiles to report after the workload runs, in addition to min/median/mean/max which is always displayed. Like `--latency-percentiles`, the setting accepts `ints` or `floats` with values between `0` and `100` inclusive. Does not accept `min`, `median`, `mean`, or `max`. Default is `None`. 

<!-- vale off -->
## randomization-enabled
<!-- vale on -->

Enables randomization of values in range queries, where the values are drawn from standard value functions registered with `register_standard_value_source` in the workload's `workload.py` file. 

A standard value function is a no-argument function that generates a random pair of values for a certain field, in a dict with keys `"gte"`, `"lte"`, and optionally `"format"`. 

If this argument is `True` but a search operation does not have a registered standard value function, OpenSearch Benchmark raises a `SystemSetupError`. 

Default is `False`. 

<!-- vale off -->
## randomization-repeat-frequency
<!-- vale on -->

Sets what fraction of randomized query values can be repeated. Takes values between `0.0` and `1.0`. Default is `0.3`. This setting does not work when `--randomization-enabled` is not used. 

<!-- vale off -->
## randomization-n
<!-- vale on -->

Sets how many distinct repeatable pair values are generated for each operation when randomization is used. Default is `5000`. This setting does not work when `--randomization-enabled` is not used. 

<!-- vale off -->
## test-iterations
<!-- vale on -->

Specifies the number of times to run the workload. Default is `1`.

<!-- vale off -->
## aggregate
<!-- vale on -->

Determines whether OpenSearch Benchmark should aggregate the results of multiple test executions.

When set to `true`, OpenSearch Benchmark will combine the results from all iterations into a single aggregated report. When set to `false`, results from each iteration will be reported separately. 

Default is `true`.

<!-- vale off -->
## sleep-timer
<!-- vale on -->

Specifies the number of seconds to sleep before starting the next test execution. Default is `5`.


<!-- vale off -->
## cancel-on-error
<!-- vale on -->

When set, this flag instructs OpenSearch Benchmark to stop executing tests if an error occurs in one of the test iterations. Default is `false` (not set).

