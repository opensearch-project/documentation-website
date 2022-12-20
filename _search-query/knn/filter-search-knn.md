---
layout: default
title: Search with k-NN filters
nav_order: 15
parent: k-NN
has_children: false
has_math: true
---

# Search with k-NN filters
Introduced 2.4
{: .label .label-purple }

You can create custom filters using Query domain-specific language (DSL) search options to refine your k-NN searches. You define the filter criteria within the `knn_vector` field's `filter` subsection in your query. You can use any of the OpenSearch Query DSL query types as a filter. This includes the common query types: `term`, `range`, `regexp`, and `wildcard`, as well as custom query types. To include or exclude results, use Boolean query clauses. You can also specify a query point with the `knn_vector` type and search for nearest neighbors that match your filter criteria.
To run k-NN queries with a filter, the Lucene search engine and Hierarchical Navigable Small World (HNSW) method are required.

To learn more about how to use Query DSL Boolean query clauses, see [Boolean queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/bool). For more details about the `knn_vector` data type definition, see [k-NN Index]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/).
{: .note }

## How does a k-NN filter work?

The OpenSearch k-NN plugin version 2.2 introduced support for the Lucene engine in order to process k-NN searches. The Lucene engine provides a search that is based on the HNSW algorithm in order to represent a multi-layered graph. The OpenSearch k-NN plugin version 2.4 can incorporate filters for searches based on Lucene 9.4.

After a filter is applied to a set of documents to be searched, the algorithm decides whether to perform pre-filtering for an exact k-NN search or modified post-filtering for an approximate search. The approximate search with filtering ensures the top number of closest vectors in the results.

Lucene also provides the capability to operate its `KnnVectorQuery` across a subset of documents. To learn more about this capability, see the [Apache Lucene Documentation](https://issues.apache.org/jira/browse/LUCENE-10382).

To learn more about all available k-NN search approaches, including approximate k-NN, exact k-NN with script score, and pre-filtering with painless extensions, see [k-NN]({{site.url}}{{site.baseurl}}/search-plugins/knn/index/).

### Filtered search performance

Filtering that is tightly integrated with the Lucene HNSW algorithm implementation allows you to apply k-NN searches more efficiently, both in terms of relevancy of search results and performance. Consider, for example, an exact search using post-filtering on a large dataset that returns results slowly and does not ensure the required number of results specified by `k`.
With this new capability, you can create an approximate k-NN search, apply filters, and get the number of results that you need. To learn more about approximate searches, see [Approximate k-NN search]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/).

The HNSW algorithm decides which type of filtering to apply to a search based on the volume of documents and number of `k` points in the index that you search with a filter.

![How the algorithm evaluates a doc set]({{site.url}}{{site.baseurl}}/images/hsnw-algorithm.png)

| Variable | Description |
-- | -- | -- |
N | The number of documents in the index.
P | The number of documents in the search set after the filter is applied using the formula P <= N.
q | The search vector.
k | The maximum number of vectors to return in the response.

To learn more about k-NN performance tuning, see [Performance tuning]({{site.url}}{{site.baseurl}}/search-plugins/knn/performance-tuning/).

## Filter approaches by use case

Depending on the dataset that you are searching, you might choose a different approach to minimize recall or latency. You can create filters that are:

* Very restrictive: Returns the lowest number of documents (for example, 2.5%).
* Somewhat restrictive: Returns some documents (for example, 38%).
* Not very restrictive: Returns the highest number of documents (for example, 80%).

The restrictive percentage indicates the number of documents the filter returns for any given document set in an index.

Number of Vectors | Filter Restrictive Percentage | k | Recall | Latency
-- | -- | -- | -- | --
10M | 2.5 | 100 | Scoring script | Scoring script
10M | 38 | 100 | Lucene filter | Boolean filter
10M | 80 | 100 | Scoring script | Lucene filter
1M | 2.5 | 100 | Lucene filter | Scoring script
1M | 38 | 100 | Lucene filter | lucene_filtering / Scoring script
1M | 80 | 100 | Boolean filter | lucene_filtering

In this context, *Scoring script* is essentially a brute force search, whereas a Boolean filter is an approximate k-NN search with post-filtering.

To learn more about the dynamic searches you can perform with the score script plugin, see [Exact k-NN with scoring script]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-score-script/).

### Boolean filter with approximate k-NN search

In a Boolean query that uses post-filtering, you can join a k-NN query with a filter using a `bool` `must` query clause.

#### Sample request

The following k-NN query uses a Boolean query clause to filter results:

```json
POST /hotels-index/_search
{
    "size": 3,
    "query": {
        "bool": {
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
            },
            "must": [
                {
                    "knn": {
                        "location": {
                            "vector": [
                                5.0,
                                4.0
                            ],
                            "k": 20
                        }
                    }
                }
            ]
        }
    }
}
```
#### Sample response

The Boolean query filter returns the following results in the response:

```json
{
  "took" : 95,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 5,
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

### Use case 1: Very restrictive 2.5% filter

A very restrictive filter returns the lowest number of documents in your dataset. For example, the following filter criteria specifies hotels with feedback ratings less than or equal to 3. This 2.5% filter only returns 1 document:

```json
                "filter": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "rating": {
                                        "lte": 3
                                    }
                                }
                            }
                        ]
                    }
                }
