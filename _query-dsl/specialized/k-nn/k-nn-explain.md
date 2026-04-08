---
layout: default
title: k-NN query explain
parent: k-NN
grand_parent: Specialized queries
nav_order: 10
canonical_url: https://docs.opensearch.org/latest/query-dsl/specialized/k-nn/k-nn-explain/
---

# k-NN query explain
**Introduced 3.0**
{: .label .label-purple }

You can provide the `explain` parameter to understand how scores are calculated, normalized, and combined in `knn` queries. When enabled, it provides detailed information about the scoring process for each search result. This includes revealing the score normalization techniques used, how different scores were combined, and the calculations for individual subquery scores. This comprehensive insight makes it easier to understand and optimize your `knn` query results. For more information about `explain`, see [Explain API]({{site.url}}{{site.baseurl}}/api-reference/explain/).

`explain` is an expensive operation in terms of both resources and time. For production clusters, we recommend using it sparingly for the purpose of troubleshooting.
{: .warning }

You can provide the `explain` parameter in a URL when running a complete `knn` query for the Faiss engine using the following syntax:

```json
GET <index>/_search?explain=true
POST <index>/_search?explain=true
```

`explain` for k-NN search for all types of queries with the Lucene engine does not return a detailed explanation as with the Faiss engine.
{: .note }

The `explain` parameter works for the following types of k-NN search with the Faiss engine:

- [Approximate k-NN search]({{site.url}}{{site.baseurl}}/vector-search/vector-search-techniques/approximate-knn/)
- Approximate k-NN search with [exact search]({{site.url}}{{site.baseurl}}/vector-search/vector-search-techniques/knn-score-script/)
- [Disk-based search]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/disk-based-vector-search/)
- [k-NN search with efficient filtering]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/efficient-knn-filtering/)
- [Radial search]({{site.url}}{{site.baseurl}}/vector-search/specialized-operations/radial-search-knn/)
- k-NN search with a `term` query

`explain` for k-NN search with nested fields does not return a detailed explanation as with other searches.
{: .note }

You can provide the `explain` parameter as a query parameter:

```json
GET my-knn-index/_search?explain=true
{
  "query": {
    "knn": {
      "my_vector": {
      "vector": [2, 3, 5, 7],
      "k": 2
      }
    }
  }
}
```
{% include copy-curl.html %}

Alternatively, you can provide the `explain` parameter in the request body:

```json
GET my-knn-index/_search
{
  "query": {
    "knn": {
      "my_vector": {
      "vector": [2, 3, 5, 7],
      "k": 2
      }
    }
  },
  "explain": true
}
```
{% include copy-curl.html %}

## Example: Approximate k-NN search

<details markdown="block">
  <summary>
    Example response
  </summary>
  {: .text-delta}

```json
{
  "took": 216038,
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
    "max_score": 88.4,
    "hits": [
      {
        "_shard": "[my-knn-index-1][0]",
        "_node": "VHcyav6OTsmXdpsttX2Yug",
        "_index": "my-knn-index-1",
        "_id": "5",
        "_score": 88.4,
        "_source": {
          "my_vector1": [
            2.5,
            3.5,
            5.5,
            7.4
          ],
          "price": 8.9
        },
        "_explanation": {
          "value": 88.4,
          "description": "the type of knn search executed was Approximate-NN",
          "details": [
            {
              "value": 88.4,
              "description": "the type of knn search executed at leaf was Approximate-NN with vectorDataType = FLOAT, spaceType = innerproduct where score is computed as `-rawScore + 1` from:",
              "details": [
                {
                  "value": -87.4,
                  "description": "rawScore, returned from FAISS library",
                  "details": []
                }
              ]
            }
          ]
        }
      },
      {
        "_shard": "[my-knn-index-1][0]",
        "_node": "VHcyav6OTsmXdpsttX2Yug",
        "_index": "my-knn-index-1",
        "_id": "2",
        "_score": 84.7,
        "_source": {
          "my_vector1": [
            2.5,
            3.5,
            5.6,
            6.7
          ],
          "price": 5.5
        },
        "_explanation": {
          "value": 84.7,
          "description": "the type of knn search executed was Approximate-NN",
          "details": [
            {
              "value": 84.7,
              "description": "the type of knn search executed at leaf was Approximate-NN with vectorDataType = FLOAT, spaceType = innerproduct where score is computed as `-rawScore + 1` from:",
              "details": [
                {
                  "value": -83.7,
                  "description": "rawScore, returned from FAISS library",
                  "details": []
                }
              ]
            }
          ]
        }
      }
    ]
  }
}
```
</details>

## Example: Approximate k-NN search with exact search

<details markdown="block">
  <summary>
    Example response
  </summary>
  {: .text-delta}

