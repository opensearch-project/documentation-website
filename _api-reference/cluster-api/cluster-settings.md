---
layout: default
title: Cluster settings
nav_order: 50
parent: Cluster APIs
redirect_from:
  - /api-reference/cluster-settings/
  - /opensearch/rest-api/cluster-settings/
---

# Cluster settings
**Introduced 1.0**
{: .label .label-purple }

The cluster settings operation lets you check the current settings for your cluster, review default settings, and change settings. When you update a setting using the API, OpenSearch applies it to all nodes in the cluster.

## Path and HTTP methods

```
GET _cluster/settings
PUT _cluster/settings
```

## Path parameters

All cluster setting parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
flat_settings | Boolean | Whether to return settings in the flat form, which can improve readability, especially for heavily nested settings. For example, the flat form of `"cluster": { "max_shards_per_node": 500 }` is `"cluster.max_shards_per_node": "500"`.
include_defaults (GET only) | Boolean | Whether to include default settings as part of the response. This parameter is useful for identifying the names and current values of settings you want to update.
cluster_manager_timeout | Time unit | The amount of time to wait for a response from the cluster manager node. Default is `30 seconds`.
timeout (PUT only) | Time unit | The amount of time to wait for a response from the cluster. Default is `30 seconds`.


#### Example request

```json
GET _cluster/settings?include_defaults=true
```
{% include copy-curl.html %}

#### Example response

```json
PUT _cluster/settings
{
   "persistent":{
      "action.auto_create_index": false
   }
}
```

## Request fields

The GET operation has no request body options. All cluster setting field parameters are optional.

Not all cluster settings can be updated using the cluster settings API. You will receive the error message `"setting [cluster.some.setting], not dynamically updateable"` when trying to configure these settings via the API.
{: .note }

The following request field parameters are compatible with the cluster API.

