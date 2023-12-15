---
layout: default
title: Sum
parent: Metric aggregations
grand_parent: Aggregations
nav_order: 120
redirect_from:
  - /query-dsl/aggregations/metric/sum/
---

# Sum aggregations

The `sum` metric is a single-value metric aggregations that returns the sum of the values of a field.

The following example calculates the total sum of the `taxful_total_price` field:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "sum_taxful_total_price": {
      "sum": {
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
      "value": 4675,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "sum_taxful_total_price": {
      "value": 350884.12890625
    }
  }
}
```
