---
layout: default
title: Missing
parent: Bucket aggregations
nav_order: 120
redirect_from:
  - /query-dsl/aggregations/bucket/missing/
---

# Missing aggregations

The `missing` aggregation creates a single bucket containing all documents that do not have a value for a specified field. A document is considered missing if the field is absent entirely or contains a configured `NULL` value. This aggregation is commonly paired with other bucket aggregations to account for documents that cannot be placed in any other bucket because they lack the required field.

## Parameters

The `missing` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `field` | Required | String | The field to check for missing values. |

## Example

The following example uses the `products` index (created in the [weighted average example]({{site.url}}{{site.baseurl}}/aggregations/metric/weighted-avg/#example)) which contains a document without the `rating` field. The aggregation counts how many products are missing a rating and includes a `terms` subaggregation to identify them:

```json
GET /products/_search
{
  "size": 0,
  "aggs": {
    "without_rating": {
      "missing": {
        "field": "rating"
      },
      "aggs": {
        "names": {
          "terms": {
            "field": "name.keyword"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The response shows that one product (Product C) is missing the `rating` field:

```json
{
  "took": 9,
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
      "value": 4,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "without_rating": {
      "doc_count": 1,
      "names": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": [
          {
            "key": "Product C",
            "doc_count": 1
          }
        ]
      }
    }
  }
}
```

## Response body fields

The following table lists the response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `doc_count` | Integer | The number of documents missing the specified field. |
