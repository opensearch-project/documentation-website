---
layout: default
title: Approximate k-NN search
nav_order: 15
parent: k-NN search
has_children: false
has_math: true
canonical_url: https://docs.opensearch.org/latest/search-plugins/knn/approximate-knn/
---

# Approximate k-NN search

Standard k-NN search methods compute similarity using a brute-force approach that measures the nearest distance between a query and a number of points, which produces exact results. This works well in many applications. However, in the case of extremely large datasets with high dimensionality, this creates a scaling problem that reduces the efficiency of the search. Approximate k-NN search methods can overcome this by employing tools that restructure indexes more efficiently and reduce the dimensionality of searchable vectors. Using this approach requires a sacrifice in accuracy but increases search processing speeds appreciably.

The Approximate k-NN search methods leveraged by OpenSearch use approximate nearest neighbor (ANN) algorithms from the [nmslib](https://github.com/nmslib/nmslib), [faiss](https://github.com/facebookresearch/faiss), and [Lucene](https://lucene.apache.org/) libraries to power k-NN search. These search methods employ ANN to improve search latency for large datasets. Of the three search methods the k-NN plugin provides, this method offers the best search scalability for large datasets. This approach is the preferred method when a dataset reaches hundreds of thousands of vectors.

For details on the algorithms the plugin currently supports, see [k-NN Index documentation]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index#method-definitions).
{: .note}

The k-NN plugin builds a native library index of the vectors for each knn-vector field/Lucene segment pair during indexing, which can be used to efficiently find the k-nearest neighbors to a query vector during search. To learn more about Lucene segments, see the [Apache Lucene documentation](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/codecs/lucene87/package-summary.html#package.description). These native library indexes are loaded into native memory during search and managed by a cache. To learn more about preloading native library indexes into memory, refer to the [warmup API]({{site.url}}{{site.baseurl}}/search-plugins/knn/api#warmup-operation). Additionally, you can see which native library indexes are already loaded in memory. To learn more about this, see the [stats API section]({{site.url}}{{site.baseurl}}/search-plugins/knn/api#stats).

Because the native library indexes are constructed during indexing, it is not possible to apply a filter on an index and then use this search method. All filters are applied on the results produced by the approximate nearest neighbor search.

## Recommendations for engines and cluster node sizing

Each of the three engines used for approximate k-NN search has its own attributes that make one more sensible to use than the others in a given situation. You can follow the general information below to help determine which engine will best meet your requirements.

In general, nmslib outperforms both faiss and Lucene on search. However, to optimize for indexing throughput, faiss is a good option. For relatively smaller datasets (up to a few million vectors), the Lucene engine demonstrates better latencies and recall. At the same time, the size of the index is smallest compared to the other engines, which allows it to use smaller AWS instances for data nodes.

When considering cluster node sizing, a general approach is to first establish an even distribution of the index across the cluster. However, there are other considerations. To help make these choices, you can refer to the OpenSearch managed service guidance in the section [Sizing domains](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/sizing-domains.html).

## Get started with approximate k-NN

To use the k-NN plugin's approximate search functionality, you must first create a k-NN index with `index.knn` set to `true`. This setting tells the plugin to create native library indexes for the index.

Next, you must add one or more fields of the `knn_vector` data type. This example creates an index with two
`knn_vector` fields, one using `faiss` and the other using `nmslib` fields:

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

In the preceding example, both `knn_vector` fields are configured using method definitions. Additionally, `knn_vector` fields can be configured using models. For more information, see [k-NN vector]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/).

The `knn_vector` data type supports a vector of floats that can have a dimension count of up to 16,000 for the NMSLIB, Faiss, and Lucene engines, as set by the dimension mapping parameter.

In OpenSearch, codecs handle the storage and retrieval of indexes. The k-NN plugin uses a custom codec to write vector data to native library indexes so that the underlying k-NN search library can read it.
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
{% include copy-curl.html %}

### The number of returned results

In the preceding query, `k` represents the number of neighbors returned by the search of each graph. You must also include the `size` option, indicating the final number of results that you want the query to return.  

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

### Building a k-NN index from a model

For some of the algorithms that the k-NN plugin supports, the native library index needs to be trained before it can be used. It would be expensive to train every newly created segment, so, instead, the plugin features the concept of a *model* that initializes the native library index during segment creation. You can create a model by calling the [Train API]({{site.url}}{{site.baseurl}}/search-plugins/knn/api#train-a-model) and passing in the source of the training data and the method definition of the model. Once training is complete, the model is serialized to a k-NN model system index. Then, during indexing, the model is pulled from this index to initialize the segments.

To train a model, you first need an OpenSearch index containing training data. Training data can come from any `knn_vector` field that has a dimension matching the dimension of the model you want to create. Training data can be the same data that you are going to index or data in a separate set. To create a training index, send the following request:

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

After indexing into the training index completes, you can call the Train API:

```json
POST /_plugins/_knn/models/my-model/_train
{
  "training_index": "train-index",
  "training_field": "train-field",
  "dimension": 4,
  "description": "My model description",
  "space_type": "l2",
  "method": {
    "name": "ivf",
    "engine": "faiss",
    "parameters": {
      "nlist": 4,
      "nprobes": 2
    }
  }
}
```
{% include copy-curl.html %}

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

### Additional query parameters

Starting with version 2.16, you can provide `method_parameters` in a search request:

```json
GET my-knn-index-1/_search
{
  "size": 2,
  "query": {
    "knn": {
      "target-field": {
        "vector": [2, 3, 5, 6],
        "k": 2,
        "method_parameters" : {
          "ef_search": 100
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

These parameters are dependent on the combination of engine and method used to create the index. The following sections provide information about the supported `method_parameters`.

#### `ef_search`

You can provide the `ef_search` parameter when searching an index created using the `hnsw` method. The `ef_search` parameter specifies the number of vectors to examine in order to find the top k nearest neighbors. Higher `ef_search` values improve recall at the cost of increased search latency. The value must be positive.

The following table provides information about the `ef_search` parameter for the supported engines.

Engine | Radial query support | Notes
:--- | :--- | :---
`nmslib` | No | If `ef_search` is present in a query, it overrides the `index.knn.algo_param.ef_search` index setting.
`faiss` | Yes | If `ef_search` is present in a query, it overrides the `index.knn.algo_param.ef_search` index setting.
`lucene` | No | When creating a search query, you must specify `k`. If you provide both `k` and `ef_search`, then the larger value is passed to the engine. If `ef_search` is larger than `k`, you can provide the `size` parameter to limit the final number of results to `k`. 

#### `nprobes`

You can provide the `nprobes` parameter when searching an index created using the `ivf` method. The `nprobes` parameter specifies the number of buckets to examine in order to find the top k nearest neighbors. Higher `nprobes` values improve recall at the cost of increased search latency. The value must be positive.

The following table provides information about the `nprobes` parameter for the supported engines.

Engine | Notes
:--- | :--- 
`faiss` | If `nprobes` is present in a query, it overrides the value provided when creating the index.

### Rescoring quantized results using full precision

Quantization can be used to significantly reduce the memory footprint of a k-NN index. For more information about quantization, see [k-NN vector quantization]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-vector-quantization). Because some vector representation is lost during quantization, the computed distances will be approximate. This causes the overall recall of the search to decrease. 

To improve recall while maintaining the memory savings of quantization, you can use a two-phase search approach. In the first phase, `oversample_factor * k` results are retrieved from an index using quantized vectors and the scores are approximated. In the second phase, the full-precision vectors of those `oversample_factor * k` results are loaded into memory from disk, and scores are recomputed against the full-precision query vector. The results are then reduced to the top k.

The default rescoring behavior is determined by the `mode` and `compression_level` of the backing k-NN vector field:

- For `in_memory` mode, no rescoring is applied by default.
- For `on_disk` mode, default rescoring is based on the configured `compression_level`. Each `compression_level` provides a default `oversample_factor`, specified in the following table.

| Compression level | Default rescore `oversample_factor` |
|:------------------|:----------------------------------|
| `32x` (default)   | 3.0                               |
| `16x`             | 2.0                               |
| `8x`              | 2.0                               |
| `4x`              | No default rescoring             |
| `2x`              | No default rescoring             |

To explicitly apply rescoring, provide the `rescore` parameter in a query on a quantized index and specify the `oversample_factor`:

```json
GET my-knn-index-1/_search
{
  "size": 2,
  "query": {
    "knn": {
      "target-field": {
        "vector": [2, 3, 5, 6],
        "k": 2,
        "rescore" : {
          "oversample_factor": 1.2
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Alternatively, set the `rescore` parameter to `true` to use a default `oversample_factor` of `1.0`:

```json
GET my-knn-index-1/_search
{
  "size": 2,
  "query": {
    "knn": {
      "target-field": {
        "vector": [2, 3, 5, 6],
        "k": 2,
        "rescore" : true
      }
    }
  }
}
```
{% include copy-curl.html %}

The `oversample_factor` is a floating-point number between 1.0 and 100.0, inclusive. The number of results in the first pass is calculated as `oversample_factor * k` and is guaranteed to be between 100 and 10,000, inclusive. If the calculated number of results is smaller than 100, then the number of results is set to 100. If the calculated number of results is greater than 10,000, then the number of results is set to 10,000.

Rescoring is only supported for the `faiss` engine.

Rescoring is not needed if quantization is not used because the scores returned are already fully precise.
{: .note}

### Using approximate k-NN with filters

To learn about using filters with k-NN search, see [k-NN search with filters]({{site.url}}{{site.baseurl}}/search-plugins/knn/filter-search-knn/).

### Using approximate k-NN with nested fields

To learn about using k-NN search with nested fields, see [k-NN search with nested fields]({{site.url}}{{site.baseurl}}/search-plugins/knn/nested-search-knn/).

### Using approximate radial search

To learn more about the radial search feature, see [k-NN radial search]({{site.url}}{{site.baseurl}}/search-plugins/knn/radial-search-knn/).

### Using approximate k-NN with binary vectors

To learn more about using binary vectors with k-NN search, see [Binary k-NN vectors]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector#binary-vectors).

## Spaces

A _space_ corresponds to the function used to measure the distance between two points in order to determine the k-nearest neighbors. From the k-NN perspective, a lower score equates to a closer and better result. This is the opposite of how OpenSearch scores results, where a higher score equates to a better result. The k-NN plugin supports the following spaces. 

Not every method supports each of these spaces. Be sure to check out [the method documentation]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index#method-definitions) to make sure the space you are interested in is supported.
{: note.}

| Space type | Distance function ($$d$$ ) | OpenSearch score |
| :--- | :--- | :--- |
| `l1`  | $$ d(\mathbf{x}, \mathbf{y}) = \sum_{i=1}^n \lvert x_i - y_i \rvert $$ | $$ score = {1 \over {1 + d} } $$ |
| `l2`  | $$ d(\mathbf{x}, \mathbf{y}) = \sum_{i=1}^n (x_i - y_i)^2 $$ | $$ score = {1 \over 1 + d } $$ |
| `linf` | $$ d(\mathbf{x}, \mathbf{y}) = max(\lvert x_i - y_i \rvert) $$ | $$ score = {1 \over 1 + d } $$ |
| `cosinesimil` | $$ d(\mathbf{x}, \mathbf{y}) = 1 - cos { \theta } = 1 - {\mathbf{x} \cdot \mathbf{y} \over \lVert \mathbf{x}\rVert \cdot \lVert \mathbf{y}\rVert}$$$$ = 1 - {\sum_{i=1}^n x_i y_i \over \sqrt{\sum_{i=1}^n x_i^2} \cdot \sqrt{\sum_{i=1}^n y_i^2}}$$, <br> where $$\lVert \mathbf{x}\rVert$$ and $$\lVert \mathbf{y}\rVert$$ represent the norms of vectors $$\mathbf{x}$$ and $$\mathbf{y}$$, respectively. | **NMSLIB** and **Faiss**:<br>$$ score = {1 \over 1 + d } $$  <br><br>**Lucene**:<br>$$ score = {2 - d \over 2}$$ |
| `innerproduct` (supported for Lucene in OpenSearch version 2.13 and later) | **NMSLIB** and **Faiss**:<br> $$ d(\mathbf{x}, \mathbf{y}) = - {\mathbf{x} \cdot \mathbf{y}} = - \sum_{i=1}^n x_i y_i $$  <br><br>**Lucene**:<br> $$ d(\mathbf{x}, \mathbf{y}) = {\mathbf{x} \cdot \mathbf{y}} = \sum_{i=1}^n x_i y_i $$ | **NMSLIB** and **Faiss**:<br> $$ \text{If} d \ge 0,  score = {1 \over 1 + d }$$ <br> $$\text{If} d < 0, score = −d + 1$$  <br><br>**Lucene:**<br> $$ \text{If} d > 0, score = d + 1 $$ <br> $$\text{If} d \le 0, score = {1 \over 1 + (-1 \cdot d) }$$ |
| `hamming` (supported for binary vectors in OpenSearch version 2.16 and later) | $$ d(\mathbf{x}, \mathbf{y}) = \text{countSetBits}(\mathbf{x} \oplus \mathbf{y})$$ | $$ score = {1 \over 1 + d } $$ |

The cosine similarity formula does not include the `1 -` prefix. However, because similarity search libraries equate lower scores with closer results, they return `1 - cosineSimilarity` for the cosine similarity space---this is why `1 -` is included in the distance function.
{: .note }

With cosine similarity, it is not valid to pass a zero vector (`[0, 0, ...]`) as input. This is because the magnitude of such a vector is 0, which raises a `divide by 0` exception in the corresponding formula. Requests containing the zero vector will be rejected, and a corresponding exception will be thrown.
{: .note }

The `hamming` space type is supported for binary vectors in OpenSearch version 2.16 and later. For more information, see [Binary k-NN vectors]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector#binary-vectors).
{: .note}
