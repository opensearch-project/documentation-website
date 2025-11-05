---
layout: default
title: Cluster settings
parent: Configuring OpenSearch
nav_order: 50
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

- `cluster.blocks.create_index` (Dynamic, Boolean): Controls whether index creation is blocked at the cluster level. When set to `true`, prevents new indexes from being created. Default is `false`.

- `cluster.blocks.create_index.auto_release` (Dynamic, Boolean): Controls whether automatic index creation blocks (triggered by high disk usage) are automatically removed when disk usage returns below threshold levels. Default is `true`.

- `cluster.ignore_dot_indexes` (Dynamic, Boolean): When set to `true`, ignores dot-prefixed indexes (like `.opensearch-*`) in shard limit validation checks. Default is `false`.

- `cluster.routing.allocation.awareness.balance` (Dynamic, Boolean): Enables awareness-based replica balancing across awareness attributes. Takes effect only when both `cluster.routing.allocation.awareness.attributes` and `cluster.routing.allocation.awareness.force.zone.values` are specified. Default is `false`.

- `cluster.routing.allocation.primary_constraint.threshold` (Dynamic, long): The threshold for primary shard constraint checks in allocation decisions. Default is `10`. Minimum enforced is `0`.

- `cluster.routing.allocation.remote_primary.ignore_throttle` (Dynamic, Boolean): Whether to ignore throttling limits for remote primary shard restoration operations. Default is `true`.

- `cluster.routing.ignore_weighted_routing` (Dynamic, Boolean): When set to `true`, ignores weighted routing configurations and uses default routing behavior. Default is `false`.

- `cluster.routing.weighted.default_weight` (Dynamic, double): The default weight assigned to nodes when weighted routing is enabled but no specific weight is configured. Default is `1.0`. Minimum enforced is `1.0`.

- `cluster.routing.weighted.fail_open` (Dynamic, Boolean): When weighted routing is enabled, determines whether to fail open (allow requests to any node) if all weighted nodes are unavailable. Default is `true`.

- `cluster.routing.weighted.strict` (Dynamic, Boolean): When enabled, enforces strict weighted routing where requests are only routed to nodes with appropriate weights. Default is `true`.

