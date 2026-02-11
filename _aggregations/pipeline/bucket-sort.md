---
layout: default
title: Bucket sort
parent: Pipeline aggregations
nav_order: 40
canonical_url: https://docs.opensearch.org/latest/aggregations/pipeline/bucket-sort/
---

# Bucket sort aggregations

The `bucket_sort` aggregation is a parent aggregation that sorts or truncates the buckets produced by its parent multi-bucket aggregation.

In `bucket_sort` aggregations, you can sort buckets by multiple fields, each with its own sort order. Buckets can be sorted by their key, document count, or values from subaggregations. You can also use the `from` and `size` parameters to truncate the results, with or without sorting.

For information about specifying sort order, see [Sort results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/sort/).

## Parameters

The `bucket_sort` aggregation takes the following parameters.

| Parameter        | Required/Optional | Data type       | Description |
| :--              | :--               |  :--            | :--         |
| `gap_policy`     | Optional          | String          | The policy to apply to missing data. Valid values are `skip` and `insert_zeros`. Default is `skip`. See [Data gaps]({{site.url}}{{site.baseurl}}/aggregations/pipeline/#data-gaps). |
| `sort`           | Optional          | String          | A list of fields by which to sort. See [Sort results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/sort/). |
| `from`           | Optional          | String          | The index of the first result to return. Must be a non-negative integer. Default is `0`. See [The `from` and `size` parameters]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/#the-from-and-size-parameters). |
| `size`           | Optional          | String          | The maximum number of results to return. Must be a positive integer. See [The `from` and `size` parameters]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/#the-from-and-size-parameters).|

You must supply at least one of `sort`, `from`, and `size`.
{: .note}

## Example

The following example creates a date histogram with a one-month interval from the OpenSearch Dashboards e-commerce sample data. The `sum` subaggregation calculates the sum of all bytes for each month. Finally, the aggregation sorts the buckets in descending order by number of bytes:

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

The aggregation reorders the buckets in descending order by total number of bytes:

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
    "sales_per_month": {
      "buckets": [
        {
          "key_as_string": "2025-05-01T00:00:00.000Z",
          "key": 1746057600000,
          "doc_count": 7072,
          "total_bytes": {
            "value": 40124337
          }
        },
        {
          "key_as_string": "2025-06-01T00:00:00.000Z",
          "key": 1748736000000,
          "doc_count": 6056,
          "total_bytes": {
            "value": 34123131
          }
        },
        {
          "key_as_string": "2025-04-01T00:00:00.000Z",
          "key": 1743465600000,
          "doc_count": 946,
          "total_bytes": {
            "value": 5478221
          }
        }
      ]
    }
  }
}
```

## Example: Truncating the results 

To truncate the results, provide the `from` and/or `size` parameters. The following example performs the same sort but returns two buckets, starting with the second bucket:

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
            "from": 1,
            "size": 2
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The aggregation returns the two sorted buckets:

```json
{
  "took": 2,
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
          "key_as_string": "2025-06-01T00:00:00.000Z",
          "key": 1748736000000,
          "doc_count": 6056,
          "total_bytes": {
            "value": 34123131
          }
        },
        {
          "key_as_string": "2025-04-01T00:00:00.000Z",
          "key": 1743465600000,
          "doc_count": 946,
          "total_bytes": {
            "value": 5478221
          }
        }
      ]
    }
  }
}
```

To truncate results without sorting, omit the `sort` parameter:

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
            "from": 1,
            "size": 2
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}