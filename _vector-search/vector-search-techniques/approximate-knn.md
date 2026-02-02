---
layout: default
title: Approximate k-NN search
nav_order: 15
parent: Vector search techniques
has_children: false
has_math: true
redirect_from:
  - /search-plugins/knn/approximate-knn/ 
---

# Approximate k-NN search

Standard k-nearest neighbors (k-NN) search methods compute similarity using a brute-force approach that measures the nearest distance between a query and a number of points, which produces exact results. This works well in many applications. However, in the case of extremely large datasets with high dimensionality, this creates a scaling problem that reduces the efficiency of the search. Approximate k-NN search methods can overcome this by employing tools that restructure indexes more efficiently and reduce the dimensionality of searchable vectors. Using this approach requires a sacrifice in accuracy but increases search processing speeds appreciably.

The approximate k-NN search methods in OpenSearch use approximate nearest neighbor (ANN) algorithms from the [NMSLIB](https://github.com/nmslib/nmslib), [Faiss](https://github.com/facebookresearch/faiss), and [Lucene](https://lucene.apache.org/) libraries to power k-NN search. These search methods employ ANN to improve search latency for large datasets. Of the three search methods OpenSearch provides, this method offers the best search scalability for large datasets. This approach is the preferred method when a dataset reaches hundreds of thousands of vectors.

For information about the algorithms OpenSearch supports, see [Methods and engines]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-methods-engines/).
{: .note}

OpenSearch builds a native library index of the vectors for each `knn-vector` field/Lucene segment pair during indexing, which can be used to efficiently find the k-nearest neighbors to a query vector during search. To learn more about Lucene segments, see the [Apache Lucene documentation](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/codecs/lucene87/package-summary.html#package.description). These native library indexes are loaded into native memory during search and managed by a cache. To learn more about preloading native library indexes into memory, see [Warmup API]({{site.url}}{{site.baseurl}}/vector-search/api/knn#warmup-operation). Additionally, you can see which native library indexes are already loaded into memory using the [Stats API]({{site.url}}{{site.baseurl}}/vector-search/api/knn#stats).

Because the native library indexes are constructed during indexing, it is not possible to apply a filter on an index and then use this search method. All filters are applied to the results produced by the ANN search.

## Get started with approximate k-NN

To use the approximate search functionality, you must first create a vector index with `index.knn` set to `true`. This setting tells OpenSearch to create native library indexes for the index.

Next, you must add one or more fields of the `knn_vector` data type. The following example creates an index with two `knn_vector` fields using the `faiss` engine:

```json
PUT my-knn-index-1
{
  "settings": {
    "index": {
      "knn": true,
      "knn.algo_param.ef_search": 100
    }
  },
  "mappings": {
    "properties": {
        "my_vector1": {
          "type": "knn_vector",
          "dimension": 2,
          "space_type": "l2",
          "method": {
            "name": "hnsw",
            "engine": "faiss",
            "parameters": {
              "ef_construction": 128,
              "m": 24
            }
          }
        },
        "my_vector2": {
          "type": "knn_vector",
          "dimension": 4,
          "space_type": "innerproduct",
          "method": {
            "name": "hnsw",
            "engine": "faiss",
            "parameters": {
              "ef_construction": 256,
              "m": 48
            }
          }
        }
    }
  }
}
```
{% include copy-curl.html %}

In the preceding example, both `knn_vector` fields are configured using method definitions. Additionally, `knn_vector` fields can be configured using models. For more information, see [k-NN vector]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-vector/).

The `knn_vector` data type supports a vector of floats that can have a dimension count of up to 16,000 for the NMSLIB, Faiss, and Lucene engines, as set by the `dimension` mapping parameter.

In OpenSearch, codecs handle the storage and retrieval of indexes. OpenSearch uses a custom codec to write vector data to native library indexes so that the underlying k-NN search library can read it.
{: .tip }

After you create the index, you can add some data to it:

```json
POST _bulk
{ "index": { "_index": "my-knn-index-1", "_id": "1" } }
{ "my_vector1": [1.5, 2.5], "price": 12.2 }
{ "index": { "_index": "my-knn-index-1", "_id": "2" } }
{ "my_vector1": [2.5, 3.5], "price": 7.1 }
{ "index": { "_index": "my-knn-index-1", "_id": "3" } }
{ "my_vector1": [3.5, 4.5], "price": 12.9 }
{ "index": { "_index": "my-knn-index-1", "_id": "4" } }
{ "my_vector1": [5.5, 6.5], "price": 1.2 }
{ "index": { "_index": "my-knn-index-1", "_id": "5" } }
{ "my_vector1": [4.5, 5.5], "price": 3.7 }
{ "index": { "_index": "my-knn-index-1", "_id": "6" } }
{ "my_vector2": [1.5, 5.5, 4.5, 6.4], "price": 10.3 }
{ "index": { "_index": "my-knn-index-1", "_id": "7" } }
{ "my_vector2": [2.5, 3.5, 5.6, 6.7], "price": 5.5 }
{ "index": { "_index": "my-knn-index-1", "_id": "8" } }
{ "my_vector2": [4.5, 5.5, 6.7, 3.7], "price": 4.4 }
{ "index": { "_index": "my-knn-index-1", "_id": "9" } }
{ "my_vector2": [1.5, 5.5, 4.5, 6.4], "price": 8.9 }
```
{% include copy-curl.html %}

