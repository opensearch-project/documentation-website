---
layout: default
title: Cumulative sum
parent: Pipeline aggregations
has_children: false
nav_order: 60
canonical_url: https://docs.opensearch.org/latest/aggregations/pipeline/cumulative-sum/
---

# Cumulative sum aggregations

The `cumulative_sum` aggregation is a parent aggregation that calculates the cumulative sum across the buckets of a previous aggregation.

A cumulative sum is a sequence of partial sums of a given sequence. For example, the cumulative sums of the sequence `{a,b,c,…}` are `a`, `a+b`, `a+b+c`, and so on. You can use the cumulative sum to visualize the rate of change of a field over time.

## Parameters

The `cumulative_sum` aggregation takes the following parameters.

| Parameter             | Required/Optional | Data type       | Description |
| :--                   | :--               |  :--            | :--         |
| `buckets_path`        | Required          | String          | The path of the aggregation buckets to be aggregated. See [Buckets path]({{site.url}}{{site.baseurl}}/aggregations/pipeline/index#buckets-path). |
| `format`              | Optional          | String          | A [DecimalFormat](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/DecimalFormat.html) formatting string. Returns the formatted output in the aggregation's `value_as_string` property. |


## Example

The following example creates a date histogram with a one-month interval from the OpenSearch Dashboards e-commerce sample data. The `sum` subaggregation calculates the sum of all bytes for each month. Finally, the `cumulative_sum` aggregation calculates the cumulative number of bytes for each month's bucket:

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
        "no-of-bytes": {
          "sum": {
            "field": "bytes"
          }
        },
        "cumulative_bytes": {
          "cumulative_sum": {
            "buckets_path": "no-of-bytes"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 8,
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
          "no-of-bytes": {
            "value": 2804103
          },
          "cumulative_bytes": {
            "value": 2804103
          }
        },
        {
          "key_as_string": "2025-04-01T00:00:00.000Z",
          "key": 1743465600000,
          "doc_count": 6849,
          "no-of-bytes": {
            "value": 39103067
          },
          "cumulative_bytes": {
            "value": 41907170
          }
        },
        {
          "key_as_string": "2025-05-01T00:00:00.000Z",
          "key": 1746057600000,
          "doc_count": 6745,
          "no-of-bytes": {
            "value": 37818519
          },
          "cumulative_bytes": {
            "value": 79725689
          }
        }
      ]
    }
  }
}
```
