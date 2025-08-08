---
layout: default
title: Collapsing hybrid query results
parent: Hybrid search
grand_parent: AI search
has_children: false
nav_order: 35
---

# Collapsing hybrid query results
**Introduced 3.1**
{: .label .label-purple }

The `collapse` parameter lets you group results by a field, returning only the highest scoring document for each unique field value. This is useful when you want to avoid duplicates in your search results. The field you collapse on must be of type `keyword` or a numeric type. The number of results returned is still limited by the `size` parameter in your query.

The `collapse` parameter is compatible with other hybrid query search options, such as sort, explain, and pagination, using their standard syntax.

When using `collapse` in a hybrid query, note the following considerations:

- Performance may be impacted when working with large result sets.  Starting with OpenSearch 3.2, the index-level [`index.neural_search.hybrid_collapse_docs_per_group_per_subquery`]({{site.url}}{{site.baseurl}}/vector-search/settings/#hybrid-collapse-docs-per-group) setting controls how many documents are stored per group per subquery. 
- Aggregations run on pre-collapsed results, not the final output.
- Pagination behavior changes: Because `collapse` reduces the total number of results, it can affect how results are distributed across pages. To retrieve more results, consider increasing the pagination depth.
- Results may differ from those returned by the [`collapse` response processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/collapse-processor/), which applies collapse logic after the query is executed.

## Example

The following example demonstrates how to collapse hybrid query results.

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
{% include copy-curl.html %}

Ingest documents into the index:

```json
POST /bakery-items/_bulk
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
{% include copy-curl.html %}

Create a search pipeline. This example uses the `min_max` normalization technique:

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
{% include copy-curl.html %}

Search the index, grouping the search results by the `item` field:

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
{% include copy-curl.html %}

The response returns the collapsed search results:

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

## Collapse and sort results

To collapse and sort hybrid query results, provide the `collapse` and `sort` parameters in the query:

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
{% include copy-curl.html %}

For more information about sorting in a hybrid query, see [Using sorting with a hybrid query]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/sorting/).

In the response, documents are sorted by the lowest price:

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

## Collapse and explain

You can provide the `explain` query parameter when collapsing search results:

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
{% include copy-curl.html %}

The response contains detailed information about the scoring process for each search result:

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

For more information about using `explain` in a hybrid query, see [Hybrid search explain]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/explain/).

## Collapse and pagination

You can paginate collapsed results by providing the `from` and `size` parameters. For more information about pagination in a hybrid query, see [Paginating hybrid query results]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/pagination/). For more information about `from` and `size`, see [The `from` and `size` parameters]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/#the-from-and-size-parameters).

For this example, create the following index:

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
{% include copy-curl.html %}

Ingest the following documents into the index:

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
{% include copy-curl.html %}

Run a `hybrid` query, specifying the `from` and `size` parameters to paginate results. In the following example, the query requests two results starting from the sixth position (`from: 5, size: 2`). The pagination depth is set to limit each shard to return a maximum of 10 documents. After the results are retrieved, the `collapse` parameter is applied in order to group them by the `item` field:

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
{% include copy-curl.html %}



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

## Retrieving inner hits for collapsed hybrid query results
**Introduced 3.2**
{: .label .label-purple }

You can use the `inner_hits` parameter within the `collapse` parameter to retrieve additional documents from each collapsed group.

The following example uses the `bakery-items` index created earlier. It searches for cake items, collapses (groups) the results by the `item` field, and returns the two cheapest items for each collapsed value:

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
    "field": "item",
    "inner_hits": [
      {
        "name": "cheapest_items",
        "size": 2,
        "sort": ["price"]
      }
    ]
  }
}
```
{% include copy-curl.html %}

In the response, the main `hits` contain the top-scoring document from each collapsed group. The `inner_hits` contain the two cheapest items from each group:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  ...
  "hits": {
    "total": {
      "value": 5,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "bakery-items",
        "_id": "bIe6e5gBAB5HT6ixTd4F",
        "_score": 1,
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
        "inner_hits": {
          "cheapest_items": {
            "hits": {
              "total": {
                "value": 2,
                "relation": "eq"
              },
              "max_score": null,
              "hits": [
                {
                  "_index": "bakery-items",
                  "_id": "bIe6e5gBAB5HT6ixTd4F",
                  "_score": null,
                  "_source": {
                    "item": "Chocolate Cake",
                    "category": "cakes",
                    "price": 15,
                    "baked_date": "2023-07-01T00:00:00Z"
                  },
                  "sort": [
                    15
                  ]
                },
                {
                  "_index": "bakery-items",
                  "_id": "bYe6e5gBAB5HT6ixTd4F",
                  "_score": null,
                  "_source": {
                    "item": "Chocolate Cake",
                    "category": "cakes",
                    "price": 18,
                    "baked_date": "2023-07-04T00:00:00Z"
                  },
                  "sort": [
                    18
                  ]
                }
              ]
            }
          }
        }
      },
      {
        "_index": "bakery-items",
        "_id": "boe6e5gBAB5HT6ixTd4F",
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
        "inner_hits": {
          "cheapest_items": {
            "hits": {
              "total": {
                "value": 3,
                "relation": "eq"
              },
              "max_score": null,
              "hits": [
                {
                  "_index": "bakery-items",
                  "_id": "boe6e5gBAB5HT6ixTd4F",
                  "_score": null,
                  "_source": {
                    "item": "Vanilla Cake",
                    "category": "cakes",
                    "price": 12,
                    "baked_date": "2023-07-02T00:00:00Z"
                  },
                  "sort": [
                    12
                  ]
                },
                {
                  "_index": "bakery-items",
                  "_id": "b4e6e5gBAB5HT6ixTd4F",
                  "_score": null,
                  "_source": {
                    "item": "Vanilla Cake",
                    "category": "cakes",
                    "price": 16,
                    "baked_date": "2023-07-03T00:00:00Z"
                  },
                  "sort": [
                    16
                  ]
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

</details>