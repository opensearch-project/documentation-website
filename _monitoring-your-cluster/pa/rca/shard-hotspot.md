---
layout: default
title: Shard hotspot identification
parent: Root Cause Analysis
grand_parent: Performance Analyzer
nav_order: 30
---

## Shard hotspot identification

With the Shard Hotspot Identification RCA, you can identify a hot shard within an index. A hot shard is a resource consuming outlier within its counterparts. The RCA subscribes to following metrics:

- `CPU_Utilization`
- `Heap_AllocRate`

While there is only two of them, these metrics provide accurate picture of operation intensities for a certain shard like Bulk request - high heap allocation rate, Search request - high CPU utilization and for more complex queries also heap allocation rate, Document update - relatively high balance between these two metrics. The RCA looks at the above two metric data and compares the values against the threshold for each resource and if the usage for any of the resources is greater than their individual threshold, we mark the context as 'UnHealthy' and create a `HotShardResourceSummary` for the shard.

In order to have a full picture of the index-level shard stats, and to detect outliers, cluster variant - `HotShardClusterRCA` is to be used as a downstream RCA to the `HotShardRCAs` running on each Data node.
  
In every RCA period, all existing shards are taken into account within this RCA. This number can go up to 1000 per Node and thus create huge memory footprint for both the Cluster Manager and Data nodes, if implementation is handled naively.

To minimize the core of the footprint (memory allocated for the whole duration of each RCA period which directly scales with number of shards), a single map, mapping unique Index, Shard combination to the highly specific structure, called `SummarizedWindow` is used.

`HotShardRCA` period consists of `SLIDING_WINDOW_IN_SECONDS/5` (default being 12) operate ticks, each of them consuming metric aggregations from previous 5 seconds, more precisely the 5-second SUM aggregation of each metric. `SummarizedWindow` accumulates these aggregation over the period of `SLIDING_WINDOW_IN_SECONDS` (by default 1 minute) and is later used to calculate the over time average of these accumulated metrics. Note that summarization would give us a little less information than the average value as some shards may start or stop being active anywhere inside the RCA period. This is why more general case structures like `SlidingWindow` offer us a granularity that we don't need and by omitting them, considerable amount of heap is saved. Also, inside the same single `SummarizedWindow`, all metrics are getting aggregated at once, this way eliminating duplicated timestamps and shard identification data.

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