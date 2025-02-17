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

OpenSearch supports three different methods for obtaining the k-nearest neighbors from an index of vectors:

- [Approximate search]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/)) (approximate k-NN, or ANN): Returns approximate nearest neighbors to the query vector. Usually, approximate search algorithms sacrifice indexing speed and search accuracy in exchange for performance benefits such as lower latency, smaller memory footprints, and more scalable search. For most use cases, approximate search is the best option.

- Exact search: A brute-force, exact k-NN search of vector fields. OpenSearch supports the following types of exact search: 
  - [Exact search with scoring script]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-score-script/): Using a scoring script, you can apply a filter to an index before executing the nearest neighbor search. 
  - [Painless extensions]({{site.url}}{{site.baseurl}}/search-plugins/knn/painless-functions/): Adds the distance functions as Painless extensions that you can use in more complex combinations. You can use this method to perform a brute-force, exact vector search of an index, which also supports pre-filtering. 


Overall, for larger data sets, you should generally choose the approximate nearest neighbor method because it scales significantly better. For smaller data sets, where you may want to apply a filter, you should choose the custom scoring approach. If you have a more complex use case where you need to use a distance function as part of their scoring method, you should use the Painless scripting approach.

## Approximate search

OpenSearch supports the following algorithms (_methods_) for approximate vector search:

- Hierarchical Navigable Small World (HNSW)
- Inverted File System (IVF)

Additionally, you can choose one of the following libraries (_engines_) that implement these algorithms:

- [Facebook AI Similarity Search (Faiss)](https://github.com/facebookresearch/faiss)
- Lucene
- [Non-Metric Space Library (NMSLIB)](https://github.com/nmslib/nmslib) (deprecated)

The following table lists the combinations of search methods and libraries supported by the k-NN engine for approximate vector search.

Method | Engine
:--- | :---
HNSW | Faiss, Lucene, NMSLIB (deprecated)
IVF | Faiss 

For more information, see [Methods and engines]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/) and [Choosing the right method]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/#choosing-the-right-method).

## Engine recommendations

In general, select Faiss for large-scale use cases. Lucene is a good option for smaller deployments and offers benefits like smart filtering, where the optimal filtering strategy—pre-filtering, post-filtering, or exact k-NN—is automatically applied depending on the situation. The following table summarizes the differences between each option.

| |   Faiss/HNSW |  Faiss/IVF |  Lucene/HNSW |
|:---|:---|:---|:---|
|  Max dimensions |    16,000 |  16,000 |  16,000 |
|  Filter |    Post-filter |  Post-filter |  Filter during search |
|  Training required |    No (Yes for product quantization) |  Yes |  No |
|  Similarity metrics | `l2`, `innerproduct` |  `l2`, `innerproduct` |  `l2`, `cosinesimil` |
|  Number of vectors   |    Tens of billions |  Tens of billions |  Less than 10 million |
|  Indexing latency |   Low  |  Lowest  |  Low  |
|  Query latency and quality  |    Low latency and high quality  |  Low latency and low quality  |  High latency and high quality  |
|  Vector compression  |   Flat <br><br>Product quantization |  Flat <br><br>Product quantization |  Flat  |
|  Memory consumption |   High <br><br> Low with product quantization |  Medium <br><br> Low with product quantization |  High  |

## Using sparse vectors

_Neural sparse search_ offers an efficient alternative to dense vector search by using sparse embedding models and inverted indexes, providing performance similar to BM25. Unlike dense vector methods that require significant memory and CPU resources, sparse search creates a list of token-weight pairs and stores them in a rank features index. This approach combines the efficiency of traditional search with the semantic understanding of neural networks. OpenSearch supports both automatic embedding generation through ingest pipelines and direct sparse vector ingestion. For more information, see [Neural sparse search]({{site.url}}{{site.baseurl}}/vector-search/ml-powered-search/neural-sparse-search/).

## Combining multiple search techniques

_Hybrid search_ enhances search relevance by combining multiple search techniques within OpenSearch. It integrates traditional keyword search with vector-based semantic search. Through a configurable search pipeline, hybrid search normalizes and combines scores from different search methods to provide unified, relevant results. This approach is particularly effective for complex queries where both semantic understanding and exact matching are important. The search pipeline can be further customized with post-filtering operations and aggregations to meet specific search requirements. For more information, see [Hybrid search]({{site.url}}{{site.baseurl}}/vector-search/ml-powered-search/hybrid-search/).
