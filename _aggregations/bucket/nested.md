---
layout: default
title: Nested
parent: Bucket aggregations
nav_order: 140
redirect_from:
  - /query-dsl/aggregations/bucket/nested/
---

# Nested aggregations

The `nested` aggregation lets you aggregate on fields inside a [nested]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/nested/) object. The `nested` type is a specialized version of the `object` data type that indexes each element of an array of objects as a separate hidden document. This preserves the relationship between fields within the same array element so they can be queried and aggregated together.

## Nested aggregation example

To aggregate over fields inside a nested array, specify the `path` to the nested field and define subaggregations under it:

```json
GET logs-nested/_search
{
  "query": {
    "match": { "response": "200" }
  },
  "aggs": {
    "pages": {
      "nested": { "path": "pages" },
      "aggs": {
        "min_load_time": { "min": { "field": "pages.load_time" } }
      }
    }
  }
}
```
{% include copy-curl.html %}

The returned hit contains the requested aggregation:

```json
"hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "logs-nested",
        "_id": "0",
        "_score": 1,
        "_source": {
          "response": "200",
          "pages": [
            {
              "page": "landing",
              "load_time": 200
            },
            {
              "page": "blog",
              "load_time": 500
            }
          ]
        }
      }
    ]
  },
  "aggregations": {
    "pages": {
      "doc_count": 2,
      "min_load_time": {
        "value": 200
      }
    }
  }
```

