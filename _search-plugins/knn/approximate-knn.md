---
layout: default
title: Approximate search
nav_order: 2
parent: k-NN
has_children: false
has_math: true
canonical_url: https://docs.opensearch.org/latest/search-plugins/knn/approximate-knn/
---

# Approximate k-NN search

The approximate k-NN search method uses nearest neighbor algorithms from *nmslib* and *faiss* to power
k-NN search. To see the algorithms that the plugin currently supports, check out the [k-NN Index documentation]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index#method-definitions).
In this case, approximate means that for a given search, the neighbors returned are an estimate of the true k-nearest neighbors. Of the three search methods the plugin provides, this method offers the best search scalability for large data sets. Generally speaking, once the data set gets into the hundreds of thousands of vectors, this approach is preferred.

The k-NN plugin builds a native library index of the vectors for each "knn-vector field"/ "Lucene segment" pair during indexing that can be used to efficiently find the k-nearest neighbors to a query vector during search. To learn more about Lucene segments, see the [Apache Lucene documentation](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/codecs/lucene87/package-summary.html#package.description).
These native library indices are loaded into native memory during search and managed by a cache. To learn more about
pre-loading native library indices into memory, refer to the [warmup API]({{site.url}}{{site.baseurl}}/search-plugins/knn/api#warmup-operation). Additionally, you can see what native library indices are already loaded in memory, which you can learn more about in the [stats API section]({{site.url}}{{site.baseurl}}/search-plugins/knn/api#stats).

Because the native library indices are constructed during indexing, it is not possible to apply a filter on an index
and then use this search method. All filters are applied on the results produced by the approximate nearest neighbor search.

## Get started with approximate k-NN

To use the k-NN plugin's approximate search functionality, you must first create a k-NN index with setting `index.knn` to `true`. This setting tells the plugin to create native library indices for the index.

Next, you must add one or more fields of the `knn_vector` data type. This example creates an index with two
`knn_vector`'s, one using *faiss*, the other using *nmslib*, fields:

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
          "method": {
            "name": "hnsw",
            "space_type": "l2",
            "engine": "nmslib",
            "parameters": {
              "ef_construction": 128,
              "m": 24
            }
          }
        },
        "my_vector2": {
          "type": "knn_vector",
          "dimension": 4,
          "method": {
            "name": "hnsw",
            "space_type": "innerproduct",
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

In the example above, both `knn_vector`s are configured from method definitions. Additionally, `knn_vector`s can also be configured from models. Learn more about it [here]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index#knn_vector-data-type)!

The `knn_vector` data type supports a vector of floats that can have a dimension of up to 10,000, as set by the
dimension mapping parameter.

In OpenSearch, codecs handle the storage and retrieval of indices. The k-NN plugin uses a custom codec to write vector data to native library indices so that the underlying k-NN search library can read it.
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

Then you can execute an approximate nearest neighbor search on the data using the `knn` query type:

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

`k` is the number of neighbors the search of each graph will return. You must also include the `size` option, which
indicates how many results the query actually returns. The plugin returns `k` amount of results for each shard
(and each segment) and `size` amount of results for the entire query. The plugin supports a maximum `k` value of 10,000.

### Building a k-NN index from a model

For some of the algorithms that we support, the native library index needs to be trained before it can be used. It would be expensive to training every newly created segment, so, instead, we introduce the concept of a *model* that is used to initialize the native library index during segment creation. A *model* is created by calling the [Train API]({{site.url}}{{site.baseurl}}/search-plugins/knn/api#train-model), passing in the source of training data as well as the method definition of the model. Once training is complete, the model will be serialized to a k-NN model system index. Then, during indexing, the model is pulled from this index to initialize the segments.

To train a model, we first need an OpenSearch index with training data in it. Training data can come from
any `knn_vector` field that has a dimension matching the dimension of the model you want to create. Training data can be the same data that you are going to index or have in a separate set. Let's create a training index:

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

Notice that `index.knn` is not set in the index settings. This ensures that we do not create native library indices for this index.

Next, let's add some data to it:

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

After indexing into the training index completes, we can call the Train API:

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
    "space_type": "l2",
    "parameters": {
      "nlist": 4,
      "nprobes": 2
    }
  }
}
```

The Train API will return as soon as the training job is started. To check its status, we can use the Get Model API:

```json
GET /_plugins/_knn/models/my-model?filter_path=state&pretty
{
  "state": "training"
}
```

Once the model enters the "created" state, we can create an index that will use this model to initialize it's native
library indices:

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

Lastly, we can add the documents we want to be searched to the index:
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
...
```

After data is ingested, it can be search just like any other `knn_vector` field!

### Using approximate k-NN with filters
If you use the `knn` query alongside filters or other clauses (e.g. `bool`, `must`, `match`), you might receive fewer than `k` results. In this example, `post_filter` reduces the number of results from 2 to 1:

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
  },
  "post_filter": {
    "range": {
      "price": {
        "gte": 5,
        "lte": 10
      }
    }
  }
}
```

## Spaces

A space corresponds to the function used to measure the distance between two points in order to determine the k-nearest neighbors. From the k-NN perspective, a lower score equates to a closer and better result. This is the opposite of how OpenSearch scores results, where a greater score equates to a better result. To convert distances to OpenSearch scores, we take 1 / (1 + distance). The k-NN plugin the spaces the plugin supports are below. Not every method supports each of these spaces. Be sure to check out [the method documentation]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index#method-definitions) to make sure the space you are interested in is supported.

<table>
  <thead style="text-align: center">
  <tr>
    <th>spaceType</th>
    <th>Distance Function (d)</th>
    <th>OpenSearch Score</th>
  </tr>
  </thead>
  <tr>
    <td>l1</td>
    <td>\[ d(\mathbf{x}, \mathbf{y}) = \sum_{i=1}^n |x_i - y_i| \]</td>
    <td>\[ score = {1 \over 1 + d } \]</td>
  </tr>
  <tr>
    <td>l2</td>
    <td>\[ d(\mathbf{x}, \mathbf{y}) = \sum_{i=1}^n (x_i - y_i)^2 \]</td>
    <td>\[ score = {1 \over 1 + d } \]</td>
  </tr>
  <tr>
    <td>linf</td>
    <td>\[ d(\mathbf{x}, \mathbf{y}) = max(|x_i - y_i|) \]</td>
    <td>\[ score = {1 \over 1 + d } \]</td>
  </tr>
  <tr>
    <td>cosinesimil</td>
    <td>\[ d(\mathbf{x}, \mathbf{y}) = 1 - cos { \theta } = 1 - {\mathbf{x} &middot; \mathbf{y} \over \|\mathbf{x}\| &middot; \|\mathbf{y}\|}\]\[ = 1 - 
    {\sum_{i=1}^n x_i y_i \over \sqrt{\sum_{i=1}^n x_i^2} &middot; \sqrt{\sum_{i=1}^n y_i^2}}\]
    where \(\|\mathbf{x}\|\) and \(\|\mathbf{y}\|\) represent normalized vectors.</td>
    <td>\[ score = {1 \over 1 + d } \]</td>
  </tr>
  <tr>
    <td>innerproduct</td>
    <td>\[ d(\mathbf{x}, \mathbf{y}) = - {\mathbf{x} &middot; \mathbf{y}} = - \sum_{i=1}^n x_i y_i \]</td>
    <td>\[ \text{If} d \ge 0, \] \[score = {1 \over 1 + d }\] \[\text{If} d < 0, score = &minus;d + 1\]</td>
  </tr>
</table>

The cosine similarity formula does not include the `1 -` prefix. However, because similarity search libraries equates
smaller scores with closer results, they return `1 - cosineSimilarity` for cosine similarity space---that's why `1 -` is
included in the distance function.
{: .note }
