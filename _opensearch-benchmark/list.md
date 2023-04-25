---
layout: default
title: list
nav_order: 52
has_children: false
---

# list

usage: opensearch-benchmark list [-h] [--limit LIMIT] [--workload-repository WORKLOAD_REPOSITORY | --workload-path WORKLOAD_PATH] [--workload-revision WORKLOAD_REVISION] [--distribution-version DISTRIBUTION_VERSION]
                                 [--provision-config-path PROVISION_CONFIG_PATH] [--provision-config-repository PROVISION_CONFIG_REPOSITORY] [--provision-config-revision PROVISION_CONFIG_REVISION] [--quiet] [--offline]
                                 configuration

positional arguments:
  configuration         The configuration for which Benchmark should show the available options. Possible values are: telemetry, workloads, pipelines, test_executions, provision_config_instances, opensearch-plugins

optional arguments:
  -h, --help            show this help message and exit
  --limit LIMIT         Limit the number of search results for recent test_executions (default: 10).
  --workload-repository WORKLOAD_REPOSITORY
                        Define the repository from where Benchmark will load workloads (default: default).
  --workload-path WORKLOAD_PATH
                        Define the path to a workload.
  --workload-revision WORKLOAD_REVISION
                        Define a specific revision in the workload repository that Benchmark should use.
  --distribution-version DISTRIBUTION_VERSION
                        Define the version of the OpenSearch distribution to download. Check https://opensearch.org/docs/version-history/ for released versions.
  --provision-config-path PROVISION_CONFIG_PATH
                        Define the path to the provision_config_instance and plugin configurations to use.
  --provision-config-repository PROVISION_CONFIG_REPOSITORY
                        Define repository from where Benchmark will load provision_configs and provision_config_instances (default: default).
  --provision-config-revision PROVISION_CONFIG_REVISION
                        Define a specific revision in the provision_config repository that Benchmark should use.
  --quiet               Suppress as much as output as possible (default: false).
  --offline             Assume that Benchmark has no connection to the Internet (default: false).
