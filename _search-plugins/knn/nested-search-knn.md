---
layout: default
title: k-NN search with nested fields
nav_order: 21
parent: k-NN search
has_children: false
has_math: true
canonical_url: https://docs.opensearch.org/latest/search-plugins/knn/nested-search-knn/
---

# k-NN search with nested fields

Using [nested fields]({{site.url}}{{site.baseurl}}/field-types/nested/) in a k-nearest neighbors (k-NN) index, you can store multiple vectors in a single document. For example, if your document consists of various components, you can generate a vector value for each component and store each vector in a nested field.

A k-NN document search operates at the field level. For a document with nested fields, OpenSearch examines only the vector nearest to the query vector to decide whether to include the document in the results. For example, consider an index containing documents `A` and `B`. Document `A` is represented by vectors `A1` and `A2`, and document `B` is represented by vector `B1`. Further, the similarity order for a query Q is `A1`, `A2`, `B1`. If you search using query Q with a k value of 2, the search will return both documents `A` and `B` instead of only document `A`.

Note that in the case of an approximate search, the results are approximations and not exact matches.

k-NN search with nested fields is supported by the HNSW algorithm for the Lucene and Faiss engines. 


## Indexing and searching nested fields

To use k-NN search with nested fields, you must create a k-NN index by setting `index.knn` to `true`. Create a nested field by setting its `type` to `nested` and specify one or more fields of the `knn_vector` data type within the nested field. In this example, the `knn_vector` field `my_vector` is nested inside the `nested_field` field:

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
          },
          "color": {
            "type": "text",
            "index": false
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

After you create the index, add some data to it:

```json
PUT _bulk?refresh=true
{ "index": { "_index": "my-knn-index-1", "_id": "1" } }
{"nested_field":[{"my_vector":[1,1,1], "color": "blue"},{"my_vector":[2,2,2], "color": "yellow"},{"my_vector":[3,3,3], "color": "white"}]}
{ "index": { "_index": "my-knn-index-1", "_id": "2" } }
{"nested_field":[{"my_vector":[10,10,10], "color": "red"},{"my_vector":[20,20,20], "color": "green"},{"my_vector":[30,30,30], "color": "black"}]}
```
{% include copy-curl.html %}

Then run a k-NN search on the data by using the `knn` query type:

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
{% include copy-curl.html %}

Even though all three vectors nearest to the query vector are in document 1, the query returns both documents 1 and 2 because k is set to 2:

```json
{
  "took": 5,
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
    "max_score": 1.0,
    "hits": [
      {
        "_index": "my-knn-index-1",
        "_id": "1",
        "_score": 1.0,
        "_source": {
          "nested_field": [
            {
              "my_vector": [
                1,
                1,
                1
              ],
              "color": "blue"
            },
            {
              "my_vector": [
                2,
                2,
                2
              ],
              "color": "yellow"
            },
            {
              "my_vector": [
                3,
                3,
                3
              ],
              "color": "white"
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
              ],
              "color": "red"
            },
            {
              "my_vector": [
                20,
                20,
                20
              ],
              "color": "green"
            },
            {
              "my_vector": [
                30,
                30,
                30
              ],
              "color": "black"
            }
          ]
        }
      }
    ]
  }
}
```

## Inner hits 

When you retrieve documents based on matches in nested fields, by default, the response does not contain information about which inner objects matched the query. Thus, it is not apparent why the document is a match. To include information about the matching nested fields in the response, you can provide the `inner_hits` object in your query. To return only certain fields of the matching documents within `inner_hits`, specify the document fields in the `fields` array. Generally, you should also exclude `_source` from the results to avoid returning the whole document. The following example returns only the `color` inner field of the `nested_field`:

```json
GET my-knn-index-1/_search
{
  "_source": false,
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
      },
      "inner_hits": {
        "_source": false,
        "fields":["nested_field.color"]
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains matching documents. For each matching document, the `inner_hits` object contains only the `nested_field.color` fields of the matched documents in the `fields` array:

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
    "max_score": 1.0,
    "hits": [
      {
        "_index": "my-knn-index-1",
        "_id": "1",
        "_score": 1.0,
        "inner_hits": {
          "nested_field": {
            "hits": {
              "total": {
                "value": 1,
                "relation": "eq"
              },
              "max_score": 1.0,
              "hits": [
                {
                  "_index": "my-knn-index-1",
                  "_id": "1",
                  "_nested": {
                    "field": "nested_field",
                    "offset": 0
                  },
                  "_score": 1.0,
                  "fields": {
                    "nested_field.color": [
                      "blue"
                    ]
                  }
                }
              ]
            }
          }
        }
      },
      {
        "_index": "my-knn-index-1",
        "_id": "2",
        "_score": 0.0040983604,
        "inner_hits": {
          "nested_field": {
            "hits": {
              "total": {
                "value": 1,
                "relation": "eq"
              },
              "max_score": 0.0040983604,
              "hits": [
                {
                  "_index": "my-knn-index-1",
                  "_id": "2",
                  "_nested": {
                    "field": "nested_field",
                    "offset": 0
                  },
                  "_score": 0.0040983604,
                  "fields": {
                    "nested_field.color": [
                      "red"
                    ]
                  }
                }
              ]
            }
          }
        }
      }
    ]
  }
}
```

## k-NN search with filtering on nested fields

You can apply a filter to a k-NN search with nested fields. A filter can be applied to either a top-level field or a field inside a nested field.

The following example applies a filter to a top-level field. 

First, create a k-NN index with a nested field:

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
{% include copy-curl.html %}

After you create the index, add some data to it:

```json
PUT _bulk?refresh=true
{ "index": { "_index": "my-knn-index-1", "_id": "1" } }
{"parking": false, "nested_field":[{"my_vector":[1,1,1]},{"my_vector":[2,2,2]},{"my_vector":[3,3,3]}]}
{ "index": { "_index": "my-knn-index-1", "_id": "2" } }
{"parking": true, "nested_field":[{"my_vector":[10,10,10]},{"my_vector":[20,20,20]},{"my_vector":[30,30,30]}]}
{ "index": { "_index": "my-knn-index-1", "_id": "3" } }
{"parking": true, "nested_field":[{"my_vector":[100,100,100]},{"my_vector":[200,200,200]},{"my_vector":[300,300,300]}]}
```
{% include copy-curl.html %}

Then run a k-NN search on the data using the `knn` query type with a filter. The following query returns documents whose `parking` field is set to `true`:

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
{% include copy-curl.html %}

Even though all three vectors nearest to the query vector are in document 1, the query returns documents 2 and 3 because document 1 is filtered out:

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
