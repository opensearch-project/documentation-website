---
layout: default
title: Median absolute deviation
parent: Metric aggregations
grand_parent: Aggregations
nav_order: 65
redirect_from:
  - /query-dsl/aggregations/metric/median-absolute-deviation/
---

# Median absolute deviation aggregations

The `median_absolute_deviation` metric is a single-value metric aggregation that returns median absolute deviation field. Median absolute deviation is a statistical measure of data variability. It is used to measure dispersion from the median, may be less impacted by outliers in a dataset. 

Median absolute deviation is calculated with:<br>
median_absolute_deviation = median(|X<sub>i</sub> - Median(X<sub>i</sub>)|)

The following example calculates the median absolute deviation of the `DistanceMiles` field of the opensearch_dashboards_sample_data_flights:


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
You can set a default value for missing fields from documents by specifying the `missing` parameter. This could be a missing field or a null value in a field.

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
The calculation of the median absolute deviation utilizes [t-digest](https://github.com/tdunning/t-digest/tree/main) which controls the balance between performance and accuracy of estimation. The default value for TDigest's `compression` field is 1000. Decreasing the `compression` value will increase the performance while reducing the accuracy of the estimation.

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