```json
{
  "took": 87,
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
    "max_score": 84.7,
    "hits": [
      {
        "_shard": "[my-knn-index-1][0]",
        "_node": "MQVux8dZRWeznuEYKhMq0Q",
        "_index": "my-knn-index-1",
        "_id": "7",
        "_score": 84.7,
        "_source": {
          "my_vector2": [
            2.5,
            3.5,
            5.6,
            6.7
          ],
          "price": 5.5
        },
        "_explanation": {
          "value": 84.7,
          "description": "the type of knn search executed was Approximate-NN",
          "details": [
            {
              "value": 84.7,
              "description": "the type of knn search executed at leaf was Exact with spaceType = INNER_PRODUCT, vectorDataType = FLOAT, queryVector = [2.0, 3.0, 5.0, 6.0]",
              "details": []
            }
          ]
        }
      },
      {
        "_shard": "[my-knn-index-1][0]",
        "_node": "MQVux8dZRWeznuEYKhMq0Q",
        "_index": "my-knn-index-1",
        "_id": "8",
        "_score": 82.2,
        "_source": {
          "my_vector2": [
            4.5,
            5.5,
            6.7,
            3.7
          ],
          "price": 4.4
        },
        "_explanation": {
          "value": 82.2,
          "description": "the type of knn search executed was Approximate-NN",
          "details": [
            {
              "value": 82.2,
              "description": "the type of knn search executed at leaf was Exact with spaceType = INNER_PRODUCT, vectorDataType = FLOAT, queryVector = [2.0, 3.0, 5.0, 6.0]",
              "details": []
            }
          ]
        }
      }
    ]
  }
```
</details>

## Example: Disk-based search

<details markdown="block">
  <summary>
    Example response
  </summary>
  {: .text-delta}

```json
{
  "took" : 4,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 381.0,
    "hits" : [
      {
        "_shard" : "[my-vector-index][0]",
        "_node" : "pLaiqZftTX-MVSKdQSu7ow",
        "_index" : "my-vector-index",
        "_id" : "9",
        "_score" : 381.0,
        "_source" : {
          "my_vector_field" : [
            9.5,
            9.5,
            9.5,
            9.5,
            9.5,
            9.5,
            9.5,
            9.5
          ],
          "price" : 8.9
        },
        "_explanation" : {
          "value" : 381.0,
          "description" : "the type of knn search executed was Disk-based and the first pass k was 100 with vector dimension of 8, over sampling factor of 5.0, shard level rescoring enabled",
          "details" : [
            {
              "value" : 381.0,
              "description" : "the type of knn search executed at leaf was Approximate-NN with spaceType = HAMMING, vectorDataType = FLOAT, queryVector = [1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5]",
              "details" : [ ]
            }
          ]
        }
      }
    ]
  }
}
```
</details>

## Example: k-NN search with efficient filtering

<details markdown="block">
  <summary>
    Example response
  </summary>
  {: .text-delta}

```json
{
  "took" : 51,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 0.8620689,
    "hits" : [
      {
        "_shard" : "[products-shirts][0]",
        "_node" : "9epk8WoFT8yvnUI0tAaJgQ",
        "_index" : "products-shirts",
        "_id" : "8",
        "_score" : 0.8620689,
        "_source" : {
          "item_vector" : [
            2.4,
            4.0,
            3.0
          ],
          "size" : "small",
          "rating" : 8
        },
        "_explanation" : {
          "value" : 0.8620689,
          "description" : "the type of knn search executed was Approximate-NN",
          "details" : [
            {
              "value" : 0.8620689,
              "description" : "the type of knn search executed at leaf was Exact since filteredIds = 2 is less than or equal to K = 10 with spaceType = L2, vectorDataType = FLOAT, queryVector = [2.0, 4.0, 3.0]",
              "details" : [ ]
            }
          ]
        }
      },
      {
        "_shard" : "[products-shirts][0]",
        "_node" : "9epk8WoFT8yvnUI0tAaJgQ",
        "_index" : "products-shirts",
        "_id" : "6",
        "_score" : 0.029691212,
        "_source" : {
          "item_vector" : [
            6.4,
            3.4,
            6.6
          ],
          "size" : "small",
          "rating" : 9
        },
        "_explanation" : {
          "value" : 0.029691212,
          "description" : "the type of knn search executed was Approximate-NN",
          "details" : [
            {
              "value" : 0.029691212,
              "description" : "the type of knn search executed at leaf was Exact since filteredIds = 2 is less than or equal to K = 10 with spaceType = L2, vectorDataType = FLOAT, queryVector = [2.0, 4.0, 3.0]",
              "details" : [ ]
            }
          ]
        }
      }
    ]
  }
}
```
</details>

## Example: Radial search

```json
GET my-knn-index/_search?explain=true
{
  "query": {
    "knn": {
      "my_vector": {
      "vector": [7.1, 8.3],
      "max_distance": 2
      }
    }
  }
}
```
{% include copy-curl.html %}

<details markdown="block">
  <summary>
    Example response
  </summary>
  {: .text-delta}

