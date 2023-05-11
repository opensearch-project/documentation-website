---
layout: default
title: Hot shard identification
parent: Root Cause Analysis
grand_parent: Performance Analyzer
nav_order: 30
---

# Hot shard identification

Hot shard identification root cause analysis (RCA) lets you identify a hot shard within an index. A hot shard is an outlier that consumes more resources than other shards and may lead to poor indexing and search performance. The hot shard identification RCA monitors the following metrics:

- CPU utilization
- Heap allocation rate

Shards may become hot because of the nature of your workload. When you use a `_routing` parameter or a custom document ID, a specific shard or several shards within the cluster receive frequent updates, consuming more CPU and heap resources than other shards.

The hot shard identification RCA compares the CPU utilization and heap allocation rates against their threshold values. If the usage for either metric is greater than the threshold, the shard is considered to be _hot_.

For more information about the hot shard identification RCA implementation, see [Hot Shard RCA](https://github.com/opensearch-project/performance-analyzer-rca/blob/main/src/main/java/org/opensearch/performanceanalyzer/rca/store/rca/hotshard/docs/README.md).

#### Example request

The following query requests hot shard identification:

```bash
GET _plugins/_performanceanalyzer/rca?name=HotShardClusterRca
```
{% include copy-curl.html %}

#### Example Response

The response contains a list of unhealthy shards:

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

## Response fields

The following table lists the response fields.

Field | Type | Description
:--- | :--- | :---
rca_name | String | The name of the RCA. In this case, "HotShardClusterRca".
timestamp | Integer | The timestamp of the RCA.
state | Object | The state of the cluster determined by the RCA. The `state` can be `healthy`, `unhealthy`, or `unknown`.
HotClusterSummary.HotNodeSummary.number_of_nodes | Integer | The number of nodes in the cluster.
HotClusterSummary.HotNodeSummary.number_of_unhealthy_nodes | Integer | The number of nodes found to be in an `unhealthy` state.
HotClusterSummary.HotNodeSummary.HotResourceSummary.resource_type | Object | The type of resource causing the unhealthy state, either "cpu usage" or "heap".
HotClusterSummary.HotNodeSummary.HotResourceSummary.resource_metric | String | The definition of the resource_type. Either "cpu usage(num of cores)" or "heap alloc rate(heap alloc rate in bytes per second)".
HotClusterSummary.HotNodeSummary.HotResourceSummary.threshold | Float | The value that determines whether a resource is contended.
HotClusterSummary.HotNodeSummary.HotResourceSummary.value | Float | The current value of the resource.
HotClusterSummary.HotNodeSummary.HotResourceSummary.time_period_seconds | Time | The amount of time that a shard was monitored before its state was declared to be healthy or unhealthy.
HotClusterSummary.HotNodeSummary.HotResourceSummary.meta_data | String | The metadata associated with the resource_type.

In the preceding example response, `meta_data` is `QRF4rBM7SNCDr1g3KU6HyA index9 0`. The `meta_data` string consists of three fields:

- Node name: `QRF4rBM7SNCDr1g3KU6HyA`
- Index name: `index9`
- Shard ID: `0`

This means that shard `0` of index `index9` on node `QRF4rBM7SNCDr1g3KU6HyA` is hot.