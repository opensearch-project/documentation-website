---
layout: default
title: Voting configuration management
parent: Discovery and cluster formation
nav_order: 30
---

# Voting configuration management

Every OpenSearch cluster maintains a voting configuration, which defines the set of cluster-manager-eligible nodes whose responses count when making critical cluster decisions. Understanding how OpenSearch manages voting configurations is essential for maintaining cluster stability and availability.

The _voting configuration_ is the authoritative list of cluster-manager-eligible nodes that participate in:

- **Cluster manager elections** - Choosing which node leads the cluster.
- **Cluster state updates** - Approving changes to cluster metadata and shard allocation.
- **Critical cluster decisions** - Any operation requiring cluster-wide consensus.

Decisions are made only after a majority (more than half) of the nodes in the voting configuration respond positively.

## Voting configuration compared to cluster membership

The voting configuration typically matches all cluster-manager-eligible nodes that are part of the cluster, but there are times when they differ. During normal operations in a stable cluster, all healthy cluster-manager-eligible nodes participate in voting. However, differences can occur during node transitions (for example, when a node is joining or leaving), in failure scenarios where some eligible nodes are unreachable, or when administrators manually exclude nodes for maintenance.

## Automatic voting configuration management

OpenSearch automatically adjusts the voting configuration to maintain resilience as the cluster changes. When a new cluster-manager-eligible node joins, the cluster manager evaluates the state, adds the new node to the voting configuration, and publishes the updated state to all nodes. Larger configurations provide better fault tolerance, so OpenSearch prefers to include all available eligible nodes.

Node removal behavior depends on the `cluster.auto_shrink_voting_configuration` setting, which is enabled by default. When it's enabled, OpenSearch automatically removes departed nodes while ensuring at least three voting nodes remain. This enhances availability and allows the cluster to continue operating after node failures. When it's disabled (false), you must manually remove departed nodes using the voting exclusions API, giving administrators precise control over when and how the configuration changes.

When possible, OpenSearch replaces departed voting nodes with other eligible nodes instead of reducing the configuration size. This replacement strategy maintains the same number of voting nodes and preserves fault tolerance without disruption.

## Viewing the current voting configuration

Use the cluster state API to inspect the current voting configuration:

```bash
curl -X GET "localhost:9200/_cluster/state?filter_path=metadata.cluster_coordination.last_committed_config"
```
{% include copy.html %}

Example response:

```json
{
  "metadata": {
    "cluster_coordination": {
      "last_committed_config": [
        "KfEEGG7_SsKZVFqI4ko2FA"
      ]
    }
  }
}
```

The `last_committed_config` array contains the node IDs of all nodes in the current voting configuration.

## Even numbers of cluster-manager-eligible nodes

OpenSearch handles even numbers of cluster-manager-eligible nodes intelligently to prevent split-brain scenarios. A split-brain scenario occurs in a distributed system when a network failure divides the cluster into two or more isolated groups of nodes that can't communicate with each other. With an even number of voting nodes, a network partition could split the cluster into two equal halves, leaving neither side with a majority to elect a cluster manager. For example, in a four-node cluster, decisions require three votes. If the network splits into two and two, neither side can reach three votes, and the cluster becomes unavailable.

To prevent this, OpenSearch automatically excludes one node from the voting configuration, creating an odd number of voting nodes (for example, three out of four eligible). This adjustment ensures that one partition can maintain a majority and continue operating while the other cannot. As a result, OpenSearch improves resilience against split-brain conditions without reducing overall fault tolerance.

## Bootstrap configuration for new clusters

When starting a brand-new cluster for the very first time, OpenSearch requires an initial bootstrap configuration to determine which nodes should participate in the first cluster manager election. This bootstrap process establishes the initial voting configuration that the cluster will use.

The bootstrap configuration is only required for new clusters and is ignored once the cluster has been successfully started. After the initial bootstrap, OpenSearch automatically manages the voting configuration as described in the sections above.

For complete details on configuring cluster bootstrapping, including setup procedures, requirements, troubleshooting, and examples, see [Cluster bootstrapping]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/bootstrapping/).

## Monitoring voting configuration changes

To track voting configuration changes and check cluster formation status, use the monitoring commands detailed in the [Discovery and cluster formation]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/#monitoring-discovery-and-cluster-formation) overview.

## Related documentation

- [Voting and quorums]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/voting-quorums/): Understanding quorum-based decision making
- [Discovery and cluster formation settings]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/settings/): Configure voting behavior
- [Cluster bootstrapping]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/bootstrapping/): Initial cluster startup procedures