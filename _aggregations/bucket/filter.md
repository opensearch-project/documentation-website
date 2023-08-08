---
layout: default
title: Filter
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 50
redirect_from:
  - /query-dsl/aggregations/bucket/filter/
---

# Filter aggregations

A `filter` aggregation is a query clause, exactly like a search query — `match` or `term` or `range`. You can use the `filter` aggregation to narrow down the entire set of documents to a specific set before creating buckets.

The following example shows the `avg` aggregation running within the context of a filter. The `avg` aggregation only aggregates the documents that match the `range` query:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "low_value": {
      "filter": {
        "range": {
          "taxful_total_price": {
            "lte": 50
          }
        }
      },
      "aggs": {
        "avg_amount": {
          "avg": {
            "field": "taxful_total_price"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
...
"aggregations" : {
  "low_value" : {
    "doc_count" : 1633,
    "avg_amount" : {
      "value" : 38.363175998928355
    }
  }
 }
}
```