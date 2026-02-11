---
layout: default
title: Minimum bucket
parent: Pipeline aggregations
nav_order: 110
canonical_url: https://docs.opensearch.org/latest/aggregations/pipeline/min-bucket/
---

# Minimum bucket aggregations

The `min_bucket` aggregation is a sibling aggregation that calculates the minimum of a metric in each bucket of a previous aggregation.

The specified metric must be numeric, and the sibling aggregation must be a multi-bucket aggregation.

## Parameters

The `min_bucket` aggregation takes the following parameters.

| Parameter             | Required/Optional | Data type       | Description |
| :--                   | :--               |  :--            | :--         |
| `buckets_path`        | Required          | String          | The path of the aggregation buckets to be aggregated. See [Buckets path]({{site.url}}{{site.baseurl}}/aggregations/pipeline/index#buckets-path). |
| `gap_policy`          | Optional          | String          | The policy to apply to missing data. Valid values are `skip` and `insert_zeros`. Default is `skip`. See [Data gaps]({{site.url}}{{site.baseurl}}/aggregations/pipeline/index#data-gaps).|
| `format`              | Optional          | String          | A [DecimalFormat](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/DecimalFormat.html) formatting string. Returns the formatted output in the aggregation's `value_as_string` property. |

## Example

The following example creates a date histogram with a one-month interval from the OpenSearch Dashboards e-commerce sample data. The `sum` subaggregation calculates the sum of bytes for each month. Finally, the `min_bucket` aggregation finds the minimum---the smallest of these buckets:

```json
POST opensearch_dashboards_sample_data_logs/_search
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
    "min_monthly_bytes": {
      "min_bucket": {
        "buckets_path": "visits_per_month>sum_of_bytes"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The `max_bucket` aggregation returns the minimum value from a specified metric across multiple buckets. In this example, it calculates the minimum number of bytes per month from the `sum_of_bytes` metric inside `visits_per_month`. The `value` field shows the minimum value found across all buckets. The `keys` array contains the keys of the buckets in which this minimum value was observed. It's an array because more than one bucket can have the same minimum value. In such cases, all matching bucket keys are included. This ensures that the result is accurate even if multiple time periods (or terms) have the same minimum value:

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
    "min_monthly_bytes": {
      "value": 2804103,
      "keys": [
        "2025-03-01T00:00:00.000Z"
      ]
    }
  }
}
```


