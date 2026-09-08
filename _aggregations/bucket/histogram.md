---
layout: default
title: Histogram
parent: Bucket aggregations
nav_order: 100
redirect_from:
  - /query-dsl/aggregations/bucket/histogram/
---

# Histogram aggregation

The `histogram` aggregation divides a numeric field's value range into fixed-width intervals and counts documents in each interval. Each bucket's `key` represents the lower bound of that interval, computed as `Math.floor((value - offset) / interval) * interval + offset`.

## Parameters

The `histogram` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `field` | Required | String | The numeric field to aggregate on. |
| `interval` | Required | Number | The width of each bucket. Must be a positive value. |
| `min_doc_count` | Optional | Integer | The minimum number of documents required for a bucket to appear in the response. Set to `1` to omit empty buckets. Default is `0` (empty buckets are included). |
| `extended_bounds` | Optional | Object | Guarantees that buckets exist from `min` to `max`, even if no documents fall in that range. Does not filter out buckets beyond the bounds---to exclude buckets outside a range, use `hard_bounds` or a range query. Accepts `min` and `max` values. Only meaningful when `min_doc_count` is `0`. |
| `hard_bounds` | Optional | Object | Limits the range of buckets in the response. Accepts `min` and `max` values. Buckets outside these bounds are excluded. |
| `offset` | Optional | Number | Shifts bucket boundaries by the specified amount. Must be in the range [0, `interval`). Default is `0`. |
| `keyed` | Optional | Boolean | When `true`, returns buckets as an object keyed by bucket value instead of an array. Default is `false`. |
| `order` | Optional | Object | Controls the sort order of buckets. Accepts `_key` or `_count`, each with `asc` or `desc`. Default is `{"_key": "asc"}`. |
| `missing` | Optional | Number | The value to assign to documents missing the target field, placing them in the corresponding bucket. By default, missing documents are ignored. |

When aggregating a [numeric range field]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/range/) rather than a single-value numeric field, a document can appear in multiple buckets---one for each interval between its lower and upper bounds.
{: .note}

## Example: Basic histogram

The following example groups e-commerce order totals into $50 intervals, showing only buckets that contain at least one document:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "price_histogram": {
      "histogram": {
        "field": "taxful_total_price",
        "interval": 50,
        "min_doc_count": 1
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example: Using offset to shift bucket boundaries

The `offset` parameter shifts where bucket boundaries start. The following example uses an offset of `10`, so buckets start at 10, 60, 110, and so on instead of 0, 50, 100:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "price_histogram": {
      "histogram": {
        "field": "taxful_total_price",
        "interval": 50,
        "offset": 10,
        "min_doc_count": 1
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The following response corresponds to the basic histogram example:

```json
{
  "took": 2,
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
    "price_histogram": {
      "buckets": [
        {
          "key": 0.0,
          "doc_count": 1633
        },
        {
          "key": 50.0,
          "doc_count": 2036
        },
        {
          "key": 100.0,
          "doc_count": 724
        },
        {
          "key": 150.0,
          "doc_count": 205
        },
        {
          "key": 200.0,
          "doc_count": 53
        },
        {
          "key": 250.0,
          "doc_count": 14
        },
        {
          "key": 300.0,
          "doc_count": 7
        },
        {
          "key": 350.0,
          "doc_count": 2
        },
        {
          "key": 2250.0,
          "doc_count": 1
        }
      ]
    }
  }
}
```

## Response body fields

The following table lists the response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `buckets` | Array or Object | The histogram buckets. Returned as an array by default, or as an object when `keyed` is `true`. |
| `buckets.key` | Double | The lower bound of the bucket interval. |
| `buckets.doc_count` | Integer | The number of documents in the bucket. |
