---
layout: default
title: Percentile ranks
parent: Metric aggregations
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

This response indicates that the value `10` is at the `5.5`th percentile and the value `15` is at the `8.3`rd percentile. 

As with the `percentiles` aggregation, you can control the level of approximation by setting the optional `tdigest.compression` field. A larger value increases the precision of the approximation but uses more heap space. The default value is 100.

For example, use the following request to set `compression` to `200`: 

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
        ],
        "tdigest": { 
          "compression": 200
        }
      }
    }
  }
}
```
