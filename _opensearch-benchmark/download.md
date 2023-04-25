---
layout: default
title: download
nav_order: 62
has_children: false
---

# download

usage: opensearch-benchmark download [-h] [--provision-config-repository PROVISION_CONFIG_REPOSITORY] [--provision-config-revision PROVISION_CONFIG_REVISION] [--provision-config-path PROVISION_CONFIG_PATH]
                                     [--distribution-version DISTRIBUTION_VERSION] [--distribution-repository DISTRIBUTION_REPOSITORY] [--provision-config-instance PROVISION_CONFIG_INSTANCE]
                                     [--provision-config-instance-params PROVISION_CONFIG_INSTANCE_PARAMS] [--target-os TARGET_OS] [--target-arch TARGET_ARCH] [--quiet] [--offline]

optional arguments:
  -h, --help            show this help message and exit
  --provision-config-repository PROVISION_CONFIG_REPOSITORY
                        Define the repository from where Benchmark will load provision_configs and provision_config_instances (default: default).
  --provision-config-revision PROVISION_CONFIG_REVISION
                        Define a specific revision in the provision_config repository that Benchmark should use.
  --provision-config-path PROVISION_CONFIG_PATH
                        Define the path to the provision_config_instance and plugin configurations to use.
  --distribution-version DISTRIBUTION_VERSION
                        Define the version of the OpenSearch distribution to download. Check https://opensearch.org/docs/version-history/ for released versions.
  --distribution-repository DISTRIBUTION_REPOSITORY
                        Define the repository from where the OpenSearch distribution should be downloaded (default: release).
  --provision-config-instance PROVISION_CONFIG_INSTANCE
                        Define the provision_config_instance to use. List possible provision_config_instances with `opensearch-benchmark list provision_config_instances` (default: defaults).
  --provision-config-instance-params PROVISION_CONFIG_INSTANCE_PARAMS
                        Define a comma-separated list of key:value pairs that are injected verbatim as variables for the provision_config_instance.
  --target-os TARGET_OS
                        The name of the target operating system for which an artifact should be downloaded (default: current OS)
  --target-arch TARGET_ARCH
                        The name of the CPU architecture for which an artifact should be downloaded (default: current architecture)
  --quiet               Suppress as much as output as possible (default: false).
  --offline             Assume that Benchmark has no connection to the Internet (default: false).