---
layout: default
title: install
nav_order: 64
has_children: false
---

# install

usage: opensearch-benchmark install [-h] [--revision REVISION] [--provision-config-repository PROVISION_CONFIG_REPOSITORY] [--provision-config-revision PROVISION_CONFIG_REVISION] [--provision-config-path PROVISION_CONFIG_PATH]
                                    [--runtime-jdk RUNTIME_JDK] [--distribution-repository DISTRIBUTION_REPOSITORY] [--distribution-version DISTRIBUTION_VERSION] [--provision-config-instance PROVISION_CONFIG_INSTANCE]
                                    [--provision-config-instance-params PROVISION_CONFIG_INSTANCE_PARAMS] [--opensearch-plugins OPENSEARCH_PLUGINS] [--plugin-params PLUGIN_PARAMS] [--network-host NETWORK_HOST] [--http-port HTTP_PORT]
                                    [--node-name NODE_NAME] [--master-nodes MASTER_NODES] [--seed-hosts SEED_HOSTS] [--quiet] [--offline]

optional arguments:
  -h, --help            show this help message and exit
  --revision REVISION   Define the source code revision for building the benchmark candidate. 'current' uses the source tree as is, 'latest' fetches the latest version on main. It is also possible to specify a commit id or a timestamp. The
                        timestamp must be specified as: "@ts" where "ts" must be a valid ISO 8601 timestamp, e.g. "@2013-07-27T10:37:00Z" (default: current).
  --provision-config-repository PROVISION_CONFIG_REPOSITORY
                        Define the repository from where Benchmark will load provision_configs and provision_config_instances (default: default).
  --provision-config-revision PROVISION_CONFIG_REVISION
                        Define a specific revision in the provision_config repository that Benchmark should use.
  --provision-config-path PROVISION_CONFIG_PATH
                        Define the path to the provision_config_instance and plugin configurations to use.
  --runtime-jdk RUNTIME_JDK
                        The major version of the runtime JDK to use during installation.
  --distribution-repository DISTRIBUTION_REPOSITORY
                        Define the repository from where the OpenSearch distribution should be downloaded (default: release).
  --distribution-version DISTRIBUTION_VERSION
                        Define the version of the OpenSearch distribution to download. Check https://opensearch.org/docs/version-history/ for released versions.
  --provision-config-instance PROVISION_CONFIG_INSTANCE
                        Define the provision_config_instance to use. List possible provision_config_instances with `opensearch-benchmark list provision_config_instances` (default: defaults).
  --provision-config-instance-params PROVISION_CONFIG_INSTANCE_PARAMS
                        Define a comma-separated list of key:value pairs that are injected verbatim as variables for the provision_config_instance.
  --opensearch-plugins OPENSEARCH_PLUGINS
                        Define the OpenSearch plugins to install. (default: install no plugins).
  --plugin-params PLUGIN_PARAMS
                        Define a comma-separated list of key:value pairs that are injected verbatim to all plugins as variables.
  --network-host NETWORK_HOST
                        The IP address to bind to and publish
  --http-port HTTP_PORT
                        The port to expose for HTTP traffic
  --node-name NODE_NAME
                        The name of this OpenSearch node
  --master-nodes MASTER_NODES
                        A comma-separated list of the initial master node names
  --seed-hosts SEED_HOSTS
                        A comma-separated list of the initial seed host IPs
  --quiet               Suppress as much as output as possible (default: false).
  --offline             Assume that Benchmark has no connection to the Internet (default: false).