---
layout: default
title: Using inner hits in hybrid queries
parent: Hybrid search
grand_parent: AI search
has_children: false
nav_order: 60
canonical_url: https://docs.opensearch.org/latest/vector-search/ai-search/hybrid-search/inner-hits/
---

# Using inner hits in hybrid queries
**Introduced 3.0**
{: .label .label-purple }

When running a hybrid search, you can retrieve the matching nested objects or child documents by including an `inner_hits` clause in your search request. This information lets you explore the specific parts of a document that matched the query.

To learn more about how `inner_hits` works, see [Retrieve inner hits]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/inner-hits/).


During hybrid query execution, documents are scored and retrieved as follows:

1. Each subquery selects parent documents based on the relevance of their inner hits.
1. The selected parent documents from all subqueries are combined, and their scores are normalized to produce a hybrid score.
1. For each parent document, the relevant `inner_hits` are retrieved from the shards and included in the final response.

Hybrid queries handle inner hits differently than traditional queries when determining final search results:

- In a **traditional query**, the final ranking of parent documents is determined directly by the `inner_hits` scores.
- In a **hybrid query**, the final ranking is determined by the **hybrid score** (a normalized combination of all subquery scores). However, parent documents are still fetched from the shard based on the relevance of their `inner_hits`.

The `inner_hits` section in the response shows the original (raw) scores before normalization. The parent documents show the final hybrid score.
{: .note}

## Example

The following example demonstrates using `inner_hits` with a hybrid query. 

### Step 1: Create an index

Create an index with two nested fields (`user` and `location`):

