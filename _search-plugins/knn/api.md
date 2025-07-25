---
layout: default
title: k-NN plugin API
nav_order: 30
parent: k-NN search
has_children: false
canonical_url: https://docs.opensearch.org/latest/search-plugins/knn/api/
---

# k-NN plugin API

The k-NN plugin adds several APIs for managing, monitoring, and optimizing your k-NN workload.

## Stats

The k-NN `stats` API provides information about the current status of the k-NN plugin. The plugin keeps track of both cluster-level and node-level statistics. Cluster-level statistics have a single value for the entire cluster. Node-level statistics have a single value for each node in the cluster. You can filter the query by `nodeId` and `statName`, as shown in the following example:

```
GET /_plugins/_knn/nodeId1,nodeId2/stats/statName1,statName2
```

Statistic |  Description
:--- | :---
`circuit_breaker_triggered` | Indicates whether the circuit breaker is triggered. This statistic is only relevant to approximate k-NN search.
`total_load_time` | The time in nanoseconds that k-NN has taken to load native library indexes into the cache. This statistic is only relevant to approximate k-NN search.
`eviction_count` | The number of native library indexes that have been evicted from the cache due to memory constraints or idle time. This statistic is only relevant to approximate k-NN search. <br /> **Note**: Explicit evictions that occur because of index deletion aren't counted.
`hit_count` | The number of cache hits. A cache hit occurs when a user queries a native library index that's already loaded into memory. This statistic is only relevant to approximate k-NN search.
`miss_count` | The number of cache misses. A cache miss occurs when a user queries a native library index that isn't loaded into memory yet. This statistic is only relevant to approximate k-NN search.
`graph_memory_usage` | The amount of native memory native library indexes are using on the node in kilobytes.
`graph_memory_usage_percentage` | The amount of native memory native library indexes are using on the node as a percentage of the maximum cache capacity.
`graph_index_requests` | The number of requests to add the `knn_vector` field of a document into a native library index.
`graph_index_errors` | The number of requests to add the `knn_vector` field of a document into a native library index that have produced an error.
`graph_query_requests` | The number of native library index queries that have been made.
`graph_query_errors` | The number of native library index queries that have produced an error.
`knn_query_requests` | The number of k-NN query requests received.
`cache_capacity_reached` | Whether `knn.memory.circuit_breaker.limit` has been reached. This statistic is only relevant to approximate k-NN search.
`load_success_count` | The number of times k-NN successfully loaded a native library index into the cache. This statistic is only relevant to approximate k-NN search.
`load_exception_count` | The number of times an exception occurred when trying to load a native library index into the cache. This statistic is only relevant to approximate k-NN search.
`indices_in_cache` | For each OpenSearch index with a `knn_vector` field and approximate k-NN turned on, this statistic provides the number of native library indexes that OpenSearch index has and the total `graph_memory_usage` that the OpenSearch index is using, in kilobytes.
`script_compilations` | The number of times the k-NN script has been compiled. This value should usually be 1 or 0, but if the cache containing the compiled scripts is filled, the k-NN script might be recompiled. This statistic is only relevant to k-NN score script search.
`script_compilation_errors` | The number of errors during script compilation. This statistic is only relevant to k-NN score script search.
`script_query_requests` | The total number of script queries. This statistic is only relevant to k-NN score script search.
`script_query_errors` | The number of errors during script queries. This statistic is only relevant to k-NN score script search.
`nmslib_initialized` | Boolean value indicating whether the *nmslib* JNI library has been loaded and initialized on the node.
`faiss_initialized` | Boolean value indicating whether the *faiss* JNI library has been loaded and initialized on the node.
`model_index_status` | Status of model system index. Valid values are "red", "yellow", "green". If the index does not exist, this will be null.
`indexing_from_model_degraded` | Boolean value indicating if indexing from a model is degraded. This happens if there is not enough JVM memory to cache the models.
`ing_requests` | The number of training requests made to the node.
`training_errors` | The number of training errors that have occurred on the node.
`training_memory_usage` | The amount of native memory training is using on the node in kilobytes.
`training_memory_usage_percentage` | The amount of native memory training is using on the node as a percentage of the maximum cache capacity.

