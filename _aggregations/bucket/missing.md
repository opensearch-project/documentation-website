---
layout: default
title: Missing
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 120
redirect_from:
  - /query-dsl/aggregations/bucket/missing/
---

# Missing aggregations

If you have documents in your index that don’t contain the aggregating field at all or the aggregating field has a value of NULL, use the `missing` parameter to specify the name of the bucket such documents should be placed in.

The following example adds any missing values to a bucket named "N/A":

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "response_codes": {
      "terms": {
        "field": "response.keyword",
        "size": 10,
        "missing": "N/A"
      }
    }
  }
}
```
{% include copy-curl.html %}

Because the default value for the `min_doc_count` parameter is 1, the `missing` parameter doesn't return any buckets in its response. Set `min_doc_count` parameter to 0 to see the "N/A" bucket in the response:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "response_codes": {
      "terms": {
        "field": "response.keyword",
        "size": 10,
        "missing": "N/A",
        "min_doc_count": 0
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "response_codes" : {
    "doc_count_error_upper_bound" : 0,
    "sum_other_doc_count" : 0,
    "buckets" : [
      {
        "key" : "200",
        "doc_count" : 12832
      },
      {
        "key" : "404",
        "doc_count" : 801
      },
      {
        "key" : "503",
        "doc_count" : 441
      },
      {
        "key" : "N/A",
        "doc_count" : 0
      }
    ]
  }
 }
}
```