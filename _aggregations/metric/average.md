---
layout: default
title: Average
parent: Metric aggregations
grand_parent: Aggregations
nav_order: 10
redirect_from:
  - /query-dsl/aggregations/metric/average/
---

# Average aggregations

The `avg` metric is a single-value metric aggregations that returns the average value of a field.

The following example calculates the average of the `taxful_total_price` field:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "avg_taxful_total_price": {
      "avg": {
        "field": "taxful_total_price"
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 85,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4675,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "sum_taxful_total_price": {
      "value": 75.05542864304813
    }
  }
}
```