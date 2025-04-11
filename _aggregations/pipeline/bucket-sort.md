---
layout: default
title: Bucket sort
parent: Pipeline aggregations
nav_order: 40
redirect_from:
  - /query-dsl/aggregations/pipeline-agg#bucket_sort/
  - /query-dsl/aggregations/pipeline/bucket-sort/
---

# Bucket sort aggregations

The `bucket_sort` aggregation is a parent aggregation that sorts buckets of a previous aggregation.

You can specify several sort fields together with a sort order for each. You can sort each bucket based on its key, count, or its sub-aggregations. You can also truncate the buckets by setting `from` and `size` parameters, or use the `from` or `size` parameters without `sort` to truncate the buckets without sorting.

For details about how to specify sort order, see [Sort results](https://opensearch.org/docs/latest/search-plugins/searching-data/sort/).

## Parameters

The `bucket_sort` aggregation takes the following parameters.

| Parameter        | Required/Optional | Data type       | Description |
| :--              | :--               |  :--            | :--         |
| `gap_policy`     | Optional          | String          | The policy to apply to missing data. Valid values are `skip`, `insert_zeros`, and `keep_values`. Default is `skip`. |
| `sort`           | Optional          | String          | A list of fields to sort. See [Sort results](https://opensearch.org/docs/latest/search-plugins/searching-data/sort/). |
| `from`           | Optional          | String          | The index of the first result to return. Indexing starts at `0`. Must be a non-negative integer. |
| `size`           | Optional          | String          | The maximum number of results to return. Must be a positive integer. |

You must supply at least one of `sort`, `from`, and `size`.
{: .note}

## Example

The following example creates a date histogram with a one-month interval from the OpenSearch Dashboards e-commerce sample data. The `sum` sub-aggregation calculates the sum of all bytes for each month. Finally, the aggregation sorts the buckets in descending order of number of bytes:

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
        "total_bytes": {
          "sum": {
            "field": "bytes"
          }
        },
        "bytes_bucket_sort": {
          "bucket_sort": {
            "sort": [
              { "total_bytes": { "order": "desc" } }
            ]
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The aggregation reorders the buckets descending order of total bytes:

```json
{
  "took": 4,
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
          "key_as_string": "2025-04-01T00:00:00.000Z",
          "key": 1743465600000,
          "doc_count": 6849,
          "total_bytes": {
            "value": 39103067
          }
        },
        {
          "key_as_string": "2025-05-01T00:00:00.000Z",
          "key": 1746057600000,
          "doc_count": 6745,
          "total_bytes": {
            "value": 37818519
          }
        },
        {
          "key_as_string": "2025-03-01T00:00:00.000Z",
          "key": 1740787200000,
          "doc_count": 480,
          "total_bytes": {
            "value": 2804103
          }
        }
      ]
    }
  }
}
```

## Example: truncating the response

The following example performs the same sort, but returns only one bucket:

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
        "total_bytes": {
          "sum": {
            "field": "bytes"
          }
        },
        "bytes_bucket_sort": {
          "bucket_sort": {
            "sort": [
              { "total_bytes": { "order": "desc" } }
            ],
            "size": 1
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response: truncating the response

The aggregation returns the first of the sorted buckets:

```json
{
  "took": 5,
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
          "key_as_string": "2025-04-01T00:00:00.000Z",
          "key": 1743465600000,
          "doc_count": 6849,
          "total_bytes": {
            "value": 39103067
          }
        }
      ]
    }
  }
}
```