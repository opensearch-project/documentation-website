---
layout: default
title: Working with subaggregations
parent: Composite
grand_parent: Bucket aggregations
great_grand_parent: Aggregations
nav_order: 30
---

# Working with subaggregations

Composite aggregations support the use of subaggregations, which allows you to compute additional buckets or statistics for each composite bucket created by the parent aggregation. Subaggregations provide a powerful way to analyze and summarize your data at multiple levels within a single query.

## Syntax

To include subaggregations in a composite aggregation, you need to add an `aggregations` field within the composite aggregation definition. This field should contain the subaggregation(s) you want to compute for each composite bucket. See the following example definition:

```json
{
  "aggs": {
    "my_buckets": {
      "composite": {
        "sources": [
          { "SOURCE_NAME": { "AGGREGATION": { ... } } },
          ...
        ]
      },
      "aggregations": {
        "SUB_AGGREGATION_NAME": {
          "AGGREGATION_TYPE": { ... }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

---

## Example

Consider an index `sales` with fields `timestamp` (date), `product` (keyword), and `price` (float). You can composite aggregate sales by `day` and `product`, then calculate the average price for each resulting bucket with the following query:

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
                "order": "asc"
              }
            }
          }
        ]
      },
      "aggregations": {
        "avg_price": {
          "avg": {
            "field": "price"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}


#### Example response

```json
{
  "took": 12,
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
          "doc_count": 1,
          "avg_price": {
            "value": null
          }
        },
        {
          "key": {
            "day": 1680307200000,
            "product": "Product A"
          },
          "doc_count": 1,
          "avg_price": {
            "value": null
          }
        },
        {
          "key": {
            "day": 1680307200000,
            "product": "Product B"
          },
          "doc_count": 1,
          "avg_price": {
            "value": null
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}
