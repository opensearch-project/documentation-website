---
layout: default
title: Percentile ranks
parent: Metric aggregations
grand_parent: Aggregations
nav_order: 80
redirect_from:
  - /query-dsl/aggregations/metric/percentile-ranks/
---

# Percentile rank aggregations

Percentile rank is the percentile of values at or below a threshold grouped by a specified value. For example, if a value is greater than or equal to 80% of the values, it has a percentile rank of 80.

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "percentile_rank_taxful_total_price": {
      "percentile_ranks": {
        "field": "taxful_total_price",
        "values": [
          10,
          15
        ]
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
  "percentile_rank_taxful_total_price" : {
    "values" : {
      "10.0" : 0.055096056411283456,
      "15.0" : 0.0830092961834656
    }
  }
 }
}
```