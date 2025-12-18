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
canonical_url: https://docs.opensearch.org/latest/vector-search/vector-search-techniques/index/
---

# Vector search techniques

OpenSearch implements vector search as *k-nearest neighbors*, or *k-NN*, search. k-NN search finds the k neighbors closest to a query point across an index of vectors. To determine the neighbors, you can specify the space (the distance function) you want to use to measure the distance between points.

OpenSearch supports three different methods for obtaining the k-nearest neighbors from an index of vectors:

- [Approximate search]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/) (approximate k-NN, or ANN): Returns approximate nearest neighbors to the query vector. Usually, approximate search algorithms sacrifice indexing speed and search accuracy in exchange for performance benefits such as lower latency, smaller memory footprints, and more scalable search. For most use cases, approximate search is the best option.

- Exact search: A brute-force, exact k-NN search of vector fields. OpenSearch supports the following types of exact search: 
  - [Exact search with a scoring script]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-score-script/): Using a scoring script, you can apply a filter to an index before executing the nearest neighbor search. 
  - [Painless extensions]({{site.url}}{{site.baseurl}}/search-plugins/knn/painless-functions/): Adds the distance functions as Painless extensions that you can use in more complex combinations. You can use this method to perform a brute-force, exact vector search of an index, which also supports pre-filtering. 


In general, you should choose the ANN method for larger datasets because it scales significantly better. For smaller datasets, where you may want to apply a filter, you should choose the custom scoring approach. If you have a more complex use case in which you need to use a distance function as part of the scoring method, you should use the Painless scripting approach.

## Approximate search

OpenSearch supports multiple backend algorithms (_methods_) and libraries for implementing these algorithms (_engines_). It automatically selects the optimal configuration based on the chosen mode and available memory. For more information, see [Methods and engines]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-methods-engines/).

## Using sparse vectors

_Neural sparse search_ offers an efficient alternative to dense vector search by using sparse embedding models and inverted indexes, providing performance similar to BM25. Unlike dense vector methods that require significant memory and CPU resources, sparse search creates a list of token-weight pairs and stores them in a rank features index. This approach combines the efficiency of traditional search with the semantic understanding of neural networks. OpenSearch supports both automatic embedding generation through ingest pipelines and direct sparse vector ingestion. For more information, see [Neural sparse search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-search/).

## Combining multiple search techniques

_Hybrid search_ enhances search relevance by combining multiple search techniques in OpenSearch. It integrates traditional keyword search with vector-based semantic search. Through a configurable search pipeline, hybrid search normalizes and combines scores from different search methods to provide unified, relevant results. This approach is particularly effective for complex queries where both semantic understanding and exact matching are important. The search pipeline can be further customized with post-filtering operations and aggregations to meet specific search requirements. For more information, see [Hybrid search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/).
