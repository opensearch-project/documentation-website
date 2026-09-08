---
layout: default
title: Filter
parent: Bucket aggregations
nav_order: 50
redirect_from:
  - /query-dsl/aggregations/bucket/filter/
---

# Filter aggregation

The `filter` aggregation creates a single bucket containing all documents that match a specified query. Any query clause---`match`, `term`, `range`, `bool`, and others---can serve as the filter. Subaggregations nested inside the `filter` aggregation operate only on the matching documents, making it useful for scoping expensive computations to a relevant subset.

For filtering documents into multiple named buckets simultaneously, see the [`filters` aggregation]({{site.url}}{{site.baseurl}}/aggregations/bucket/filters/).

## Example

The following example calculates the average order total for all orders under $50 by wrapping an `avg` subaggregation inside a `range` filter:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "low_value": {
      "filter": {
        "range": {
          "taxful_total_price": {
            "lte": 50
          }
        }
      },
      "aggs": {
        "avg_amount": {
          "avg": {
            "field": "taxful_total_price"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "took": 43,
  "timed_out": false,
  "terminated_early": true,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4675,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "low_value": {
      "doc_count": 1633,
      "avg_amount": {
        "value": 38.363175998928355
      }
    }
  }
}
```

## Response body fields

The following table lists the response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `doc_count` | Integer | The number of documents that matched the filter query. |
