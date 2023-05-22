---
layout: default
title: Running a benchmark
nav_order: 50
has_children: false
---

# Running a benchmark

The primary use for OpenSearch Benchmark is to gather data about the performance of an OpenSearch cluster. You can either use preconfigured [OpenSearch Benchmark workloads](https://github.com/opensearch-project/opensearch-benchmark-workloads) or you can [create a custom workload]({{site.url}}{{site.baseurl}}/tuning-your-cluster/opensearch-benchmark/create-workload/) where you define what data to use and which OpenSearch operations the benchmark should test.

Use the `execute_test` argument&#8212;sometimes referred to as a "subcommand"&#8212;to run a benchmark. You must provide, at minimum, 

```bash
opensearch-benchmark execute_test 
```

execute_test

```
usage: opensearch-benchmark execute_test [-h] [--distribution-version DISTRIBUTION_VERSION] [--provision-config-path PROVISION_CONFIG_PATH] [--provision-config-repository PROVISION_CONFIG_REPOSITORY]
                                         [--provision-config-revision PROVISION_CONFIG_REVISION] [--test-execution-id TEST_EXECUTION_ID] [--pipeline PIPELINE] [--revision REVISION]
                                         [--workload-repository WORKLOAD_REPOSITORY | --workload-path WORKLOAD_PATH] [--workload-revision WORKLOAD_REVISION] [--workload WORKLOAD] [--workload-params WORKLOAD_PARAMS]
                                         [--test-procedure TEST_PROCEDURE] [--provision-config-instance PROVISION_CONFIG_INSTANCE] [--provision-config-instance-params PROVISION_CONFIG_INSTANCE_PARAMS] [--runtime-jdk RUNTIME_JDK]
                                         [--opensearch-plugins OPENSEARCH_PLUGINS] [--plugin-params PLUGIN_PARAMS] [--target-hosts TARGET_HOSTS] [--load-worker-coordinator-hosts LOAD_WORKER_COORDINATOR_HOSTS]
                                         [--client-options CLIENT_OPTIONS] [--on-error {continue,abort}] [--telemetry TELEMETRY] [--telemetry-params TELEMETRY_PARAMS] [--distribution-repository DISTRIBUTION_REPOSITORY]
                                         [--include-tasks INCLUDE_TASKS | --exclude-tasks EXCLUDE_TASKS] [--user-tag USER_TAG] [--results-format {markdown,csv}] [--results-numbers-align {right,center,left,decimal}]
                                         [--show-in-results {available,all-percentiles,all}] [--results-file RESULTS_FILE] [--preserve-install] [--test-mode] [--enable-worker-coordinator-profiling] [--enable-assertions]
                                         [--kill-running-processes] [--quiet] [--offline]

optional arguments:
  -h, --help            show this help message and exit
  --distribution-version DISTRIBUTION_VERSION
                        Define the version of the OpenSearch distribution to download. Check https://opensearch.org/docs/version-history/ for released versions.
  --provision-config-path PROVISION_CONFIG_PATH
                        Define the path to the provision_config_instance and plugin configurations to use.
  --provision-config-repository PROVISION_CONFIG_REPOSITORY
                        Define repository from where Benchmark will load provision_configs and provision_config_instances (default: default).
  --provision-config-revision PROVISION_CONFIG_REVISION
                        Define a specific revision in the provision_config repository that Benchmark should use.
  --test-execution-id TEST_EXECUTION_ID
                        Define a unique id for this test_execution.
  --pipeline PIPELINE   Select the pipeline to run.
  --revision REVISION   Define the source code revision for building the benchmark candidate. 'current' uses the source tree as is, 'latest' fetches the latest version on main. It is also possible to specify a commit id or a timestamp. The
                        timestamp must be specified as: "@ts" where "ts" must be a valid ISO 8601 timestamp, e.g. "@2013-07-27T10:37:00Z" (default: current).
  --workload-repository WORKLOAD_REPOSITORY
                        Define the repository from where Benchmark will load workloads (default: default).
  --workload-path WORKLOAD_PATH
                        Define the path to a workload.
  --workload-revision WORKLOAD_REVISION
                        Define a specific revision in the workload repository that Benchmark should use.
  --workload WORKLOAD   Define the workload to use. List possible workloads with `opensearch-benchmark list workloads`.
  --workload-params WORKLOAD_PARAMS
                        Define a comma-separated list of key:value pairs that are injected verbatim to the workload as variables.
  --test-procedure TEST_PROCEDURE
                        Define the test_procedure to use. List possible test_procedures for workloads with `opensearch-benchmark list workloads`.
  --provision-config-instance PROVISION_CONFIG_INSTANCE
                        Define the provision_config_instance to use. List possible provision_config_instances with `opensearch-benchmark list provision_config_instances` (default: defaults).
  --provision-config-instance-params PROVISION_CONFIG_INSTANCE_PARAMS
                        Define a comma-separated list of key:value pairs that are injected verbatim as variables for the provision_config_instance.
  --runtime-jdk RUNTIME_JDK
                        The major version of the runtime JDK to use.
  --opensearch-plugins OPENSEARCH_PLUGINS
                        Define the OpenSearch plugins to install. (default: install no plugins).
  --plugin-params PLUGIN_PARAMS
                        Define a comma-separated list of key:value pairs that are injected verbatim to all plugins as variables.
  --target-hosts TARGET_HOSTS
                        Define a comma-separated list of host:port pairs which should be targeted if using the pipeline 'benchmark-only' (default: localhost:9200).
  --load-worker-coordinator-hosts LOAD_WORKER_COORDINATOR_HOSTS
                        Define a comma-separated list of hosts which should generate load (default: localhost).
  --client-options CLIENT_OPTIONS
                        Define a comma-separated list of client options to use. The options will be passed to the OpenSearch Python client (default: timeout:60).
  --on-error {continue,abort}
                        Controls how Benchmark behaves on response errors (default: continue).
  --telemetry TELEMETRY
                        Enable the provided telemetry devices, provided as a comma-separated list. List possible telemetry devices with `opensearch-benchmark list telemetry`.
  --telemetry-params TELEMETRY_PARAMS
                        Define a comma-separated list of key:value pairs that are injected verbatim to the telemetry devices as parameters.
  --distribution-repository DISTRIBUTION_REPOSITORY
                        Define the repository from where the OpenSearch distribution should be downloaded (default: release).
  --include-tasks INCLUDE_TASKS
                        Defines a comma-separated list of tasks to run. By default all tasks of a test_procedure are run.
  --exclude-tasks EXCLUDE_TASKS
                        Defines a comma-separated list of tasks not to run. By default all tasks of a test_procedure are run.
  --user-tag USER_TAG   Define a user-specific key-value pair (separated by ':'). It is added to each metric record as meta info. Example: intention:baseline-ticket-12345
  --results-format {markdown,csv}
                        Define the output format for the command line results (default: markdown).
  --results-numbers-align {right,center,left,decimal}
                        Define the output column number alignment for the command line results (default: right).
  --show-in-results {available,all-percentiles,all}
                        Define which values are shown in the summary publish (default: available).
  --results-file RESULTS_FILE
                        Write the command line results also to the provided file.
  --preserve-install    Keep the benchmark candidate and its index. (default: false).
  --test-mode           Runs the given workload in 'test mode'. Meant to check a workload for errors but not for real benchmarks (default: false).
  --enable-worker-coordinator-profiling
                        Enables a profiler for analyzing the performance of calls in Benchmark's worker coordinator (default: false).
  --enable-assertions   Enables assertion checks for tasks (default: false).
  --kill-running-processes
                        If any processes is running, it is going to kill them and allow Benchmark to continue to run.
  --quiet               Suppress as much as output as possible (default: false).
  --offline             Assume that Benchmark has no connection to the Internet (default: false).

```