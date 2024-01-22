---
layout: default
title: k-NN search with nested fields
nav_order: 21
parent: k-NN search
grand_parent: Search methods
has_children: false
has_math: true
---

# k-NN search with nested fields
With k-NN search using nested fields, you can store multiple vectors in a single document. 
For example, if your document consists of various components, you can generate a vector value for each component and store them in a nested field.

During a k document search, the search operates at the field level. 
However, only the nearest vector of each document contributes to the result. 
For instance, if there are documents A and B, with A having vectors A1 and A2, and B having vector B1, and the similarity order for a query Q is A1, A2, B1, using a k value of 2 will return both documents A and B instead of just A.

It's essential to note that in the case of an approximate search, the results are approximations and not exact matches.

k-NN search with nested fields is supported with the HNSW algorithm in Lucene and the Faiss engine. 


## Get started with k-NN search with nested fields

To use the k-NN plugin's search functionality with nested fields, you must first create a k-NN index with `index.knn` set to `true`.

Next, you must add one or more fields of the `knn_vector` data type inside nested_field. This example creates an index with one `knn_vector` data type inside nested field.

```json
PUT my-knn-index-1
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "nested_field": {
        "type": "nested",
        "properties": {
          "my_vector": {
            "type": "knn_vector",
            "dimension": 3,
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
  }
}
```

After you create the index, you can add some data to it:

```json
PUT _bulk?refresh=true
{ "index": { "_index": "my-knn-index-1", "_id": "1" } }
{"nested_field":[{"my_vector":[1,1,1]},{"my_vector":[2,2,2]},{"my_vector":[3,3,3]}]}
{ "index": { "_index": "my-knn-index-1", "_id": "2" } }
{"nested_field":[{"my_vector":[10,10,10]},{"my_vector":[20,20,20]},{"my_vector":[30,30,30]}]}

```

Then you can execute a k-nearest neighbor search on the data using the `knn` query type:

```json
GET my-knn-index-1/_search
{
  "query": {
    "nested": {
      "path": "nested_field",
      "query": {
        "knn": {
          "nested_field.my_vector": {
            "vector": [1,1,1],
            "k": 2
          }
        }
      }
    }
  }
}
```


Even if document ID 1 has three nearest vectors, it returns two documents with a k value of 2. 
```json
{
  "took": 23,
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
    "max_score": 1,
    "hits": [
      {
        "_index": "my-knn-index-1",
        "_id": "1",
        "_score": 1,
        "_source": {
          "nested_field": [
            {
              "my_vector": [
                1,
                1,
                1
              ]
            },
            {
              "my_vector": [
                2,
                2,
                2
              ]
            },
            {
              "my_vector": [
                3,
                3,
                3
              ]
            }
          ]
        }
      },
      {
        "_index": "my-knn-index-1",
        "_id": "2",
        "_score": 0.0040983604,
        "_source": {
          "nested_field": [
            {
              "my_vector": [
                10,
                10,
                10
              ]
            },
            {
              "my_vector": [
                20,
                20,
                20
              ]
            },
            {
              "my_vector": [
                30,
                30,
                30
              ]
            }
          ]
        }
      }
    ]
  }
}
```

## Filtering on k-NN search with nested fields
You can apply filter on k-NN search with nested fields. Filter can be applied to either top level field or field inside nested fields.

In this example, it uses filter on top level field. 
First, you need to create a knn index with a nested field.

```json
PUT my-knn-index-1
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "nested_field": {
        "type": "nested",
        "properties": {
          "my_vector": {
            "type": "knn_vector",
            "dimension": 3,
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
  }
}
```

After you create the index, you can add some data to it:

```json
PUT _bulk?refresh=true
{ "index": { "_index": "my-knn-index-1", "_id": "1" } }
{"parking": false, "nested_field":[{"my_vector":[1,1,1]},{"my_vector":[2,2,2]},{"my_vector":[3,3,3]}]}
{ "index": { "_index": "my-knn-index-1", "_id": "2" } }
{"parking": true, "nested_field":[{"my_vector":[10,10,10]},{"my_vector":[20,20,20]},{"my_vector":[30,30,30]}]}
{ "index": { "_index": "my-knn-index-1", "_id": "3" } }
{"parking": true, "nested_field":[{"my_vector":[100,100,100]},{"my_vector":[200,200,200]},{"my_vector":[300,300,300]}]}

```

Then you can execute a k-nearest neighbor search on the data using the `knn` query type with filter:

```json
GET my-knn-index-1/_search
{
  "query": {
    "nested": {
      "path": "nested_field",
      "query": {
        "knn": {
          "nested_field.my_vector": {
            "vector": [
              1,
              1,
              1
            ],
            "k": 3,
            "filter": {
              "term": {
                "parking": true
              }
            }
          }
        }
      }
    }
  }
}
```


Even if document ID 1 has the nearest vector value, only document ID 2 and 3 are returned with the filtering condition
```json
{
  "took": 10,
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
    "max_score": 0.0040983604,
    "hits": [
      {
        "_index": "my-knn-index-1",
        "_id": "2",
        "_score": 0.0040983604,
        "_source": {
          "parking": true,
          "nested_field": [
            {
              "my_vector": [
                10,
                10,
                10
              ]
            },
            {
              "my_vector": [
                20,
                20,
                20
              ]
            },
            {
              "my_vector": [
                30,
                30,
                30
              ]
            }
          ]
        }
      },
      {
        "_index": "my-knn-index-1",
        "_id": "3",
        "_score": 3.400898E-5,
        "_source": {
          "parking": true,
          "nested_field": [
            {
              "my_vector": [
                100,
                100,
                100
              ]
            },
            {
              "my_vector": [
                200,
                200,
                200
              ]
            },
            {
              "my_vector": [
                300,
                300,
                300
              ]
            }
          ]
        }
      }
    ]
  }
}
```
