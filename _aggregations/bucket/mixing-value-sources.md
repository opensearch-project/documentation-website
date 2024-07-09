---
layout: default
title: Mixing value sources
parent: Composite
grand_parent: Bucket aggregations
great_grand_parent: Aggregations
nav_order: 10
---

# Mixing value sources

The `sources` parameter in the composite aggregation defines the source fields and aggregation types to use when building composite buckets. You can mix and match multiple value sources, such as `terms`, `histogram`, `date_histogram`, and `geotile_grid`, to create unique combinations of data aggregations.

The order in which the sources are defined controls the order in which the keys are returned in the composite buckets. You must use a unique name when defining sources for the composite aggregation.

---

## Example: Mixing terms and histogram value sources

The following example creates composite buckets that combine the `product` field (using the `terms` value source) and the `price` field (using the `histogram` value source):

```json
GET /test_index/_search
{
  "size": 0,
  "aggs": {
    "my_buckets": {
      "composite": {
        "sources": [
          { "product": { "terms": { "field": "product.keyword" } } },
          { "price_range": { "histogram": { "field": "price", "interval": 10 } } }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

This query defines two value sources:

- `product`: This source uses the terms value source to create buckets for each unique value of the `product.keyword` field.
- `price_range`: This source uses the `histogram` value source to create buckets based on the `price` field, grouped into intervals of `10`.

The resulting composite buckets will have a structure similar to the following example:

```json
{
  "data": [
    {
      "key": {
        "product": "Jeans",
        "price_range": 40
      },
      "doc_count": 1
    },
    {
      "key": {
        "product": "Sneakers",
        "price_range": 70
      },
      "doc_count": 1
    },
    {
      "key": {
        "product": "T-Shirt",
        "price_range": 10
      },
      "doc_count": 1
    }
  ]
}
```
Each composite bucket will contain the product name and the corresponding price range, allowing you to analyze the distribution of products across different price ranges.

---

## Example: Mixing date histogram and geotile grid value source

The following example combines the `date_histogram` and `geotile_grid` value sources to create composite buckets based on timestamps and geographic locations:

```json
GET /test_index/_search
{
  "size": 0,
  "aggs": {
    "my_buckets": {
      "composite": {
        "sources": [
          { "date": { "date_histogram": { "field": "timestamp", "calendar_interval": "1d" } } },
          { "location": { "geotile_grid": { "field": "location", "precision": 3 } } }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

This query defines two value sources:

- `date`: This source uses the `date_histogram` value source to group documents based on the day of the `timestamp` field.
- `location`: This source uses the `geotile_grid` value source to aggregate `geo_point` data into buckets that correspond to cells in a grid, with a precision of `3`.

The resulting composite buckets will have a structure similar to the following example: 

```json
{
  "took": 34,
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
    "my_buckets": {
      "buckets": []
    }
  }
}
```

## Considerations

When mixing value sources in the `composite` aggregation, keep the following point in mind: 

- <SME: What are the considerations? Please list them here.>