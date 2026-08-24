---
layout: default
title: Range
parent: Bucket aggregations
nav_order: 150
redirect_from:
  - /query-dsl/aggregations/bucket/range/
---

# Range aggregation

The `range` aggregation groups documents into buckets based on value ranges that you define. Each bucket captures documents whose field value falls within its specified `from` (inclusive) and `to` (exclusive) boundaries. Unlike the [`histogram` aggregation]({{site.url}}{{site.baseurl}}/aggregations/bucket/histogram/), which creates uniform intervals automatically, `range` lets you define arbitrary, non-uniform boundaries.

## Parameters

The `range` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `field` | Optional | String | The numeric field to aggregate on. Either `field` or `script` is required. |
| `script` | Optional | Object | A script that produces the value to aggregate on. Either `field` or `script` is required. When used with `field`, the script acts as a value script and receives the field value as `_value`. |
| `ranges` | Required | Array | A list of range boundaries. Each entry can include `from`, `to`, and optionally `key`. |
| `keyed` | Optional | Boolean | When `true`, returns buckets as an object keyed by range name instead of an array. Default is `false`. |
| `missing` | Optional | Number | The value to use for documents missing the target field. By default, missing documents are ignored. |

## Example: Custom-named price tiers with subaggregation

The following example segments e-commerce orders into three price tiers and computes the average order value within each tier:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "price_tiers": {
      "range": {
        "field": "taxful_total_price",
        "keyed": true,
        "ranges": [
          { "key": "budget", "to": 50 },
          { "key": "mid_range", "from": 50, "to": 100 },
          { "key": "premium", "from": 100 }
        ]
      },
      "aggs": {
        "avg_price": {
          "avg": { "field": "taxful_total_price" }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response groups orders into labeled tiers with their average prices:

```json
{
  ...
  "aggregations": {
    "price_tiers": {
      "buckets": {
        "budget": {
          "to": 50.0,
          "doc_count": 1633,
          "avg_price": {
            "value": 38.363175998928355
          }
        },
        "mid_range": {
          "from": 50.0,
          "to": 100.0,
          "doc_count": 2036,
          "avg_price": {
            "value": 72.34457883104126
          }
        },
        "premium": {
          "from": 100.0,
          "doc_count": 1006,
          "avg_price": {
            "value": 140.10288270377734
          }
        }
      }
    }
  }
}
```

## Example: Using a script

You can use a script instead of a field to compute values on the fly. The following example applies a 10% markup to prices before bucketing:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "marked_up_tiers": {
      "range": {
        "script": {
          "source": "doc['taxful_total_price'].value * 1.1"
        },
        "ranges": [
          { "to": 55 },
          { "from": 55, "to": 110 },
          { "from": 110 }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example: Transforming field values with a value script

When you specify both `field` and `script`, the script receives each field value as the `_value` variable. The following example converts USD prices to euros (at a 0.92 rate) before evaluating which range they fall into:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "price_in_euros": {
      "range": {
        "field": "taxful_total_price",
        "script": {
          "source": "_value * 0.92"
        },
        "ranges": [
          { "to": 46 },
          { "from": 46, "to": 92 },
          { "from": 92 }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

## Response body fields

The following table lists the response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `buckets` | Array or Object | The range buckets. Returned as an array by default, or as an object when `keyed` is `true`. |
| `buckets.key` | String | The auto-generated range label (for example, `*-50.0` or `50.0-100.0`), or a custom key if specified. |
| `buckets.from` | Double | The lower bound of the range (inclusive). Omitted for open-ended ranges with no lower bound. |
| `buckets.to` | Double | The upper bound of the range (exclusive). Omitted for open-ended ranges with no upper bound. |
| `buckets.doc_count` | Integer | The number of documents falling within this range. |