Some statistics contain *graph* in the name. In these cases, *graph* is synonymous with *native library index*. The term *graph* is reflective of when the plugin only supported the HNSW algorithm, which consists of hierarchical graphs.
{: .note}

#### Usage

The following code examples show how to retrieve statistics related to the k-NN plugin. The first example fetches comprehensive statistics for the k-NN plugin across all nodes in the cluster, while the second example retrieves specific metrics (circuit breaker status and graph memory usage) for a single node.

```json
GET /_plugins/_knn/stats?pretty
{
    "_nodes" : {
        "total" : 1,
        "successful" : 1,
        "failed" : 0
    },
    "cluster_name" : "my-cluster",
    "circuit_breaker_triggered" : false,
    "model_index_status" : "YELLOW",
    "nodes" : {
      "JdfxIkOS1-43UxqNz98nw" : {
        "graph_memory_usage_percentage" : 3.68,
        "graph_query_requests" : 1420920,
        "graph_memory_usage" : 2,
        "cache_capacity_reached" : false,
        "load_success_count" : 179,
        "training_memory_usage" : 0,
        "indices_in_cache" : {
            "myindex" : {
                "graph_memory_usage" : 2,
                "graph_memory_usage_percentage" : 3.68,
                "graph_count" : 2
            }
        },
        "script_query_errors" : 0,
        "hit_count" : 1420775,
        "knn_query_requests" : 147092,
        "total_load_time" : 2436679306,
        "miss_count" : 179,
        "training_memory_usage_percentage" : 0.0,
        "graph_index_requests" : 656,
        "faiss_initialized" : true,
        "load_exception_count" : 0,
        "training_errors" : 0,
        "eviction_count" : 0,
        "nmslib_initialized" : false,
        "script_compilations" : 0,
        "script_query_requests" : 0,
        "graph_query_errors" : 0,
        "indexing_from_model_degraded" : false,
        "graph_index_errors" : 0,
        "training_requests" : 17,
        "script_compilation_errors" : 0
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
    "cluster_name" : "my-cluster",
    "circuit_breaker_triggered" : false,
    "nodes" : {
        "HYMrXXsBSamUkcAjhjeN0w" : {
            "graph_memory_usage" : 1
        }
    }
}
```

## Warmup operation

The native library indexes used to perform approximate k-NN search are stored as special files with other Apache Lucene segment files. To perform a search on these indexes using the k-NN plugin, the plugin needs to load these files into native memory.

If the plugin has not loaded the files into native memory, then it loads them when it receives a search request. The loading time can cause high latency during initial queries. To avoid this, users often run random queries during a warmup period. After this warmup period, the files are loaded into native memory, and their production workloads can launch. This loading process is indirect and requires extra effort.

As an alternative, you can avoid this latency issue by running the k-NN plugin warmup API operation on the indexes you want to search. This operation loads all the native library files for all the shards (primaries and replicas) of all the indexes specified in the request into native memory.

After the process is finished, you can search against the indexes without initial latency penalties. The warmup API operation is idempotent, so if a segment's native library files are already loaded into memory, this operation has no effect. It only loads files not currently stored in memory.

#### Usage

This request performs a warmup on three indexes:

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

The call does not return results until the warmup operation finishes or the request times out. If the request times out, then the operation continues on the cluster. To monitor the warmup operation, use the OpenSearch `_tasks` API:

```json
GET /_tasks
```

