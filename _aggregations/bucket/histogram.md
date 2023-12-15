---
layout: default
title: Histogram
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 100
redirect_from:
  - /query-dsl/aggregations/bucket/histogram/
---

# Histogram aggregations

The `histogram` aggregation buckets documents based on a specified interval.

With `histogram` aggregations, you can visualize the distributions of values in a given range of documents very easily. Now OpenSearch doesn’t give you back an actual graph of course, that’s what OpenSearch Dashboards is for. But it'll give you the JSON response that you can use to construct your own graph.

The following example buckets the `number_of_bytes` field by 10,000 intervals:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "number_of_bytes": {
      "histogram": {
        "field": "bytes",
        "interval": 10000
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
        "key" : 0.0,
        "doc_count" : 13372
      },
      {
        "key" : 10000.0,
        "doc_count" : 702
      }
    ]
  }
 }
}
```