| Field | Data type | Description |
| :--- | :--- | :--- |
| plugins.security_analytics.enable_workflow_usage | Boolean | Supports Alerting plugin workflow integration with Security Analytics. Determines whether composite monitor workflows are generated for the Alerting plugin after creating a new threat detector in Security Analytics. By default, the setting is `true`. <br> <br> When set to `true`, composite monitor workflows based on an associated threat detector's configuration are enabled. When set to `false`, composite monitor workflows based on an associated threat detector's configuration are disabled. <br> <br> For more information about Alerting plugin workflow integration with Security Analytics, see [Integrated Alerting plugin workflows]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/detectors-config/#integrated-alerting-plugin-workflows). |
| action.auto_create_index | Boolean | Automatically creates an index if the index doesn't already exist. Also applies any index templates that are configured. Default is `true`. |
| action.destructive_requires_name | Boolean | When set to `true`, you must specify the index name to delete an index. You cannot delete all indexes or use wildcards. Default is `true`. |
| cluster.indices.close.enable | Boolean | Enables closing of open indexes in OpenSearch. Default is `true`. |
| indices.recovery.max_bytes_per_sec | String | Limits the total inbound and outbound recovery traffic for each node. This applies to peer recoveries and snapshot recoveries. Default is `40mb`. If you set the recovery traffic value to less than or equal to `0mb`, rate limiting will be disabled, which causes recovery data to be transferred at the highest possible rate. |
| indices.recovery.max_concurrent_file_chunks | Integer | The number of file chunks sent in parallel for each recovery operation. Default is `2`. |
| indices.recovery.max_concurrent_operations | Integer | The number of operations sent in parallel for each recovery. Default is `1`. |
| logger.org.opensearch.discovery | String | Loggers accept Log4j2’s built-in log levels: `OFF`, `FATAL`, `ERROR`, `WARN`, `INFO`, `DEBUG`, and `TRACE`. Default is `INFO`. |
| breaker.model_inference.limit | String | The limit for the trained model circuit breaker. Default is `50%` of the JVM heap. |
| breaker.model_inference.overhead | Integer | The constant that all trained model estimations are multiplied by to determine a final estimation. Default is `1`. |
| search.max_buckets | Integer | The maximum number of aggregation buckets allowed in a single response. Default is `65536`. |
| snapshot.max_concurrent_operations | Integer | The maximum number of concurrent snapshot operations. Default is `1000`. |
| slm.health.failed_snapshot_warn_threshold | String | The number of failed invocations since the last successful snapshot that will indicate a problem as per the health API profile. Default is five repeated failures: `5L`. |
| indices.breaker.total.limit | String | The starting limit for the overall parent breaker. Default is `70%` of the JVM heap if `indices.breaker.total.use_real_memory` is set to `false`. Default is `95%` of the JVM heap if `indices.breaker.total.use_real_memory` is set to `true`. |
| indices.breaker.fielddata.limit | String | The limit for the fielddata breaker. Default is `40%` of the JVM heap. |
| indices.breaker.fielddata.overhead | Floating point | The constant that all fielddata estimations are multiplied by to determine a final estimation. Default is `1.03`. |
| indices.breaker.request.limit | String | The limit for the request breaker. Default is `60%` of the JVM heap. |
| indices.breaker.request.overhead | Integer | The constant that all request estimations are multiplied by to determine a final estimation. Default is `1`. |
| network.breaker.inflight_requests.limit | String | The limit for the in-flight requests breaker. Default is `100%` of the JVM heap. |
| network.breaker.inflight_requests.overhead | Integer/Time unit | The constant that all in-flight request estimations are multiplied by to determine a final estimation. Default is `2`. |
| script.max_compilations_rate | String | The limit for the number of unique dynamic scripts within a defined interval that are allowed to be compiled. Default is 150 every 5 minutes: `150/5m`. |
| cluster.default.index.refresh_interval | Time unit | Sets the refresh interval when the `index.refresh_interval` setting is not provided. This setting can be useful when you want to set a default refresh interval across all indexes in a cluster and also support the `searchIdle` setting. You cannot set the interval lower than the `cluster.minimum.index.refresh_interval` setting. |
| cluster.minimum.index.refresh_interval | Time unit | Sets the minimum refresh interval and applies it to all indexes in the cluster. The `cluster.default.index.refresh_interval` setting should be higher than this setting's value. If, during index creation, the `index.refresh_interval` setting is lower than the minimum set, index creation fails. |
| cluster.remote_store.translog.buffer_interval | Time unit | The default value of the translog buffer interval used when performing periodic translog updates. This setting is only effective when the index setting `index.remote_store.translog.buffer_interval` is not present. |
| cluster.routing.allocation.enable | String | Enables or disables allocation for specific kinds of shards: <br /> <br /> `all` – Allows shard allocation for all types of shards. <br /> <br /> `primaries` – Allows shard allocation for primary shards only. <br /> <br /> `new_primaries` – Allows shard allocation for primary shards for new indexes only. <br /> <br /> `none` – No shard allocations are allowed for any indexes. <br /> <br /> Default is `all`. |
| cluster.routing.allocation.node_concurrent_incoming_recoveries | Integer | Configures how many concurrent incoming shard recoveries are allowed to happen on a node. Default is `2`. |
| cluster.routing.allocation.node_concurrent_outgoing_recoveries | Integer | Configures how many concurrent outgoing shard recoveries are allowed to happen on a node. Default is `2`. |
| cluster.routing.allocation.node_concurrent_recoveries | String | Used to set `cluster.routing.allocation.node_concurrent_incoming_recoveries` and `cluster.routing.allocation.node_concurrent_outgoing_recoveries` to the same value. |
| cluster.routing.allocation.node_initial_primaries_recoveries | Integer | Sets the number of recoveries for unassigned primaries after a node restart. Default is `4`. |
| cluster.routing.allocation.same_shard.host | Boolean | When set to `true`, multiple copies of a shard are prevented from being allocated to distinct nodes on the same host. Default is `false`. |
| cluster.routing.rebalance.enable | String | Enables or disables rebalancing for specific kinds of shards: <br /> <br /> `all` – Allows shard balancing for all types of shards. <br /> <br /> `primaries` – Allows shard balancing for primary shards only. <br /> <br /> `replicas` – Allows shard balancing for replica shards only. <br /> <br /> `none` – No shard balancing is allowed for any indexes. <br /> <br /> Default is `all`. |
| cluster.routing.allocation.allow_rebalance | String | Specifies when shard rebalancing is allowed: <br /> <br /> `always` – Always allow rebalancing. <br /> <br /> `indices_primaries_active` – Only allow rebalancing when all primaries in the cluster are allocated. <br /> <br /> `indices_all_active` – Only allow rebalancing when all shards in the cluster are allocated. <br /> <br /> Default is `indices_all_active`. |
| cluster.routing.allocation.cluster_concurrent_rebalance | Integer | Allows you to control how many concurrent shard rebalances are allowed across a cluster. Default is `2`. |
| cluster.routing.allocation.balance.shard | Floating point | Defines the weight factor for the total number of shards allocated per node. Default is `0.45`. |
| cluster.routing.allocation.balance.index | Floating point | Defines the weight factor for the number of shards per index allocated on a node. Default is `0.55`. |
| cluster.routing.allocation.balance.threshold | Floating point | The minimum optimization value of operations that should be performed. Default is `1.0`. |
| cluster.routing.allocation.balance.prefer_primary | Boolean | When set to `true`, OpenSearch attempts to evenly distribute the primary shards between the cluster nodes. Enabling this setting does not always guarantee an equal number of primary shards on each node, especially in the event of failover. Changing this setting to `false` after it was set to `true` does not invoke redistribution of primary shards. Default is `false`.
| cluster.routing.allocation.disk.threshold_enabled | Boolean | When set to `false`, disables the disk allocation decider. This will also remove any existing `index.blocks.read_only_allow_delete index blocks` when disabled. Default is `true`. |
| cluster.routing.allocation.disk.watermark.low | String | Controls the low watermark for disk usage. When set to a percentage, OpenSearch will not allocate shards to nodes with that percentage of disk used. This can also be entered as ratio value, like `0.85`. Finally, this can also be set to a byte value, like `400mb`. This setting does not affect the primary shards of newly-created indexes, but will prevent their replicas from being allocated. Default is `85%`. |
| cluster.routing.allocation.disk.watermark.high | String | Controls the high watermark. OpenSearch will attempt to relocate shards away from a node whose disk usage is above the percentage defined. This can also be entered as a ratio value, like `0.85`. Finally, this can also be set to a byte value, like `400mb`. This setting affects the allocation of all shards. Default is `90%`. |
| cluster.routing.allocation.disk.watermark.flood_stage | String | Controls the flood stage watermark. This is a last resort to prevent nodes from running out of disk space. OpenSearch enforces a read-only index block (`index.blocks.read_only_allow_delete`) on every index that has one or more shards allocated on the node, and that has at least one disk exceeding the flood stage. The index block is released once the disk utilization falls below the high watermark.  This can also be entered as a ratio value, like `0.85`. Finally, this can also be set to a byte value, like `400mb`. Default is `95%`. |
| cluster.info.update.interval | Time unit | Sets how often OpenSearch should check disk usage for each node in the cluster. Default is `30s`. |
| cluster.routing.allocation.include.<attribute> | Enum | Allocates shards to a node whose `attribute` has at least one of the included comma-separated values. |
| cluster.routing.allocation.require.<attribute> | Enum | Only allocates shards to a node whose `attribute` has all of the included comma-separated values. |
| cluster.routing.allocation.exclude.<attribute> | Enum | Does not allocate shards to a node whose `attribute` has any of the included comma-separated values. The cluster allocation settings support the following built-in attributes: <br /> <br /> `_name` – Match nodes by node name. <br /> <br /> `_host_ip` – Match nodes by host IP address. <br /> <br /> `_publish_ip` – Match nodes by publish IP address. <br /> <br /> `_ip` – Match either `_host_ip` or `_publish_ip`. <br /> <br /> `_host` – Match nodes by hostname. <br /> <br /> `_id` – Match nodes by node ID. <br /> <br /> `_tier` – Match nodes by data tier role. |
| cluster.routing.allocation.shard_movement_strategy | Enum |  Determines the order in which shards are relocated from outgoing to incoming nodes. This setting supports the following strategies: <br /> <br /> `PRIMARY_FIRST` – Primary shards are relocated first, before replica shards. This prioritization may help prevent a cluster's health status from going red if the relocating nodes fail during the process. <br /> <br /> `REPLICA_FIRST` – Replica shards are relocated first, before primary shards. This prioritization may help prevent a cluster's health status from going red when carrying out shard relocation in a mixed-version, segment-replication-enabled OpenSearch cluster. In this situation, primary shards relocated to OpenSearch nodes of a newer version could try to copy segment files to replica shards on an older version of OpenSearch, which would result in shard failure. Relocating replica shards first may help to avoid this in multi-version clusters. <br /> <br /> `NO_PREFERENCE` – The default behavior in which the order of shard relocation has no importance.
| cluster.blocks.read_only | Boolean | Sets the entire cluster to read-only. Default is `false`. |
| cluster.blocks.read_only_allow_delete | Boolean | Similar to `cluster.blocks.read_only` but allows you to delete indexes. |
| cluster.max_shards_per_node | Integer | Limits the total number of primary and replica shards for the cluster. The limit is calculated as follows: `cluster.max_shards_per_node` multiplied by the number of non-frozen data nodes. Shards for closed indexes do not count toward this limit. Default is `1000`. |
| cluster.persistent_tasks.allocation.enable | String | Enables or disables allocation for persistent tasks: <br /> <br /> `all` – Allows persistent tasks to be assigned to nodes. <br /> <br /> `none` – No allocations are allowed for persistent tasks. This does not affect persistent tasks already running. <br /> <br /> Default is `all`. |
| cluster.persistent_tasks.allocation.recheck_interval | Time unit | The cluster manager automatically checks whether or not persistent tasks need to be assigned when the cluster state changes in a significant way. There are other factors, such as memory usage, that will affect whether or not persistent tasks are assigned to nodes but do not otherwise cause the cluster state to change. This setting defines how often assignment checks are performed in response to these factors. Default is `30 seconds`, with a minimum of `10 seconds` being required. |
| remote_store.moving_average_window_size | Integer | The moving average window size used to calculate the rolling statistic values exposed through the [Remote Store Stats API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/remote-store-stats-api/). Default is `20`. Minimum enforced is `5`. |
| indices.time_series_index.default_index_merge_policy | String | This setting allows you to specify the default merge policy for time-series indexes, particularly for those with an `@timestamp` field, such as data streams. The two available options are `tiered` (default) and `log_byte_size`. We recommend using `log_byte_size` for time-series indexes to enhance the performance of range queries with the `@timestamp` field. To override the merge policy on a per-index basis, you can use the `index.merge.policy` index setting. |


#### Example request

For a PUT operation, the request body must contain `transient` or `persistent`, along with the setting you want to update:

```json
PUT _cluster/settings
{
   "persistent":{
      "cluster.max_shards_per_node": 500
   }
}
```
{% include copy-curl.html %}

For more information about transient settings, persistent settings, and precedence, see [OpenSearch configuration]({{site.url}}{{site.baseurl}}/install-and-configure/configuration/).

#### Example response

```json
{
   "acknowledged":true,
   "persistent":{
      "cluster":{
         "max_shards_per_node":"500"
      }
   },
   "transient":{}
}
```
