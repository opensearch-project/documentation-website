---
layout: default
title: API
nav_order: 30
parent: k-NN
has_children: false
---

# k-NN plugin API

The k-NN plugin adds several APIs for managing, monitoring and optimizing your k-NN workload.


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
`indices_in_cache` | For each OpenSearch index  with a `knn_vector` field and approximate k-NN turned on, this statistic provides the number of native library indexes that OpenSearch index has and the total `graph_memory_usage` that the OpenSearch index is using, in kilobytes.
`script_compilations` | The number of times the k-NN script has been compiled. This value should usually be 1 or 0, but if the cache containing the compiled scripts is filled, the k-NN script might be recompiled. This statistic is only relevant to k-NN score script search.
`script_compilation_errors` | The number of errors during script compilation. This statistic is only relevant to k-NN score script search.
`script_query_requests` | The total number of script queries. This statistic is only relevant to k-NN score script search.
`script_query_errors` | The number of errors during script queries. This statistic is only relevant to k-NN score script search.
`nmslib_initialized` | Boolean value indicating whether the *nmslib* JNI library has been loaded and initialized on the node.
`faiss_initialized` | Boolean value indicating whether the *faiss* JNI library has been loaded and initialized on the node.
`model_index_status` | Status of model system index. Valid values are "red", "yellow", "green". If the index does not exist, this will be null.
`indexing_from_model_degraded` | Boolean value indicating if indexing from a model is degraded. This will happen if there is not enough JVM memory to cache the models.
`training_requests` | The number of training requests made to the node.
`training_errors` | The number of training errors that have occurred on the node.
`training_memory_usage` | The amount of native memory training is using on the node in kilobytes.
`training_memory_usage_percentage` | The amount of native memory training is using on the node as a percentage of the maximum cache capacity.

**Note**: Some stats contain *graph* in the name. In these cases, *graph* is synonymous with *native library index*. The term *graph* is a legacy detail, coming from when the plugin only supported the HNSW algorithm, which consists of hierarchical graphs. 


### Usage

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
Introduced 1.0
{: .label .label-purple }

The native library indexes used to perform approximate k-Nearest Neighbor (k-NN) search are stored as special files with other Apache Lucene segment files. In order for you to perform a search on these indexes using the k-NN plugin, the plugin needs to load these files into native memory.

If the plugin hasn't loaded the files into native memory, it loads them when it receives a search request. The loading time can cause high latency during initial queries. To avoid this situation, users often run random queries during a warmup period. After this warmup period, the files are loaded into native memory and their production workloads can begin. This loading process is indirect and requires extra effort.

As an alternative, you can avoid this latency issue by running the k-NN plugin warmup API operation on whatever indexes you're interested in searching. This operation loads all the native library files for all of the shards (primaries and replicas) of all the indexes specified in the request into native memory.

After the process finishes, you can start searching against the indexes with no initial latency penalties. The warmup API operation is idempotent, so if a segment's native library files are already loaded into memory, this operation has no impact. It only loads files that aren't currently in memory.


### Usage

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

The call doesn't return results until the warmup operation finishes or the request times out. If the request times out, the operation still continues on the cluster. To monitor the warmup operation, use the OpenSearch `_tasks` API:

```json
GET /_tasks
```

After the operation has finished, use the [k-NN `_stats` API operation](#stats) to see what the k-NN plugin loaded into the graph.


### Best practices

For the warmup operation to function properly, follow these best practices:

* Don't run merge operations on indexes that you want to warm up. During merge, the k-NN plugin creates new segments, and old segments are sometimes deleted. For example, you could encounter a situation in which the warmup API operation loads native library indexes A and B into native memory, but segment C is created from segments A and B being merged. The native library indexes for A and B would no longer be in memory, and native library index C would also not be in memory. In this case, the initial penalty for loading native library index C is still present.

* Confirm that all native library indexes you want to warm up can fit into native memory. For more information about the native memory limit, see the [knn.memory.circuit_breaker.limit statistic]({{site.url}}{{site.baseurl}}/search-plugins/knn/settings#cluster-settings). High graph memory usage causes cache thrashing, which can lead to operations constantly failing and attempting to run again.

* Don't index any documents that you want to load into the cache. Writing new information to segments prevents the warmup API operation from loading the native library indexes until they're searchable. This means that you would have to run the warmup operation again after indexing finishes.

## Get Model
Introduced 1.2
{: .label .label-purple }

Used to retrieve information about models present in the cluster. Some native library index configurations require a 
training step before indexing and querying can begin. The output of training is a model that can then be used to 
initialize native library index files during indexing. The model is serialized in the k-NN model system index.  

```
GET /_plugins/_knn/models/{model_id}
```

Response Field |  Description
:--- | :---
`model_id` | The id of the fetched model.
`model_blob` | The base64 encoded string of the serialized model.
`state` | Current state of the model. Either "created", "failed", "training".
`timestamp` | Time when the model was created.
`description` | User provided description of the model.
`error` | Error message explaining why the model is in the failed state.
`space_type` | Space type this model is trained for.
`dimension` | Dimension this model is for.
`engine` | Native library used to create model. Either "faiss" or "nmslib". 

### Usage

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

## Search Model
Introduced 1.2
{: .label .label-purple }

Use an OpenSearch query to search for models in the index.

### Usage
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

## Delete Model
Introduced 1.2
{: .label .label-purple }

Used to delete a particular model in the cluster.

### Usage

```json
DELETE /_plugins/_knn/models/{model_id}
{
  "model_id": {model_id},
  "acknowledged": true
}
```

## Train Model
Introduced 1.2
{: .label .label-purple }

Create and train a model that can be used for initializing k-NN native library indexes during indexing. This API will 
pull training data from a `knn_vector` field in a training index and then create and train a model and then serialize it
to the model system index. Training data must match the dimension passed into the body of the request. This request 
will return when training begins. To monitor the state of the model, use the [Get model API](#get-model).  

Query Parameter |  Description
:--- | :---
`model_id` | (Optional) The id of the fetched model. If not specified, a random id will be generated.
`node_id` | (Optional) Preferred node to execute training. If set, this node will be used to perform training if it is deemed to be capable.

Request Parameter |  Description
:--- | :---
`training_index` | Index from where training data from.
`training_field` | `knn_vector` field from `training_index` to grab training data from. Dimension of this field must match `dimension` passed in to this request.  
`dimension` | Dimension this model is for.
`max_training_vector_count` | (Optional) Maximum number of vectors from the training index to use for training. Defaults to all of the vectors in the index.
`search_size` | (Optional) Training data is pulled from the training index with scroll queries. Defines the number of results to return per scroll query. Defaults to 10,000.
`description` | (Optional) User provided description of the model.
`method` | Configuration of ANN method used for search. For more information about possible methods, refer to the [method documentation]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index#method-definitions). Method must require training to be valid.
   

### Usage

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
