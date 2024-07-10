---
layout: default
title: Handling missing buckets
parent: Composite
grand_parent: Bucket aggregations
great_grand_parent: Aggregations
nav_order: 20
---

## Handling missing buckets

By default, composite aggregations exclude documents that do not have a value for a particular source. However, you can choose to include these missing values by setting the `missing_bucket` parameter to `true` for the relevant source.

## Syntax 

The syntax for handling missing values in a composite aggregation requires you to include the `missing_bucket` parameter with a value of `true` within the relevant source definition, as shown in the following example syntax for the `sources` array.

```json
"sources": [
  {
    "NAME": {
      "AGGREGATION": {
        "field": "FIELD",
        "missing_bucket": true
      }
    }
  }
]
```
{% include copy-curl.html %}

---

## Example

For example, the following query groups documents by product name using a `terms` aggregation and includes a bucket for documents that do not have a product name specified: 

```json
GET /sales/_search
{
  "size": 0,
  "aggs": {
    "sales_by_day_product": {
      "composite": {
        "sources": [
          {
            "day": {
              "date_histogram": {
                "field": "timestamp",
                "calendar_interval": "1d",
                "order": "desc"
              }
            }
          },
          {
            "product": {
              "terms": {
                "field": "product.keyword",
                "order": "asc",
                "missing_bucket": true
              }
            }
          }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 23,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "sales_by_day_product": {
      "after_key": {
        "day": 1680307200000,
        "product": "Product B"
      },
      "buckets": [
        {
          "key": {
            "day": 1680393600000,
            "product": "Product A"
          },
          "doc_count": 1
        },
        {
          "key": {
            "day": 1680307200000,
            "product": "Product A"
          },
          "doc_count": 1
        },
        {
          "key": {
            "day": 1680307200000,
            "product": "Product B"
          },
          "doc_count": 1
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}