After the operation has finished, use the [k-NN `_stats` API operation](#stats) to see what the k-NN plugin loaded into the graph.

### Best practices

For the warmup operation to function properly, follow these best practices:

* Do not run merge operations on indexes that you want to warm up. During a merge operation, the k-NN plugin creates new segments, and old segments are sometimes deleted. For example, you could encounter a situation in which the warmup API operation loads native library indexes A and B into native memory but segment C is created from segments A and B being merged. Native library indexes A and B would no longer be in memory, and native library index C would also not be in memory. In this case, the initial penalty for loading native library index C still exists.

* Confirm that all native library indexes you want to warm up can fit into native memory. For more information about the native memory limit, see the [knn.memory.circuit_breaker.limit statistic]({{site.url}}{{site.baseurl}}/search-plugins/knn/settings#cluster-settings). High graph memory usage causes cache thrashing, which can lead to operations constantly failing and attempting to run again.

* Do not index any documents that you want to load into the cache. Writing new information to segments prevents the warmup API operation from loading the native library indexes until they are searchable. This means that you would have to run the warmup operation again after indexing.

## k-NN clear cache
Introduced 2.14
{: .label .label-purple }

During approximate k-NN search or warmup operations, the native library indexes (`nmslib` and `faiss` engines) are loaded into native memory. Currently, you can evict an index from cache or native memory by either deleting the index or setting the k-NN cluster settings `knn.cache.item.expiry.enabled` and `knn.cache.item.expiry.minutes`, which removes the index from the cache if it is idle for a given period of time. However, you cannot evict an index from the cache without deleting the index. To solve this problem, you can use the k-NN clear cache API operation, which clears a given set of indexes from the cache.

The k-NN clear cache API evicts all native library files for all shards (primaries and replicas) of all indexes specified in the request. Similarly to how the [warmup operation](#warmup-operation) behaves, the k-NN clear cache API is idempotent, meaning that if you try to clear the cache for an index that has already been evicted from the cache, it does not have any additional effect.

This API operation only works with indexes created using the `nmslib` and `faiss` engines. It has no effect on indexes created using the `lucene` engine.
{: .note}

#### Usage

The following request evicts the native library indexes of three indexes from the cache:

```json
GET /_plugins/_knn/clear_cache/index1,index2,index3?pretty
{
  "_shards" : {
    "total" : 6,
    "successful" : 6,
    "failed" : 0
  }
}
```

The `total` parameter indicates the number of shards that the API attempted to clear from the cache. The response includes both the number of cleared shards and the number of shards that the plugin failed to clear.

The k-NN clear cache API can be used with index patterns to clear one or more indexes that match the given pattern from the cache, as shown in the following example:

```json
GET /_plugins/_knn/clear_cache/index*?pretty
{
  "_shards" : {
    "total" : 6,
    "successful" : 6,
    "failed" : 0
  }
}
```

The API call does not return results until the operation finishes or the request times out. If the request times out, then the operation continues on the cluster. To monitor the request, use the `_tasks` API, as shown in the following example:

```json
GET /_tasks
```

When the operation finishes, use the [k-NN `_stats` API operation](#stats) to see which indexes have been evicted from the cache.

## Get a model

The GET model operation retrieves information about models present in the cluster. Some native library index configurations require a training step before indexing and querying can begin. The output of training is a model that can be used to initialize native library index files during indexing. The model is serialized in the k-NN model system index. See the following GET example:

```
GET /_plugins/_knn/models/{model_id}
```

Response field |  Description
:--- | :---
`model_id` | The unique identifier of the fetched model.
`model_blob` | The base64 encoded string of the serialized model.
`state` | The model's current state, which can be `created`, `failed`, or `training`.
`timestamp` | The date and time when the model was created.
`description` | A user-provided description of the model.
`error` | An error message explaining why the model is in a failed state.
`space_type` | The space type for which this model is trained, for example, Euclidean or cosine.
`dimension` | The dimensionality of the vector space for which this model is designed.
`engine` | The native library used to create the model, either `faiss` or `nmslib`. 

### Usage

The following examples show how to retrieve information about a specific model using the k-NN plugin API. The first example returns all the available information about the model, while the second example shows how to selectively retrieve fields.

```json
GET /_plugins/_knn/models/test-model?pretty
{
  "model_id" : "test-model",
  "model_blob" : "SXdGbIAAAAAAAAAAAA...",
  "state" : "created",
  "timestamp" : "2021-11-15T18:45:07.505369036Z",
  "description" : "Default",
  "error" : "",
  "space_type" : "l2",
  "dimension" : 128,
  "engine" : "faiss" 
}
```

```json
GET /_plugins/_knn/models/test-model?pretty&filter_path=model_id,state
{
  "model_id" : "test-model",
  "state" : "created"
}
```

## Search for a model

You can use an OpenSearch query to search for a model in the index. See the following usage example. 

#### Usage

The following example shows how to search for k-NN models in an OpenSearch cluster and how to retrieve the metadata for those models, excluding the potentially large `model_blob` field:

```json
GET/POST /_plugins/_knn/models/_search?pretty&_source_excludes=model_blob
{
    "query": {
         ...
     }
}

{
    "took" : 0,
    "timed_out" : false,
    "_shards" : {
        "total" : 1,
        "successful" : 1,
        "skipped" : 0,
        "failed" : 0
    },
    "hits" : {
      "total" : {
          "value" : 1,
          "relation" : "eq"
      },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : ".opensearch-knn-models",
        "_id" : "test-model",
        "_score" : 1.0,
        "_source" : {
          "engine" : "faiss",
          "space_type" : "l2",
          "description" : "Default",
          "model_id" : "test-model",
          "state" : "created",
          "error" : "",
          "dimension" : 128,
          "timestamp" : "2021-11-15T18:45:07.505369036Z"
        }
      }
    ]
  }
}
```

## Delete a model

You can delete a model in the cluster by using the DELETE operation. See the following usage example. 

#### Usage

The following example shows how to delete a k-NN model:

```json
DELETE /_plugins/_knn/models/{model_id}
{
  "model_id": {model_id},
  "acknowledged": true
}
```

## Train a model

You can create and train a model that can be used for initializing k-NN native library indexes during indexing. This API pulls training data from a `knn_vector` field in a training index, creates and trains a model, and then serializes it to the model system index. Training data must match the dimension passed in the request body. This request is returned when training begins. To monitor the model's state, use the [Get model API](#get-a-model).  

Query parameter |  Description
:--- | :---
`model_id` | The unique identifier of the fetched model. If not specified, then a random ID is generated. Optional. 
`node_id` | Specifies the preferred node on which to execute the training process. If provided, the specified node is used for training if it has the necessary capabilities and resources available. Optional.

Request parameter |  Description
:--- | :---
`training_index` | The index from which the training data is retrieved.
`training_field` | The `knn_vector` field in the `training_index` from which the training data is retrieved. The dimension of this field must match the `dimension` passed in this request.  
`dimension` | The dimension of the model being trained.
`max_training_vector_count` | The maximum number of vectors from the training index to be used for training. Defaults to all the vectors in the index. Optional.
`search_size` | The training data is pulled from the training index using scroll queries. This parameter defines the number of results to return per scroll query. Default is `10000`. Optional.
`description` | A user-provided description of the model. Optional.
`method` | The configuration of the approximate k-NN method used for search operations. For more information about the available methods, see [k-NN index method definitions]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index#method-definitions). The method requires training to be valid.
   
#### Usage

The following examples show how to initiate the training process for a k-NN model:

```json
POST /_plugins/_knn/models/{model_id}/_train?preference={node_id}
{
    "training_index": "train-index-name",
    "training_field": "train-field-name",
    "dimension": 16,
    "max_training_vector_count": 1200,
    "search_size": 100,
    "description": "My model",
    "method": {
        "name":"ivf",
        "engine":"faiss",
        "space_type": "l2",
        "parameters":{
            "nlist":128,
            "encoder":{
                "name":"pq",
                "parameters":{
                    "code_size":8
                }
            }
        }
    }
}

{
    "model_id": "model_x"
}
```

```json
POST /_plugins/_knn/models/_train?preference={node_id}
{
    "training_index": "train-index-name",
    "training_field": "train-field-name",
    "dimension": 16,
    "max_training_vector_count": 1200,
    "search_size": 100,
    "description": "My model",
    "method": {
        "name":"ivf",
        "engine":"faiss",
        "space_type": "l2",
        "parameters":{
            "nlist":128,
            "encoder":{
                "name":"pq",
                "parameters":{
                    "code_size":8
                }
            }
        }
    }
}

{
    "model_id": "dcdwscddscsad"
}
```
