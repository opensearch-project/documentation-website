---
layout: default
title: Filters
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 60
redirect_from:
  - /query-dsl/aggregations/bucket/filters/
---

# Filters aggregations

A `filters` aggregation is the same as the `filter` aggregation, except that it lets you use multiple filter aggregations.
While the `filter` aggregation results in a single bucket, the `filters` aggregation returns multiple buckets, one for each of the defined filters.

To create a bucket for all the documents that didn't match the any of the filter queries, set the `other_bucket` property to `true`:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "200_os": {
      "filters": {
        "other_bucket": true,
        "filters": [
          {
            "term": {
              "response.keyword": "200"
            }
          },
          {
            "term": {
              "machine.os.keyword": "osx"
            }
          }
        ]
      },
      "aggs": {
        "avg_amount": {
          "avg": {
            "field": "bytes"
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
...
"aggregations" : {
  "200_os" : {
    "buckets" : [
      {
        "doc_count" : 12832,
        "avg_amount" : {
          "value" : 5897.852711970075
        }
      },
      {
        "doc_count" : 2825,
        "avg_amount" : {
          "value" : 5620.347256637168
        }
      },
      {
        "doc_count" : 1017,
        "avg_amount" : {
          "value" : 3247.0963618485744
        }
      }
    ]
  }
 }
}
```