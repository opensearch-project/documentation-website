---
layout: default
title: Discovery and gateway settings
parent: Configuring OpenSearch
nav_order: 30
---

# Discovery and gateway settings

The following are settings related to discovery and local gateway.

To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## Discovery settings

The discovery process is used when a cluster is formed. It consists of discovering nodes and electing a cluster manager node. OpenSearch supports the following discovery settings:

- `discovery.seed_hosts` (Static, list): The list of hosts that perform discovery when a node is started. The default list of hosts is `["127.0.0.1", "[::1]"]`.

- `discovery.seed_providers` (Static, list): Specifies the types of seed hosts provider to use for obtaining seed node addresses in order to start the discovery process.

- `discovery.type` (Static, string): By default, OpenSearch forms a multi-node cluster. Set `discovery.type` to `single-node` to form a single-node cluster.

- `cluster.initial_cluster_manager_nodes` (Static, list): A list of cluster-manager-eligible nodes used to bootstrap the cluster. 

## Gateway settings

The local gateway stores cluster state and shard data that is used when a cluster is restarted. OpenSearch supports the following local gateway settings:

- `gateway.recover_after_nodes` (Static, integer): After a full cluster restart, the number of nodes that must join the cluster before recovery can begin.

- `gateway.recover_after_data_nodes` (Static, integer): After a full cluster restart, the number of data nodes that must join the cluster before recovery can begin.

- `gateway.expected_data_nodes` (Static, integer): The number of data nodes expected to exist in the cluster. After the expected number of nodes joins the cluster, recovery of local shards can begin.

- `gateway.recover_after_time` (Static, time value): The amount of time to wait before starting recovery if the number of data nodes is less than the expected number of data nodes.
