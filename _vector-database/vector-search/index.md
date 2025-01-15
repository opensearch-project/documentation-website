---
layout: default
title: Vector search
nav_order: 40
has_children: true
has_toc: false
redirect_from:
  - /search-plugins/knn/
  - /search-plugins/knn/index/ 
  - /vector-database/vector-search/     
---

# Vector search

Short for *k-nearest neighbors*, the k-NN plugin enables users to search for the k-nearest neighbors to a query point across an index of vectors. To determine the neighbors, you can specify the space (the distance function) you want to use to measure the distance between points.

Use cases include recommendations (for example, an "other songs you might like" feature in a music application), image recognition, and fraud detection. For more background information about vector search, see [Wikipedia](https://en.wikipedia.org/wiki/Nearest_neighbor_search).

This plugin supports three different methods for obtaining the k-nearest neighbors from an index of vectors:

- [Approximate search](#approximate-search) (approximate k-NN, or ANN): Returns approximate nearest neighbors to the query vector. Usually, approximate search algorithms sacrifice indexing speed and search accuracy in exchange for performance benefits such as lower latency, smaller memory footprints, and more scalable search. For most use cases, approximate search is the best option.

- Exact search: A brute-force, exact k-NN search of vector fields. OpenSearch supports the following types of exact search: 
  - [Exact search with scoring script]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-score-script/): Using a scoring script, you can apply a filter to an index before executing the nearest neighbor search. 
  - [Painless extensions]({{site.url}}{{site.baseurl}}/search-plugins/knn/painless-functions/): Adds the distance functions as Painless extensions that you can use in more complex combinations. You can use this method to perform a brute-force, exact vector search of an index, which also supports pre-filtering. 


Overall, for larger data sets, you should generally choose the approximate nearest neighbor method because it scales significantly better. For smaller data sets, where you may want to apply a filter, you should choose the custom scoring approach. If you have a more complex use case where you need to use a distance function as part of their scoring method, you should use the Painless scripting approach.

### Vector search with filtering

For information about vector search with filtering, see [Vector search with filters]({{site.url}}{{site.baseurl}}/search-plugins/knn/filter-search-knn/).

## Nested field vector search

For information about vector search with nested fields, see [Vector search with filters]({{site.url}}{{site.baseurl}}/search-plugins/knn/nested-search-knn/).

## Radial search

With radial search, you can search all points within a vector space that reside within a specified maximum distance or minimum score threshold from a query point. For information about vector search with nested fields, see [Radial search]({{site.url}}{{site.baseurl}}/search-plugins/knn/radial-search-knn/).