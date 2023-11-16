---
layout: default
title: Cluster settings
parent: Configuring OpenSearch
nav_order: 60
---

# Cluster settings

The following settings are related to the OpenSearch cluster.

To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## Cluster-level routing and allocation settings

OpenSearch supports the following cluster-level routing and shard allocation settings. All settings in this list are dynamic:

- `cluster.routing.allocation.enable` (String): Enables or disables allocation for specific kinds of shards. 
    
    Valid values are:
     - `all` – Allows shard allocation for all types of shards. 
     - `primaries` – Allows shard allocation for primary shards only. 
     - `new_primaries` – Allows shard allocation for primary shards for new indexes only. 
     - `none` – No shard allocations are allowed for any indexes. 
     
     Default is `all`. 

- `cluster.routing.allocation.node_concurrent_incoming_recoveries` (Integer): Configures how many concurrent incoming shard recoveries are allowed to happen on a node. Default is `2`. 

- `cluster.routing.allocation.node_concurrent_outgoing_recoveries` (Integer): Configures how many concurrent outgoing shard recoveries are allowed to happen on a node. Default is `2`. 

- `cluster.routing.allocation.node_concurrent_recoveries` (String): Used to set `cluster.routing.allocation.node_concurrent_incoming_recoveries` and `cluster.routing.allocation.node_concurrent_outgoing_recoveries` to the same value. 

- `cluster.routing.allocation.node_initial_primaries_recoveries` (Integer): Sets the number of recoveries for unassigned primaries after a node restart. Default is `4`. 

- `cluster.routing.allocation.same_shard.host` (Boolean): When set to `true`, multiple copies of a shard are prevented from being allocated to distinct nodes on the same host. Default is `false`. 

- `cluster.routing.rebalance.enable` (String): Enables or disables rebalancing for specific kinds of shards.
    
    Valid values are:
     - `all` – Allows shard balancing for all types of shards. 
     - `primaries` – Allows shard balancing for primary shards only. 
     - `replicas` – Allows shard balancing for replica shards only. 
     - `none` – No shard balancing is allowed for any indexes. 

     Default is `all`. 

-  `cluster.routing.allocation.allow_rebalance` (String): Specifies when shard rebalancing is allowed.
    
    Valid values are:
    -  `always` – Always allow rebalancing. 
    - `indices_primaries_active` – Only allow rebalancing when all primaries in the cluster are allocated. 
    - `indices_all_active` – Only allow rebalancing when all shards in the cluster are allocated.

    Default is `indices_all_active`. 

- `cluster.routing.allocation.cluster_concurrent_rebalance` (Integer): Allows you to control how many concurrent shard rebalances are allowed across a cluster. Default is `2`. 

- `cluster.routing.allocation.balance.shard` (Floating point): Defines the weight factor for the total number of shards allocated per node. Default is `0.45`. 

- `cluster.routing.allocation.balance.index` (Floating point): Defines the weight factor for the number of shards per index allocated on a node. Default is `0.55`. 

- `cluster.routing.allocation.balance.threshold` (Floating point): The minimum optimization value of operations that should be performed. Default is `1.0`. 

- `cluster.routing.allocation.balance.prefer_primary` (Boolean): When set to `true`, OpenSearch attempts to evenly distribute the primary shards between the cluster nodes. Enabling this setting does not always guarantee an equal number of primary shards on each node, especially in the event of failover. Changing this setting to `false` after it was set to `true` does not invoke redistribution of primary shards. Default is `false`.

- `cluster.routing.allocation.disk.threshold_enabled` (Boolean): When set to `false`, disables the disk allocation decider. This will also remove any existing `index.blocks.read_only_allow_delete index blocks` when disabled. Default is `true`. 

- `cluster.routing.allocation.disk.watermark.low` (String): Controls the low watermark for disk usage. When set to a percentage, OpenSearch will not allocate shards to nodes with that percentage of disk used. This can also be entered as ratio value, like `0.85`. Finally, this can also be set to a byte value, like `400mb`. This setting does not affect the primary shards of newly created indexes, but will prevent their replicas from being allocated. Default is `85%`. 

