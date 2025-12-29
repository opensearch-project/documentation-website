---
layout: default
title: Voting and quorum
parent: Discovery and cluster formation
nav_order: 20
---

# Voting and quorum

OpenSearch uses a sophisticated quorum-based decision-making system to ensure cluster reliability and prevent split-brain scenarios. Understanding how voting and quorum work is essential for maintaining a stable, fault-tolerant OpenSearch cluster.

Two fundamental tasks require coordination among cluster-manager-eligible nodes:

1. **Electing a cluster manager** -- Choosing which node will coordinate the cluster.
2. **Updating cluster state** -- Making changes to cluster metadata, shard allocation, and configuration.

OpenSearch achieves robust coordination by requiring a _quorum_ (majority) of cluster-manager-eligible nodes to agree on these decisions. This approach provides several key benefits:

- **Fault tolerance**: Some nodes can fail without stopping cluster operations.
- **Split-brain prevention**: The cluster cannot make conflicting decisions when partitioned.
- **Consistency**: All decisions are made by a clear majority of nodes.

A decision succeeds only when **more than half** of the nodes in the voting configuration respond positively. This ensures that even if the cluster becomes partitioned, only one partition can have a majority and continue making decisions.

## Voting configuration

The _voting configuration_ is the set of cluster-manager-eligible nodes whose responses are counted when making cluster decisions. OpenSearch automatically manages this configuration as nodes join and leave the cluster.

OpenSearch implements dynamic voting configuration management:

- As nodes join or leave, OpenSearch updates the voting configuration to maintain optimal fault tolerance.
- The voting configuration typically includes all cluster-manager-eligible nodes currently in the cluster.
- During node transitions, the voting configuration may temporarily differ from the current node set.

The voting configuration follows these rules:

- Decisions require more than half of voting nodes to respond.
- OpenSearch adds nodes to the voting configuration when they join.
- Nodes are removed from the voting configuration when they leave gracefully.
- No two partitions can both have a voting majority.

## Fault tolerance guidelines

To maintain cluster availability, follow these critical guidelines.

Never stop half or more of the nodes in the voting configuration at the same time. This is the most important rule for cluster availability.
{: .important}

The number of cluster-manager-eligible nodes determines your fault tolerance:

- 3 nodes: Can tolerate 1 node failure (2 nodes maintain majority).
- 4 nodes: Can tolerate 1 node failure (3 nodes maintain majority).
- 5 nodes: Can tolerate 2 node failures (3 nodes maintain majority).
- 6 nodes: Can tolerate 2 node failures (4 nodes maintain majority).
- 2 nodes: Can tolerate 0 node failures (both must remain available).
- 1 node: Can tolerate 0 node failures (single point of failure).

## Cluster manager elections

OpenSearch uses an election process to select the cluster manager node, both at startup and when the current cluster manager fails.

The election process is as follows:

1. Election is triggered by one of the following events:
   - Cluster startup (no current cluster manager)
   - Current cluster manager failure or disconnection
   - Network partition resolution

2. Any cluster-manager-eligible node can start an election.

3. Elections are randomly scheduled on each node to reduce conflicts.

4. A node becomes cluster manager only with majority support from the voting configuration.

5. If elections fail (because of timing conflicts), nodes retry with exponential backoff.

Election behavior is controlled by the `cluster.election.*` settings. For more information, see [Discovery and cluster formation settings]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/settings/).

## Cluster maintenance operations

Understanding quorum requirements helps you perform maintenance safely.

### Rolling restarts

OpenSearch can remain available during rolling restarts:

- Restart nodes one at a time: Restart nodes individually, waiting for each to rejoin.
- Maintain a majority: Ensure a majority of voting nodes remain available.
- Wait for stabilization: Allow the voting configuration to update after each node rejoins.

### Planned maintenance

For maintenance requiring multiple nodes:

