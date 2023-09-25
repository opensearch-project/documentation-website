---
layout: default
title: Extended stats
parent: Metric aggregations
grand_parent: Aggregations
nav_order: 30
redirect_from:
  - /query-dsl/aggregations/metric/extended-stats/
---

# Extended stats aggregations

The `extended_stats` aggregation is an extended version of the [`stats`]({{site.url}}{{site.baseurl}}/query-dsl/aggregations/metric/stats/) aggregation. Apart from including basic stats, `extended_stats` also returns stats such as `sum_of_squares`, `variance`, and `std_deviation`.
The following example returns extended stats for `taxful_total_price`:
```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "extended_stats_taxful_total_price": {
      "extended_stats": {
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
  "extended_stats_taxful_total_price" : {
    "count" : 4675,
    "min" : 6.98828125,
    "max" : 2250.0,
    "avg" : 75.05542864304813,
    "sum" : 350884.12890625,
    "sum_of_squares" : 3.9367749294174194E7,
    "variance" : 2787.59157113862,
    "variance_population" : 2787.59157113862,
    "variance_sampling" : 2788.187974983536,
    "std_deviation" : 52.79764740155209,
    "std_deviation_population" : 52.79764740155209,
    "std_deviation_sampling" : 52.80329511482722,
    "std_deviation_bounds" : {
      "upper" : 180.6507234461523,
      "lower" : -30.53986616005605,
      "upper_population" : 180.6507234461523,
      "lower_population" : -30.53986616005605,
      "upper_sampling" : 180.66201887270256,
      "lower_sampling" : -30.551161586606312
    }
  }
 }
}
```

The `std_deviation_bounds` object provides a visual variance of the data with an interval of plus/minus two standard deviations from the mean.
To set the standard deviation to a different value, say 3, set `sigma` to 3:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "extended_stats_taxful_total_price": {
      "extended_stats": {
        "field": "taxful_total_price",
        "sigma": 3
      }
    }
  }
}
```