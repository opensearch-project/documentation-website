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
* Collapse affects the paginated results.
* The collapse parameter via query return different results than the collapse response processor.

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

Create a search pipeline:
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
{
  "took": 19,
  "errors": false,
  "items": [
    {
      "index": {
        "_index": "bakery-items",
        "_id": "wBRPZZcB49c_2-1rYmO7",
        "_version": 1,
        "result": "created",
        "_shards": {
          "total": 2,
          "successful": 1,
          "failed": 0
        },
        "_seq_no": 0,
        "_primary_term": 1,
        "status": 201
      }
    },
    {
      "index": {
        "_index": "bakery-items",
        "_id": "wRRPZZcB49c_2-1rYmO7",
        "_version": 1,
        "result": "created",
        "_shards": {
          "total": 2,
          "successful": 1,
          "failed": 0
        },
        "_seq_no": 1,
        "_primary_term": 1,
        "status": 201
      }
    },
    {
      "index": {
        "_index": "bakery-items",
        "_id": "whRPZZcB49c_2-1rYmO7",
        "_version": 1,
        "result": "created",
        "_shards": {
          "total": 2,
          "successful": 1,
          "failed": 0
        },
        "_seq_no": 2,
        "_primary_term": 1,
        "status": 201
      }
    },
    {
      "index": {
        "_index": "bakery-items",
        "_id": "wxRPZZcB49c_2-1rYmO7",
        "_version": 1,
        "result": "created",
        "_shards": {
          "total": 2,
          "successful": 1,
          "failed": 0
        },
        "_seq_no": 3,
        "_primary_term": 1,
        "status": 201
      }
    },
    {
      "index": {
        "_index": "bakery-items",
        "_id": "xBRPZZcB49c_2-1rYmO7",
        "_version": 1,
        "result": "created",
        "_shards": {
          "total": 2,
          "successful": 1,
          "failed": 0
        },
        "_seq_no": 4,
        "_primary_term": 1,
        "status": 201
      }
    }
  ]
}
```

Collapse is compatible with other features in hybrid query using syntax that is standard for those features, such as sort, pagination, and explain.
For example, this is is how you can combine collapse and sort:

```json
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
{
  "took": 13,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
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
}
```
