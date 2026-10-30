---
layout: default
title: Missing
parent: Bucket aggregations
nav_order: 120
redirect_from:
  - /query-dsl/aggregations/bucket/missing/
---

# Missing aggregation

The `missing` aggregation creates a single bucket containing all documents that do not have a value for a specified field. A document is considered missing if the field is absent, `null`, or an empty array. If the field mapping defines a [`null_value`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/null-value/), explicit `null` values are indexed as that value and are not counted as missing. This aggregation is commonly paired with other bucket aggregations to account for documents that cannot be placed in any other bucket because they lack the required field.

## Parameters

The `missing` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `field` | Required | String | The field to check for missing values. |

If the specified field is not mapped in the index, every document is counted as missing, and no error is returned. A misspelled field name therefore produces a bucket containing all documents. If the `doc_count` equals the total number of documents, verify the field name.
{: .note}

## Example

The following request indexes three products into a `product_ratings` index. Product C has no `rating` field:

```json
POST product_ratings/_bulk?refresh
{ "index": { "_id": "1" } }
{ "name": "Product A", "rating": 4.5, "num_reviews": 100 }
{ "index": { "_id": "2" } }
{ "name": "Product B", "rating": 3.8, "num_reviews": 50 }
{ "index": { "_id": "3" } }
{ "name": "Product C" }
```
{% include copy-curl.html %}

The following aggregation counts how many products are missing a rating and includes a `terms` subaggregation to identify them:

```json
GET /product_ratings/_search
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
  ...
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
