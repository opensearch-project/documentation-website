---
layout: default
title: Extended stats bucket
parent: Pipeline aggregations
nav_order: 80
---

# Extended stats bucket aggregation

The `extended_stats_bucket` aggregation is a more comprehensive version of the [`stats_bucket`]({{site.url}}{{site.baseurl}}/aggregations/pipeline/stats-bucket/) sibling aggregation. As well as the basic statistical measures provided by `stats_bucket`, `extended_stats_bucket` calculates the following metrics:

- Sum of squares
- Variance
- Population variance
- Sampling variance
- Standard deviation
- Population standard deviation
- Sampling standard deviation
- Standard deviation bounds:
  - Upper
  - Lower
  - Population upper
  - Population lower
  - Sampling upper
  - Sampling lower

The standard deviation and variance are population statistics; they are always equal to the population standard deviation and variance, respectively.

The `std_deviation_bounds` object defines a range that spans the specified number of standard deviations above and below the mean (default is two standard deviations). This object is always included in the output but is meaningful only for normally distributed data. Before interpreting these values, verify that your dataset follows a normal distribution.

The specified metric must be numeric, and the sibling aggregation must be a multi-bucket aggregation.

## Parameters

The `extended_stats_bucket` aggregation takes the following parameters.

| Parameter             | Required/Optional | Data type       | Description |
| :--                   | :--               |  :--            | :--         |
| `buckets_path`        | Required          | String          | The path of the aggregation buckets to be aggregated. See [Buckets path]({{site.url}}{{site.baseurl}}/aggregations/pipeline/index#buckets-path). |
| `gap_policy`          | Optional          | String          | The policy to apply to missing data. Valid values are `skip` and `insert_zeros`. Default is `skip`. See [Data gaps]({{site.url}}{{site.baseurl}}/aggregations/pipeline/#data-gaps).|
| `format`              | Optional          | String          | A [DecimalFormat](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/DecimalFormat.html) formatting string. Returns the formatted output in the aggregation's `<stat>_as_string` property. |
| `sigma`   | Optional          | Double (non-negative) | The number of standard deviations above and below the mean used to calculate the `std_deviation_bounds` interval. Default is `2`. See [Defining bounds]({{site.url}}{{site.baseurl}}/aggregations/metric/extended-stats#defining-bounds) in `extended_stats`. |

## Example

The following example creates a date histogram with a one-month interval using the OpenSearch Dashboards e-commerce sample data. The `sum` sub-aggregation calculates the sum of all bytes for each month. Finally, the `extended_stats_bucket` aggregation returns the extended stats for these sums:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "visits_per_month": {
      "date_histogram": {
        "field": "@timestamp",
        "interval": "month"
      },
      "aggs": {
        "sum_of_bytes": {
          "sum": {
            "field": "bytes"
          }
        }
      }
    },
    "stats_monthly_bytes": {
      "extended_stats_bucket": {
        "buckets_path": "visits_per_month>sum_of_bytes",
        "sigma": 3,
        "format": "0.##E0"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The response contains extended stats for the selected buckets. Note that the standard deviation bounds are for a three-sigma range; changing `sigma` (or letting it default to `2`) returns different results:

<details open markdown="block">
  <summary>
    Response
  </summary>

```json
{
  "took": 6,
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
    "visits_per_month": {
      "buckets": [
        {
          "key_as_string": "2025-03-01T00:00:00.000Z",
          "key": 1740787200000,
          "doc_count": 480,
          "sum_of_bytes": {
            "value": 2804103
          }
        },
        {
          "key_as_string": "2025-04-01T00:00:00.000Z",
          "key": 1743465600000,
          "doc_count": 6849,
          "sum_of_bytes": {
            "value": 39103067
          }
        },
        {
          "key_as_string": "2025-05-01T00:00:00.000Z",
          "key": 1746057600000,
          "doc_count": 6745,
          "sum_of_bytes": {
            "value": 37818519
          }
        }
      ]
    },
    "stats_monthly_bytes": {
      "count": 3,
      "min": 2804103,
      "max": 39103067,
      "avg": 26575229.666666668,
      "sum": 79725689,
      "min_as_string": "2.8E6",
      "max_as_string": "3.91E7",
      "avg_as_string": "2.66E7",
      "sum_as_string": "7.97E7",
      "sum_of_squares": 2967153221794459,
      "variance": 282808242095406.25,
      "variance_population": 282808242095406.25,
      "variance_sampling": 424212363143109.4,
      "std_deviation": 16816903.46334325,
      "std_deviation_population": 16816903.46334325,
      "std_deviation_sampling": 20596416.2694171,
      "std_deviation_bounds": {
        "upper": 77025940.05669643,
        "lower": -23875480.72336309,
        "upper_population": 77025940.05669643,
        "lower_population": -23875480.72336309,
        "upper_sampling": 88364478.47491796,
        "lower_sampling": -35214019.141584635
      },
      "sum_of_squares_as_string": "2.97E15",
      "variance_as_string": "2.83E14",
      "variance_population_as_string": "2.83E14",
      "variance_sampling_as_string": "4.24E14",
      "std_deviation_as_string": "1.68E7",
      "std_deviation_population_as_string": "1.68E7",
      "std_deviation_sampling_as_string": "2.06E7",
      "std_deviation_bounds_as_string": {
        "upper": "7.7E7",
        "lower": "-2.39E7",
        "upper_population": "7.7E7",
        "lower_population": "-2.39E7",
        "upper_sampling": "8.84E7",
        "lower_sampling": "-3.52E7"
      }
    }
  }
}
```

</details>
