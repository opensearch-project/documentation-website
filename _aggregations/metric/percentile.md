---
layout: default
title: Percentile
parent: Metric aggregations
nav_order: 90
redirect_from:
  - /query-dsl/aggregations/metric/percentile/
canonical_url: https://docs.opensearch.org/latest/aggregations/metric/percentile/
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

You can control the level of approximation using the optional `tdigest.compression` field. A larger value indicates that the data structure that approximates percentiles is more accurate but uses more heap space. The default value is 100. 

For example, use the following request to set `compression` to `200`: 

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "percentile_taxful_total_price": {
      "percentiles": {
        "field": "taxful_total_price",
        "tdigest": { 
          "compression": 200
        }
      }
    }
  }
}
```

The default percentiles returned are `1, 5, 25, 50, 75, 95, 99`. You can specify other percentiles in the optional `percents` field. For example, to get the 99.9th and 99.99th percentiles, run the following request: 

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "percentile_taxful_total_price": {
      "percentiles": {
        "field": "taxful_total_price",
        "percents": [99.9, 99.99]
      }
    }
  }
}
```
{% include copy-curl.html %}

The specified value overrides the default percentiles, so only the percentiles you specify are returned. 
