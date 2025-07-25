---
layout: default
title: Cluster settings
parent: Configuring OpenSearch
nav_order: 60
canonical_url: https://docs.opensearch.org/latest/install-and-configure/configuring-opensearch/cluster-settings/
---

# Cluster settings

The following settings are related to the OpenSearch cluster.

To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## Cluster-level routing and allocation settings

OpenSearch supports the following cluster-level routing and shard allocation settings:

- `cluster.routing.allocation.enable` (Dynamic, string): Enables or disables allocation for specific kinds of shards. 
    
    Valid values are:
     - `all` – Allows shard allocation for all types of shards. 
     - `primaries` – Allows shard allocation for primary shards only. 
     - `new_primaries` – Allows shard allocation for primary shards for new indexes only. 
     - `none` – No shard allocations are allowed for any indexes. 
     
     Default is `all`. 

- `cluster.routing.allocation.node_concurrent_incoming_recoveries` (Dynamic, integer): Configures how many concurrent incoming shard recoveries are allowed to occur on a node. Default is `2`. 

- `cluster.routing.allocation.node_concurrent_outgoing_recoveries` (Dynamic, integer): Configures how many concurrent outgoing shard recoveries are allowed to occur on a node. Default is `2`. 

- `cluster.routing.allocation.node_concurrent_recoveries` (Dynamic, string): Used to set `cluster.routing.allocation.node_concurrent_incoming_recoveries` and `cluster.routing.allocation.node_concurrent_outgoing_recoveries` to the same value. 

- `cluster.routing.allocation.node_initial_primaries_recoveries` (Dynamic, integer): Sets the number of recoveries for unassigned primaries after a node restart. Default is `4`. 

- `cluster.routing.allocation.same_shard.host` (Dynamic, Boolean): When set to `true`, multiple copies of a shard are prevented from being allocated to distinct nodes on the same host. Default is `false`. 

- `cluster.routing.rebalance.enable` (Dynamic, string): Enables or disables rebalancing for specific kinds of shards.
    
    Valid values are:
     - `all` – Allows shard balancing for all types of shards. 
     - `primaries` – Allows shard balancing for primary shards only. 
     - `replicas` – Allows shard balancing for replica shards only. 
     - `none` – No shard balancing is allowed for any indexes. 

     Default is `all`. 

-  `cluster.routing.allocation.allow_rebalance` (Dynamic, string): Specifies when shard rebalancing is allowed.
    
    Valid values are:
    -  `always` – Always allow rebalancing. 
    - `indices_primaries_active` – Only allow rebalancing when all primaries in the cluster are allocated. 
    - `indices_all_active` – Only allow rebalancing when all shards in the cluster are allocated.

    Default is `indices_all_active`. 

- `cluster.routing.allocation.cluster_concurrent_rebalance` (Dynamic, integer): Allows you to control how many concurrent shard rebalances are allowed across a cluster. Default is `2`. 

- `cluster.routing.allocation.balance.shard` (Dynamic, floating point): Defines the weight factor for the total number of shards allocated per node. Default is `0.45`. 

- `cluster.routing.allocation.balance.index` (Dynamic, floating point): Defines the weight factor for the number of shards per index allocated on a node. Default is `0.55`. 

- `cluster.routing.allocation.balance.threshold` (Dynamic, floating point): The minimum optimization value of operations that should be performed. Default is `1.0`. 

- `cluster.routing.allocation.balance.prefer_primary` (Dynamic, Boolean): When set to `true`, OpenSearch attempts to evenly distribute the primary shards between the cluster nodes. Enabling this setting does not always guarantee an equal number of primary shards on each node, especially in the event of a failover. Changing this setting to `false` after it was set to `true` does not invoke redistribution of primary shards. Default is `false`.

- `cluster.routing.allocation.rebalance.primary.enable` (Dynamic, Boolean): When set to `true`, OpenSearch attempts to rebalance the primary shards between the cluster nodes. When enabled, the cluster tries to maintain the number of primary shards on each node, with the maximum buffer defined by the `cluster.routing.allocation.rebalance.primary.buffer` setting. Changing this setting to `false` after it was set to `true` does not invoke the redistribution of primary shards. Default is `false`.

- `cluster.routing.allocation.rebalance.primary.buffer` (Dynamic, floating point): Defines the maximum allowed buffer of primary shards between nodes when `cluster.routing.allocation.rebalance.primary.enable` is enabled. Default is `0.1`.