- `cluster.routing.allocation.awareness.attributes` (Dynamic, list): See [Shard allocation awareness]({{site.url}}{{site.baseurl}}/tuning-your-cluster/index#shard-allocation-awareness).

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

- `cluster.routing.allocation.awareness.force.<attribute>.values` (Dynamic, list): See [Forced awareness]({{site.url}}{{site.baseurl}}/tuning-your-cluster/index#forced-awareness).   

- `cluster.routing.allocation.shard_movement_strategy` (Dynamic, enum): Determines the order in which shards are relocated from outgoing to incoming nodes. 

    This setting supports the following strategies: 
    - `PRIMARY_FIRST` – Primary shards are relocated first, before replica shards. This prioritization may help prevent a cluster's health status from going red if the relocating nodes fail during the process. 
    - `REPLICA_FIRST` – Replica shards are relocated first, before primary shards. This prioritization may help prevent a cluster's health status from going red when carrying out shard relocation in a mixed-version, segment-replication-enabled OpenSearch cluster. In this situation, primary shards relocated to OpenSearch nodes of a newer version could try to copy segment files to replica shards on an older version of OpenSearch, which would result in shard failure. Relocating replica shards first may help to avoid this in multi-version clusters. 
    - `NO_PREFERENCE` – The default behavior in which the order of shard relocation has no importance. 

- `cluster.routing.search_replica.strict` (Dynamic, Boolean): Controls how search requests are routed when search replica shards exist for an index, such as when `index.number_of_search_replicas` is greater than `0`. This setting applies only when search replicas are configured for an index. When set to `true`, all search requests for such indexes are routed only to search replica shards. If search replicas are unassigned, the requests fail. When set to `false`, if search replicas are unassigned, requests fall back to any available shard. Default is `true`.

- `cluster.allocator.gateway.batch_size` (Dynamic, integer): Limits the number of shards sent to data nodes in a single batch to fetch any unassigned shard metadata. Default is `2000`.

- `cluster.allocator.existing_shards_allocator.batch_enabled` (Static, Boolean): Enables batch allocation of unassigned shards that already exist on the disk, as opposed to allocating one shard at a time. This reduces memory and transport overhead by fetching any unassigned shard metadata in a batch call. Default is `false`.

- `cluster.routing.allocation.total_shards_per_node` (Dynamic, integer): The maximum combined total number of primary and replica shards that can be allocated to a single node. Default is `-1` (unlimited). Helps distribute shards evenly across nodes by limiting the total number of shards per node. Use with caution because shards may remain unallocated if nodes reach their configured limits.

- `cluster.routing.allocation.total_primary_shards_per_node` (Dynamic, integer): The maximum number of primary shards that can be allocated to a single node. This setting is applicable only for remote-backed clusters. Default is `-1`(unlimited). Helps distribute primary shards evenly across nodes by limiting the number of primary shards per node. Use with caution because primary shards may remain unallocated if nodes reach their configured limits.

- `cluster.routing.allocation.disk.watermark.enable_for_single_data_node` (Static, Boolean): Enables disk watermark checks for clusters with only a single data node. When enabled, disk-based shard allocation decisions are enforced even in single-node clusters. Default is `false`.

### Advanced cluster routing and allocation settings

OpenSearch supports the following advanced cluster routing and allocation settings:

- `cluster.routing.allocation.balanced_shards_allocator.allocator_timeout` (Dynamic, time unit): Controls the timeout for balanced shard allocator operations. When set to `-1`, the timeout is disabled. When set to a positive value, the allocator will timeout after the specified duration if allocation cannot be completed. Default is `-1` (no timeout). Minimum value is `20s` when timeout is enabled.

- `cluster.routing.allocation.cluster_concurrent_recoveries` (Dynamic, integer): Controls the maximum number of concurrent recovery operations allowed at the cluster level. This setting limits the total number of recovery operations (relocations) happening simultaneously across the entire cluster to prevent resource exhaustion. Set to `-1` for unlimited concurrent recoveries. Default is `-1`.

### Load-aware allocation settings

OpenSearch supports the following load-aware allocation settings for distributing shards based on node resource utilization:

- `cluster.routing.allocation.load_awareness.allow_unassigned_primaries` (Dynamic, Boolean): When load-aware allocation is enabled, this setting controls whether newly created primary shards can be assigned even if it would breach the skew factor. Setting to `true` allows new primaries to be assigned while preventing replica allocation from breaching the skew factor. Setting to `false` can result in primaries remaining unassigned and the cluster turning red. Default is `true`.

- `cluster.routing.allocation.load_awareness.flat_skew` (Dynamic, integer): The flat skew factor used in load-aware allocation to determine acceptable imbalance between nodes. Higher values allow more imbalance but provide greater allocation flexibility. Default is `2`. Minimum is `2`.

- `cluster.routing.allocation.load_awareness.provisioned_capacity` (Dynamic, integer): The provisioned capacity setting for load-aware allocation. This helps the allocator understand the intended capacity of nodes for better load distribution. Set to `-1` to disable. Default is `-1`.

- `cluster.routing.allocation.load_awareness.skew_factor` (Dynamic, double): The skew factor threshold for load-aware allocation. This controls how much imbalance is tolerated between nodes before the allocator takes corrective action. Higher values allow more skew. Default is `50`. Set to `-1` to disable skew-based allocation.

- `cluster.routing.allocation.move.primary_first` (Dynamic, Boolean): When rebalancing shards, this setting controls whether primary shards are moved before replica shards. Moving primaries first can help balance the load more effectively but may impact search performance during rebalancing. Default is `false`.

- `cluster.routing.allocation.node_initial_replicas_recoveries` (Dynamic, integer): The maximum number of initial replica recoveries that can happen simultaneously on a single node during cluster startup or when a node joins. This is separate from the concurrent recoveries limit and helps control startup load. Default is `2`.

## Cluster-level snapshot settings

OpenSearch supports the following cluster-level snapshot settings:

- `cluster.snapshot.info.max_concurrent_fetches` (Dynamic, integer): The maximum number of concurrent snapshot information fetch operations allowed. This setting helps control the load when retrieving snapshot metadata from the repository. Higher values can improve performance when managing many snapshots but may increase resource usage. Default is `5`.

## Cluster-level composite index settings

OpenSearch supports the following composite index settings:

- `indices.composite_index.translog.max_flush_threshold_size` (Dynamic, byte size): The maximum translog size threshold for composite indexes before a flush is triggered. This setting helps control memory usage and ensures translog data is persisted to disk regularly for composite indexes. Default is `512mb`. Minimum value is `128mb`.

## Cluster-level shard, block, and task settings

OpenSearch supports the following cluster-level shard, block, and task settings:

- `action.search.shard_count.limit` (Integer): Limits the maximum number of shards to be hit during search. Requests that exceed this limit will be rejected.

- `cluster.blocks.read_only` (Boolean): Sets the entire cluster to read-only. Default is `false`. 

- `cluster.blocks.read_only_allow_delete` (Boolean): Similar to `cluster.blocks.read_only`, but allows you to delete indexes. 

- `cluster.no_cluster_manager_block` (String): Configures the operations that are rejected when no cluster manager is active. Accepts one of the following three option:
    - `all`: Blocks all read and write requests to the cluster.
    - `write`: Blocks only write requests. Read requests can still be processed.
    - `metadata_write`: Metadata-related writes, such as updates to mappings or routing tables, are blocked, but normal document indexing can still be performed. Read and write requests are processed using the cluster state last received by the node. Because the node may be cut off from the rest of the cluster, this can lead to serving outdated information or returning only part of the data.

- `cluster.max_shards_per_node` (Integer): Limits the total number of primary and replica shards for the cluster. The limit is calculated as follows: `cluster.max_shards_per_node` multiplied by the number of non-frozen data nodes. Shards for closed indexes do not count toward this limit. Default is `1000`. 

- `cluster.persistent_tasks.allocation.enable` (String): Enables or disables allocation for persistent tasks.   

    Valid values are: 
    - `all` – Allows persistent tasks to be assigned to nodes. 
    - `none` – No allocations are allowed for persistent tasks. This does not affect persistent tasks already running. 

    Default is `all`. 

- `cluster.persistent_tasks.allocation.recheck_interval` (Time unit): The cluster manager automatically checks whether persistent tasks need to be assigned when the cluster state changes in a significant way. There are other factors, such as memory usage, that will affect whether persistent tasks are assigned to nodes but do not otherwise cause the cluster state to change. This setting defines how often assignment checks are performed in response to these factors. Default is `30 seconds`, with a minimum of `10 seconds` being required.

- `task_cancellation.duration_millis` (Dynamic, long): The duration threshold in milliseconds for tracking cancelled tasks in the task cancellation monitoring system. Default is `10000` (10 seconds).

- `task_cancellation.enabled` (Dynamic, Boolean): Enables or disables the task cancellation monitoring service. Default is `true`.

- `task_resource_tracking.enabled` (Dynamic, Boolean): Controls whether task resource tracking is enabled to monitor CPU and memory usage of individual tasks. Default is `true`.

## Cluster-level search settings

OpenSearch supports the following cluster-level search settings:

- `cluster.search.ignore_awareness_attributes` (Boolean): Controls whether awareness attributes are considered during shard query routing. If `true` (default), the cluster ignores awareness attributes and uses Adaptive Replica Selection (ARS) to choose the optimal shard copy, reducing query response latency. Set this to `false` for routing decisions to prioritize awareness attributes instead of performance-based selection.

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

## Cluster-level fault detection settings

OpenSearch supports the following cluster-level fault detection settings that control how nodes detect and respond to failures:

- `cluster.fault_detection.follower_check.retry_count` (Static, integer): Sets how many consecutive follower check failures must occur before the elected cluster manager considers a node to be faulty and removes it from the cluster. This setting controls fault detection sensitivity for follower nodes. Default is `3`. **Warning**: Changing this setting from the default may cause your cluster to become unstable.

- `cluster.fault_detection.leader_check.interval` (Static, time unit): Sets how long each node waits between checks of the elected cluster manager. This controls the frequency of leader health checks performed by follower nodes. Default is `1s`. **Warning**: Changing this setting from the default may cause your cluster to become unstable.

- `cluster.fault_detection.leader_check.retry_count` (Static, integer): Sets how many consecutive leader check failures must occur before a node considers the elected cluster manager to be faulty and attempts to find or elect a new cluster manager. This setting controls fault detection sensitivity for the cluster manager node. Default is `3`. **Warning**: Changing this setting from the default may cause your cluster to become unstable.

- `cluster.indices.tombstones.size` (Static, integer): Sets the maximum number of index deletion tombstones to keep in the cluster state. Index tombstones prevent nodes that are not part of the cluster when a delete occurs from joining the cluster and reimporting the index as though the delete was never issued. To prevent the cluster state from growing too large, only the most recent deletions are kept. Default is `500`. You can increase this value if you expect nodes to be absent from the cluster and miss more than 500 index deletions, though this is rare. Tombstones use minimal space, but very large values (like 50,000) are not recommended.

## Cluster-level CAT response limit settings

OpenSearch supports the following cluster-level CAT API response limit settings, all of which are dynamic:

- `cat.indices.response.limit.number_of_indices` (Integer): Sets a limit on the number of indexes returned by the [CAT Indices API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-indices/). The default value is `-1` (no limit). If the number of indexes in the response exceeds this limit, the API returns a `429` error. To avoid this, you can specify an index pattern filter in your query (for example, `_cat/indices/<index-pattern>`).

- `cat.shards.response.limit.number_of_shards` (Integer): Sets a limit on the number of shards returned by the [CAT Shards API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-shards/). The default value is `-1` (no limit). If the number of shards in the response exceeds this limit, the API returns a `429` error. To avoid this, you can specify an index pattern filter in your query (for example, `_cat/shards/<index-pattern>`).

- `cat.segments.response.limit.number_of_indices` (Integer): Sets a limit on the number of indexes returned by the [CAT Segments API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-segments/). The default value is `-1` (no limit). If the number of indexes in the response exceeds this limit, the API returns a `429` error. To avoid this, you can specify an index pattern filter in your query (for example, `_cat/segments/<index-pattern>`).

## Cluster-level gateway and indexes settings

OpenSearch supports the following gateway and indexes settings:

- `gateway.slow_write_logging_threshold` (Dynamic, time unit): The threshold for logging slow write operations in gateway cluster state persistence. Default is `10s`. Minimum enforced is `0`.

- `indices.id_field_data.enabled` (Dynamic, Boolean): Controls whether ID field data is enabled for indexes, allowing sorting and aggregating on the `_id` field. Default is `true`.

- `indices.mapping.max_in_flight_updates` (Dynamic, integer): The maximum number of concurrent mapping update requests allowed. Default is `10`. Minimum enforced is `1`. Maximum allowed is `1000`.

- `indices.recovery.internal_action_long_timeout` (Dynamic, time unit): The timeout for long-running internal recovery actions. Default is twice the value of `indices.recovery.internal_action_timeout`. Minimum enforced is `0`.

- `indices.recovery.internal_remote_upload_timeout` (Dynamic, time unit): The timeout for internal remote upload operations during shard recovery. Default is `1h`.

- `indices.replication.initial_retry_backoff_bound` (Dynamic, time unit): The maximum bound for the first retry backoff when replication operations fail. Default is `50ms`. Minimum enforced is `10ms`.

- `indices.replication.retry_timeout` (Dynamic, time unit): The total timeout for retrying failed replication requests. Default is `60s`.

## Cluster-level metadata settings

OpenSearch supports the following cluster-level metadata settings:

- `cluster.metadata.<key>` (Dynamic, varies): Adds cluster metadata in the `"cluster.metadata.key": "value"` format. This setting is useful for persisting arbitrary, infrequently changing information about the cluster, such as contact details or annotations, without creating a dedicated index. **Important**: User-defined cluster metadata is not intended to store sensitive or confidential information. The values are visible to anyone with access to the Get Cluster Settings API and are recorded in the logs.

## Cluster-level remote cluster settings

OpenSearch supports the following remote cluster settings:

- `cluster.remote.initial_connect_timeout` (Dynamic, time unit): Sets the timeout period for establishing initial connections to remote clusters when the node starts. This prevents nodes from hanging indefinitely during startup if remote clusters are unavailable. Default is `30s`.

- `cluster.remote.connections_per_cluster` (Static, integer): The maximum number of connections that will be established to a remote cluster. If there is only a single seed node, other nodes will be discovered up to this number. Default is `3`. Minimum is `1`.

- `cluster.remote.<cluster_alias>.mode` (Dynamic, string): Specifies the connection mode for a specific remote cluster. Valid values are `sniff` (discovers and connects to multiple nodes in the remote cluster) and `proxy` (connects through a single proxy address). Default is `sniff`.

- `node.remote_cluster_client` (Static, Boolean): Controls whether a node can act as a cross-cluster client and connect to remote clusters. Default is `true`. Set to `false` to prevent a node from connecting to remote clusters. Remote cluster requests must be sent to a node on which this setting is enabled.

- `cluster.remote.<cluster_alias>.skip_unavailable` (Dynamic, Boolean): Controls whether cross-cluster operations should continue when this specific remote cluster is unavailable. When set to `true`, the cluster becomes optional and operations will skip it if unreachable. When set to `false`, operations fail if this cluster is unavailable. Default is `false`.

- `cluster.remote.<cluster_alias>.transport.compress` (Dynamic, Boolean): Enables compression for transport communications with a specific remote cluster. When enabled, reduces network bandwidth usage but increases CPU overhead for compression operations. If unset, uses the global `transport.compress` setting as a fallback. Default is `false`.

- `cluster.remote.<cluster_alias>.transport.ping_schedule` (Dynamic, time unit): Sets the interval for sending application-level ping messages to maintain connections with a specific remote cluster. Setting to `-1` disables pings for this cluster. If unset, uses the global `transport.ping_schedule` setting. Default is `-1` (disabled).

- `cluster.remote.<cluster_alias>.seeds` (Dynamic, list): Applicable to `sniff` mode only. Specifies the list of seed nodes used to discover the remote cluster topology. These nodes are contacted initially to retrieve the cluster state and identify gateway nodes for ongoing connections.

- `cluster.remote.<cluster_alias>.node_connections` (Dynamic, integer): Applicable to `sniff` mode only. Sets the number of gateway nodes to which to maintain active connections in the remote cluster. More connections provide better availability but consume more resources. Default is `3`.

- `cluster.remote.node.attr` (Static, string): Applicable to `sniff` mode only. Specifies a node attribute to filter nodes that are eligible as gateway nodes in remote clusters. When set, only remote cluster nodes with the specified attribute will be used for connections. For example, if remote cluster nodes have `node.attr.gateway: true` and this setting is set to `gateway`, only those nodes will be connected to for cross-cluster operations.

- `cluster.remote.<cluster_alias>.proxy_address` (Dynamic, string): Applicable to `proxy` mode only. Specifies the proxy server address for connecting to the remote cluster. All remote connections are routed through this single proxy endpoint.

- `cluster.remote.<cluster_alias>.proxy_socket_connections` (Dynamic, integer): Applicable to `proxy` mode only. Sets the number of socket connections to open to the proxy server for this remote cluster. More connections can improve throughput but consume more resources. Default is `18`.

- `cluster.remote.<cluster_alias>.server_name` (Dynamic, string): Applicable to `proxy` mode only. Specifies the hostname sent in the TLS Server Name Indication (SNI) extension when TLS is enabled for the remote cluster connection. This must be a valid hostname according to TLS SNI specifications.

## Cluster manager task throttling settings

OpenSearch supports the following dynamic cluster manager task throttling settings that control the number of pending tasks for specific cluster manager operations:

- `cluster_manager.throttling.thresholds.<task_name>.value` (Dynamic, integer): Sets the throttling limit for specific cluster manager task types. When this limit is reached, additional tasks of this type are queued rather than processed immediately. Setting to `-1` disables throttling for the specified task type. Default varies by task type. Available task names include:
  - `create-index`: Controls index creation operations
  - `delete-index`: Controls index deletion operations
  - `put-mapping`: Controls mapping update operations
  - `index-aliases`: Controls index alias operations
  - `cluster-update-settings`: Controls cluster settings updates
  - `put-pipeline`: Controls ingest pipeline operations
  - `delete-pipeline`: Controls ingest pipeline deletion
  - `put-search-pipeline`: Controls search pipeline operations
  - `delete-search-pipeline`: Controls search pipeline deletion
  - `put-script`: Controls stored script operations
  - `delete-script`: Controls stored script deletion
  - `create-snapshot`: Controls snapshot creation operations
  - `delete-snapshot`: Controls snapshot deletion operations
  - And other cluster manager task types


## Cluster-level remote store settings

OpenSearch supports the following remote store settings:

For practical examples and step-by-step configuration guides, see [Remote-backed storage]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/).
{: .tip}


- `cluster.remote_store.index.restrict.async-durability` (Static, Boolean): **Restricted Access Setting.** When enabled (`true`), restricts the creation or modification of indexes where `index.translog.durability` is set to `async`. This setting prevents indexes from using async durability mode in remote store environments, enforcing stronger durability guarantees. When  set to `false`, indexes can use any durability mode (`sync` or `async`) and can be switched between modes at any time. When set to `true`, any attempt to create or update an index with `index.translog.durability=async` will be rejected. This setting is specifically designed for remote store deployments where async durability might compromise data consistency. Default is `false`.

- `cluster.remote_store.compatibility_mode` (Dynamic, string): Controls the compatibility mode for remote store operations during cluster migration. Valid values are:
  - `strict`: Only nodes with identical remote store configuration can join the cluster
  - `mixed`: Allows mixed clusters with both remote-store-enabled and regular nodes during migration
  Default is `strict`.

- `cluster.remote_store.state.enabled` (Static, Boolean): Enables remote cluster state functionality. When enabled, cluster state metadata is stored in a remote repository in addition to local storage, enabling features like seamless search replica recovery and improved cluster resilience. This setting must be configured during cluster initialization and requires proper remote repository configuration. Default is `false`.

- `cluster.remote_store.publication.enabled` (Static, Boolean): Enables remote publication of cluster state updates. When enabled, cluster state changes are published to the remote store, allowing for distributed state management and improved cluster coordination. This setting requires `cluster.remote_store.state.enabled` to be `true`. Default is `false`.

- `cluster.remote_store.index_metadata.path_type` (Static, string): Defines the path structure used for storing index metadata in the remote store. Valid values are:
  - `FIXED`: Uses a fixed path structure for metadata storage
  - `HASHED_PREFIX`: Uses a hashed prefix in the path structure for better distribution
  - `HASHED_INFIX`: Uses a hashed infix in the path structure for load balancing
  Default is `HASHED_PREFIX`.

- `cluster.remote_store.index_metadata.path_hash_algo` (Static, string): Specifies the hash algorithm used for constructing prefixes or infixes in index metadata paths when `cluster.remote_store.index_metadata.path_type` is set to `HASHED_PREFIX` or `HASHED_INFIX`. Valid values are:
  - `FNV_1A_BASE64`: Uses FNV-1a hash with Base64 encoding
  - `FNV_1A_COMPOSITE_1`: Uses FNV-1a hash with composite encoding for better distribution
  Default is `FNV_1A_BASE64`.

- `cluster.filecache.remote_data_ratio` (Dynamic, double): Controls the ratio of remote data to local disk cache for file caching in remote store configurations. This setting determines how much remote data is cached locally to improve performance. Higher values cache more data locally but consume more disk space. Value should be between 0.0 and 1.0. Default is `0.8`.

- `cluster.indices.replication.strategy` (Dynamic, string): Sets the replication strategy for indices in the cluster. Valid values include:
  - `DOCUMENT`: Traditional document-based replication
  - `SEGMENT`: Segment-based replication for improved performance and efficiency
  Default is `DOCUMENT`.

- `cluster.index.restrict.replication.type` (Dynamic, Boolean): When enabled, restricts the creation of indices with specific replication types to ensure consistency across the cluster. This setting helps enforce replication policies and prevents incompatible replication configurations. Default is `false`.

