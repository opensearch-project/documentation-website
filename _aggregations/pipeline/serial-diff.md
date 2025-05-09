---
layout: default
title: Serial diff
parent: Pipeline aggregations
nav_order: 190
redirect_from:
  - /query-dsl/aggregations/pipeline-agg#serial_diff/
  - /query-dsl/aggregations/pipeline/serial-diff/
---

# Serial diff aggregations

The `serial_diff` aggregation is a parent pipeline aggregation that computes a sequence of differences between values from current and previous aggregations. 

Use the `serial_diff` aggregation to compute changes between time periods with a specified lag. The `lag` parameter (a positive integer value) specifies which previous bucket to subtract from the current one. The default `lag` value is `1`, meaning `serial_diff` subtracts the immediately previous bucket from the current bucket.

## Parameters

The `serial_diff` aggregation takes the following parameters:

| Parameter             | Required/Optional | Data type       | Description |
| :--                   | :--               |  :--            | :--         |
| `buckets_path`        | Required          | String          | The path of the aggregation buckets to be aggregated. See [Pipeline aggregations]({{site.url}}{{site.baseurl}}/aggregations/pipeline/index#pipeline-aggregation-syntax). |
| `gap_policy`          | Optional          | String          | The policy to apply to missing data. Valid values are `skip`, `insert_zeros`, and `keep_values`. Default is `skip`. |
| `format`              | Optional          | String          | A [DecimalFormat](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/DecimalFormat.html) formatting string. Returns the formatted output in the aggregation's `value_as_string` property. |
| `lag`                 | Optional          | Integer         | The historical bucket to subtract from the current bucket. Must be a positive integer. Default is `1`. |

## Example

The following example creates a date histogram with a one-month interval from the OpenSearch Dashboards logs sample data. The `sum` sub-aggregation calculates the sum of all bytes for each month. Finally, the `serial_diff` aggregation calculates month-to-month difference in total bytes from these sums:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
   "size": 0,
   "aggs": {
      "monthly_bytes": {                  
         "date_histogram": {
            "field": "@timestamp",
            "calendar_interval": "month"
         },
         "aggs": {
            "total_bytes": {
               "sum": {
                  "field": "bytes"     
               }
            },
            "monthly_bytes_change": {
               "serial_diff": {                
                  "buckets_path": "total_bytes",
                  "lag": 1
               }
            }
         }
      }
   }
}
```
{% include copy-curl.html %}

## Example response

The result shows the month-to-month difference for the second and third month. (The first month `serial_diff` cannot be calculated because because there's no previous month to compare with.)

```json
{
  "took": 3,
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
    "monthly_bytes": {
      "buckets": [
        {
          "key_as_string": "2025-03-01T00:00:00.000Z",
          "key": 1740787200000,
          "doc_count": 480,
          "total_bytes": {
            "value": 2804103
          }
        },
        {
          "key_as_string": "2025-04-01T00:00:00.000Z",
          "key": 1743465600000,
          "doc_count": 6849,
          "total_bytes": {
            "value": 39103067
          },
          "monthly_bytes_change": {
            "value": 36298964
          }
        },
        {
          "key_as_string": "2025-05-01T00:00:00.000Z",
          "key": 1746057600000,
          "doc_count": 6745,
          "total_bytes": {
            "value": 37818519
          },
          "monthly_bytes_change": {
            "value": -1284548
          }
        }
      ]
    }
  }
}
```

## Example: Multi-period differences

Use a larger `lag` value to compare with buckets further back in time. The following example computes differences on weekly byte data with a lag of 4 (comparing each bucket with the bucket 4 weeks back). This has the effect of removing any variation with a period of four weeks:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
   "size": 0,
   "aggs": {
      "monthly_bytes": {                  
         "date_histogram": {
            "field": "@timestamp",
            "calendar_interval": "week"
         },
         "aggs": {
            "total_bytes": {
               "sum": {
                  "field": "bytes"     
               }
            },
            "monthly_bytes_change": {
               "serial_diff": {                
                  "buckets_path": "total_bytes",
                  "lag": 4
               }
            }
         }
      }
   }
}
```
{% include copy-curl.html %}

## Example response: Multi-period differences

<details open markdown="block">

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
    "monthly_bytes": {
      "buckets": [
        {
          "key_as_string": "2025-03-24T00:00:00.000Z",
          "key": 1742774400000,
          "doc_count": 249,
          "total_bytes": {
            "value": 1531493
          }
        },
        {
          "key_as_string": "2025-03-31T00:00:00.000Z",
          "key": 1743379200000,
          "doc_count": 1617,
          "total_bytes": {
            "value": 9213161
          }
        },
        {
          "key_as_string": "2025-04-07T00:00:00.000Z",
          "key": 1743984000000,
          "doc_count": 1610,
          "total_bytes": {
            "value": 9188671
          }
        },
        {
          "key_as_string": "2025-04-14T00:00:00.000Z",
          "key": 1744588800000,
          "doc_count": 1610,
          "total_bytes": {
            "value": 9244851
          }
        },
        {
          "key_as_string": "2025-04-21T00:00:00.000Z",
          "key": 1745193600000,
          "doc_count": 1609,
          "total_bytes": {
            "value": 9061045
          },
          "monthly_bytes_change": {
            "value": 7529552
          }
        },
        {
          "key_as_string": "2025-04-28T00:00:00.000Z",
          "key": 1745798400000,
          "doc_count": 1554,
          "total_bytes": {
            "value": 8713507
          },
          "monthly_bytes_change": {
            "value": -499654
          }
        },
        {
          "key_as_string": "2025-05-05T00:00:00.000Z",
          "key": 1746403200000,
          "doc_count": 1710,
          "total_bytes": {
            "value": 9544718
          },
          "monthly_bytes_change": {
            "value": 356047
          }
        },
        {
          "key_as_string": "2025-05-12T00:00:00.000Z",
          "key": 1747008000000,
          "doc_count": 1610,
          "total_bytes": {
            "value": 9155820
          },
          "monthly_bytes_change": {
            "value": -89031
          }
        },
        {
          "key_as_string": "2025-05-19T00:00:00.000Z",
          "key": 1747612800000,
          "doc_count": 1610,
          "total_bytes": {
            "value": 9025078
          },
          "monthly_bytes_change": {
            "value": -35967
          }
        },
        {
          "key_as_string": "2025-05-26T00:00:00.000Z",
          "key": 1748217600000,
          "doc_count": 895,
          "total_bytes": {
            "value": 5047345
          },
          "monthly_bytes_change": {
            "value": -3666162
          }
        }
      ]
    }
  }
}
```
</details>

Note that the `serial_diff` aggregation does not begin until the fifth bucket, when a bucket with a `lag` of `4` becomes available.