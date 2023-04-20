---
layout: default
title: Shard hotspot identification
parent: Root Cause Analysis
grand_parent: Performance Analyzer
nav_order: 30
---

## Shard hotspot identification

With the shard hotspot identification Root Cause Analysis (RCA), you can identify a hot shard within an index. A hot shard is an outlier that consumes more resources than other shards and may lead to poor indexing and search performance. The shard hotspot identification RCA monitors the following metrics:

- CPU utilization
- Heap allocation rate

These metrics provide an accurate picture of operation intensities for certain shards, such as the following: 

- Bulk requests: High heap allocation rate.
- Search requests: High CPU utilization
- Complex queries: High CPU utilization and high heap allocation rate.
- Document updates: High CPU utilization and high heap allocation rate.

The shard hotspot identification RCA compares the CPU utilization and heap allocation rate against their threshold values. If the usage for either metric is greater than the threshold, the shard is considered a hot spot.

For more information about the shard hotspot identification RCA implementation, see [Hot Shard RCA](https://github.com/opensearch-project/performance-analyzer-rca/blob/main/src/main/java/org/opensearch/performanceanalyzer/rca/store/rca/hotshard/docs/README.md).

#### Example request

The following example requests the shard hotspot identification RCA:

```bash
GET _plugins/_performanceanalyzer/rca?name=HotShardClusterRca
```
{% include copy-curl.html %}

#### Response

```json
"HotShardClusterRca": [{
  "rca_name": "HotShardClusterRca",
  "timestamp": 1680721367563,
  "state": "unhealthy",
  "HotClusterSummary": [
    {
      "number_of_nodes": 3,
      "number_of_unhealthy_nodes": 1,
      "HotNodeSummary": [
        {
          "node_id": "7kosAbpASsqBoHmHkVXxmw",
          "host_address": "192.168.80.4",
          "HotResourceSummary": [
            {
              "resource_type": "cpu usage",
              "resource_metric": "cpu usage(num of cores)",
              "threshold": 0.027397981341796683,
              "value": 0.034449630200405396,
              "time_period_seconds": 60,
              "meta_data": "ssZw1WRUSHS5DZCW73BOJQ index9 4"
            },
            {
              "resource_type": "heap",
              "resource_metric": "heap alloc rate(heap alloc rate in bytes per second)",
              "threshold": 7605441.367010161,
              "value": 10872119.748328414,
              "time_period_seconds": 60,
              "meta_data": "ssZw1WRUSHS5DZCW73BOJQ index9 4"
            },
            {
              "resource_type": "heap",
              "resource_metric": "heap alloc rate(heap alloc rate in bytes per second)",
              "threshold": 7605441.367010161,
              "value": 8019622.354388569,
              "time_period_seconds": 60,
              "meta_data": "QRF4rBM7SNCDr1g3KU6HyA index9 0"
            }
          ]
        }
      ]
    }
  ]
}]
```

Response field parameters.

Field | Type | Description
:--- | :--- | :---
rca_name | String | The name of the RCA. In this case, "HotShardClusterRca".
timestamp | Integer | The timestamp of the RCA
state | Object | The state of the cluster determined by the RCA. Either `healthy` or `unhealthy`.
HotClusterSummary.HotNodeSummary.number_of_nodes | Integer | The number of nodes in the cluster.
HotClusterSummary.HotNodeSummary.number_of_unhealthy_nodes | Integer | The number of nodes found to be in an `unhealthy` state.
HotClusterSummary.HotNodeSummary.HotResourceSummary.resource_type | Object | The type of resource checked, either "cpu usage" or "heap".
HotClusterSummary.HotNodeSummary.HotResourceSummary.resource_metric | String | The definition of the resource_type. Either "cpu usage(num of cores)" or "heap alloc rate(heap alloc rate in bytes per second)".
HotClusterSummary.HotNodeSummary.HotResourceSummary.threshold | Float | The value that determines if a resource is highly utilized.
HotClusterSummary.HotNodeSummary.HotResourceSummary.value | Float | The current value of the resource.
HotClusterSummary.HotNodeSummary.HotResourceSummary.time_period_seconds | Time | The amount of time that the resource_type has to be above the threshold value in order to mark the shard state as `unhealthy`.
HotClusterSummary.HotNodeSummary.HotResourceSummary.meta_data | String | The metadata associated with the resource_type.