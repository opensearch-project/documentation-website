---
layout: default
title: Percentile
parent: Metric aggregations
grand_parent: Aggregations
nav_order: 90
redirect_from:
  - /query-dsl/aggregations/metric/percentile/
---

# Percentile aggregations

Percentile is the percentage of the data that's at or below a certain threshold value.

The `percentile` metric is a multi-value metric aggregation that lets you find outliers in your data or figure out the distribution of your data.

Like the `cardinality` metric, the `percentile` metric is also approximate.

The following example calculates the percentile in relation to the `taxful_total_price` field:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "percentile_taxful_total_price": {
      "percentiles": {
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
  "percentile_taxful_total_price" : {
    "values" : {
      "1.0" : 21.984375,
      "5.0" : 27.984375,
      "25.0" : 44.96875,
      "50.0" : 64.22061688311689,
      "75.0" : 93.0,
      "95.0" : 156.0,
      "99.0" : 222.0
    }
  }
 }
}
```
