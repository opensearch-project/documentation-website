---
layout: default
title: Median absolute deviation
parent: Metric aggregations
grand_parent: Aggregations
nav_order: 65
redirect_from:
  - /query-dsl/aggregations/metric/median-absolute-deviation/
canonical_url: https://docs.opensearch.org/latest/aggregations/metric/median-absolute-deviation/
---

# Median absolute deviation aggregations

The `median_absolute_deviation` metric is a single-value metric aggregation that returns a median absolute deviation field. Median absolute deviation is a statistical measure of data variability. Because the median absolute deviation measures dispersion from the median, it provides a more robust measure of variability that is less affected by outliers in a dataset. 

Median absolute deviation is calculated as follows:<br>
median_absolute_deviation = median(|X<sub>i</sub> - Median(X<sub>i</sub>)|)

The following example calculates the median absolute deviation of the `DistanceMiles` field in the sample dataset `opensearch_dashboards_sample_data_flights`:


```json
GET opensearch_dashboards_sample_data_flights/_search
{
  "size": 0,
  "aggs": {
    "median_absolute_deviation_DistanceMiles": {
      "median_absolute_deviation": {
        "field": "DistanceMiles"
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 35,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 10000,
      "relation": "gte"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "median_absolute_deviation_distanceMiles": {
      "value": 1829.8993624441966
    }
  }
}
```

### Missing

By default, if a field is missing or has a null value in a document, it is ignored during computation. However, you can specify a value to be used for those missing or null fields by using the `missing` parameter, as shown in the following request:

```json
GET opensearch_dashboards_sample_data_flights/_search
{
  "size": 0,
  "aggs": {
    "median_absolute_deviation_distanceMiles": {
      "median_absolute_deviation": {
        "field": "DistanceMiles",
        "missing": 1000
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 7,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 10000,
      "relation": "gte"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "median_absolute_deviation_distanceMiles": {
      "value": 1829.6443646143355
    }
  }
}
```

### Compression

The median absolute deviation is calculated using the [t-digest](https://github.com/tdunning/t-digest/tree/main) data structure, which balances between performance and estimation accuracy through the `compression` parameter (default value: `1000`). Adjusting the `compression` value affects the trade-off between computational efficiency and precision. Lower `compression` values improve performance but may reduce estimation accuracy, while higher values enhance accuracy at the cost of increased computational overhead, as shown in the following request:

```json
GET opensearch_dashboards_sample_data_flights/_search
{
  "size": 0,
  "aggs": {
    "median_absolute_deviation_DistanceMiles": {
      "median_absolute_deviation": {
        "field": "DistanceMiles",
        "compression": 10
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 1,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 10000,
      "relation": "gte"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "median_absolute_deviation_DistanceMiles": {
      "value": 1836.265614211182
    }
  }
}
```