- `cluster.routing.allocation.disk.watermark.high` (String): Controls the high watermark. OpenSearch will attempt to relocate shards away from a node whose disk usage is above the percentage defined. This can also be entered as a ratio value, like `0.85`. Finally, this can also be set to a byte value, like `400mb`. This setting affects the allocation of all shards. Default is `90%`. 

- `cluster.routing.allocation.disk.watermark.flood_stage` (String): Controls the flood stage watermark. This is a last resort to prevent nodes from running out of disk space. OpenSearch enforces a read-only index block (`index.blocks.read_only_allow_delete`) on every index that has one or more shards allocated on the node and that has at least one disk exceeding the flood stage. The index block is released once the disk utilization falls below the high watermark. This can also be entered as a ratio value, like `0.85`. Finally, this can also be set to a byte value, like `400mb`. Default is `95%`. 

- `cluster.info.update.interval` (Time unit): Sets how often OpenSearch should check disk usage for each node in the cluster. Default is `30s`. 

- `cluster.routing.allocation.include.<attribute>` (Enum): Allocates shards to a node whose `attribute` has at least one of the included comma-separated values. 

- `cluster.routing.allocation.require.<attribute>` (Enum): Only allocates shards to a node whose `attribute` has all of the included comma-separated values. 

- `cluster.routing.allocation.exclude.<attribute>` (Enum): Does not allocate shards to a node whose `attribute` has any of the included comma-separated values. The cluster allocation settings support the following built-in attributes. 
    
    Valid values are:
    - `_name` – Match nodes by node name. 
    - `_host_ip` – Match nodes by host IP address. 
    - `_publish_ip` – Match nodes by publish IP address. 
    - `_ip` – Match either `_host_ip` or `_publish_ip`. 
    - `_host` – Match nodes by hostname. 
    - `_id` – Match nodes by node ID. 
    - `_tier` – Match nodes by data tier role.     

- `cluster.routing.allocation.shard_movement_strategy` (Enum):  Determines the order in which shards are relocated from outgoing to incoming nodes. 

    This setting supports the following strategies: 
    - `PRIMARY_FIRST` – Primary shards are relocated first, before replica shards. This prioritization may help prevent a cluster's health status from going red if the relocating nodes fail during the process. 
    - `REPLICA_FIRST` – Replica shards are relocated first, before primary shards. This prioritization may help prevent a cluster's health status from going red when carrying out shard relocation in a mixed-version, segment-replication-enabled OpenSearch cluster. In this situation, primary shards relocated to OpenSearch nodes of a newer version could try to copy segment files to replica shards on an older version of OpenSearch, which would result in shard failure. Relocating replica shards first may help to avoid this in multi-version clusters. 
    - `NO_PREFERENCE` – The default behavior in which the order of shard relocation has no importance. 

## Cluster-level shard, block, and task settings

OpenSearch supports the following cluster-level shard, block, and task settings:

- `cluster.blocks.read_only` (Boolean): Sets the entire cluster to read-only. Default is `false`. 

- `cluster.blocks.read_only_allow_delete` (Boolean): Similar to `cluster.blocks.read_only`, but allows you to delete indexes. 

- `cluster.max_shards_per_node` (Integer): Limits the total number of primary and replica shards for the cluster. The limit is calculated as follows: `cluster.max_shards_per_node` multiplied by the number of non-frozen data nodes. Shards for closed indexes do not count toward this limit. Default is `1000`. 

- `cluster.persistent_tasks.allocation.enable` (String): Enables or disables allocation for persistent tasks.   

    Valid values are: 
    - `all` – Allows persistent tasks to be assigned to nodes. 
    - `none` – No allocations are allowed for persistent tasks. This does not affect persistent tasks already running. 

    Default is `all`. 

- `cluster.persistent_tasks.allocation.recheck_interval` (Time unit): The cluster manager automatically checks whether persistent tasks need to be assigned when the cluster state changes in a significant way. There are other factors, such as memory usage, that will affect whether persistent tasks are assigned to nodes but do not otherwise cause the cluster state to change. This setting defines how often assignment checks are performed in response to these factors. Default is `30 seconds`, with a minimum of `10 seconds` being required. 

## Cluster-level index settings

For information about index-level index settings, see [Cluster-level index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#cluster-level-index-settings).