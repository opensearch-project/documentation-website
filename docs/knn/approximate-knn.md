---
layout: default
title: Approximate Search
nav_order: 1
parent: k-NN
has_children: false
has_math: true
---

# Approximate k-NN Search

The approximate k-NN method uses [nmslib's](https://github.com/nmslib/nmslib/) implementation of the HNSW algorithm to power k-NN search. In this case, approximate means that for a given search, the neighbors returned are an estimate of the true k-nearest neighbors. Of the three methods, this method offers the best search scalability for large data sets. Generally speaking, once the data set gets into the hundreds of thousands of vectors, this approach should be preferred.

This plugin builds an HNSW graph of the vectors for each "knn-vector field"/ "Lucene segment" pair during indexing that can be used to efficiently find the k-nearest neighbors to a query vector during search. To learn more about Lucene segments, please refer to [Apache Lucene's documentation](https://lucene.apache.org/core/8_7_0/core/org/apache/lucene/codecs/lucene87/package-summary.html#package.description). These graphs are loaded into native memory during search and managed by a cache. To learn more about pre-loading graphs into memory, refer to the [warmup API](../api#warmup). Additionally, you can see what graphs are already loaded in memory, which you can learn more about in the [stats API section](../api#stats).

Because the graphs are constructed during indexing, it is not possible to apply a filter on an index and then use this search method. All filters will be applied on the results produced by the approximate nearest neighbor search.

## Get started with approximate k-NN

To use the k-NN plugin's approximate search functionality, you must first create a k-NN index with setting `index.knn` to `true`. This setting tells the plugin to create HNSW graphs for the index.

Additionally, if you are using the approximate k-nearest neighbor method, you should specify `knn.space_type` to the space that you are interested in. This setting cannot be changed after it is set. To see what spaces we support, please refer to the [spaces section](#spaces). By default, `index.knn.space_type` is `l2`. For more information on index settings, such as algorithm parameters that can be tweaked to tune performance, please refer to the [documentation](../settings#index-settings).

Next, you must add one or more fields of the `knn_vector` data type. Here is an example that creates an index with two `knn_vector` fields and uses cosine similarity:

```json
PUT my-knn-index-1
{
  "settings": {
    "index": {
      "knn": true,
      "knn.space_type": "cosinesimil"
    }
  },
  "mappings": {
    "properties": {
      "my_vector1": {
        "type": "knn_vector",
        "dimension": 2
      },
      "my_vector2": {
        "type": "knn_vector",
        "dimension": 4
      }
    }
  }
}
```

The `knn_vector` data type supports a vector of floats that can have a dimension of up to 10,000, as set by the dimension mapping parameter.

In OpenSearch, codecs handle the storage and retrieval of indices. The k-NN plugin uses a custom codec to write vector data to graphs so that the underlying k-NN search library can read it.
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

`k` is the number of neighbors the search of each graph will return. You must also include the `size` option. This option indicates how many results the query actually returns. The plugin returns `k` amount of results for each shard (and each segment) and `size` amount of results for the entire query. The plugin supports a maximum `k` value of 10,000.

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

A space corresponds to the function used to measure the distance between 2 points in order to determine the k-nearest neighbors. From the k-NN perspective, a lower score equates to a closer and better result. This is the opposite of how OpenSearch scores results, where a greater score equates to a better result. To convert distances to OpenSearch scores, we take 1 / (1 + distance). Currently, the k-NN plugin supports the following spaces:

<table>
  <thead style="text-align: left">
  <tr>
    <th>spaceType</th>
    <th>Distance Function</th>
    <th>OpenSearch Score</th>
  </tr>
  </thead>
  <tr>
    <td>l2</td>
    <td>\[ Distance(X, Y) = \sum_{i=1}^n (X_i - Y_i)^2 \]</td>
    <td>1 / (1 + Distance Function)</td>
  </tr>
  <tr>
    <td>l1</td>
    <td>\[ Distance(X, Y) = \sum_{i=1}^n (X_i - Y_i) \]</td>
    <td>1 / (1 + Distance Function)</td>
  </tr>
  <tr>
    <td>cosinesimil</td>
    <td>\[ 1 - {A &middot; B \over \|A\| &middot; \|B\|} = 1 -
    {\sum_{i=1}^n (A_i &middot; B_i) \over \sqrt{\sum_{i=1}^n A_i^2} &middot; \sqrt{\sum_{i=1}^n B_i^2}}\]
    where \(\|A\|\) and \(\|B\|\) represent normalized vectors.</td>
    <td>1 / (1 + Distance Function)</td>
  </tr>
  <tr>
    <td>hammingbit</td>
    <td style="text-align:center">Distance = countSetBits(X \(\oplus\) Y)</td>
    <td>1 / (1 + Distance Function)</td>
  </tr>
</table>

The cosine similarity formula does not include the `1 - ` prefix. However, because nmslib equates smaller scores with closer results, they return `1 - cosineSimilarity` for their cosine similarity space---that's why `1 - ` is included in the distance function.
{: .note }
