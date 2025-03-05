---
layout: default
title: Efficient k-NN filtering
parent: Filtering data
nav_order: 10
---

# Efficient k-NN filtering

You can perform efficient k-NN filtering with the `lucene` or `faiss` engines. 

## Lucene k-NN filter implementation

OpenSearch version 2.2 introduced support for running k-NN searches with the Lucene engine using HNSW graphs. Starting with version 2.4, which is based on Lucene version 9.4, you can use Lucene filters for k-NN searches.

When you specify a Lucene filter for a k-NN search, the Lucene algorithm decides whether to perform an exact k-NN search with pre-filtering or an approximate search with modified post-filtering. The algorithm uses the following variables:

- N: The number of documents in the index.
- P: The number of documents in the document subset after the filter is applied (P <= N).
- k: The maximum number of vectors to return in the response.

The following flow chart outlines the Lucene algorithm.

![Lucene algorithm for filtering]({{site.url}}{{site.baseurl}}/images/lucene-algorithm.png)

For more information about the Lucene filtering implementation and the underlying `KnnVectorQuery`, see the [Apache Lucene documentation](https://lucene.apache.org/core/9_2_0/core/org/apache/lucene/search/KnnVectorQuery.html).

## Using a Lucene k-NN filter

Consider a dataset that includes 12 documents containing hotel information. The following image shows all hotels on an xy coordinate plane by location. Additionally, the points for hotels that have a rating between 8 and 10, inclusive, are depicted with orange dots, and hotels that provide parking are depicted with green circles. The search point is colored in red:

![Graph of documents with filter criteria]({{site.url}}{{site.baseurl}}/images/knn-doc-set-for-filtering.png)

In this example, you will create an index and search for the three hotels with high ratings and parking that are the closest to the search location.

### Step 1: Create a new index

Before you can run a k-NN search with a filter, you need to create an index with a `knn_vector` field. For this field, you need to specify `lucene` as the engine and `hnsw` as the `method` in the mapping.

The following request creates a new index called `hotels-index` with a `knn-filter` field called `location`:

```json
PUT /hotels-index
{
  "settings": {
    "index": {
      "knn": true,
      "knn.algo_param.ef_search": 100,
      "number_of_shards": 1,
      "number_of_replicas": 0
    }
  },
  "mappings": {
    "properties": {
      "location": {
        "type": "knn_vector",
        "dimension": 2,
        "method": {
          "name": "hnsw",
          "space_type": "l2",
          "engine": "lucene",
          "parameters": {
            "ef_construction": 100,
            "m": 16
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### Step 2: Add data to your index

Next, add data to your index.

The following request adds 12 documents that contain hotel location, rating, and parking information:  

```json
POST /_bulk
{ "index": { "_index": "hotels-index", "_id": "1" } }
{ "location": [5.2, 4.4], "parking" : "true", "rating" : 5 }
{ "index": { "_index": "hotels-index", "_id": "2" } }
{ "location": [5.2, 3.9], "parking" : "false", "rating" : 4 }
{ "index": { "_index": "hotels-index", "_id": "3" } }
{ "location": [4.9, 3.4], "parking" : "true", "rating" : 9 }
{ "index": { "_index": "hotels-index", "_id": "4" } }
{ "location": [4.2, 4.6], "parking" : "false", "rating" : 6}
{ "index": { "_index": "hotels-index", "_id": "5" } }
{ "location": [3.3, 4.5], "parking" : "true", "rating" : 8 }
{ "index": { "_index": "hotels-index", "_id": "6" } }
{ "location": [6.4, 3.4], "parking" : "true", "rating" : 9 }
{ "index": { "_index": "hotels-index", "_id": "7" } }
{ "location": [4.2, 6.2], "parking" : "true", "rating" : 5 }
{ "index": { "_index": "hotels-index", "_id": "8" } }
{ "location": [2.4, 4.0], "parking" : "true", "rating" : 8 }
{ "index": { "_index": "hotels-index", "_id": "9" } }
{ "location": [1.4, 3.2], "parking" : "false", "rating" : 5 }
{ "index": { "_index": "hotels-index", "_id": "10" } }
{ "location": [7.0, 9.9], "parking" : "true", "rating" : 9 }
{ "index": { "_index": "hotels-index", "_id": "11" } }
{ "location": [3.0, 2.3], "parking" : "false", "rating" : 6 }
{ "index": { "_index": "hotels-index", "_id": "12" } }
{ "location": [5.0, 1.0], "parking" : "true", "rating" : 3 }
```
{% include copy-curl.html %}

### Step 3: Search your data with a filter

Now you can create a k-NN search with filters. In the k-NN query clause, include the point of interest that is used to search for nearest neighbors, the number of nearest neighbors to return (`k`), and a filter with the restriction criteria. Depending on how restrictive you want your filter to be, you can add multiple query clauses to a single request.

The following request creates a k-NN query that searches for the top three hotels near the location with the coordinates `[5, 4]` that are rated between 8 and 10, inclusive, and provide parking:

```json
POST /hotels-index/_search
{
  "size": 3,
  "query": {
    "knn": {
      "location": {
        "vector": [
          5,
          4
        ],
        "k": 3,
        "filter": {
          "bool": {
            "must": [
              {
                "range": {
                  "rating": {
                    "gte": 8,
                    "lte": 10
                  }
                }
              },
              {
                "term": {
                  "parking": "true"
                }
              }
            ]
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response returns the three hotels that are nearest to the search point and have met the filter criteria:

```json
{
  "took" : 47,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 3,
      "relation" : "eq"
    },
    "max_score" : 0.72992706,
    "hits" : [
      {
        "_index" : "hotels-index",
        "_id" : "3",
        "_score" : 0.72992706,
        "_source" : {
          "location" : [
            4.9,
            3.4
          ],
          "parking" : "true",
          "rating" : 9
        }
      },
      {
        "_index" : "hotels-index",
        "_id" : "6",
        "_score" : 0.3012048,
        "_source" : {
          "location" : [
            6.4,
            3.4
          ],
          "parking" : "true",
          "rating" : 9
        }
      },
      {
        "_index" : "hotels-index",
        "_id" : "5",
        "_score" : 0.24154587,
        "_source" : {
          "location" : [
            3.3,
            4.5
          ],
          "parking" : "true",
          "rating" : 8
        }
      }
    ]
  }
}
```

For more ways to construct a filter, see [Constructing a filter](#constructing-a-filter).

## Faiss k-NN filter implementation 

For k-NN searches, you can use `faiss` filters with an HNSW algorithm (OpenSearch version 2.9 and later) or IVF algorithm (OpenSearch version 2.10 and later).

When you specify a Faiss filter for a k-NN search, the Faiss algorithm decides whether to perform an exact k-NN search with pre-filtering or an approximate search with modified post-filtering. The algorithm uses the following variables:

- N: The number of documents in the index.
- P: The number of documents in the document subset after the filter is applied (P <= N).
- k: The maximum number of vectors to return in the response.
- R: The number of results returned after performing the filtered approximate nearest neighbor search.
- FT (filtered threshold): An index-level threshold defined in the [`knn.advanced.filtered_exact_search_threshold` setting]({{site.url}}{{site.baseurl}}/search-plugins/knn/settings/) that specifies to switch to exact search.
- MDC (max distance computations): The maximum number of distance computations allowed in exact search if `FT` (filtered threshold) is not set. This value cannot be changed.

The following flow chart outlines the Faiss algorithm.

![Faiss algorithm for filtering]({{site.url}}{{site.baseurl}}/images/faiss-algorithm.jpg)

## Using a Faiss efficient filter

Consider an index that contains information about different shirts for an e-commerce application. You want to find the top-rated shirts that are similar to the one you already have but would like to restrict the results by shirt size.

In this example, you will create an index and search for shirts that are similar to the shirt you provide.

### Step 1: Create a new index

Before you can run a k-NN search with a filter, you need to create an index with a `knn_vector` field. For this field, you need to specify `faiss` and `hnsw` as the `method` in the mapping.

The following request creates an index that contains vector representations of shirts:

```json
PUT /products-shirts
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "item_vector": {
        "type": "knn_vector",
        "dimension": 3,
        "method": {
          "name": "hnsw",
          "space_type": "l2",
          "engine": "faiss"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### Step 2: Add data to your index

Next, add data to your index.

The following request adds 12 documents that contain information about shirts, including their vector representation, size, and rating:  

```json
POST /_bulk?refresh
{ "index": { "_index": "products-shirts", "_id": "1" } }
{ "item_vector": [5.2, 4.4, 8.4], "size" : "large", "rating" : 5 }
{ "index": { "_index": "products-shirts", "_id": "2" } }
{ "item_vector": [5.2, 3.9, 2.9], "size" : "small", "rating" : 4 }
{ "index": { "_index": "products-shirts", "_id": "3" } }
{ "item_vector": [4.9, 3.4, 2.2], "size" : "xlarge", "rating" : 9 }
{ "index": { "_index": "products-shirts", "_id": "4" } }
{ "item_vector": [4.2, 4.6, 5.5], "size" : "large", "rating" : 6}
{ "index": { "_index": "products-shirts", "_id": "5" } }
{ "item_vector": [3.3, 4.5, 8.8], "size" : "medium", "rating" : 8 }
{ "index": { "_index": "products-shirts", "_id": "6" } }
{ "item_vector": [6.4, 3.4, 6.6], "size" : "small", "rating" : 9 }
{ "index": { "_index": "products-shirts", "_id": "7" } }
{ "item_vector": [4.2, 6.2, 4.6], "size" : "small", "rating" : 5 }
{ "index": { "_index": "products-shirts", "_id": "8" } }
{ "item_vector": [2.4, 4.0, 3.0], "size" : "small", "rating" : 8 }
{ "index": { "_index": "products-shirts", "_id": "9" } }
{ "item_vector": [1.4, 3.2, 9.0], "size" : "small", "rating" : 5 }
{ "index": { "_index": "products-shirts", "_id": "10" } }
{ "item_vector": [7.0, 9.9, 9.0], "size" : "xlarge", "rating" : 9 }
{ "index": { "_index": "products-shirts", "_id": "11" } }
{ "item_vector": [3.0, 2.3, 2.0], "size" : "large", "rating" : 6 }
{ "index": { "_index": "products-shirts", "_id": "12" } }
{ "item_vector": [5.0, 1.0, 4.0], "size" : "large", "rating" : 3 }

```
{% include copy-curl.html %}

### Step 3: Search your data with a filter

Now you can create a k-NN search with filters. In the k-NN query clause, include the vector representation of the shirt that is used to search for similar ones, the number of nearest neighbors to return (`k`), and a filter by size and rating.

The following request searches for size small shirts rated between 7 and 10, inclusive:

```json
POST /products-shirts/_search
{
  "size": 2,
  "query": {
    "knn": {
      "item_vector": {
        "vector": [
          2, 4, 3
        ],
        "k": 10,
        "filter": {
          "bool": {
            "must": [
              {
                "range": {
                  "rating": {
                    "gte": 7,
                    "lte": 10
                  }
                }
              },
              {
                "term": {
                  "size": "small"
                }
              }
            ]
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response returns the two matching documents:

```json
{
  "took": 2,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.8620689,
    "hits": [
      {
        "_index": "products-shirts",
        "_id": "8",
        "_score": 0.8620689,
        "_source": {
          "item_vector": [
            2.4,
            4,
            3
          ],
          "size": "small",
          "rating": 8
        }
      },
      {
        "_index": "products-shirts",
        "_id": "6",
        "_score": 0.029691212,
        "_source": {
          "item_vector": [
            6.4,
            3.4,
            6.6
          ],
          "size": "small",
          "rating": 9
        }
      }
    ]
  }
}
```

For more ways to construct a filter, see [Constructing a filter](#constructing-a-filter).

## Constructing a filter

There are multiple ways to construct a filter for the same condition. For example, you can use the following constructs to create a filter that returns hotels that provide parking:

- A `term` query clause in the `should` clause
- A `wildcard` query clause in the `should` clause
- A `regexp` query clause in the `should` clause
- A `must_not` clause to eliminate hotels with `parking` set to `false`.

The following request illustrates these four different ways of searching for hotels with parking:

```json
POST /hotels-index/_search
{
  "size": 3,
  "query": {
    "knn": {
      "location": {
        "vector": [ 5.0, 4.0 ],
        "k": 3,
        "filter": {
          "bool": {
            "must": {
              "range": {
                "rating": {
                  "gte": 1,
                  "lte": 6
                }
              }
            },
            "should": [
            {
              "term": {
                "parking": "true"
              }
            },
            {
              "wildcard": {
                "parking": {
                  "value": "t*e"
                }
              }
            },
            {
              "regexp": {
                "parking": "[a-zA-Z]rue"
              }
            }
            ],
            "must_not": [
            {
              "term": {
                  "parking": "false"
              }
            }
            ],
            "minimum_should_match": 1
          }
        }
      }
    }
  }
} 
```
{% include copy-curl.html %}