```

### Use case 2: Somewhat restrictive 38% filter

A somewhat restrictive filter returns 38% of the documents in the data set that you search. For example, the following filter criteria specifies hotels with parking and feedback ratings less than or equal to 8 and returns 5 documents.

```json
               "filter": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "rating": {
                                        "lte": 8
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
```

### Use case 3: Not very restrictive 80% filter

A filter that is not very restrictive will return 80% of the documents that you search. For example, the following filter criteria specifies hotels with feedback ratings greater than or equal to 5 and returns 10 documents.

```json
                "filter": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "rating": {
                                        "gte": 5
                                    }
                                }
                            }
                        ]
                    }
                }
```

## Overview: How to use filters in a k-NN search

You can search with a filter by following these three steps:
1. Create an index and specify the requirements for the Lucene engine and HNSW requirements in the mapping.
1. Add your data to the index.
1. Search the index and specify these three items in your query:
* One or more filters defined by Query DSL
* A vector reference point defined by the `vector` field
* The number of matches you want returned with the `k` field

You can use a range query to specify hotel feedback ratings and a term query to require that parking is available. The criteria is processed with Boolean clauses to indicate whether or not the document contains the criteria.

Consider a dataset that contains 12 documents, a search reference point, and documents that meet two filter criteria.

![Graph of documents with filter criteria]({{site.url}}{{site.baseurl}}/images/knn-two-filters.png)

## Step 1: Create a new index with a Lucene mapping

Before you can run a k-NN search with a filter, you need to create an index, specify the Lucene engine in a mapping, and add data to the index.

You need to add a `location` field to represent the location and specify it as the `knn_vector` type. The most basic vector can be two-dimensional. For example:

```
  "type": "knn_vector",
  "dimension": 2,
```

### Requirement: Lucene engine with HNSW method

Make sure to specify "hnsw" method and "lucene" engine in the `knn_vector` field description, as follows:

```json
"my_field": {
                "type": "knn_vector",
                "dimension": 2,
                "method": {
                    "name": "hnsw",
                    "space_type": "l2",
                    "engine": "lucene"
                }
            }
```

#### Sample request

The following request creates a new index called "hotels-index":

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
#### Sample response

Upon success, you should receive a "200-OK" status with the following response:

```json
{
  "acknowledged" : true,
  "shards_acknowledged" : true,
  "index" : "hotels-index"
}
```

## Step 2: Add data to your index

Next, add data to your index with a PUT HTTP request. Make sure that the search criteria is defined in the body of the request.

#### Sample request

The following request adds 12 hotel documents that contain criteria such as feedback ratings and whether or not parking is available:  

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

#### Sample response

Upon success, you should receive a "200-OK" status with entries for each document ID added to the index. The following response is truncated to only show one document:

```json
{
  "took" : 140,
  "errors" : false,
  "items" : [
    {
      "index" : {
        "_index" : "hotels-index",
        "_id" : "1",
        "_version" : 2,
        "result" : "updated",
        "_shards" : {
          "total" : 1,
          "successful" : 1,
          "failed" : 0
        },
        "_seq_no" : 12,
        "_primary_term" : 3,
        "status" : 200
      }
    }
  ]
}

```

## Step 3: Search your data with a filter

Now you can create a k-NN search that specifies filters by using Query DSL Boolean clauses. You need to include your reference point to search for nearest neighbors. Provide an x-y coordinate for the point within the `vector` field, such as `"vector": [ 5.0, 4.0]`.

 To learn more about how to specify ranges with Query DSL, see [Range query]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/term/#range-query).
{: .note }

#### Sample request

The following request creates a k-NN query that only returns the top hotels rated between 8 and 10 and that provide parking. The filter criteria to indicate the range for the feedback ratings uses a `range` query and a `term` query clause to indicate "parking":

```json
POST /hotels-index/_search
{
    "size": 3,
    "query": {
        "knn": {
            "location": {
                "vector": [
                    5.0,
                    4.0
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


#### Sample Response

The following response indicates that only three hotels met the filter criteria:


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

## Additional complex filter query

Depending on how restrictive you want your filter to be, you can add multiple query types to a single request, such as `term`, `wildcard`, `regexp`, or `range`. You can then filter out the search results with the Boolean clauses `must`, `should`, and `must_not`.

#### Sample request

The following request returns hotels that provide parking. This request illustrates multiple alternative mechanisms to obtain the parking filter criteria. It uses a regular expression for the value `true`, a term query for the key-value pair `"parking":"true"`, a wildcard for the characters that spell "true", and the `must_not` clause to eliminate hotels with "parking" set to `false`.

```json
POST /hotels-index/_search
{
    "size": 3,
    "query": {
        "knn": {
            "location": {
                "vector": [
                    5.0,
                    4.0
                ],
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
#### Sample response

The following response indicates a few results for the search with filters:

```json
{
  "took" : 94,
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
    "max_score" : 0.8333333,
    "hits" : [
      {
        "_index" : "hotels-index",
        "_id" : "1",
        "_score" : 0.8333333,
        "_source" : {
          "location" : [
            5.2,
            4.4
          ],
          "parking" : "true",
          "rating" : 5
        }
      },
      {
        "_index" : "hotels-index",
        "_id" : "7",
        "_score" : 0.154321,
        "_source" : {
          "location" : [
            4.2,
            6.2
          ],
          "parking" : "true",
          "rating" : 5
        }
      },
      {
        "_index" : "hotels-index",
        "_id" : "12",
        "_score" : 0.1,
        "_source" : {
          "location" : [
            5.0,
            1.0
          ],
          "parking" : "true",
          "rating" : 3
        }
      }
    ]
  }
}
```