```json
{
  "took" : 376529,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 0.98039204,
    "hits" : [
      {
        "_shard" : "[knn-index-test][0]",
        "_node" : "c9b4aPe4QGO8eOtb8P5D3g",
        "_index" : "knn-index-test",
        "_id" : "1",
        "_score" : 0.98039204,
        "_source" : {
          "my_vector" : [
            7.0,
            8.2
          ],
          "price" : 4.4
        },
        "_explanation" : {
          "value" : 0.98039204,
          "description" : "the type of knn search executed was Radial with the radius of 2.0",
          "details" : [
            {
              "value" : 0.98039204,
              "description" : "the type of knn search executed at leaf was Approximate-NN with vectorDataType = FLOAT, spaceType = l2 where score is computed as `1 / (1 + rawScore)` from:",
              "details" : [
                {
                  "value" : 0.020000057,
                  "description" : "rawScore, returned from FAISS library",
                  "details" : [ ]
                }
              ]
            }
          ]
        }
      },
      {
        "_shard" : "[knn-index-test][0]",
        "_node" : "c9b4aPe4QGO8eOtb8P5D3g",
        "_index" : "knn-index-test",
        "_id" : "3",
        "_score" : 0.9615384,
        "_source" : {
          "my_vector" : [
            7.3,
            8.3
          ],
          "price" : 19.1
        },
        "_explanation" : {
          "value" : 0.9615384,
          "description" : "the type of knn search executed was Radial with the radius of 2.0",
          "details" : [
            {
              "value" : 0.9615384,
              "description" : "the type of knn search executed at leaf was Approximate-NN with vectorDataType = FLOAT, spaceType = l2 where score is computed as `1 / (1 + rawScore)` from:",
              "details" : [
                {
                  "value" : 0.040000115,
                  "description" : "rawScore, returned from FAISS library",
                  "details" : [ ]
                }
              ]
            }
          ]
        }
      }
    ]
  }
}

```
</details>

## Example: k-NN search with a term query

```json
GET my-knn-index/_search?explain=true
{
  "query": {
    "bool": {
      "should": [
        {
          "knn": {
            "my_vector2": { // vector field name
              "vector": [2, 3, 5, 6],
              "k": 2
            }
          }
        },
      {
        "term": {
            "price": "4.4"
          }
        }
      ]
    }  
  }
}
```
{% include copy-curl.html %}

<details markdown="block">
  <summary>
    Example response
  </summary>
  {: .text-delta}

```json
{
  "took" : 51,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 84.7,
    "hits" : [
      {
        "_shard" : "[my-knn-index-1][0]",
        "_node" : "c9b4aPe4QGO8eOtb8P5D3g",
        "_index" : "my-knn-index-1",
        "_id" : "7",
        "_score" : 84.7,
        "_source" : {
          "my_vector2" : [
            2.5,
            3.5,
            5.6,
            6.7
          ],
          "price" : 5.5
        },
        "_explanation" : {
          "value" : 84.7,
          "description" : "sum of:",
          "details" : [
            {
              "value" : 84.7,
              "description" : "the type of knn search executed was Approximate-NN",
              "details" : [
                {
                  "value" : 84.7,
                  "description" : "the type of knn search executed at leaf was Approximate-NN with vectorDataType = FLOAT, spaceType = innerproduct where score is computed as `-rawScore + 1` from:",
                  "details" : [
                    {
                      "value" : -83.7,
                      "description" : "rawScore, returned from FAISS library",
                      "details" : [ ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        "_shard" : "[my-knn-index-1][0]",
        "_node" : "c9b4aPe4QGO8eOtb8P5D3g",
        "_index" : "my-knn-index-1",
        "_id" : "8",
        "_score" : 83.2,
        "_source" : {
          "my_vector2" : [
            4.5,
            5.5,
            6.7,
            3.7
          ],
          "price" : 4.4
        },
        "_explanation" : {
          "value" : 83.2,
          "description" : "sum of:",
          "details" : [
            {
              "value" : 82.2,
              "description" : "the type of knn search executed was Approximate-NN",
              "details" : [
                {
                  "value" : 82.2,
                  "description" : "the type of knn search executed at leaf was Approximate-NN with vectorDataType = FLOAT, spaceType = innerproduct where score is computed as `-rawScore + 1` from:",
                  "details" : [
                    {
                      "value" : -81.2,
                      "description" : "rawScore, returned from FAISS library",
                      "details" : [ ]
                    }
                  ]
                }
              ]
            },
            {
              "value" : 1.0,
              "description" : "price:[1082969293 TO 1082969293]",
              "details" : [ ]
            }
          ]
        }
      }
    ]
  }
}
```

</details>

## Response body fields

Field | Description
:--- | :---
`explanation` | The `explanation` object contains the following fields: <br> - `value`: Contains the calculation result.<br> - `description`: Explains what type of calculation was performed. For score normalization, the information in the `description` field includes the technique used for normalization or combination and the corresponding score. <br> - `details`: Shows any subcalculations performed. 

