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

