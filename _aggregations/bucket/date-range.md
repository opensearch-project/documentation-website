---
layout: default
title: Date range
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 30
redirect_from:
  - /query-dsl/aggregations/bucket/date-range/
---

# Date range aggregations

The `date_range` aggregation is conceptually the same as the `range` aggregation, except that it lets you perform date math.
For example, you can get all documents from the last 10 days. To make the date more readable, include the format with a `format` parameter:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "number_of_bytes": {
      "date_range": {
        "field": "@timestamp",
        "format": "MM-yyyy",
        "ranges": [
          {
            "from": "now-10d/d",
            "to": "now"
          }
        ]
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
  "number_of_bytes" : {
    "buckets" : [
      {
        "key" : "03-2021-03-2021",
        "from" : 1.6145568E12,
        "from_as_string" : "03-2021",
        "to" : 1.615451329043E12,
        "to_as_string" : "03-2021",
        "doc_count" : 0
      }
    ]
  }
 }
}
```