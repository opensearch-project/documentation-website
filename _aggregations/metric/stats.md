---
layout: default
title: Stats
parent: Metric aggregations
grand_parent: Aggregations
nav_order: 110
redirect_from:
  - /query-dsl/aggregations/metric/stats/
---

# Stats aggregations

The `stats` metric is a multi-value metric aggregation that returns all basic metrics such as `min`, `max`, `sum`, `avg`, and `value_count` in one aggregation query.

The following example returns the basic stats for the `taxful_total_price` field:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "stats_taxful_total_price": {
      "stats": {
        "field": "taxful_total_price"
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
  "stats_taxful_total_price" : {
    "count" : 4675,
    "min" : 6.98828125,
    "max" : 2250.0,
    "avg" : 75.05542864304813,
    "sum" : 350884.12890625
  }
 }
}
```