Then you can run an ANN search on the data using the `knn` query type:

```json
GET my-knn-index-1/_search
{
  "size": 2,
  "query": {
    "knn": {
      "my_vector2": {
        "vector": [2, 3, 5, 6],
        "k": 2
      }
    }
  }
}
```
{% include copy-curl.html %}

## The number of returned results

In the preceding query, `k` represents the number of neighbors returned by the search of each graph. You must also include the `size` parameter, indicating the final number of results that you want the query to return.  

For the NMSLIB and Faiss engines, `k` represents the maximum number of documents returned for all segments of a shard. For the Lucene engine, `k` represents the number of documents returned for a shard. The maximum value of `k` is 10,000.

For any engine, each shard returns `size` results to the coordinator node. Thus, the total number of results that the coordinator node receives is `size * number of shards`. After the coordinator node consolidates the results received from all nodes, the query returns the top `size` results.

The following table provides examples of the number of results returned by various engines in several scenarios. For these examples, assume that the number of documents contained in the segments and shards is sufficient to return the number of results specified in the table.

`size` 	| `k` | Number of primary shards | 	Number of segments per shard | Number of returned results, Faiss/NMSLIB | Number of returned results, Lucene
:--- | :--- | :--- | :--- | :--- | :---
10 |	1 |	1 |	4 |	4 | 1
10 | 10 |	1 |	4 |	10 | 10
10 |	1 |	2 |	4 |	8 | 2

The number of results returned by Faiss/NMSLIB differs from the number of results returned by Lucene only when `k` is smaller than `size`. If `k` and `size` are equal, all engines return the same number of results. 

Starting in OpenSearch 2.14, you can use `k`, `min_score`, or `max_distance` for [radial search]({{site.url}}{{site.baseurl}}/search-plugins/knn/radial-search-knn/).

## Building a vector index from a model

For some of the algorithms that OpenSearch supports, the native library index needs to be trained before it can be used. It would be expensive to train every newly created segment, so, instead, OpenSearch features the concept of a *model* that initializes the native library index during segment creation. You can create a model by calling the [Train API]({{site.url}}{{site.baseurl}}/vector-search/api/knn#train-a-model) and passing in the source of the training data and the method definition of the model. Once training is complete, the model is serialized to a k-NN model system index. Then, during indexing, the model is pulled from that index to initialize the segments.

To train a model, you first need an OpenSearch index containing training data. Training data can come from any `knn_vector` field that has a dimension matching the dimension of the model you want to create. Training data can be the same as the data you plan to index or come from a separate dataset. To create a training index, send the following request:

```json
PUT /train-index
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 0
  },
  "mappings": {
    "properties": {
      "train-field": {
        "type": "knn_vector",
        "dimension": 4
      }
    }
  }
}
```
{% include copy-curl.html %}

Notice that `index.knn` is not set in the index settings. This ensures that you do not create native library indexes for this index.

You can now add some data to the index:

```json
POST _bulk
{ "index": { "_index": "train-index", "_id": "1" } }
{ "train-field": [1.5, 5.5, 4.5, 6.4]}
{ "index": { "_index": "train-index", "_id": "2" } }
{ "train-field": [2.5, 3.5, 5.6, 6.7]}
{ "index": { "_index": "train-index", "_id": "3" } }
{ "train-field": [4.5, 5.5, 6.7, 3.7]}
{ "index": { "_index": "train-index", "_id": "4" } }
{ "train-field": [1.5, 5.5, 4.5, 6.4]}
```
{% include copy-curl.html %}

After completing indexing into the training index, you can call the Train API:

```json
POST /_plugins/_knn/models/my-model/_train
{
  "training_index": "train-index",
  "training_field": "train-field",
  "dimension": 4,
  "description": "My model description",
  "method": {
    "name": "ivf",
    "engine": "faiss",
    "parameters": {
      "encoder": {
        "name": "pq",
        "parameters": {
          "code_size": 2,
          "m": 2
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

For more information about the method parameters, see [IVF training requirements]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-methods-engines/#ivf-training-requirements).

The Train API returns as soon as the training job is started. To check the job status, use the Get Model API:

```json
GET /_plugins/_knn/models/my-model?filter_path=state&pretty
{
  "state": "training"
}
```
{% include copy-curl.html %}

Once the model enters the `created` state, you can create an index that will use this model to initialize its native library indexes:

```json
PUT /target-index
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 1,
    "index.knn": true
  },
  "mappings": {
    "properties": {
      "target-field": {
        "type": "knn_vector",
        "model_id": "my-model"
      }
    }
  }
}
```
{% include copy-curl.html %}

Lastly, you can add the documents you want to be searched to the index:

```json
POST _bulk
{ "index": { "_index": "target-index", "_id": "1" } }
{ "target-field": [1.5, 5.5, 4.5, 6.4]}
{ "index": { "_index": "target-index", "_id": "2" } }
{ "target-field": [2.5, 3.5, 5.6, 6.7]}
{ "index": { "_index": "target-index", "_id": "3" } }
{ "target-field": [4.5, 5.5, 6.7, 3.7]}
{ "index": { "_index": "target-index", "_id": "4" } }
{ "target-field": [1.5, 5.5, 4.5, 6.4]}
```
{% include copy-curl.html %}

After data is ingested, it can be searched in the same way as any other `knn_vector` field.
