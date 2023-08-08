---
layout: default
title: Minimum
parent: Metric aggregations
grand_parent: Aggregations
nav_order: 70
redirect_from:
  - /query-dsl/aggregations/metric/minimum/
---

# Minimum aggregations

The `min` metric is a single-value metric aggregations that returns the minimum value of a field.

The following example calculates the minimum of the `taxful_total_price` field:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "min_taxful_total_price": {
      "min": {
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
      "value": 4675,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "min_taxful_total_price": {
      "value": 6.98828125
    }
  }
}
```