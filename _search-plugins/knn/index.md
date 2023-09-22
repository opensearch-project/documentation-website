---
layout: default
title: k-NN
nav_order: 50
has_children: true
has_toc: false
redirect_from:
  - /search-plugins/knn/
---

# k-NN

Short for *k-nearest neighbors*, the k-NN plugin enables users to search for the k-nearest neighbors to a query point across an index of vectors. To determine the neighbors, you can specify the space (the distance function) you want to use to measure the distance between points.

Use cases include recommendations (for example, an "other songs you might like" feature in a music application), image recognition, and fraud detection. For more background information about k-NN search, see [Wikipedia](https://en.wikipedia.org/wiki/Nearest_neighbor_search).

This plugin supports three different methods for obtaining the k-nearest neighbors from an index of vectors:

1. **Approximate k-NN**

    The first method takes an approximate nearest neighbor approach---it uses one of several algorithms to return the approximate k-nearest neighbors to a query vector. Usually, these algorithms sacrifice indexing speed and search accuracy in return for performance benefits such as lower latency, smaller memory footprints and more scalable search. To learn more about the algorithms, refer to [*nmslib*](https://github.com/nmslib/nmslib/blob/master/manual/README.md)'s and [*faiss*](https://github.com/facebookresearch/faiss/wiki)'s documentation.

    Approximate k-NN is the best choice for searches over large indexes (that is, hundreds of thousands of vectors or more) that require low latency. You should not use approximate k-NN if you want to apply a filter on the index before the k-NN search, which greatly reduces the number of vectors to be searched. In this case, you should use either the script scoring method or Painless extensions.

    For more details about this method, including recommendations for which engine to use, see [Approximate k-NN search]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/).

2. **Script Score k-NN**

    The second method extends OpenSearch's script scoring functionality to execute a brute force, exact k-NN search over "knn_vector" fields or fields that can represent binary objects. With this approach, you can run k-NN search on a subset of vectors in your index (sometimes referred to as a pre-filter search).

    Use this approach for searches over smaller bodies of documents or when a pre-filter is needed. Using this approach on large indexes may lead to high latencies.

    For more details about this method, see [Exact k-NN with scoring script]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-score-script/).

3. **Painless extensions**

    The third method adds the distance functions as painless extensions that you can use in more complex combinations. Similar to the k-NN Script Score, you can use this method to perform a brute force, exact k-NN search across an index, which also supports pre-filtering.

    This approach has slightly slower query performance compared to the k-NN Script Score. If your use case requires more customization over the final score, you should use this approach over Script Score k-NN.

    For more details about this method, see [Painless scripting functions]({{site.url}}{{site.baseurl}}/search-plugins/knn/painless-functions/).


Overall, for larger data sets, you should generally choose the approximate nearest neighbor method because it scales significantly better. For smaller data sets, where you may want to apply a filter, you should choose the custom scoring approach. If you have a more complex use case where you need to use a distance function as part of their scoring method, you should use the painless scripting approach.
