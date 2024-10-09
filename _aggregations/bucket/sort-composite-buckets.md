---
layout: default
title: Sorting composite buckets
parent: Composite
grand_parent: Bucket aggregations
great_grand_parent: Aggregations
nav_order: 15
---

# Sorting composite buckets

By default, composite buckets are sorted in natural ascending order based on their values. However, you can customize the sort order for each [value source]({{site.url}}{{site.baseurl}}/aggregations/bucket/value-sources/) within a composite bucket aggregation.

## Syntax

The `order` parameter is used to specify the sort direction for a value source within the `sources` array of the composite aggregation. It accepts two values:

- `asc` (default): Sort in ascending order
- `desc`: Sort in descending order

```json
"composite": {
  "sources": [
    {
      "NAME": {
        "AGGREGATION": {
          "field": "FIELD",
          "order": "asc|desc"
        }
      }
    },
    ...
  ]
}
```
{% include copy-curl.html %}


---

## Example

For example, the following query groups documents by day (`date_histogram`) in descending order, and then by product name (`terms`) in ascending order:

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
      }
    }
  }
}
```
{% include copy-curl.html %}


In this example, 

- The `day` source uses a `date_histogram` aggregation on the `timestamp` field, with a calendar interval of 1 day, sorted in descending order.
- The `product` source uses a `terms` aggregation on the `product` field, sorted in ascending order.

#### Example response

```json
{
  "took": 65,
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
