---
layout: default
title: Filter search results
nav_order: 36
---

# Filter search results

You can filter search using different methods, each suited to specific scenarios. You can apply filters at the query level, using `boolean` query clauses, as well as by using `post_filter` and `aggregation` level filters.

## Query-level filtering with boolean queries
Use a `boolean` query with a filter clause to apply filters to both search hits and aggregations. For example, if a shopper searches for "smartphones" from BrandA, a Boolean query can restrict results to only those smartphones from BrandA.

Create an index `electronics` and provide the mapping:

```
PUT /electronics
{
  "mappings": {
    "properties": {
      "brand": { "type": "keyword" },
      "category": { "type": "keyword" },
      "price": { "type": "float" },
      "features": { "type": "keyword" }
    }
  }
}
```

Add documents to the `electronics` index:

```
PUT /electronics/_doc/1?refresh
{
  "brand": "BrandA",
  "category": "Smartphone",
  "price": 699.99,
  "features": ["5G", "Dual Camera"]
}
PUT /electronics/_doc/2?refresh
{
  "brand": "BrandA",
  "category": "Laptop",
  "price": 1199.99,
  "features": ["Touchscreen", "16GB RAM"]
}
PUT /electronics/_doc/3?refresh
{
  "brand": "BrandB",
  "category": "Smartphone",
  "price": 799.99,
  "features": ["5G", "Triple Camera"]
}
```

Apply a `boolean` filter query to display only `smartphones` from `BrandA`:

```
GET /electronics/_search
{
  "query": {
    "bool": {
      "filter": [
        { "term": { "brand": "BrandA" }},
        { "term": { "category": "Smartphone" }}
      ]
    }
  }
}
```

## Using `post-filter` to narrow results without affecting aggregations

Use `post_filter` to limit search hits, while maintaining all aggregation options. For example, if a shopper selects `BrandA`, you can filter results to show only `BrandA` products while keeping all brands visible in the aggregation.

```
GET /electronics/_search
{
  "query": {
    "bool": {
      "filter": { "term": { "category": "Smartphone" }}
    }
  },
  "aggs": {
    "brands": {
      "terms": { "field": "brand" }
    }
  },
  "post_filter": {
    "term": { "brand": "BrandA" }
  }
}
```
This shows `BrandA` smartphones in the search hits while still displaying all brands in the aggregations.

## Aggregation-level filtering to refine aggregations
We can use aggregation-level filtering to apply filters to specific aggregations, without affecting the overall aggregation.

Use aggregation-level filtering to filter the `price_ranges` aggregation based on selected brands, `BrandA` and `BrandB`, without affecting the main `price_ranges` aggregation. This allows you to display price ranges relevant to the selected brands while still showing overall price ranges for all products.

```
GET /electronics/_search
{
  "query": {
    "bool": {
      "filter": { "term": { "category": "Smartphone" }}
    }
  },
  "aggs": {
    "price_ranges": {
      "range": {
        "field": "price",
        "ranges": [
          { "to": 500 },
          { "from": 500, "to": 1000 },
          { "from": 1000 }
        ]
      }
    },
    "filtered_brands": {
      "filter": {
        "terms": { "brand": ["BrandA", "BrandB"] }
      },
      "aggs": {
        "price_ranges": {
          "range": {
            "field": "price",
            "ranges": [
              { "to": 500 },
              { "from": 500, "to": 1000 },
              { "from": 1000 }
            ]
          }
        }
      }
    }
  }
}
```

## Summary of filters used for filtering the search results:
1. Query-level filtering: Apply `boolean` query filter clauses to filter both search hits and aggregations, such as narrowing results to specific categories or brands.
2. Post-filtering: Use `post_filter` to refine search hits based on user selections, while keeping all aggregation options, like brands, visible and unaffected.
3. Aggregation-level filtering: Adjust specific aggregations, like price ranges, based on selected filters without impacting other aggregations, such as the brand list.

