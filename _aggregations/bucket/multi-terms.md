---
layout: default
title: Multi-terms
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 130
redirect_from:
  - /query-dsl/aggregations/multi-terms/
---

# Multi-terms aggregations

Similar to the `terms` bucket aggregation, you can also search for multiple terms using the `multi_terms` aggregation. Multi-terms aggregations are useful when you need to sort by document count, or when you need to sort by a metric aggregation on a composite key and get the top `n` results. For example, you could search for a specific number of documents (e.g., 1000) and the number of servers per location that show CPU usage greater than 90%. The top number of results would be returned for this multi-term query.

The `multi_terms` aggregation does consume more memory than a `terms` aggregation, so its performance might be slower.
{: .tip }

## Multi-terms aggregation parameters

Parameter | Description
:--- | :---
multi_terms | Indicates a multi-terms aggregation that gathers buckets of documents together based on criteria specified by multiple terms.
size | Specifies the number of buckets to return. Default is 10.
order | Indicates the order to sort the buckets. By default, buckets are ordered according to document count per bucket. If the buckets contain the same document count, then `order` can be explicitly set to the term value instead of document count. (e.g., set `order` to "max-cpu").
doc_count | Specifies the number of documents to be returned in each bucket. By default, the top 10 terms are returned.

#### Example request

```json
GET sample-index100/_search
{
  "size": 0, 
  "aggs": {
    "hot": {
      "multi_terms": {
        "terms": [{
          "field": "region" 
        },{
          "field": "host" 
        }],
        "order": {"max-cpu": "desc"}
      },
      "aggs": {
        "max-cpu": { "max": { "field": "cpu" } }
      }      
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 118,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 8,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "multi-terms": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": [
            "dub",
            "h1"
          ],
          "key_as_string": "dub|h1",
          "doc_count": 2,
          "max-cpu": {
            "value": 90.0
          }
        },
        {
          "key": [
            "dub",
            "h2"
          ],
          "key_as_string": "dub|h2",
          "doc_count": 2,
          "max-cpu": {
            "value": 70.0
          }
        },
        {
          "key": [
            "iad",
            "h2"
          ],
          "key_as_string": "iad|h2",
          "doc_count": 2,
          "max-cpu": {
            "value": 50.0
          }
        },
        {
          "key": [
            "iad",
            "h1"
          ],
          "key_as_string": "iad|h1",
          "doc_count": 2,
          "max-cpu": {
            "value": 15.0
          }
        }
      ]
    }
  }
}
```