```json
PUT /my-nlp-index
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 0
  },
  "mappings": {
    "properties": {
      "user": {
        "type": "nested",
        "properties": {
          "name": {
            "type": "text"
          },
          "age": {
            "type": "integer"
          }
        }
      },
      "location": {
        "type": "nested",
        "properties": {
          "city": {
            "type": "text"
          },
          "state": {
            "type": "text"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### Step 2: Create a search pipeline 

Configure a search pipeline with a `normalization-processor` using the `min_max` normalization technique and the `arithmetic_mean` combination technique:

```json
PUT /_search/pipeline/nlp-search-pipeline
{
  "description": "Post processor for hybrid search",
  "phase_results_processors": [
    {
      "normalization-processor": {
        "normalization": {
          "technique": "min_max"
        },
        "combination": {
          "technique": "arithmetic_mean",
          "parameters": {}
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 3: Ingest documents into the index

To ingest documents into the index created in the previous step, send the following request:

```json
POST /my-nlp-index/_bulk
{"index": {"_index": "my-nlp-index"}}
{"user":[{"name":"John Alder","age":35},{"name":"Sammy","age":34},{"name":"Mike","age":32},{"name":"Maples","age":30}],"location":[{"city":"Amsterdam","state":"Netherlands"},{"city":"Udaipur","state":"Rajasthan"},{"city":"Naples","state":"Italy"}]}
{"index": {"_index": "my-nlp-index"}}
{"user":[{"name":"John Wick","age":46},{"name":"John Snow","age":40},{"name":"Sansa Stark","age":22},{"name":"Arya Stark","age":20}],"location":[{"city":"Tromso","state":"Norway"},{"city":"Los Angeles","state":"California"},{"city":"London","state":"UK"}]}
```
{% include copy-curl.html %}

### Step 4: Search the index using hybrid search and fetch inner hits

The following request runs a hybrid query to search for matches in two nested fields: `user` and `location`. It combines the results from each field into a single ranked list of parent documents while also retrieving the matching nested objects using `inner_hits`:

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline
{
  "query": {
    "hybrid": {
      "queries": [
        {
          "nested": {
            "path": "user",
            "query": {
              "match": {
                "user.name": "John"
              }
            },
            "score_mode": "sum",
            "inner_hits": {}
          }
        },
        {
          "nested": {
            "path": "location",
            "query": {
              "match": {
                "location.city": "Udaipur"
              }
            },
            "inner_hits": {}
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

The response includes the matched parent documents along with the relevant nested `inner_hits` for both the `user` and `location` nested fields. Each inner hit shows which nested object matched and how strongly it contributed to the overall hybrid score:

```json
...
{
  "hits": [
    {
      "_index": "my-nlp-index",
      "_id": "1",
      "_score": 1.0,
      "inner_hits": {
        "location": {
          "hits": {
            "max_score": 0.44583148,
            "hits": [
              {
                "_nested": {
                  "field": "location",
                  "offset": 1
                },
                "_score": 0.44583148,
                "_source": {
                  "city": "Udaipur",
                  "state": "Rajasthan"
                }
              }
            ]
          }
        },
        "user": {
          "hits": {
            "max_score": 0.4394061,
            "hits": [
              {
                "_nested": {
                  "field": "user",
                  "offset": 0
                },
                "_score": 0.4394061,
                "_source": {
                  "name": "John Alder",
                  "age": 35
                }
              }
            ]
          }
        }
      }
      // Additional details omitted for brevity
    },
    {
      "_index": "my-nlp-index",
      "_id": "2",
      "_score": 5.0E-4,
      "inner_hits": {
        "user": {
          "hits": {
            "max_score": 0.31506687,
            "hits": [
              {
                "_nested": {
                  "field": "user",
                  "offset": 0
                },
                "_score": 0.31506687,
                "_source": {
                  "name": "John Wick",
                  "age": 46
                }
              },
              {
                "_nested": {
                  "field": "user",
                  "offset": 1
                },
                "_score": 0.31506687,
                "_source": {
                  "name": "John Snow",
                  "age": 40
                }
              }
            ]
          }
        }
        // Additional details omitted for brevity
      }
    }
  ]
  // Additional details omitted for brevity
}
...
```

## Using the explain parameter

To understand how inner hits contribute to the hybrid score, you can enable explanation. The response will include detailed scoring information. For more information about using `explain` with hybrid queries, see [Hybrid search explain]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/explain/).

`explain` is an expensive operation in terms of both resources and time. For production clusters, we recommend using it sparingly for the purpose of troubleshooting.
{: .warning}

First, add the `hybrid_score_explanation` processor to the search pipeline you created in Step 2:

```json
PUT /_search/pipeline/nlp-search-pipeline
{
  "description": "Post processor for hybrid search",
  "phase_results_processors": [
    {
      "normalization-processor": {
        "normalization": {
          "technique": "min_max"
        },
        "combination": {
          "technique": "arithmetic_mean"
        }
      }
    }
  ],
  "response_processors": [
    {
      "hybrid_score_explanation": {}
    }
  ]
}
```
{% include copy-curl.html %}

For more information, see [Hybrid score explanation processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/explanation-processor/) and [Hybrid search explain]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/explain/).

Then, run the same query you ran in Step 4 and include the `explain` parameter in your search request:

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline&explain=true
{
  "query": {
    "hybrid": {
      "queries": [
        {
          "nested": {
            "path": "user",
            "query": {
              "match": {
                "user.name": "John"
              }
            },
            "score_mode": "sum",
            "inner_hits": {}
          }
        },
        {
          "nested": {
            "path": "location",
            "query": {
              "match": {
                "location.city": "Udaipur"
              }
            },
            "inner_hits": {}
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

The response includes an `_explanation` object containing detailed scoring information. The nested `details` array provides the relevant information about the score mode used, the number of child documents contributing to the parent document's score, and how the scores were normalized and combined:

```json
{
  ...
  "_explanation": {
    "value": 1.0,
    "description": "arithmetic_mean combination of:",
    "details": [
      {
        "value": 1.0,
        "description": "min_max normalization of:",
        "details": [
          {
            "value": 0.4458314776420593,
            "description": "combined score of:",
            "details": [
              {
                "value": 0.4394061,
                "description": "Score based on 1 child docs in range from 0 to 6, using score mode Avg",
                "details": [
                  {
                    "value": 0.4394061,
                    "description": "weight(user.name:john in 0) [PerFieldSimilarity], result of:"
                    // Additional details omitted for brevity
                  }
                ]
              },
              {
                "value": 0.44583148,
                "description": "Score based on 1 child docs in range from 0 to 6, using score mode Avg",
                "details": [
                  {
                    "value": 0.44583148,
                    "description": "weight(location.city:udaipur in 5) [PerFieldSimilarity], result of:"
                    // Additional details omitted for brevity
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
...
```

## Sorting with inner hits

To apply sorting, add a `sort` subclause in the `inner_hits` clause. For example, to sort by `user.age`, specify this sort condition in the `inner_hits` clause:

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline
{
  "query": {
    "hybrid": {
      "queries": [
        {
          "nested": {
            "path": "user",
            "query": {
              "match": {
                "user.name": "John"
              }
            },
            "score_mode": "sum",
            "inner_hits": {
              "sort": [
                {
                  "user.age": {
                    "order": "desc"
                  }
                }
              ]
            }
          }
        },
        {
          "nested": {
            "path": "location",
            "query": {
              "match": {
                "location.city": "Udaipur"
              }
            },
            "inner_hits": {}
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

In the response, the `user` inner hits are sorted by age in descending order rather than by relevance, which is why the `_score` field is `null` (scores are not calculated when custom sorting is applied):

```json
...
"user": {
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": null,
    "hits": [
      {
        "_index": "my-nlp-index",
        "_id": "2",
        "_nested": {
          "field": "user",
          "offset": 0
        },
        "_score": null,
        "_source": {
          "name": "John Wick",
          "age": 46
        },
        "sort": [
          46
        ]
      },
      {
        "_index": "my-nlp-index",
        "_id": "2",
        "_nested": {
          "field": "user",
          "offset": 1
        },
        "_score": null,
        "_source": {
          "name": "John Snow",
          "age": 40
        },
        "sort": [
          40
        ]
      }
    ]
  }
}
...
```

## Pagination with inner hits

To paginate inner hit results, specify the `from` parameter (starting position) and `size` parameter (number of results) in the `inner_hits` clause. The following example request retrieves only the third and fourth nested objects from the `user` field by setting `from` to `2` (skip the first two) and `size` to `2` (return two results):

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline
{
  "query": {
    "hybrid": {
      "queries": [
        {
          "nested": {
            "path": "user",
            "query": {
              "match_all": {}
            },
            "inner_hits": {
              "from": 2,
              "size": 2
            }
          }
        },
        {
          "nested": {
            "path": "location",
            "query": {
              "match": {
                "location.city": "Udaipur"
              }
            },
            "inner_hits": {}
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

The response contains the `user` field inner hits starting from the offset of `2`:

```json
...
"user": {
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "my-nlp-index",
        "_id": "1",
        "_nested": {
          "field": "user",
          "offset": 2
        },
        "_score": 1.0,
        "_source": {
          "name": "Mike",
          "age": 32
        }
      },
      {
        "_index": "my-nlp-index",
        "_id": "1",
        "_nested": {
          "field": "user",
          "offset": 3
        },
        "_score": 1.0,
        "_source": {
          "name": "Maples",
          "age": 30
        }
      }
    ]
  }
}
...
```

## Defining a custom name for the inner_hits field

To differentiate between multiple inner hits in a single query, you can define custom names for inner hits in the search response. For example, you can provide a custom name, `coordinates`, for the `location` field inner hits as follows:

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline
{
  "query": {
    "hybrid": {
      "queries": [
        {
          "nested": {
            "path": "user",
            "query": {
              "match_all": {}
            },
            "inner_hits": {
              "name": "coordinates"
            }
          }
        },
        {
          "nested": {
            "path": "location",
            "query": {
              "match": {
                "location.city": "Udaipur"
              }
            },
            "inner_hits": {}
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

In the response, inner hits for the `user` field appear under the custom name `coordinates`:

```json
...
"inner_hits": {
  "coordinates": {
    "hits": {
      "total": {
        "value": 4,
        "relation": "eq"
      },
      "max_score": 1.0,
      "hits": [
        {
          "_index": "my-nlp-index",
          "_id": "1",
          "_nested": {
            "field": "user",
            "offset": 0
          },
          "_score": 1.0,
          "_source": {
            "name": "John Alder",
            "age": 35
          }
        }
      ]
    }
  },
  "location": {
    "hits": {
      "total": {
        "value": 1,
        "relation": "eq"
      },
      "max_score": 0.44583148,
      "hits": [
        {
          "_index": "my-nlp-index",
          "_id": "1",
          "_nested": {
            "field": "location",
            "offset": 1
          },
          "_score": 0.44583148,
          "_source": {
            "city": "Udaipur",
            "state": "Rajasthan"
          }
        }
      ]
    }
  }
}
...
```
