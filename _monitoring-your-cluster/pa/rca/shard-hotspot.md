---
layout: default
title: Shard hotspot identification
parent: Root Cause Analysis
grand_parent: Performance Analyzer
nav_order: 30
---

## Shard hotspot identification

With the shard hotspot identification RCA, you can identify a hot shard within an index. A hot shard is an outlier that consumes more resources than its counterparts. The shard hotspot identification RCA monitors the following metrics:

- `CPU_Utilization`
- `Heap_AllocRate`

These metrics provide an accurate picture of operation intensities for certain shards, such as the following: 

- Bulk requests - High heap allocation rate.
- Search requests - High CPU utilization, more complex queries, and heap allocation rates.
- Document updates - Relatively high balance between `CPU_Utilization` and `Heap_AllocRate`.

The shard hotspot identification RCA looks at the `CPU_Utilization` and `Heap_AllocRate` metric data and compares the values against the threshold for each resource. If the usage for any of these resources is greater than their individual threshold, the context is marked as "unhealthy" and creates a "Hot Shard Resource Summary" for the shard.

For in-depth information regarding the operation of the shard hotspot identification RCA, see the following [Github readme](https://github.com/opensearch-project/performance-analyzer-rca/blob/main/src/main/java/org/opensearch/performanceanalyzer/rca/store/rca/hotshard/docs/README.md).

#### Example request

```bash
GET localhost:9600/_plugins/_performanceanalyzer/rca?name=HotShardClusterRca
```

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