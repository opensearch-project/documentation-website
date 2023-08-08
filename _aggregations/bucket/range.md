---
layout: default
title: Range
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 150
redirect_from:
  - /query-dsl/aggregations/bucket/range/
---

# Range aggregations

The `range` aggregation lets you define the range for each bucket.

For example, you can find the number of bytes between 1000 and 2000, 2000 and 3000, and 3000 and 4000.
Within the `range` parameter, you can define ranges as objects of an array.

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "number_of_bytes_distribution": {
      "range": {
        "field": "bytes",
        "ranges": [
          {
            "from": 1000,
            "to": 2000
          },
          {
            "from": 2000,
            "to": 3000
          },
          {
            "from": 3000,
            "to": 4000
          }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

The response includes the `from` key values and excludes the `to` key values:

#### Example response

```json
...
"aggregations" : {
  "number_of_bytes_distribution" : {
    "buckets" : [
      {
        "key" : "1000.0-2000.0",
        "from" : 1000.0,
        "to" : 2000.0,
        "doc_count" : 805
      },
      {
        "key" : "2000.0-3000.0",
        "from" : 2000.0,
        "to" : 3000.0,
        "doc_count" : 1369
      },
      {
        "key" : "3000.0-4000.0",
        "from" : 3000.0,
        "to" : 4000.0,
        "doc_count" : 1422
      }
    ]
  }
 }
}
```