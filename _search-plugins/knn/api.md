---
layout: default
title: k-NN API
nav_order: 5
parent: k-NN
has_children: false
canonical_url: https://docs.opensearch.org/latest/search-plugins/knn/api/
---

# k-NN plugin API

The k-NN plugin adds two API operations to help you better manage the plugin's functionality.


## Stats
Introduced 1.0
{: .label .label-purple }

The k-NN `stats` API provides information about the current status of the k-NN plugin. The plugin keeps track of both cluster-level and node-level statistics. Cluster-level statistics have a single value for the entire cluster. Node-level statistics have a single value for each node in the cluster. You can filter the query by `nodeId` and `statName`:
```
GET /_plugins/_knn/nodeId1,nodeId2/stats/statName1,statName2
```

Statistic |  Description
:--- | :---
`circuit_breaker_triggered` | Indicates whether the circuit breaker is triggered. This statistic is only relevant to approximate k-NN search.
`total_load_time` | The time in nanoseconds that k-NN has taken to load graphs into the cache. This statistic is only relevant to approximate k-NN search.
`eviction_count` | The number of graphs that have been evicted from the cache due to memory constraints or idle time. This statistic is only relevant to approximate k-NN search. <br /> **Note**: Explicit evictions that occur because of index deletion aren't counted.
`hit_count` | The number of cache hits. A cache hit occurs when a user queries a graph that's already loaded into memory. This statistic is only relevant to approximate k-NN search.
`miss_count` | The number of cache misses. A cache miss occurs when a user queries a graph that isn't loaded into memory yet. This statistic is only relevant to approximate k-NN search.
`graph_memory_usage` | Current cache size (total size of all graphs in memory) in kilobytes. This statistic is only relevant to approximate k-NN search.
`graph_memory_usage_percentage` | The current weight of the cache as a percentage of the maximum cache capacity.
`graph_index_requests` | The number of requests to add the `knn_vector` field of a document into a graph.
`graph_index_errors` | The number of requests to add the `knn_vector` field of a document into a graph that have produced an error.
`graph_query_requests` | The number of graph queries that have been made.
`graph_query_errors` | The number of graph queries that have produced an error.
`knn_query_requests` | The number of k-NN query requests received.
`cache_capacity_reached` | Whether `knn.memory.circuit_breaker.limit` has been reached. This statistic is only relevant to approximate k-NN search.
`load_success_count` | The number of times k-NN successfully loaded a graph into the cache. This statistic is only relevant to approximate k-NN search.
`load_exception_count` | The number of times an exception occurred when trying to load a graph into the cache. This statistic is only relevant to approximate k-NN search.
`indices_in_cache` | For each index that has graphs in the cache, this statistic provides the number of graphs that index has and the total `graph_memory_usage` that index is using, in kilobytes.
`script_compilations` | The number of times the k-NN script has been compiled. This value should usually be 1 or 0, but if the cache containing the compiled scripts is filled, the k-NN script might be recompiled. This statistic is only relevant to k-NN score script search.
`script_compilation_errors` | The number of errors during script compilation. This statistic is only relevant to k-NN score script search.
`script_query_requests` | The total number of script queries. This statistic is only relevant to k-NN score script search.
`script_query_errors` | The number of errors during script queries. This statistic is only relevant to k-NN score script search.


### Usage

