---
layout: default
title: Global
parent: Bucket aggregations
nav_order: 90
redirect_from:
  - /query-dsl/aggregations/bucket/global/
---

# Global aggregation

The `global` aggregation creates a single bucket containing all documents in the index, regardless of the search query. Subaggregations nested inside `global` operate on the full document set, allowing you to compare filtered metrics against overall metrics in the same request.

The `global` aggregation can only be placed as a top-level aggregation. Nesting it inside another bucket aggregation has no effect.
{: .note}

## Example

The following example computes two averages in a single request: one scoped to the query (orders under $50) and one across all documents using the `global` aggregation:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "query": {
    "range": {
      "taxful_total_price": {
        "lte": 50
      }
    }
  },
  "aggs": {
    "total_avg_amount": {
      "global": {},
      "aggs": {
        "avg_price": {
          "avg": {
            "field": "taxful_total_price"
          }
        }
      }
    },
    "filtered_avg": {
      "avg": {
        "field": "taxful_total_price"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "took": 19,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1633,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "total_avg_amount": {
      "doc_count": 4675,
      "avg_price": {
        "value": 75.05542864304813
      }
    },
    "filtered_avg": {
      "value": 38.363175998928355
    }
  }
}
```

The `total_avg_amount` aggregation reports the average across all 4,675 documents ($75.06), while `filtered_avg` reports the average only for the 1,633 documents matching the query ($38.36).

## Response body fields

The following table lists the response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `doc_count` | Integer | The total number of documents in the index, independent of the search query. |
