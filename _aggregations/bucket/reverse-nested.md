---
layout: default
title: Reverse nested
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 160
redirect_from:
  - /query-dsl/aggregations/bucket/reverse-nested/
---

# Reverse nested aggregations

You can aggregate values from nested documents to their parent; this aggregation is called `reverse_nested`.
You can use `reverse_nested` to aggregate a field from the parent document after grouping by the field from the nested object. The `reverse_nested` aggregation "joins back" the root page and gets the `load_time` for each for your variations.

The `reverse_nested` aggregation is a sub-aggregation inside a nested aggregation. It accepts a single option named `path`. This option defines how many steps backwards in the document hierarchy OpenSearch takes to calculate the aggregations.

```json
GET logs/_search
{
  "query": {
    "match": { "response": "200" }
  },
  "aggs": {
    "pages": {
      "nested": {
        "path": "pages"
      },
      "aggs": {
        "top_pages_per_load_time": {
          "terms": {
            "field": "pages.load_time"
          },
          "aggs": {
            "comment_to_logs": {
              "reverse_nested": {},
              "aggs": {
                "min_load_time": {
                  "min": {
                    "field": "pages.load_time"
                  }
                }
              }
            }
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
  "pages" : {
    "doc_count" : 2,
    "top_pages_per_load_time" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : 200.0,
          "doc_count" : 1,
          "comment_to_logs" : {
            "doc_count" : 1,
            "min_load_time" : {
              "value" : null
            }
          }
        },
        {
          "key" : 500.0,
          "doc_count" : 1,
          "comment_to_logs" : {
            "doc_count" : 1,
            "min_load_time" : {
              "value" : null
            }
          }
        }
      ]
    }
  }
 }
}
```

The response shows the logs index has one page with a `load_time` of 200 and one with a `load_time` of 500.