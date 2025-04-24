---
layout: default
title: Median absolute deviation
parent: Metric aggregations
nav_order: 65
redirect_from:
  - /query-dsl/aggregations/metric/median-absolute-deviation/
canonical_url: https://docs.opensearch.org/docs/latest/aggregations/metric/median-absolute-deviation/
---

# Median absolute deviation aggregations

The `median_absolute_deviation` aggregation is a single-value metric aggregation. Median absolute deviation is a variability metric that measures dispersion from the median.

Median absolute deviation is less affected by outliers than standard deviation, which relies on squared error terms and is useful for describing data that is not normally distributed.

Median absolute deviation is computed as follows:

```
median_absolute_deviation = median( | x<sub>i</sub> - median(x<sub>i</sub>) | )
```


OpenSearch estimates `median_absolute_deviation`, rather than calculating it directly, because of memory limitations. This estimation is computationally expensive. You can adjust the trade-off between estimation accuracy and performance. For more information, see [Adjusting estimation accuracy](https://github.com/opensearch-project/documentation-website/pull/9453/files#adjusting-estimation-accuracy).

## Parameters

The `median_absolute_deviation` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type      | Description |
| :--       | :--               | :--            | :--         |
| `field`   | Required          | String         | The name of the numeric field for which the median absolute deviation is computed. |
| `missing` | Optional          | Numeric        | The value to assign to missing instances of the field. If not provided, documents with missing values are omitted from the estimation. |
| `compression` | Optional          | Numeric        | A parameter that [adjusts the balance between estimate accuracy and performance](#adjusting-estimation-accuracy). The value of `compression` must be greater than `0`. The default value is `1000`. |

## Example

The following example calculates the median absolute deviation of the `DistanceMiles` field in the `opensearch_dashboards_sample_data_flights` dataset:

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

As shown in the following example response, the aggregation returns an estimate of the median absolute deviation in the `median_absolute_deviation_DistanceMiles` variable:

```json
{
  "took": 490,
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
      "value": 1830.917892238693
    }
  }
}
```

## Missing values

OpenSearch ignores missing and null values when computing `median_absolute_deviation`.

You can assign a value to missing instances of the aggregated field. See [Missing aggregations]({{site.url}}{{site.baseurl}}/aggregations/bucket/missing/) for more information.

## Adjusting estimation accuracy

The median absolute deviation is calculated using the [t-digest](https://github.com/tdunning/t-digest/tree/main) data structure, which takes a `compression` parameter to balance performance and estimation accuracy. Lower values of `compression` improve performance but may reduce estimation accuracy, as shown in the following request:

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

The estimation error depends on the dataset but is usually below 5%, even for `compression` values as low as `100`. (The low example value of `10` is used here to illustrate the trade-off effect and is not recommended.)

Note the decreased computation time (`took` time) and the slightly less accurate value of the estimated parameter in the following response.

For reference, OpenSearch's best estimate (with `compression` set arbitrarily high) for the median absolute deviation of `DistanceMiles` is `1831.076904296875`:


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