```json
GET /_plugins/_knn/stats?pretty
{
    "_nodes" : {
        "total" : 1,
        "successful" : 1,
        "failed" : 0
    },
    "cluster_name" : "_run",
    "circuit_breaker_triggered" : false,
    "nodes" : {
        "HYMrXXsBSamUkcAjhjeN0w" : {
            "eviction_count" : 0,
            "miss_count" : 1,
            "graph_memory_usage" : 1,
            "graph_memory_usage_percentage" : 3.68,
            "graph_index_requests" : 7,
            "graph_index_errors" : 1,
            "knn_query_requests" : 4,
            "graph_query_requests" : 30,
            "graph_query_errors" : 15,
            "indices_in_cache" : {
                "myindex" : {
                    "graph_memory_usage" : 2,
                    "graph_memory_usage_percentage" : 3.68,
                    "graph_count" : 2
                }
            },
            "cache_capacity_reached" : false,
            "load_exception_count" : 0,
            "hit_count" : 0,
            "load_success_count" : 1,
            "total_load_time" : 2878745,
            "script_compilations" : 1,
            "script_compilation_errors" : 0,
            "script_query_requests" : 534,
            "script_query_errors" : 0
        }
    }
}
```

```json
GET /_plugins/_knn/HYMrXXsBSamUkcAjhjeN0w/stats/circuit_breaker_triggered,graph_memory_usage?pretty
{
    "_nodes" : {
        "total" : 1,
        "successful" : 1,
        "failed" : 0
    },
    "cluster_name" : "_run",
    "circuit_breaker_triggered" : false,
    "nodes" : {
        "HYMrXXsBSamUkcAjhjeN0w" : {
            "graph_memory_usage" : 1
        }
    }
}
```


## Warmup operation
Introduced 1.0
{: .label .label-purple }

The Hierarchical Navigable Small World (HNSW) graphs used to perform an approximate k-Nearest Neighbor (k-NN) search are stored as `.hnsw` files with other Apache Lucene segment files. In order for you to perform a search on these graphs using the k-NN plugin, the plugin needs to load these files into native memory.

If the plugin hasn't loaded the graphs into native memory, it loads them when it receives a search request. The loading time can cause high latency during initial queries. To avoid this situation, users often run random queries during a warmup period. After this warmup period, the graphs are loaded into native memory and their production workloads can begin. This loading process is indirect and requires extra effort.

As an alternative, you can avoid this latency issue by running the k-NN plugin warmup API operation on whatever indices you're interested in searching. This operation loads all the graphs for all of the shards (primaries and replicas) of all the indices specified in the request into native memory.

After the process finishes, you can start searching against the indices with no initial latency penalties. The warmup API operation is idempotent, so if a segment's graphs are already loaded into memory, this operation has no impact on those graphs. It only loads graphs that aren't currently in memory.


### Usage

This request performs a warmup on three indices:

```json
GET /_plugins/_knn/warmup/index1,index2,index3?pretty
{
  "_shards" : {
    "total" : 6,
    "successful" : 6,
    "failed" : 0
  }
}
```

`total` indicates how many shards the k-NN plugin attempted to warm up. The response also includes the number of shards the plugin succeeded and failed to warm up.

The call doesn't return results until the warmup operation finishes or the request times out. If the request times out, the operation still continues on the cluster. To monitor the warmup operation, use the OpenSearch `_tasks` API:

```json
GET /_tasks
```

After the operation has finished, use the [k-NN `_stats` API operation](#stats) to see what the k-NN plugin loaded into the graph.


### Best practices

For the warmup operation to function properly, follow these best practices:

* Don't run merge operations on indices that you want to warm up. During merge, the k-NN plugin creates new segments, and old segments are sometimes deleted. For example, you could encounter a situation in which the warmup API operation loads graphs A and B into native memory, but segment C is created from segments A and B being merged. The graphs for A and B would no longer be in memory, and graph C would also not be in memory. In this case, the initial penalty for loading graph C is still present.

* Confirm that all graphs you want to warm up can fit into native memory. For more information about the native memory limit, see the [knn.memory.circuit_breaker.limit statistic]({{site.url}}{{site.baseurl}}/search-plugins/knn/settings#cluster-settings). High graph memory usage causes cache thrashing, which can lead to operations constantly failing and attempting to run again.

* Don't index any documents that you want to load into the cache. Writing new information to segments prevents the warmup API operation from loading the graphs until they're searchable. This means that you would have to run the warmup operation again after indexing finishes.
