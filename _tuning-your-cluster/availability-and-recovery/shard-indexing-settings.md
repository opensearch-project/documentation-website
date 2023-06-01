---
layout: default
title: Settings
parent: Shard indexing backpressure
nav_order: 50
grand_parent: Availability and recovery
redirect_from: 
  - /opensearch/shard-indexing-settings/
---

# Settings

Shard indexing backpressure adds several settings to the standard OpenSearch cluster settings. They are dynamic, so you can change the default behavior of this feature without restarting your cluster.

## High-level controls

The high-level controls allow you to turn the shard indexing backpressure feature on or off.

Setting | Default | Description
:--- | :--- | :---
`shard_indexing_pressure.enabled` | False | Change to `true` to enable shard indexing backpressure.
`shard_indexing_pressure.enforced` | False | Run shard indexing backpressure in shadow mode or enforced mode. In shadow mode (value set as `false`), shard indexing backpressure tracks all granular-level metrics, but it doesn't actually reject any indexing requests. In enforced mode (value set as `true`), shard indexing backpressure rejects any requests to the cluster that might cause a dip in its performance.

## Node-level limits

Node-level limits allow you to control memory usage on a node.

Setting | Default | Description
:--- | :--- | :---
`shard_indexing_pressure.primary_parameter.node.soft_limit` | 70% | Define the percentage of the node-level memory threshold that acts as a soft indicator for strain on a node.

## Shard-level limits

Shard-level limits allow you to control memory usage on a shard.

Setting | Default | Description
:--- | :--- | :---
`shard_indexing_pressure.primary_parameter.shard.min_limit` | 0.001d | Specify the minimum assigned quota for a new shard in any role (coordinator, primary, or replica). Shard indexing backpressure increases or decreases this allocated quota based on the inflow of traffic for the shard.
`shard_indexing_pressure.operating_factor.lower` | 75% | Specify the lower occupancy limit of the allocated quota of memory for the shard. If the total memory usage of a shard is below this limit, shard indexing backpressure decreases the current allocated memory for that shard.
`shard_indexing_pressure.operating_factor.optimal` | 85% | Specify the optimal occupancy of the allocated quota of memory for the shard. If the total memory usage of a shard is at this level, shard indexing backpressure doesn't change the current allocated memory for that shard.
`shard_indexing_pressure.operating_factor.upper` | 95% | Specify the upper occupancy limit of the allocated quota of memory for the shard. If the total memory usage of a shard is above this limit, shard indexing backpressure increases the current allocated memory for that shard.

## Performance degradation factors

The performance degradation factors allow you to control the dynamic performance thresholds for a shard.

Setting | Default | Description
:--- | :--- | :---
`shard_indexing_pressure.secondary_parameter.throughput.request_size_window` | 2,000 | The number of requests in the sampling window size on a shard. Shard indexing backpressure compares the overall performance of requests with the requests in the sample window to detect any performance degradation.
`shard_indexing_pressure.secondary_parameter.throughput.degradation_factor` | 5x | The degradation factor per unit byte for a request. This parameter determines the threshold for any latency spikes. The default value is 5x, which implies that if the latency shoots up 5 times in the historic view, shard indexing backpressure marks it as a performance degradation.
`shard_indexing_pressure.secondary_parameter.successful_request.elapsed_timeout` | 300000 ms | The amount of time a request is pending in a cluster. This parameter helps identify any stuck-request scenarios.
`shard_indexing_pressure.secondary_parameter.successful_request.max_outstanding_requests` | 100 | The maximum number of pending requests in a cluster.