- `cluster.routing.allocation.disk.threshold_enabled` (Dynamic, Boolean): When set to `false`, disables the disk allocation decider. This will also remove any existing `index.blocks.read_only_allow_delete index blocks` when disabled. Default is `true`. 

- `cluster.routing.allocation.disk.watermark.low` (Dynamic, string): Controls the low watermark for disk usage. When set to a percentage, OpenSearch will not allocate shards to nodes with that percentage of disk usage. This can also be entered as a ratio value, like `0.85`. Finally, this can also be set to a byte value, like `400mb`. This setting does not affect the primary shards of newly created indexes but will prevent their replicas from being allocated. Default is `85%`. 

- `cluster.routing.allocation.disk.watermark.high` (Dynamic, string): Controls the high watermark. OpenSearch will attempt to relocate shards away from a node whose disk usage is above the defined percentage. This can also be entered as a ratio value, like `0.85`. Finally, this can also be set to a byte value, like `400mb`. This setting affects the allocation of all shards. Default is `90%`. 

- `cluster.routing.allocation.disk.watermark.flood_stage` (Dynamic, string): Controls the flood stage watermark. This is a last resort to prevent nodes from running out of disk space. OpenSearch enforces a read-only index block (`index.blocks.read_only_allow_delete`) on every index that has one or more shards allocated on the node and at least one disk exceeding the flood stage. The index block is released once the disk utilization falls below the high watermark. This can also be entered as a ratio value, like `0.85`. Finally, this can also be set to a byte value, like `400mb`. Default is `95%`. 

- `cluster.info.update.interval` (Dynamic, time unit): Sets how often OpenSearch should check disk usage for each node in the cluster. Default is `30s`. 

- `cluster.routing.allocation.include.<attribute>` (Dynamic, enum): Allocates shards to a node whose `attribute` contains at least one of the included comma-separated values. 

- `cluster.routing.allocation.require.<attribute>` (Dynamic, enum): Only allocates shards to a node whose `attribute` contains all of the included comma-separated values. 

- `cluster.routing.allocation.exclude.<attribute>` (Dynamic, enum): Does not allocate shards to a node whose `attribute` contains any of the included comma-separated values. The cluster allocation settings support the following built-in attributes. 
    
    Valid values are:
    - `_name` – Match nodes by node name. 
    - `_host_ip` – Match nodes by host IP address. 
    - `_publish_ip` – Match nodes by publish IP address. 
    - `_ip` – Match either `_host_ip` or `_publish_ip`. 
    - `_host` – Match nodes by hostname. 
    - `_id` – Match nodes by node ID. 
    - `_tier` – Match nodes by data tier role.     

- `cluster.routing.allocation.shard_movement_strategy` (Dynamic, enum): Determines the order in which shards are relocated from outgoing to incoming nodes. 

    This setting supports the following strategies: 
    - `PRIMARY_FIRST` – Primary shards are relocated first, before replica shards. This prioritization may help prevent a cluster's health status from going red if the relocating nodes fail during the process. 
    - `REPLICA_FIRST` – Replica shards are relocated first, before primary shards. This prioritization may help prevent a cluster's health status from going red when carrying out shard relocation in a mixed-version, segment-replication-enabled OpenSearch cluster. In this situation, primary shards relocated to OpenSearch nodes of a newer version could try to copy segment files to replica shards on an older version of OpenSearch, which would result in shard failure. Relocating replica shards first may help to avoid this in multi-version clusters. 
    - `NO_PREFERENCE` – The default behavior in which the order of shard relocation has no importance. 

- `cluster.allocator.gateway.batch_size` (Dynamic, integer): Limits the number of shards sent to data nodes in a single batch to fetch any unassigned shard metadata. Default is `2000`.

- `cluster.allocator.existing_shards_allocator.batch_enabled` (Static, Boolean): Enables batch allocation of unassigned shards that already exist on the disk, as opposed to allocating one shard at a time. This reduces memory and transport overhead by fetching any unassigned shard metadata in a batch call. Default is `false`.

## Cluster-level shard, block, and task settings

OpenSearch supports the following cluster-level shard, block, and task settings:

- `action.search.shard_count.limit` (Integer): Limits the maximum number of shards to be hit during search. Requests that exceed this limit will be rejected.

- `cluster.blocks.read_only` (Boolean): Sets the entire cluster to read-only. Default is `false`. 

- `cluster.blocks.read_only_allow_delete` (Boolean): Similar to `cluster.blocks.read_only`, but allows you to delete indexes. 

