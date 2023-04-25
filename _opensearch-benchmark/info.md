---
layout: default
title: info
nav_order: 54
has_children: false
---

# info

usage: opensearch-benchmark info [-h] [--workload-repository WORKLOAD_REPOSITORY | --workload-path WORKLOAD_PATH] [--workload-revision WORKLOAD_REVISION] [--workload WORKLOAD] [--workload-params WORKLOAD_PARAMS]
                                 [--test-procedure TEST_PROCEDURE] [--include-tasks INCLUDE_TASKS | --exclude-tasks EXCLUDE_TASKS] [--quiet] [--offline]

optional arguments:
  -h, --help            show this help message and exit
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
  --include-tasks INCLUDE_TASKS
                        Defines a comma-separated list of tasks to run. By default all tasks of a test_procedure are run.
  --exclude-tasks EXCLUDE_TASKS
                        Defines a comma-separated list of tasks not to run. By default all tasks of a test_procedure are run.
  --quiet               Suppress as much as output as possible (default: false).
  --offline             Assume that Benchmark has no connection to the Internet (default: false).