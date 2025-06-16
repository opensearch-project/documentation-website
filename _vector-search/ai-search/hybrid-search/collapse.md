---
layout: default
title: Using collapse with a hybrid query
parent: Hybrid search
grand_parent: AI search
has_children: false
nav_order: 10
---

# Using collapse with hybrid query
**Introduced 3.1**
{: .label .label-purple }

You can collapse on a field by specifying the `collapse` parameter in the search query.
This will return the highest scoring document for each unique value of that field, up to the specified size in the query.
The collapse parameter requires the field being collapsed to be of either a `keyword` or a `numeric` type.

There are a few important considerations to keep in mind when using collapse with hybrid query.
* Inner hits compatibility within the collapse description is not currently supported for hybrid query.
* Performance impact may be higher when using large result sets.
* Aggregations run on pre-collapsed results.
* Collapse affects the pagination by reducing the number of results and altering the result distribution across pages. Consider setting a higher pagination depth to retrieve more results.
* The collapse parameter via query returns different results than the [collapse response processor](https://docs.opensearch.org/docs/latest/search-plugins/search-pipelines/collapse-processor/).

The following example is taken from the documentation for [collapse in search query](https://docs.opensearch.org/docs/latest/search-plugins/collapse-search/) and modified for hybrid query:

Create an index:
```json
PUT /bakery-items
{
  "mappings": {
    "properties": {
      "item": {
        "type": "keyword"
      },
      "category": {
        "type": "keyword"
      },
      "price": {
        "type": "float"
      },
      "baked_date": {
        "type": "date"
      }
    }
  }
}
```

Index documents:
```json
{ "index": {} }
{ "item": "Chocolate Cake", "category": "cakes", "price": 15, "baked_date": "2023-07-01T00:00:00Z" }
{ "index": {} }
{ "item": "Chocolate Cake", "category": "cakes", "price": 18, "baked_date": "2023-07-04T00:00:00Z" }
{ "index": {} }
{ "item": "Vanilla Cake", "category": "cakes", "price": 12, "baked_date": "2023-07-02T00:00:00Z" }
{ "index": {} }
{ "item": "Vanilla Cake", "category": "cakes", "price": 16, "baked_date": "2023-07-03T00:00:00Z" }
{ "index": {} }
{ "item": "Vanilla Cake", "category": "cakes", "price": 17, "baked_date": "2023-07-09T00:00:00Z" }
```

Create a search pipeline.  This example uses min_max normalization technique.
```json
PUT /_search/pipeline/norm-pipeline
{
  "description": "Normalization processor for hybrid search",
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
  ]
}
```

Search the index, collapsing on the `item` field:
```json
GET /bakery-items/_search?search_pipeline=norm-pipeline
{
  "query": {
    "hybrid": {
      "queries": [
        {
          "match": {
            "item": "Chocolate Cake"
          }
        },
        {
          "bool": {
            "must": {
              "match": {
                "category": "cakes"
              }
            }
          }
        }
      ]
    }
  },
  "collapse": {
    "field": "item"
  }
}
```

Response:
```json
"hits": {
    "total": {
      "value": 5,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "bakery-items",
        "_id": "wBRPZZcB49c_2-1rYmO7",
        "_score": 1.0,
        "_source": {
          "item": "Chocolate Cake",
          "category": "cakes",
          "price": 15,
          "baked_date": "2023-07-01T00:00:00Z"
        },
        "fields": {
          "item": [
            "Chocolate Cake"
          ]
        }
      },
      {
        "_index": "bakery-items",
        "_id": "whRPZZcB49c_2-1rYmO7",
        "_score": 0.5005,
        "_source": {
          "item": "Vanilla Cake",
          "category": "cakes",
          "price": 12,
          "baked_date": "2023-07-02T00:00:00Z"
        },
        "fields": {
          "item": [
            "Vanilla Cake"
          ]
        }
      }
    ]
  }
```

Collapse is compatible with other features in hybrid query using syntax that is standard for those features, such as sort, explain, and pagination.

## Collapse and sort

```json
GET /bakery-items/_search?search_pipeline=norm-pipeline
{
  "query": {
    "hybrid": {
      "queries": [
        {
          "match": {
                "item": "Chocolate Cake"
          }
        },
        {
          "bool": {
                "must": {
                    "match": {
                        "category": "cakes"
                    }
                }
          }
        }
      ]
    }
  },
  "collapse": {
    "field": "item"
  },
  "sort": "price"
}
```

Response:
```json
"hits": {
    "total": {
      "value": 5,
      "relation": "eq"
    },
    "max_score": null,
    "hits": [
      {
        "_index": "bakery-items",
        "_id": "whRPZZcB49c_2-1rYmO7",
        "_score": null,
        "_source": {
          "item": "Vanilla Cake",
          "category": "cakes",
          "price": 12,
          "baked_date": "2023-07-02T00:00:00Z"
        },
        "fields": {
          "item": [
            "Vanilla Cake"
          ]
        },
        "sort": [
          12.0
        ]
      },
      {
        "_index": "bakery-items",
        "_id": "wBRPZZcB49c_2-1rYmO7",
        "_score": null,
        "_source": {
          "item": "Chocolate Cake",
          "category": "cakes",
          "price": 15,
          "baked_date": "2023-07-01T00:00:00Z"
        },
        "fields": {
          "item": [
            "Chocolate Cake"
          ]
        },
        "sort": [
          15.0
        ]
      }
    ]
  }
```
In this example, the documents are sorted by the lowest price.
For more information about sorting in hybrid query, see [here](https://docs.opensearch.org/docs/latest/vector-search/ai-search/hybrid-search/sorting/).

## Collapse and explain
```json
GET /bakery-items/_search?search_pipeline=norm-pipeline&explain=true
{
  "query": {
    "hybrid": {
      "queries": [
        {
          "match": {
                "item": "Chocolate Cake"
          }
        },
        {
          "bool": {
                "must": {
                    "match": {
                        "category": "cakes"
                    }
                }
          }
        }
      ]
    }
  },
  "collapse": {
    "field": "item"
  }
}
```

Response:
```json
"hits": {
        "total": {
            "value": 5,
            "relation": "eq"
        },
        "max_score": 1.0,
        "hits": [
            {
                "_shard": "[bakery-items][0]",
                "_node": "Jlu8P9EaQCy3C1BxaFMa_g",
                "_index": "bakery-items",
                "_id": "3ZILepcBheX09_dPt8TD",
                "_score": 1.0,
                "_source": {
                    "item": "Chocolate Cake",
                    "category": "cakes",
                    "price": 15,
                    "baked_date": "2023-07-01T00:00:00Z"
                },
                "fields": {
                    "item": [
                        "Chocolate Cake"
                    ]
                },
                "_explanation": {
                    "value": 1.0,
                    "description": "combined score of:",
                    "details": [
                        {
                            "value": 1.0,
                            "description": "ConstantScore(item:Chocolate Cake)",
                            "details": []
                        },
                        {
                            "value": 1.0,
                            "description": "ConstantScore(category:cakes)",
                            "details": []
                        }
                    ]
                }
            },
            {
                "_shard": "[bakery-items][0]",
                "_node": "Jlu8P9EaQCy3C1BxaFMa_g",
                "_index": "bakery-items",
                "_id": "35ILepcBheX09_dPt8TD",
                "_score": 0.5005,
                "_source": {
                    "item": "Vanilla Cake",
                    "category": "cakes",
                    "price": 12,
                    "baked_date": "2023-07-02T00:00:00Z"
                },
                "fields": {
                    "item": [
                        "Vanilla Cake"
                    ]
                },
                "_explanation": {
                    "value": 1.0,
                    "description": "combined score of:",
                    "details": [
                        {
                            "value": 0.0,
                            "description": "ConstantScore(item:Chocolate Cake) doesn't match id 2",
                            "details": []
                        },
                        {
                            "value": 1.0,
                            "description": "ConstantScore(category:cakes)",
                            "details": []
                        }
                    ]
                }
            }
        ]
    }
```
Explain gives you more information about the query and score calculations.
For more information on explain in hybrid query, see [here](https://docs.opensearch.org/docs/latest/vector-search/ai-search/hybrid-search/explain/).

## Collapse and pagination

This example uses the following index with additional groups and documents to more accurately portray pagination:
```json
PUT /bakery-items-pagination
{
    "settings": {
         "index.number_of_shards": 3
    },
  "mappings": {
    "properties": {
      "item": {
        "type": "keyword"
      },
      "category": {
        "type": "keyword"
      },
      "price": {
        "type": "float"
      },
      "baked_date": {
        "type": "date"
      }
    }
  }
}
```

```json
POST /bakery-items-pagination/_bulk
{ "index": {} }
{ "item": "Chocolate Cake", "category": "cakes", "price": 15, "baked_date": "2023-07-01T00:00:00Z" }
{ "index": {} }
{ "item": "Chocolate Cake", "category": "cakes", "price": 18, "baked_date": "2023-07-02T00:00:00Z" }
{ "index": {} }
{ "item": "Vanilla Cake", "category": "cakes", "price": 12, "baked_date": "2023-07-02T00:00:00Z" }
{ "index": {} }
{ "item": "Vanilla Cake", "category": "cakes", "price": 11, "baked_date": "2023-07-04T00:00:00Z" }
{ "index": {} }
{ "item": "Ice Cream Cake", "category": "cakes", "price": 23, "baked_date": "2023-07-09T00:00:00Z" }
{ "index": {} }
{ "item": "Ice Cream Cake", "category": "cakes", "price": 22, "baked_date": "2023-07-10T00:00:00Z" }
{ "index": {} }
{ "item": "Carrot Cake", "category": "cakes", "price": 24, "baked_date": "2023-07-09T00:00:00Z" }
{ "index": {} }
{ "item": "Carrot Cake", "category": "cakes", "price": 26, "baked_date": "2023-07-21T00:00:00Z" }
{ "index": {} }
{ "item": "Red Velvet Cake", "category": "cakes", "price": 25, "baked_date": "2023-07-09T00:00:00Z" }
{ "index": {} }
{ "item": "Red Velvet Cake", "category": "cakes", "price": 29, "baked_date": "2023-07-30T00:00:00Z" }
{ "index": {} }
{ "item": "Cheesecake", "category": "cakes", "price": 27. "baked_date": "2023-07-09T00:00:00Z" }
{ "index": {} }
{ "item": "Cheesecake", "category": "cakes", "price": 34. "baked_date": "2023-07-21T00:00:00Z" }
{ "index": {} }
{ "item": "Coffee Cake", "category": "cakes", "price": 42, "baked_date": "2023-07-09T00:00:00Z" }
{ "index": {} }
{ "item": "Coffee Cake", "category": "cakes", "price": 41, "baked_date": "2023-07-05T00:00:00Z" }
{ "index": {} }
{ "item": "Cocunut Cake", "category": "cakes", "price": 23, "baked_date": "2023-07-09T00:00:00Z" }
{ "index": {} }
{ "item": "Cocunut Cake", "category": "cakes", "price": 32, "baked_date": "2023-07-12T00:00:00Z" }
// Additional documents omitted for brevity
```

```json
GET /bakery-items-pagination/_search?search_pipeline=norm-pipeline
{
  "query": {
    "hybrid": {
      "pagination_depth": 10,
      "queries": [
        {
          "match": {
                "item": "Chocolate Cake"
          }
        },
        {
          "bool": {
                "must": {
                    "match": {
                        "category": "cakes"
                    }
                }
          }
        }
      ]
    }
  },
  "from": 5,
  "size": 2,
  "collapse": {
    "field": "item"
  }
}
```

Response:
```json
"hits": {
        "total": {
            "value": 70,
            "relation": "eq"
        },
        "max_score": 1.0,
        "hits": [
            {
                "_index": "bakery-items-pagination",
                "_id": "gDayepcBIkxlgFKYda0p",
                "_score": 0.5005,
                "_source": {
                    "item": "Red Velvet Cake",
                    "category": "cakes",
                    "price": 29,
                    "baked_date": "2023-07-30T00:00:00Z"
                },
                "fields": {
                    "item": [
                        "Red Velvet Cake"
                    ]
                }
            },
            {
                "_index": "bakery-items-pagination",
                "_id": "aTayepcBIkxlgFKYca15",
                "_score": 0.5005,
                "_source": {
                    "item": "Vanilla Cake",
                    "category": "cakes",
                    "price": 12,
                    "baked_date": "2023-07-02T00:00:00Z"
                },
                "fields": {
                    "item": [
                        "Vanilla Cake"
                    ]
                }
            }
        ]
    }
```
The pagination depth in this example limits the number of documents retrieved from each shard to ten, then the results are collapsed.  The from and size settings in this example show two results starting with the sixth result.
For more information on pagination in hybrid query, see [here](https://docs.opensearch.org/docs/latest/vector-search/ai-search/hybrid-search/pagination/).