- `cluster.max_shards_per_node` (Integer): Limits the total number of primary and replica shards for the cluster. The limit is calculated as follows: `cluster.max_shards_per_node` multiplied by the number of non-frozen data nodes. Shards for closed indexes do not count toward this limit. Default is `1000`. 

- `cluster.persistent_tasks.allocation.enable` (String): Enables or disables allocation for persistent tasks.   

    Valid values are: 
    - `all` – Allows persistent tasks to be assigned to nodes. 
    - `none` – No allocations are allowed for persistent tasks. This does not affect persistent tasks already running. 

    Default is `all`. 

- `cluster.persistent_tasks.allocation.recheck_interval` (Time unit): The cluster manager automatically checks whether persistent tasks need to be assigned when the cluster state changes in a significant way. There are other factors, such as memory usage, that will affect whether persistent tasks are assigned to nodes but do not otherwise cause the cluster state to change. This setting defines how often assignment checks are performed in response to these factors. Default is `30 seconds`, with a minimum of `10 seconds` being required.

## Cluster-level slow log settings

For more information, see [Search request slow logs]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/logs/#search-request-slow-logs).

- `cluster.search.request.slowlog.threshold.warn` (Time unit): Sets the request-level slow log `WARN` threshold. Default is `-1`.

- `cluster.search.request.slowlog.threshold.info` (Time unit): Sets the request-level slow log `INFO` threshold. Default is `-1`.

- `cluster.search.request.slowlog.threshold.debug` (Time unit): Sets the request-level slow log `DEBUG` threshold. Default is `-1`.

- `cluster.search.request.slowlog.threshold.trace` (Time unit): Sets the request-level slow log `TRACE` threshold. Default is `-1`.

- `cluster.search.request.slowlog.level` (String): Sets the minimum slow log level to log: `WARN`, `INFO`, `DEBUG`, and `TRACE`. Default is `TRACE`.

## Cluster-level index settings

For information about index-level index settings, see [Cluster-level index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#cluster-level-index-settings).

## Cluster-level coordination settings

OpenSearch supports the following cluster-level coordination settings. All settings in this list are dynamic:

- `cluster.fault_detection.leader_check.timeout` (Time unit): The amount of time a node waits for a response from the elected cluster manager during a leader check before deeming the check a failure. Valid values are from `1ms` to `60s`, inclusive. Default is `10s`. Changing this setting to a value other than the default can result in an unstable cluster.

- `cluster.fault_detection.follower_check.timeout` (Time unit): The amount of time the elected cluster manager waits for a response during a follower check before deeming the check a failure. Valid values are from `1ms` to `60s`, inclusive. Default is `10s`. Changing this setting to a value other than the default can result in an unstable cluster.

- `cluster.fault_detection.follower_check.interval` (Time unit): The amount of time that the elected cluster manager waits between sending follower checks to other nodes in the cluster. Valid values are `100ms` and higher. Default is `1000ms`. Changing this setting to a value other than the default can result in an unstable cluster.

- `cluster.follower_lag.timeout` (Time unit): The amount of time that the elected cluster manager waits to receive acknowledgements for cluster state updates from lagging nodes. Default is `90s`. If a node does not successfully apply the cluster state update within this period of time, it is considered to have failed and is removed from the cluster.

- `cluster.publish.timeout` (Time unit): The amount of time that the cluster manager waits for each cluster state update to be completely published to all nodes, unless `discovery.type` is set to `single-node`. Default is `30s`.

## Cluster-level CAT response limit settings

OpenSearch supports the following cluster-level CAT API response limit settings, all of which are dynamic:

- `cat.indices.response.limit.number_of_indices` (Integer): Sets a limit on the number of indexes returned by the [CAT Indices API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-indices/). The default value is `-1` (no limit). If the number of indexes in the response exceeds this limit, the API returns a `429` error. To avoid this, you can specify an index pattern filter in your query (for example, `_cat/indices/<index-pattern>`).

- `cat.shards.response.limit.number_of_shards` (Integer): Sets a limit on the number of shards returned by the [CAT Shards API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-shards/). The default value is `-1` (no limit). If the number of shards in the response exceeds this limit, the API returns a `429` error. To avoid this, you can specify an index pattern filter in your query (for example, `_cat/shards/<index-pattern>`).

- `cat.segments.response.limit.number_of_indices` (Integer): Sets a limit on the number of indexes returned by the [CAT Segments API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-segments/). The default value is `-1` (no limit). If the number of indexes in the response exceeds this limit, the API returns a `429` error. To avoid this, you can specify an index pattern filter in your query (for example, `_cat/segments/<index-pattern>`).
