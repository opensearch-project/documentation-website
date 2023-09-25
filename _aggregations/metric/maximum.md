---
layout: default
title: Maximum
parent: Metric aggregations
grand_parent: Aggregations
nav_order: 60
redirect_from:
  - /query-dsl/aggregations/metric/maximum/
---

# Maximum aggregations

The `max` metric is a single-value metric aggregations that returns the maximum value of a field.

The following example calculates the maximum of the `taxful_total_price` field:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "max_taxful_total_price": {
      "max": {
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
  "took": 17,
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
    "max_taxful_total_price": {
      "value": 2250
    }
  }
}
```