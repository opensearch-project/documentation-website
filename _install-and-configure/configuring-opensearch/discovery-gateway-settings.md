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

The discovery process is used when a cluster is formed. It consists of discovering nodes and electing a cluster manager node.

### Static discovery settings

The following **static** discovery settings must be configured before a cluster starts:

- `discovery.seed_hosts` (Static, list): Provides a list of the addresses of the cluster manager-eligible nodes in the cluster. Each address has the format `host:port` or `host`. If a hostname resolves to multiple addresses via DNS, OpenSearch uses all of them. This setting is essential for nodes to find each other during cluster formation. Default is `["127.0.0.1", "[::1]"]`.

- `discovery.seed_providers` (Static, list): Specifies which types of seed hosts provider to use to obtain the addresses of the seed nodes used to start the discovery process. By default, this uses the settings-based seed hosts provider which obtains seed node addresses from the `discovery.seed_hosts` setting.

- `discovery.type` (Static, string): Specifies whether OpenSearch should form a multiple-node cluster or operate as a single node. When set to `single-node`, OpenSearch forms a single-node cluster and suppresses certain timeouts. This setting is useful for development and testing environments. Valid values are `multi-node` (default) and `single-node`.

- `cluster.initial_cluster_manager_nodes` (Static, list): Sets the initial set of cluster manager-eligible nodes in a brand-new cluster. This setting is required when bootstrapping a cluster for the first time and should contain the node names (as defined by `node.name`) of the initial cluster manager-eligible nodes. This list should be empty for nodes joining an existing cluster. Default is `[]` (empty list).


### Dynamic discovery settings

The following **dynamic** discovery settings can be updated while the cluster is running:

- `cluster.auto_shrink_voting_configuration` (Dynamic, Boolean): Controls whether the voting configuration automatically shrinks when nodes are removed from the cluster. If `true`, the voting configuration adjusts to maintain optimal cluster manager election behavior by removing nodes that are no longer part of the cluster. If `false`, you must remove the nodes that are no longer part of the cluster using the [Voting configuration exclusion API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-voting-configuration-exclusions/). Default is `true`.

- `cluster.max_voting_config_exclusions` (Dynamic, integer): Sets the maximum number of voting configuration exclusions that can be in place simultaneously during cluster manager node operations. This setting is used during node removal and cluster maintenance operations to temporarily exclude nodes from voting. Default is `10`.

### Static cluster coordination settings

The following cluster coordination settings control cluster formation and node joining behavior:

- `cluster.join.timeout` (Static, time unit): The amount of time a node waits after sending a request to join a cluster before it considers the request to have failed and retries. This timeout does not apply when `discovery.type` is set to `single-node`. Default is `60s`.

- `cluster.publish.info_timeout` (Static, time unit): The amount of time the cluster manager node waits for each cluster state update to be completely published to all nodes before logging a message indicating that some nodes are responding slowly. This setting helps identify slow-responding nodes during cluster state updates. Default is `10s`.

### Cluster election settings

The following settings control cluster manager election behavior:

- `cluster.election.back_off_time` (Static, time unit): Sets the incremental delay added to election retry attempts after each failure. Uses linear backoff, in which each failed election increases the wait time by this amount before the next attempt. Default is `100ms`. **Warning**: Changing this setting from the default may cause your cluster to fail to elect a cluster manager node.

- `cluster.election.duration` (Static, time unit): Sets how long each election is allowed to take before a node considers it to have failed and schedules a retry. This controls the maximum duration of the election process. Default is `500ms`. **Warning**: Changing this setting from the default may cause your cluster to fail to elect a cluster manager node.

- `cluster.election.initial_timeout` (Static, time unit): Sets the upper bound on how long a node will wait initially, or after the elected cluster manager fails, before attempting its first election. This controls the initial election delay. Default is `100ms`. **Warning**: Changing this setting from the default may cause your cluster to fail to elect a cluster manager node.

- `cluster.election.max_timeout` (Static, time unit): Sets the maximum upper bound on how long a node will wait before attempting an election, preventing excessively sparse elections during long network partitions. This caps the maximum election delay. Default is `10s`. **Warning**: Changing this setting from the default may cause your cluster to fail to elect a cluster manager node.

### Expert-level discovery settings

The following discovery settings are for expert-level configuration. **Warning**: Changing these settings from their defaults may cause cluster instability:

- `discovery.cluster_formation_warning_timeout` (Static, time unit): Sets how long a node will try to form a cluster before logging a warning that the cluster did not form. If a cluster has not formed after this timeout has elapsed, the node will log a warning message that starts with the phrase "cluster manager not discovered" which describes the current state of the discovery process. Default is `10s`.

- `discovery.find_peers_interval` (Static, time unit): Sets how long a node will wait before attempting another discovery round. This controls the frequency of peer discovery attempts during cluster formation. Default is `1s`.

- `discovery.probe.connect_timeout` (Static, time unit): Sets how long to wait when attempting to connect to each address during node discovery. This timeout applies to the initial connection attempt to potential cluster members. Default is `3s`.

- `discovery.probe.handshake_timeout` (Static, time unit): Sets how long to wait when attempting to identify the remote node via a handshake during the discovery process. This timeout applies to the node identification phase after a successful connection. Default is `1s`.

- `discovery.request_peers_timeout` (Static, time unit): Sets how long a node will wait after asking its peers for information before considering the request to have failed. This timeout applies to peer information requests during the discovery process. Default is `3s`.

- `discovery.seed_resolver.max_concurrent_resolvers` (Static, integer): Specifies how many concurrent DNS lookups to perform when resolving the addresses of seed nodes during cluster discovery. This setting controls the parallelism of DNS resolution for seed hosts. Default is `10`.

- `discovery.seed_resolver.timeout` (Static, time unit): Specifies how long to wait for each DNS lookup performed when resolving the addresses of seed nodes. This timeout applies to individual DNS resolution operations during cluster discovery. Default is `5s`.


## Gateway settings

The local gateway stores on-disk cluster state and shard data that is used when a cluster is restarted. The following local gateway settings are supported:

- `gateway.recover_after_nodes` (Static, integer): The minimum number of total nodes for any role that must be running after a full cluster restart before recovery can begin.
  - **Default**: `0` (disabled)—recovery can start as soon as a cluster forms.
  - **Recommendation**: Set to slightly over half of the number of all expected nodes so that the cluster doesn't start recovering with too few nodes.

- `gateway.recover_after_data_nodes` (Static, integer): The minimum number of data nodes that must be running after a full cluster restart before recovery can begin.
  - **Default**: `0`
  - **Recommendation**: Set to a significant portion of data nodes—approximately 50–70% of the total data nodes—to avoid premature recovery.

- `gateway.expected_data_nodes` (Static, integer): The expected number of data nodes in the cluster. When all are present, recovery of local shards can start immediately.
  - **Default**: `0`
  - **Recommendation**: Set this to the actual number of data nodes in your cluster so that recovery can start immediately once all data nodes are running.

- `gateway.recover_after_time` (Static, time unit): The maximum amount of time to wait until recovery if the expected data node count hasn't been reached. After this time, recovery proceeds.
  - **Default**: `5m` if `expected_data_nodes` or `recover_after_nodes` is set. Otherwise disabled.
  - **Recommendation**: Set slightly above your typical node join time; larger clusters often need longer to recover and are tuned based on observed startup behavior.

