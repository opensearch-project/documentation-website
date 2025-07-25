---
layout: default
title: Radial search
nav_order: 28
parent: k-NN search
has_children: false
has_math: true
canonical_url: https://docs.opensearch.org/latest/search-plugins/knn/radial-search-knn/
---

# Radial search

Radial search enhances the k-NN plugin's capabilities beyond approximate top-`k` searches. With radial search, you can search all points within a vector space that reside within a specified maximum distance or minimum score threshold from a query point. This provides increased flexibility and utility in search operations.

## Parameter type

`max_distance` allows users to specify a physical distance within the vector space, identifying all points that are within this distance from the query point. This approach is particularly useful for applications requiring spatial proximity or absolute distance measurements.

`min_score` enables the specification of a similarity score, facilitating the retrieval of points that meet or exceed this score in relation to the query point. This method is ideal in scenarios where relative similarity, based on a specific metric, is more critical than physical proximity.

Only one query variable, either `k`, `max_distance`, or `min_score`, is required to be specified during radial search. For more information about the vector spaces, see [Spaces](#spaces).

## Supported cases

You can perform radial search with either the Lucene or Faiss engines. The following table summarizes radial search use cases by engine.

| Engine supported  | Filter supported  | Nested field supported | Search type  |
| :--- | :--- | :--- | :--- |
| Lucene           | true             | false                  | approximate    |
| Faiss            | true             | true                   | approximate    |

## Spaces

For supported spaces, see [Spaces]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/#spaces).

## Examples

The following examples can help you to get started with radial search.

### Prerequisites

To use a k-NN index with radial search, create a k-NN index by setting `index.knn` to `true`. Specify one or more fields of the `knn_vector` data type, as shown in the following example:

```json
PUT knn-index-test
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1,
    "index.knn": true
  },
  "mappings": {
    "properties": {
      "my_vector": {
        "type": "knn_vector",
        "dimension": 2,
        "space_type": "l2",
        "method": {
            "name": "hnsw",
            "engine": "faiss",
            "parameters": {
              "ef_construction": 100,
              "m": 16,
              "ef_search": 100
            }
          }
      }
    }
  }
}
```
{% include copy-curl.html %}

After you create the index, add some data similar to the following:

```json
PUT _bulk?refresh=true
{"index": {"_index": "knn-index-test", "_id": "1"}}
{"my_vector": [7.0, 8.2], "price": 4.4}
{"index": {"_index": "knn-index-test", "_id": "2"}}
{"my_vector": [7.1, 7.4], "price": 14.2}
{"index": {"_index": "knn-index-test", "_id": "3"}}
{"my_vector": [7.3, 8.3], "price": 19.1}
{"index": {"_index": "knn-index-test", "_id": "4"}}
{"my_vector": [6.5, 8.8], "price": 1.2}
{"index": {"_index": "knn-index-test", "_id": "5"}}
{"my_vector": [5.7, 7.9], "price": 16.5}

```
{% include copy-curl.html %}

### Example: Radial search with `max_distance`

The following example shows a radial search performed with `max_distance`:

```json
GET knn-index-test/_search
{
    "query": {
        "knn": {
            "my_vector": {
                "vector": [
                    7.1,
                    8.3
                ],
                "max_distance": 2
            }
        }
    }
}
```
{% include copy-curl.html %}

All documents that fall within the squared Euclidean distance (`l2^2`) of 2 are returned, as shown in the following response:

<details markdown="block">
  <summary>
    Results
  </summary>
  {: .text-delta}

```json
{
    "took": 6,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 4,
            "relation": "eq"
        },
        "max_score": 0.98039204,
        "hits": [
            {
                "_index": "knn-index-test",
                "_id": "1",
                "_score": 0.98039204,
                "_source": {
                    "my_vector": [
                        7.0,
                        8.2
                    ],
                    "price": 4.4
                }
            },
            {
                "_index": "knn-index-test",
                "_id": "3",
                "_score": 0.9615384,
                "_source": {
                    "my_vector": [
                        7.3,
                        8.3
                    ],
                    "price": 19.1
                }
            },
            {
                "_index": "knn-index-test",
                "_id": "4",
                "_score": 0.62111807,
                "_source": {
                    "my_vector": [
                        6.5,
                        8.8
                    ],
                    "price": 1.2
                }
            },
            {
                "_index": "knn-index-test",
                "_id": "2",
                "_score": 0.5524861,
                "_source": {
                    "my_vector": [
                        7.1,
                        7.4
                    ],
                    "price": 14.2
                }
            }
        ]
    }
}
```
</details>

### Example: Radial search with `max_distance` and a filter

The following example shows a radial search performed with `max_distance` and a response filter:

```json
GET knn-index-test/_search
{
  "query": {
    "knn": {
      "my_vector": {
        "vector": [7.1, 8.3],
        "max_distance": 2,
        "filter": {
          "range": {
            "price": {
              "gte": 1,
              "lte": 5
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

All documents that fall within the squared Euclidean distance (`l2^2`) of 2 and have a price within the range of 1 to 5 are returned, as shown in the following response:

<details markdown="block">
  <summary>
    Results
  </summary>
  {: .text-delta}

```json
{
    "took": 4,
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
        "max_score": 0.98039204,
        "hits": [
            {
                "_index": "knn-index-test",
                "_id": "1",
                "_score": 0.98039204,
                "_source": {
                    "my_vector": [
                        7.0,
                        8.2
                    ],
                    "price": 4.4
                }
            },
            {
                "_index": "knn-index-test",
                "_id": "4",
                "_score": 0.62111807,
                "_source": {
                    "my_vector": [
                        6.5,
                        8.8
                    ],
                    "price": 1.2
                }
            }
        ]
    }
}
```
</details>

### Example: Radial search with `min_score`

The following example shows a radial search performed with `min_score`:

```json
GET knn-index-test/_search
{
  "query": {
    "knn": {
      "my_vector": {
        "vector": [7.1, 8.3],
        "min_score": 0.95
      }
    }
  }
}
```
{% include copy-curl.html %}

All documents with a score of 0.9 or higher are returned, as shown in the following response:

<details markdown="block">
  <summary>
    Results
  </summary>
  {: .text-delta}

```json
{
    "took": 3,
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
        "max_score": 0.98039204,
        "hits": [
            {
                "_index": "knn-index-test",
                "_id": "1",
                "_score": 0.98039204,
                "_source": {
                    "my_vector": [
                        7.0,
                        8.2
                    ],
                    "price": 4.4
                }
            },
            {
                "_index": "knn-index-test",
                "_id": "3",
                "_score": 0.9615384,
                "_source": {
                    "my_vector": [
                        7.3,
                        8.3
                    ],
                    "price": 19.1
                }
            }
        ]
    }
}
```
</details>

### Example: Radial search with `min_score` and a filter

The following example shows a radial search performed with `min_score` and a response filter:

```json
GET knn-index-test/_search
{
    "query": {
        "knn": {
            "my_vector": {
                "vector": [
                    7.1,
                    8.3
                ],
                "min_score": 0.95,
                "filter": {
                    "range": {
                        "price": {
                            "gte": 1,
                            "lte": 5
                        }
                    }
                }
            }
        }
    }
}
```
{% include copy-curl.html %}

All documents that have a score of 0.9 or higher and a price within the range of 1 to 5 are returned, as shown in the following example:

<details markdown="block">
  <summary>
    Results
  </summary>
  {: .text-delta}

```json
{
    "took": 4,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 1,
            "relation": "eq"
        },
        "max_score": 0.98039204,
        "hits": [
            {
                "_index": "knn-index-test",
                "_id": "1",
                "_score": 0.98039204,
                "_source": {
                    "my_vector": [
                        7.0,
                        8.2
                    ],
                    "price": 4.4
                }
            }
        ]
    }
}
```
</details>
