---
layout: default
title: Filtering data
nav_order: 50
has_children: true
redirect_from:
  - /search-plugins/knn/filter-search-knn/ 
  - /vector-search/filter-search-knn/
---

# Filtering data

To refine vector search results, you can filter a vector search using one of the following methods:

- [Efficient k-nearest neighbors (k-NN) filtering]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/efficient-knn-filtering/): This approach applies filtering _during_ the vector search, as opposed to before or after the vector search, which ensures that `k` results are returned (if there are at least `k` results in total). This approach is supported by the following engines:
  - Lucene engine with a Hierarchical Navigable Small World (HNSW) algorithm (OpenSearch version 2.4 and later) 
  - Faiss engine with an HNSW algorithm (OpenSearch version 2.9 and later) or IVF algorithm (OpenSearch version 2.10 and later). In OpenSearch version 3.1 and later, when using the Faiss engine and HNSW, the [Lucene ACORN filtering optimization](https://github.com/apache/lucene/pull/14160) is applied during HNSW traversal when [memory-optimized search]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/memory-optimized-search/) is enabled.
    - With the Faiss engine and HNSW, the [Lucene ACORN filtering optimization](https://github.com/apache/lucene/pull/14160) is applied during HNSW traversal when [memory-optimized search]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/memory-optimized-search/) is enabled.

-  [Post-filtering]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/post-filtering/): Because it is performed after the vector search, this approach may return significantly fewer than `k` results for a restrictive filter. You can use the following two filtering strategies for this approach:
    - [Boolean post-filter]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/post-filtering/#boolean-filter-with-ann-search): This approach runs an [approximate nearest neighbor (ANN)]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/) search and then applies a filter to the results. The two query parts are executed independently, and then the results are combined based on the query operator (`should`, `must`, and so on) provided in the query. 
    - [The `post_filter` parameter]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/post-filtering/#the-post_filter-parameter): This approach runs an [ANN]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/) search on the full dataset and then applies the filter to the k-NN results.

- [Scoring script filter]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/scoring-script-filter/): This approach involves pre-filtering a document set and then running an exact k-NN search on the filtered subset. It may have high latency and does not scale when filtered subsets are large. 

- [Filtering in sparse vector search]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/filtering-in-sparse-search/): This approach is about applying filtering on approximate sparse vector search.

The following table summarizes the preceding filtering use cases.

Filter | When the filter is applied | Type of search | Supported engines and methods | Where to place the `filter` clause
:--- | :--- | :--- | :---
Efficient k-NN filtering | During search (a hybrid of pre- and post-filtering) | Approximate | - `lucene` (`hnsw`) <br> - `faiss` (`hnsw`, `ivf`) | Inside the k-NN query clause.
Boolean filter | After search (post-filtering) | Approximate | - `lucene` <br> - `faiss` <br> - `nmslib` (deprecated)  | Outside the k-NN query clause. Must be a leaf clause.
The `post_filter` parameter | After search (post-filtering) | Approximate | - `lucene`<br> - `faiss` <br> - `nmslib` (deprecated) | Outside the k-NN query clause. 
Scoring script filter | Before search (pre-filtering) | Exact | N/A | Inside the script score query clause.
Filtering in neural sparse vector search | After search (post-filtering) | Approximate | N/A | In the `method_parameters` field of the `neural_sparse` query.

## Filtered search optimization

Depending on your dataset and use case, you might be more interested in maximizing recall or minimizing latency. The following table provides guidance on various k-NN search configurations and the filtering methods used to optimize for higher recall or lower latency. The first three columns of the table provide several example k-NN search configurations. A search configuration consists of:

- The number of documents in an index, where one OpenSearch document corresponds to one k-NN vector.
- The percentage of documents left in the results after filtering. This value depends on the restrictiveness of the filter that you provide in the query. The most restrictive filter in the table returns 2.5% of documents in the index, while the least restrictive filter returns 80% of documents.
- The desired number of returned results (k). 

Once you've estimated the number of documents in your index, the restrictiveness of your filter, and the desired number of nearest neighbors, use the following table to choose a filtering method that optimizes for recall or latency.

| Number of documents in an index | Percentage of documents the filter returns | k | Filtering method to use for higher recall | Filtering method to use for lower latency |
| :-- | :-- | :-- | :-- | :-- |
| 10M | 2.5 | 100 | Efficient k-NN filtering/Scoring script | Scoring script |
| 10M | 38 | 100 | Efficient k-NN filtering | Efficient k-NN filtering |
| 10M | 80 | 100 | Efficient k-NN filtering | Efficient k-NN filtering |
| 1M | 2.5 | 100 | Efficient k-NN filtering/Scoring script | Scoring script |
| 1M | 38 | 100 | Efficient k-NN filtering | Efficient k-NN filtering |
| 1M | 80 | 100 | Efficient k-NN filtering | Efficient k-NN filtering |