1. Check the voting configuration: Verify current voting nodes using the Cluster API.
2. Plan shutdown order: Ensure a majority remains available throughout maintenance.
3. Wait between changes: Allow time for voting configuration updates.
4. Monitor cluster health: Verify that the cluster remains green during maintenance.

### Emergency procedures

If you must stop multiple nodes simultaneously:

- Use voting exclusions: Temporarily exclude nodes from voting before shutdown.
- Restore carefully: Bring nodes back online in the correct order.
- Clear exclusions: Remove voting exclusions once nodes are stable.

## Monitoring voting configurations

To monitor voting configurations, cluster health, and cluster manager elections, use the monitoring commands detailed in [Discovery and cluster formation]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/#monitoring-discovery-and-cluster-formation).

## Cluster state publishing

Once a cluster manager is elected, it becomes responsible for distributing cluster state updates to all nodes. Understanding how state publishing works helps you configure appropriate timeouts and monitor cluster coordination.

The cluster manager is the only node that can make changes to the cluster state. It processes cluster state updates one batch at a time using a two-phase commit process:

1. Phase 1: Broadcasting and acknowledgment
      1. Cluster manager computes changes and creates updated cluster state.
      2. Broadcasts updated state to all nodes in the cluster.
      3. Nodes acknowledge receipt but do not yet apply the new state.
      4. Cluster manager waits for majority of cluster-manager-eligible nodes to acknowledge.
2. Phase 2: Commitment and application
      1. Cluster manager declares state committed once majority acknowledges.
      2. Broadcasts commit message instructing nodes to apply the new state.
      3. Nodes apply the updated state and send second acknowledgment.
      4. Cluster manager waits for all nodes to confirm application.

### Publishing timeouts and failure handling

The cluster manager allows a limited time for each state update to complete, controlled by `cluster.publish.timeout` (default: `30s`), which is measured from when publication begins. If this timeout is reached before the change is committed, the cluster state update is rejected, the cluster manager steps down after considering itself failed, and a new cluster manager election begins. If the commitment succeeds before the timeout, the change is considered successful, and the cluster manager waits for any remaining acknowledgments or until the timeout expires before proceeding to the next update.

After a successful commitment, some nodes might be slow to apply the update. These lagging nodes are given additional time, controlled by `cluster.follower_lag.timeout` (default: `90s`). If a node fails to apply the update within this time, it is considered failed, removed from the cluster, and the cluster continues operating without it.

### State publishing optimizations

OpenSearch typically optimizes cluster state publishing by sending **differential updates (diffs)** instead of full state copies. This approach reduces network bandwidth and publication time because only the changed portions are transmitted to nodes that already hold the current state. For example, when index mappings are updated, only the mapping changes are distributed rather than the entire state.

In some cases, OpenSearch falls back to publishing the **full cluster state**. This happens when nodes need complete information, such as when a node rejoins the cluster, when a new node joins for the first time, or when a node's state is outdated and must be synchronized with the current cluster view.


### Monitoring state publishing

To monitor cluster state publishing, use the monitoring commands detailed in [Discovery and cluster formation]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/#monitoring-discovery-and-cluster-formation).


### OpenSearch as a peer-to-peer system

Understanding OpenSearch's architecture helps explain state publishing importance:

- High-throughput APIs (Index, Delete, Search) communicate directly between nodes.
- The cluster manager role is limited to maintaining global cluster state and coordinating shard allocation.
- State changes (node joins/leaves, shard reassignment) require cluster-wide coordination.
- State publishing ensures that all nodes have a consistent view of cluster topology.

This design keeps the cluster manager from becoming a bottleneck for data operations while ensuring consistent cluster coordination.

## Related documentation

- [Discovery and cluster formation settings]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/settings/): Configuring voting and election behavior
- [Node discovery and seed hosts]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/discovery/): How nodes find each other
- [Creating a cluster]({{site.url}}{{site.baseurl}}/tuning-your-cluster/): Step-by-step cluster setup guide