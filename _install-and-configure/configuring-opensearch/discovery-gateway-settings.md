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

The discovery process is used when a cluster is formed. It consists of discovering nodes and electing a cluster manager node. For comprehensive information about discovery and cluster formation settings, see [Discovery and cluster formation settings]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/settings/).

- `discovery.find_peers_interval_during_decommission` (Static, time unit): Sets the time interval between attempts to find all peers when a node is in decommissioned state. When a node is being decommissioned, it continues to discover other nodes at this interval to maintain cluster membership information during the decommission process. This helps ensure proper coordination during controlled node removal. Default is `120s` (2 minutes). Minimum is `1000ms`.

- `discovery.unconfigured_bootstrap_timeout` (Static, time unit): Sets the timeout period for unconfigured bootstrap process during cluster formation. This setting controls how long a node will wait during the bootstrap phase when the cluster is not properly configured (e.g., when `cluster.initial_cluster_manager_nodes` is not set). After this timeout, the node will proceed with bootstrap operations or fail appropriately. This setting helps prevent nodes from waiting indefinitely in unconfigured states. Default is `3s`. Minimum is `1ms`.


## Gateway settings

The local gateway stores on-disk cluster state and shard data that is used when a cluster is restarted. The following local gateway settings are supported:

- `gateway.recover_after_data_nodes` (Static, integer): The minimum number of data nodes that must be running after a full cluster restart before recovery can begin.
  - **Default**: `0`
  - **Recommendation**: Set to a significant portion of the data nodes—approximately 50–70% of the total data nodes—to avoid premature recovery.

- `gateway.expected_data_nodes` (Static, integer): The expected number of data nodes in the cluster. When all are present, recovery of local shards can start immediately.
  - **Default**: `0`
  - **Recommendation**: Set this to the actual number of data nodes in your cluster so that recovery can start immediately once all data nodes are running.

- `gateway.recover_after_time` (Static, time unit): The maximum amount of time to wait until recovery if the expected data node count hasn't been reached. After this time, recovery proceeds.
  - **Default**: `5m` if `expected_data_nodes` or `recover_after_nodes` is set. Otherwise disabled.
  - **Recommendation**: Set slightly above your typical node join time; larger clusters often need longer to recover and are tuned based on observed startup behavior.

- `gateway.write_dangling_indices_info` (Static, Boolean): Controls whether OpenSearch writes information about dangling indices to disk during cluster state persistence. When enabled, the system maintains metadata about indices that exist on disk but are not part of the current cluster state, which can help with recovery and troubleshooting scenarios. Default is `true`.

- `gateway.auto_import_dangling_indices` (Static, Boolean): Controls whether OpenSearch automatically imports dangling indices discovered during cluster startup. Dangling indices are indices that exist on disk but are not part of the current cluster state, typically left behind after improper cluster shutdowns or node removals. When enabled, these orphaned indices are automatically imported back into the cluster state during startup. When disabled, dangling indices remain on disk but are not automatically imported, requiring manual intervention through the dangling indices API. This setting helps recover potentially lost data but should be used carefully to avoid importing unwanted indices. Default is `true`.

