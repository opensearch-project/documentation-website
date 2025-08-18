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

The discovery process is used when a cluster is formed. It consists of discovering nodes and electing a cluster manager node. The following **static** discovery settings are supported:

| Setting | Type | Description |
|:---	|:--- |:---	|                                                                         
| `discovery.seed_hosts` | List | The hosts used for peer discovery when a node starts. If not set, defaults to `["127.0.0.1", "[::1]"]`. |
| `discovery.seed_providers` | List | One or more provider types that supply seed node addresses to start discovery. |
| `discovery.type` | String | The cluster formation mode. By default forms a multi-node cluster. Set to `single-node` to run a single-node cluster, this will disable normal discovery. |
| `cluster.initial_cluster_manager_nodes` | List | Names of cluster-manager-eligible nodes used only at initial cluster bootstrap to elect the first cluster manager. Ignored after the cluster has formed. |


## Gateway settings

The local gateway stores on-disk cluster state and shard data that is used when a cluster is restarted. The following local gateway **static** settings are supported:

| Setting | Type | Description | Default | Recommendation |
|:---	|:--- |:---	|:---	|:---	|
| `gateway.recover_after_nodes` | Integer | Minimum total nodes with any role that must be up after a full cluster restart before recovery can begin. | `0` (disabled) — recovery can start as soon as a cluster forms.  | Set to slightly over half of all expected nodes so the cluster doesn’t start recovering with too few nodes. |
| `gateway.recover_after_data_nodes` | Integer | Minimum data nodes that must be up after a full cluster restart before recovery can begin.  | `0` | Set to a significant portion of data nodes, approximately  50–70% of the total data nodes to avoid premature recovery.  |
| `gateway.expected_data_nodes` | Integer | The expected number of data nodes in the cluster. When all are present, recovery of local shards can start immediately. | `0` | Set this to the actual number of data nodes in your cluster so recovery can kick off immediately once all data nodes are up.  |
| `gateway.recover_after_time` | Time | The max wait time to hold off recovery if the expected data node count hasn’t been reached. After this time, recovery proceeds. | `5m` if `expected_data_nodes` or `recover_after_nodes` is set. Otherwise disabled. | Set it slightly above your typical node join time, larger clusters often need longer, and tune based on observed startup behavior. |