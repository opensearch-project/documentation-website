---
layout: default
title: Command flags
nav_order: 51
parent: Command reference
---

OpenSearch Benchmark (OSB) uses command line flags to change OpenSearch Benchmark's behavior. Not all flags can be uses with each command. To find out which flags are supported by a specific command, enter `opensearch-benchmark <command> --h`.

All command flags are added to a command using the following syntax:

```bash
opensearch-benchmark <command> --<command-flag>
```

Flags that accept comma-seperated values such `--telemetry` can also accept a JSON array. This can be defined by passing in a file path ending in `.json` or inline as a JSON string.

- Comma-seperated values: `--test-procedure="4gheap,trial-license"`
- JSON file: `cat test-procedure.json`
- JSON inline string: `opensearch-benchmark  ... --telemetry='["node-stats", "recovery-stats"]'`

## workload-path

Can be either a directory that contains a `workload.json` file or a `.json` file with an arbitrary name that contains a track specification. `--workload-path` and `--workload-repository` as well as `--workload` are mutually exclusive.

## workload-repository

Defines the repository from which OpenSearch Benchmark loads workloads. `--workload-path` and `--workload-repository` as well as `--workload` are mutually exclusive.

## workload-revision

Defines a specific revision from the workload source tree that OpenSearch Benchmark should use. 

## workload

Defines the workload to use based on the workload's name. You can find a list of preloaded workloads using `opensearch-benchmark list workloads`. `--workload-path` and `--workload-repository` as well as `--workload` are mutually exclusive.

## test-procedure

Defines a test procedure to use. You can find a list of test procedures using `opensearch-benchmark list test-procedures`.

## test-execution-id

Defines a unique ID for this test run.

## include-tasks

Defines a comma-separated list of test procedure tasks to run. By default, all tasks listed in a test procedure array are run.

Tests are executed in the order they are defined in `test-procedure`, not in the order they are defined in the command. 

All task filters are case sensitive

## exclude-tasks

Defines a comma-separated list of test procedure tasks not to run.

## baseline

The baseline TestExecution ID used to compare the contender TestExecution.  

## contender

The TestExecution ID for the contender being compared to the baseline. 

## results-format

Defines the output format for the command line results, either `markdown` or `csv`. Default is `markdown`.

## results-number-align

Defines the column number alignment for when the `compare` command outputs results. Default is `right`.

## results-file

When provided a file path, writes the compare results to the file indicated in the path. 

## show-in-results

Determines whether or not to include the comparison in the results file. 

## provision-config-repository

Defines the repository from which OpenSearch Benchmark loads `provision-configs` and `provision-config-instances`. 

## provision-config-revision

Defines a specific Git revision in the `provision-config` that OpenSearch Benchmark should use. 

## provision-config-path

Defines the path to the `--provision-config-instance` and any OpenSearch plugin configurations to use. 

## distribution-version

Downloads the specified OpenSearch distribution based on version number. For a list of released OpenSearch versions, see [Version history](https://opensearch.org/docs/version-history/).

## distribution-repository

Defines the repository from where the OpenSearch distribution should be downloaded. Default is `release`.

## provision-config-instance

Defines the `--provision-config-instance` to use. You can view possible configuration instances using the command `opensearch-benchmark list provision-config-instances`.  

## provision-config-instance-params

A comma-separated list of key-value pairs injected verbatim as variables for the `provision-config-instance`.

## target-hosts

Defines a comma-separated list of host-port pairs that should be targeted if using the pipeline `benchmark-only`. Default is `localhost:9200`. 

## target-os

The target operating system (OS) for which the OpenSearch artifact should be downloaded. Default is the current OS.

## target-arch

The name of the CPU architecture for which an artifact should be downloaded. 

## revision

Defines the current source code revision to use for running a benchmark test. Default is `current`.

This command flag can use the following options:

   - `current`: Uses the source tree's current revision based on your OpenSearch distribution. 
   - `latest`: Fetches the latest revision from the main branch of the source tree. 
   - You can also use a timestamp or commit ID from the source tree. When using a timestamp, specify `@ts`, where "ts" is a valid ISO 8601 timestamp, for example, `@2013-07-27T10:37:00Z`. 

## opensearch-plugins

Defines which [OpenSearch plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/) to install. By default, no plugins are installed.

## plugin-params

Defines a comma-separated list of key:value pairs that are injected verbatim into all plugins as variables.

## runtime-jdk

The major version of JDK to use. 

## client-options

Defines a comma-separated list of clients to use. All options are passed to the OpenSearch Python client. Default is `timeout:60`.

## load-worker-coordinator-hosts

Defines a comma-separated list of hosts that coordinate loads. Default is `localhost`.

## enable-worker-coordinator-profiling

Enables an analysis of the performance of OpenSearch Benchmark's worker coordinator. Default is `false`.

## pipeline

The `--pipeline` option selects a pipeline to run. You can find a list of pipelines supported by OpenSearch Benchmark by running `opensearch-benchmark list pipelines`.

## telemetry

Enables the provided telemetry devices when the devices are provided using a comma-separated list. You can find a list of possible telemetry devices by using `opensearch-benchmark list telemetry`.

## telemetry-params

Enables the provided telemetry devices when the devices are provided using a comma-separated list. You can find a list of possible telemetry devices by using `opensearch-benchmark list telemetry`.

## on-error

Controls how OpenSearch Benchmark responds to errors. Default is `continue`. 

You can use the following options with this command flag:

- `continue`: Continues to run the test despite the error.
- `abort`: Aborts the test when an error occurs.

## preserve-install

Keeps the Benchmark candidate and its index. Default is `false`.

## kill-running-processes

When set to `true`, stops any OpenSearch Benchmark processes currently running and allows OpenSearch Benchmark to continue to run. Default is `false`. 


## chart-spec-path

Sets the path to the JSON files containing chart specifications that can be used to generate charts.

## chart-type

Generates the indicated chart type, either `time-series` or `bar`. Default is `time-series`.

## output-path

The path and name where the chart outputs. Default is `stdout`. 

## limit

Limits the number of search results for recent test runs. Default is `10`.