---
layout: default
title: Discovery and cluster formation settings
parent: Discovery and cluster formation
nav_order: 100
---

# Discovery and cluster formation settings

This page provides a comprehensive reference for all settings that control discovery and cluster formation behavior in OpenSearch. These settings determine how nodes find each other, elect a cluster manager, and maintain cluster coordination.

## Core discovery settings

The following settings control the fundamental discovery process:

- `discovery.seed_hosts` (Static, list): Provides a list of addresses for cluster-manager-eligible nodes in the cluster. This setting is essential for nodes to find each other during cluster formation. Each address can be specified as `host:port` or just `host`. The `host` can be a hostname (resolved via DNS - if multiple IPs are resolved, OpenSearch attempts to connect to all), IPv4 address, or IPv6 address (must be enclosed in square brackets). If no port is specified, OpenSearch determines the port by checking `transport.profiles.default.port`, then `transport.port`. If neither is configured, the default port `9300` is used. Default is `["127.0.0.1", "[::1]"]`.

- `discovery.seed_providers` (Static, list): Specifies which seed hosts providers to use for obtaining seed node addresses during discovery. Available providers are `settings` (uses addresses from the `discovery.seed_hosts` setting) and `file` (reads addresses from the `unicast_hosts.txt` file). You can specify multiple providers to combine discovery methods. Default is `["settings"]`.

- `discovery.type` (Static, string): Specifies whether OpenSearch should form a multiple-node cluster or operate as a single node. When set to `single-node`, OpenSearch forms a single-node cluster and suppresses certain timeouts. This setting is useful for development and testing environments. Valid values are `multi-node` (default) and `single-node`.

- `cluster.initial_cluster_manager_nodes` (Static, list): Sets the initial cluster-manager-eligible nodes for bootstrapping a brand-new cluster. This setting is required when bootstrapping a cluster for the first time and should contain the node names (as defined by `node.name`) of the initial cluster-manager-eligible nodes. This list should be empty for nodes joining an existing cluster. Default is `[]` (empty).

## Discovery process settings

These settings control timing and behavior during the discovery process:

- `discovery.find_peers_interval` (Static, time unit): Sets how long a node waits before attempting another discovery round when the initial attempt fails. Default is `1s`.

- `discovery.cluster_formation_warning_timeout` (Static, time unit): Sets how long a node attempts to form a cluster before logging a warning message. The warning will start with "cluster manager not discovered" and describe the current discovery state. Default is `10s`.

### DNS resolution settings

The following settings control DNS lookup behavior for seed hosts:

- `discovery.seed_resolver.max_concurrent_resolvers` (Static, integer): Specifies how many concurrent DNS lookups to perform when resolving seed node addresses. Default is `10`.

- `discovery.seed_resolver.timeout` (Static, time unit): Specifies the timeout for each DNS lookup when resolving seed node addresses. Default is `5s`.

### Connection settings

The following settings control connection attempts during discovery:

- `discovery.probe.connect_timeout` (Static, time unit): Sets the timeout when attempting to connect to each address during discovery. Default is `3s`.

- `discovery.probe.handshake_timeout` (Static, time unit): Sets the timeout when attempting to identify a remote node via handshake during discovery. Default is `1s`.

- `discovery.request_peers_timeout` (Static, time unit): Sets how long a node waits for peer information requests during discovery before considering the request failed. Default is `3s`.

## Cluster manager election settings

These settings control the cluster manager election process:

- `cluster.election.back_off_time` (Static, time unit): Sets the incremental delay added after each election failure (linear backoff). Each failed election increases the wait time by this amount before the next attempt. Default is `100ms`. **Warning**: Changing this from the default may prevent cluster manager election.

- `cluster.election.duration` (Static, time unit): Sets the maximum duration allowed for each election attempt before considering it failed and scheduling a retry. Default is `500ms`. **Warning**: Changing this from the default may prevent cluster manager election.

- `cluster.election.initial_timeout` (Static, time unit): Sets the initial upper bound for how long a node waits before attempting its first election, either at startup or after the current cluster manager fails. Default is `100ms`. **Warning**: Changing this from the default may prevent cluster manager election.

- `cluster.election.max_timeout` (Static, time unit): Sets the maximum upper bound for election delays to prevent excessively sparse elections during long network partitions. Default is `10s`. **Warning**: Changing this from the default may prevent cluster manager election.

## Voting configuration settings

The following settings control the voting mechanism for cluster manager elections:

- `cluster.auto_shrink_voting_configuration` (Dynamic, boolean): Controls whether the voting configuration automatically removes departed nodes, provided at least 3 nodes remain. When set to `false`, you must manually remove departed nodes using the voting configuration exclusions API. Default is `true`.

- `cluster.max_voting_config_exclusions` (Dynamic, integer): Sets the maximum number of voting configuration exclusions allowed simultaneously. This is used during cluster manager node maintenance operations. Default is `10`.

## Fault detection settings

OpenSearch continuously monitors cluster health through two types of health checks:

- [Follower checks](#follower-checks) (sent by the cluster manager to non-cluster-manager nodes)
- [Leader checks](#leader-checks) (sent by non-cluster-manager nodes to the cluster manager)

OpenSearch allows occasional check failures and uses the following guidelines for taking action:

- Transient issues (single check failures) are ignored; multiple consecutive failures are required for action.
- Network disconnects trigger immediate response.
- All timeouts and retry counts are configurable.

### Follower checks 

The elected cluster manager periodically checks each node in the cluster:

1. Sends periodic health check requests to all nodes.
2. Waits for responses within the configured timeout.
3. Tracks consecutive check failures for each node.
4. Removes nodes that fail consecutive checks (based on retry count).

If the cluster manager detects a node has disconnected (network-level disconnect), it bypasses the timeout and retry settings and immediately attempts to remove the node from the cluster.

### Leader checks

Each non-cluster-manager node periodically checks the health of the elected cluster manager:

1. Send periodic health check requests to the cluster manager.
2. Wait for responses within the configured timeout.
3. Track consecutive check failures for the cluster manager.
4. Start new cluster manager election if consecutive checks fail.

If a node detects the cluster manager has disconnected, it bypasses timeout and retry settings and immediately restarts its discovery phase to find or elect a new cluster manager.

The following settings control health monitoring and failure detection.

### Follower check settings

These settings control how the cluster manager monitors other nodes:

- `cluster.fault_detection.follower_check.interval` (Static, time unit): Sets the interval between follower checks from the cluster manager to other nodes. Default is `1s`. **Warning**: Changing this may cause cluster instability.

- `cluster.fault_detection.follower_check.timeout` (Static, time unit): Sets how long the cluster manager waits for a response to follower checks before considering the check failed. Default is `10s`. **Warning**: Changing this may cause cluster instability.

- `cluster.fault_detection.follower_check.retry_count` (Static, integer): Sets how many consecutive follower check failures must occur before the cluster manager considers a node faulty and removes it from the cluster. Default is `3`. **Warning**: Changing this may cause cluster instability.

### Leader check settings

These settings control how non-cluster-manager nodes monitor the cluster manager:

- `cluster.fault_detection.leader_check.interval` (Static, time unit): Sets the interval between leader checks from nodes to the cluster manager. Default is `1s`. **Warning**: Changing this may cause cluster instability.

- `cluster.fault_detection.leader_check.timeout` (Static, time unit): Sets how long nodes wait for a response to leader checks before considering the cluster manager failed. Default is `10s`. **Warning**: Changing this may cause cluster instability.

- `cluster.fault_detection.leader_check.retry_count` (Static, integer): Sets how many consecutive leader check failures must occur before a node considers the cluster manager faulty and attempts to find or elect a new cluster manager. Default is `3`. **Warning**: Changing this may cause cluster instability.

## Cluster state publishing settings

The following settings control how cluster state updates are distributed:

- `cluster.publish.timeout` (Static, time unit): Sets how long the cluster manager waits for cluster state updates to be published to all nodes before timing out. This setting is ignored when `discovery.type` is set to `single-node`. Default is `30s`.

- `cluster.publish.info_timeout` (Static, time unit): Sets how long the cluster manager waits before logging a message about slow-responding nodes during cluster state publishing. Default is `10s`.

- `cluster.follower_lag.timeout` (Static, time unit): Sets how long the cluster manager waits for acknowledgments of cluster state updates from lagging nodes. Nodes that don't respond within this time are considered failed and removed from the cluster. Default is `90s`.

## Cluster coordination settings

The following settings control cluster joining and coordination:

- `cluster.join.timeout` (Static, time unit): Sets how long a node waits after sending a join request before considering it failed and retrying. This setting is ignored when `discovery.type` is set to `single-node`. Default is `60s`.

- `cluster.no_cluster_manager_block` (Dynamic, string): Specifies which operations are rejected when there is no active cluster manager. Valid values are `all` (all operations including read/write and cluster state APIs are rejected) and `write` (only write operations are rejected; read operations succeed based on the last known cluster state but may return stale data). This setting doesn't affect node-based APIs (cluster stats, node info, node stats). For full cluster functionality, an active cluster manager is required. Default is `write`.

## Configuration examples

The following are configuration examples for discovery.

### Basic production cluster

```yaml
# Cluster identification
cluster.name: production-cluster

# Discovery configuration
discovery.seed_hosts:
  - 10.0.1.10:9300
  - 10.0.1.11:9300
  - 10.0.1.12:9300

# Initial cluster manager nodes (only for bootstrapping)
cluster.initial_cluster_manager_nodes:
  - cluster-manager-1
  - cluster-manager-2
  - cluster-manager-3

# Voting configuration
cluster.auto_shrink_voting_configuration: true
cluster.max_voting_config_exclusions: 10
```
{% include copy.html %}

### Development single-node setup

```yaml
# Single-node development cluster
cluster.name: dev-cluster
discovery.type: single-node

# Optional: Disable cluster formation timeouts for faster startup
cluster.publish.timeout: 5s
cluster.join.timeout: 10s
```
{% include copy.html %}

### High-availability production cluster

```yaml
# Production cluster with dedicated cluster manager nodes
cluster.name: production-cluster

# Discovery configuration
discovery.seed_hosts:
  - cluster-manager-1.example.com:9300
  - cluster-manager-2.example.com:9300
  - cluster-manager-3.example.com:9300

# Bootstrap configuration (only for initial setup)
cluster.initial_cluster_manager_nodes:
  - cluster-manager-1
  - cluster-manager-2
  - cluster-manager-3

# Production-optimized settings
cluster.auto_shrink_voting_configuration: true
cluster.max_voting_config_exclusions: 3
cluster.publish.timeout: 60s
cluster.join.timeout: 120s
```
{% include copy.html %}

## Related documentation

- [Node discovery and seed hosts]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/discovery/): Learn about discovery mechanisms and seed host providers
- [Creating a cluster]({{site.url}}{{site.baseurl}}/tuning-your-cluster/): Step-by-step cluster setup guide
- [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/): General configuration guidance