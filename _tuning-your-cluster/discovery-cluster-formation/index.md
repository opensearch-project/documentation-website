---
layout: default
title: Discovery and cluster formation
nav_order: 5
has_children: true
permalink: /tuning-your-cluster/discovery-cluster-formation/
---

# Discovery and cluster formation

Discovery and cluster formation are fundamental processes in OpenSearch that enable nodes to locate each other, elect a cluster manager, establish a functioning cluster, and maintain coordination as the cluster state evolves. Understanding these mechanisms is essential for configuring reliable, well-performing OpenSearch clusters.

When you start an OpenSearch cluster, several coordinated processes work together:

- **Node discovery**: Nodes locate and identify other nodes in the network that should be part of the cluster.
- **Cluster manager election**: Eligible nodes participate in selecting a cluster manager node through a consensus-based voting process.
- **Cluster formation**: Once a cluster manager is elected, the cluster state is established and nodes join the cluster.
- **State management**: The cluster manager maintains and distributes the authoritative cluster state to all nodes.
- **Health monitoring**: Nodes continuously monitor each other's health and detect failures.

All inter-node communication for these processes uses OpenSearch's [transport layer]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/network-settings/), ensuring secure and efficient data exchange.

## Discovery process

Discovery is how nodes find other nodes when starting up or when connection to the cluster manager is lost. This process involves:

1. **Seed hosts**: A configurable list of known node addresses that serve as entry points for discovery.
2. **Host providers**: Mechanisms for supplying seed host information, including static configuration and dynamic cloud-based discovery.
3. **Node identification**: Verification that discovered nodes are eligible to participate in the cluster.

## Cluster manager election

OpenSearch uses a sophisticated voting mechanism to ensure exactly one cluster manager exists at any time:

- **Voting configuration**: The set of cluster-manager-eligible nodes that participate in elections.
- **Quorum requirements**: Elections require a majority of voting nodes to prevent split-brain scenarios.
- **Automatic reconfiguration**: The voting configuration adjusts as nodes join and leave the cluster.

## Cluster state management

The elected cluster manager is responsible for:

- Maintaining the definitive cluster state (for example, node membership, index metadata, and shard allocation).
- Publishing state updates to all nodes in the cluster.
- Coordinating shard allocation and rebalancing.
- Managing cluster-wide settings and policies.

## Core components

The following topics provide detailed guidance on each stage of discovery and cluster formation:

[Node discovery and seed hosts]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/discovery/): Learn how OpenSearch nodes discover each other through seed host providers and configure static or dynamic host discovery.

[Voting and quorum]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/voting-quorums/): Understand how OpenSearch uses quorum-based voting to elect cluster managers and prevent split-brain conditions.

[Voting configuration management]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/voting-configuration/): Learn how OpenSearch automatically manages voting configurations and handles bootstrap requirements for new clusters.

[Cluster bootstrapping]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/bootstrapping/): Configure initial cluster startup and learn the requirements for safely bringing up a new cluster.

[Discovery and cluster formation settings]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/settings/): Complete reference for all configuration options that control discovery and cluster formation behavior, including fault detection and cluster state publishing settings.

## Monitoring discovery and cluster formation

You can use these API commands to monitor cluster formation and health.

### Check cluster health

```json
GET /_cluster/health
```
{% include copy-curl.html %}

Returns the health status of the cluster, including the number of nodes and shard information.

### View cluster nodes

```json
GET /_cat/nodes
```
{% include copy-curl.html %}

Returns information about nodes in the cluster, including roles and which node is the cluster manager.

### Check voting configuration

```json
GET /_cluster/state?filter_path=metadata.cluster_coordination.last_committed_config
```
{% include copy-curl.html %}

Returns the current voting configuration, showing which nodes participate in cluster manager elections.

## Next steps

- Start with [Node discovery and seed hosts]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/discovery/) to understand the foundation of cluster formation
- Review [Discovery and cluster formation settings]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/settings/) for configuration options
- See [Creating a cluster]({{site.url}}{{site.baseurl}}/tuning-your-cluster/) for hands-on cluster setup guidance