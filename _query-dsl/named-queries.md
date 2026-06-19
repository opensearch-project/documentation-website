---
layout: default
title: Named queries
nav_order: 65
---

# Named queries

Any query clause can include a `_name` parameter that assigns a label to it. When a document matches, the response includes a `matched_queries` array listing the names of all query clauses that contributed to the match. This is useful for identifying the parts of a complex query that matched a given document.

## Example

The following query uses two named `match` clauses inside a `bool` query. Each clause has a `_name` that identifies it:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 2,
  "_source": ["products.product_name", "customer_full_name"],
  "query": {
    "bool": {
      "should": [
        {"match": {"products.product_name": {"query": "shirt", "_name": "shirt_query"}}},
        {"match": {"products.product_name": {"query": "dress", "_name": "dress_query"}}}
      ]
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The `matched_queries` array in each hit shows which named clauses matched that document:

```json
{
  "took": 16,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1746,
      "relation": "eq"
    },
    "max_score": 1.8150847,
    "hits": [
      {
        "_index": "opensearch_dashboards_sample_data_ecommerce",
        "_id": "aoN5u50BpPQaFxRehbyq",
        "_score": 1.8150847,
        "_source": {
          "customer_full_name": "Stephanie Reyes",
          "products": [
            {
              "product_name": "Shirt - black/white"
            },
            {
              "product_name": "Cocktail dress / Party dress - navy"
            }
          ]
        },
        "matched_queries": [
          "shirt_query",
          "dress_query"
        ]
      },
      {
        "_index": "opensearch_dashboards_sample_data_ecommerce",
        "_id": "fYN5u50BpPQaFxRehLqd",
        "_score": 1.6545942,
        "_source": {
          "customer_full_name": "Clarice Daniels",
          "products": [
            {
              "product_name": "Summer dress - grey"
            },
            {
              "product_name": "Shirt - black/white"
            }
          ]
        },
        "matched_queries": [
          "shirt_query",
          "dress_query"
        ]
      }
    ]
  }
}
```

## Response body fields

The following table lists the response fields specific to named queries.

| Field | Description |
| :--- | :--- |
| `matched_queries` | An array of strings listing the `_name` values of all query clauses that matched this document. Only present when at least one named clause matches. |
