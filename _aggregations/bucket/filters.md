---
layout: default
title: Filters
parent: Bucket aggregations
nav_order: 60
redirect_from:
  - /query-dsl/aggregations/bucket/filters/
---

# Filters aggregations

The `filters` aggregation creates multiple buckets, each associated with a named or anonymous filter query. Every document is evaluated against all filters, and a document can land in multiple buckets if it matches more than one filter. This differs from the singular [`filter` aggregation]({{site.url}}{{site.baseurl}}/aggregations/bucket/filter/), which produces only one bucket.

## Parameters

The `filters` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `filters` | Required | Object or Array | The filter definitions. Provide an object with named keys for labeled buckets, or an array for anonymous (positional) buckets. |
| `other_bucket` | Optional | Boolean | When `true`, adds a bucket containing all documents that did not match any filter. Default is `false`. |
| `other_bucket_key` | Optional | String | The key name for the other bucket. Setting this implicitly enables `other_bucket`. Default is `_other_`. |

## Example: Named filters

When you provide filters as an object, each key becomes the bucket name in the response. The following example groups e-commerce orders into three price tiers:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "price_ranges": {
      "filters": {
        "filters": {
          "budget": { "range": { "taxful_total_price": { "lte": 50 } } },
          "mid_range": { "range": { "taxful_total_price": { "gt": 50, "lte": 100 } } },
          "premium": { "range": { "taxful_total_price": { "gt": 100 } } }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example: Anonymous filters

When you provide filters as an array, buckets are returned in the same order as the array. The following example uses anonymous filters:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "price_ranges": {
      "filters": {
        "filters": [
          { "range": { "taxful_total_price": { "lte": 50 } } },
          { "range": { "taxful_total_price": { "gt": 50, "lte": 100 } } }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example: Other bucket

The `other_bucket` parameter captures all documents that did not match any of the defined filters. The following example uses `other_bucket_key` to assign a custom name to the catch-all bucket:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "price_ranges": {
      "filters": {
        "other_bucket": true,
        "other_bucket_key": "all_others",
        "filters": {
          "budget": { "range": { "taxful_total_price": { "lte": 50 } } },
          "premium": { "range": { "taxful_total_price": { "gt": 100 } } }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The following response corresponds to the other bucket example:

```json
{
  "took": 3,
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
    "price_ranges": {
      "buckets": {
        "budget": {
          "doc_count": 1633
        },
        "premium": {
          "doc_count": 950
        },
        "all_others": {
          "doc_count": 2092
        }
      }
    }
  }
}
```

## Response body fields

The following table lists the response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `buckets` | Object or Array | An object with named keys when using named filters, or an array of objects when using anonymous filters. |
| `buckets.<key>.doc_count` | Integer | The number of documents matching the filter for this bucket. |
