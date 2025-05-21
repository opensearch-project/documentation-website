---
layout: default
title: Derivative
parent: Pipeline aggregations
nav_order: 70
---

# Derivative aggregations

The `derivative` aggregation is a parent aggregation used to calculate first-order and second-order derivatives of each bucket of an aggregation. "First-order derivative" and "second-order derivative" are often shortened to "first derivative" and "second derivative," respectively. This page uses the shortened terms.

For an ordered series of buckets, `derivative` approximates a first derivative as the difference between metric values in the current and previous buckets.

## Parameters

The `derivative` aggregation takes the following parameters.

| Parameter             | Required/Optional | Data type       | Description |
| :--                   | :--               |  :--            | :--         |
| `buckets_path`        | Required          | String          | The path of the aggregation buckets to be aggregated. See [Buckets path]({{site.url}}{{site.baseurl}}/aggregations/pipeline/index#buckets-path). |
| `gap_policy`          | Optional          | String          | The policy to apply to missing data. Valid values are `skip` and `insert_zeros`. Default is `skip`. See [Data gaps]({{site.url}}{{site.baseurl}}/aggregations/pipeline/index/#data-gaps). |
| `format`              | Optional          | String          | A [DecimalFormat](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/DecimalFormat.html) formatting string. Returns the formatted output in the aggregation's `value_as_string` property. |

## Example: First derivative

The following example creates a date histogram with a one-month interval from the OpenSearch Dashboards e-commerce sample data. The `sum` sub-aggregation calculates the sum of all bytes for each month. Finally, the `derivative` aggregation calculates the first derivative of the `sum` sub-aggregation. The first derivative is estimated as the difference between the number of bytes in the current month and the previous month:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "sales_per_month": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "month"
      },
      "aggs": {
        "number_of_bytes": {
          "sum": {
            "field": "bytes"
          }
        },
        "bytes_deriv": {
          "derivative": {
            "buckets_path": "number_of_bytes"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response: First derivative

The response shows derivatives computed for the second and third buckets: 

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
    "sales_per_month": {
      "buckets": [
        {
          "key_as_string": "2025-03-01T00:00:00.000Z",
          "key": 1740787200000,
          "doc_count": 480,
          "number_of_bytes": {
            "value": 2804103
          }
        },
        {
          "key_as_string": "2025-04-01T00:00:00.000Z",
          "key": 1743465600000,
          "doc_count": 6849,
          "number_of_bytes": {
            "value": 39103067
          },
          "bytes_deriv": {
            "value": 36298964
          }
        },
        {
          "key_as_string": "2025-05-01T00:00:00.000Z",
          "key": 1746057600000,
          "doc_count": 6745,
          "number_of_bytes": {
            "value": 37818519
          },
          "bytes_deriv": {
            "value": -1284548
          }
        }
      ]
    }
  }
}
```

No derivative is calculated for the first bucket because no previous bucket is available for that bucket.

## Example: Second derivative

To calculate a second derivative, chain one derivative aggregation to another:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "sales_per_month": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "month"
      },
      "aggs": {
        "number_of_bytes": {
          "sum": {
            "field": "bytes"
          }
        },
        "bytes_1st_deriv": {
          "derivative": {
            "buckets_path": "number_of_bytes"
          }
        },
        "bytes_2nd_deriv": {
          "derivative": {
            "buckets_path": "bytes_1st_deriv"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response: Second derivative

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
    "sales_per_month": {
      "buckets": [
        {
          "key_as_string": "2025-03-01T00:00:00.000Z",
          "key": 1740787200000,
          "doc_count": 480,
          "number_of_bytes": {
            "value": 2804103
          }
        },
        {
          "key_as_string": "2025-04-01T00:00:00.000Z",
          "key": 1743465600000,
          "doc_count": 6849,
          "number_of_bytes": {
            "value": 39103067
          },
          "bytes_1st_deriv": {
            "value": 36298964
          }
        },
        {
          "key_as_string": "2025-05-01T00:00:00.000Z",
          "key": 1746057600000,
          "doc_count": 6745,
          "number_of_bytes": {
            "value": 37818519
          },
          "bytes_1st_deriv": {
            "value": -1284548
          },
          "bytes_2nd_deriv": {
            "value": -37583512
          }
        }
      ]
    }
  }
}
```

No first derivative is calculated for the first bucket because no previous bucket is available for that bucket. Similarly, no second derivative is calculated for the first or second buckets.
