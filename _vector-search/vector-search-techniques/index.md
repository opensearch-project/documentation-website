---
layout: default
title: Vector search techniques
nav_order: 15
has_children: true
has_toc: false
redirect_from:
  - /search-plugins/knn/
  - /search-plugins/knn/index/ 
  - /vector-search/vector-search-techniques/     
---

# Vector search techniques

OpenSearch implements vector search as *k-nearest neighbors*, or *k-NN*, search. k-NN search finds the k neighbors closest to a query point across an index of vectors. To determine the neighbors, you can specify the space (the distance function) you want to use to measure the distance between points.

Use cases include recommendations (for example, an "other songs you might like" feature in a music application), image recognition, and fraud detection. For more background information about vector search, see [Nearest neighbor search](https://en.wikipedia.org/wiki/Nearest_neighbor_search).

OpenSearch supports three different methods for obtaining the k-nearest neighbors from an index of vectors:

- [Approximate search](#approximate-search) (approximate k-NN, or ANN): Returns approximate nearest neighbors to the query vector. Usually, approximate search algorithms sacrifice indexing speed and search accuracy in exchange for performance benefits such as lower latency, smaller memory footprints, and more scalable search. For most use cases, approximate search is the best option.

- Exact search: A brute-force, exact k-NN search of vector fields. OpenSearch supports the following types of exact search: 
  - [Exact search with scoring script]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-score-script/): Using a scoring script, you can apply a filter to an index before executing the nearest neighbor search. 
  - [Painless extensions]({{site.url}}{{site.baseurl}}/search-plugins/knn/painless-functions/): Adds the distance functions as Painless extensions that you can use in more complex combinations. You can use this method to perform a brute-force, exact vector search of an index, which also supports pre-filtering. 


Overall, for larger data sets, you should generally choose the approximate nearest neighbor method because it scales significantly better. For smaller data sets, where you may want to apply a filter, you should choose the custom scoring approach. If you have a more complex use case where you need to use a distance function as part of their scoring method, you should use the Painless scripting approach.

## Approximate search

OpenSearch supports several algorithms for approximate vector search, each with its own advantages. For complete documentation, see [Approximate search]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/). For more information about the search methods and engines, see [Method definitions]({{site.url}}{{site.baseurl}}/vector-search/creating-vector-index/method/). For method recommendations, see [Choosing the right method]({{site.url}}{{site.baseurl}}/vector-search/creating-vector-index/method/#choosing-the-right-method).

To use approximate vector search, specify one of the following search methods (algorithms) in the `method` parameter:

- Hierarchical Navigable Small World (HNSW)
- Inverted File System (IVF)

Additionally, specify the engine (library) that implements this method in the `engine` parameter:

- [Non-Metric Space Library (NMSLIB)](https://github.com/nmslib/nmslib)
- [Facebook AI Similarity Search (Faiss)](https://github.com/facebookresearch/faiss)
- Lucene

The following table lists the combinations of search methods and libraries supported by the k-NN engine for approximate vector search.

Method | Engine
:--- | :---
HNSW | NMSLIB, Faiss, Lucene
IVF | Faiss 

## Engine recommendations

In general, select NMSLIB or Faiss for large-scale use cases. Lucene is a good option for smaller deployments and offers benefits like smart filtering, where the optimal filtering strategy—pre-filtering, post-filtering, or exact k-NN—is automatically applied depending on the situation. The following table summarizes the differences between each option.

| |  NMSLIB/HNSW |  Faiss/HNSW |  Faiss/IVF |  Lucene/HNSW |
|:---|:---|:---|:---|:---|
|  Max dimensions |  16,000  |  16,000 |  16,000 |  16,000 |
|  Filter |  Post-filter |  Post-filter |  Post-filter |  Filter during search |
|  Training required |  No |  No |  Yes |  No |
|  Similarity metrics |  `l2`, `innerproduct`, `cosinesimil`, `l1`, `linf`  |  `l2`, `innerproduct` |  `l2`, `innerproduct` |  `l2`, `cosinesimil` |
|  Number of vectors   |  Tens of billions |  Tens of billions |  Tens of billions |  Less than 10 million |
|  Indexing latency |  Low |  Low  |  Lowest  |  Low  |
|  Query latency and quality  |  Low latency and high quality |  Low latency and high quality  |  Low latency and low quality  |  High latency and high quality  |
|  Vector compression  |  Flat |  Flat <br>Product quantization |  Flat <br>Product quantization |  Flat  |
|  Memory consumption |  High  |  High <br> Low with PQ |  Medium <br> Low with PQ |  High  |




