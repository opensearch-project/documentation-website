---
layout: default
title: Faceted search
nav_order: 5
---

# Faceted search in OpenSearch

Faceted search helps users filter results based on shared values in specific fields like color, size, price, or category. When running a search, facets display counts for each value or range, helping users understand result distribution and quickly narrow down their options. Common in e-commerce and location-based search, facets can be implemented using terms aggregations for exact values (like colors or sizes) and range aggregations for continuous values (like prices, dates, or distances).

Faceted search helps users filter results based on shared values, making it easier to explore data. They're especially useful for e-commerce and location-based search. For example, if you're building an e-commerce store, facets give users tools to quickly filter results by color or size. Use `terms` aggregations for exact values, and `range` aggregations for numbers, dates, and geo distances. Combine facets with filtered or full-text search to give users even more control over their search experience.

This tutorial shows you how to implement faceted search in OpenSearch using a product catalog for an e-commerce website as an example.

## Step 1: Define index mapping

Start by defining the fields you'll use for faceting. The mapping configuration is crucial for effective faceted search. This example uses multi-fields for enhanced search capabilities. The `color` field is defined as both a `keyword` for exact matching and faceting, and as an analyzed text field (`color.analyzed`) for fuzzy text searches. This dual configuration allows matching "burgundy" when searching for "red", while maintaining precise facet counts. Even if text analysis isn't needed initially, having the analyzed field prevents future reindexing if requirements change:

```json
PUT /products
{
  "settings": {
    "analysis": {
      "analyzer": {
        "standard_lowercase": {
          "tokenizer": "standard",
          "filter": ["lowercase"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "name": {
        "type": "text",
        "analyzer": "standard_lowercase"
      },
      "color": {
        "type": "keyword",
        "fields": {
          "analyzed": {
            "type": "text",
            "analyzer": "standard_lowercase"
          }
        }
      },
      "size": {
        "type": "keyword"
      },
      "price": {
        "type": "float"
      },
      "in_stock": {
        "type": "boolean"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Step 2: Index data

Next, index sample data into your index:

```json
POST /products/_bulk
{ "index": {} }
{ "name": "T-shirt", "color": "red", "size": "M", "price": 19.99 }
{ "index": {} }
{ "name": "T-shirt", "color": "blue", "size": "L", "price": 19.99 }
{ "index": {} }
{ "name": "Jeans", "color": "blue", "size": "M", "price": 49.99 }
{ "index": {} }
{ "name": "Sweater", "color": "red", "size": "L", "price": 39.99 }
```

## Step 3: Run a faceted search

Use the `terms` aggregation to return facet buckets for fields like `color` and `size`. This example demonstrates several key features of faceted search. It uses `multi_match` to search across both the `name` and `color.analyzed` fields using the multi-field mapping. The `and` operator ensures that all search terms must match. The `best_fields` type scores documents based on the field with the highest-scoring match. The `aggs` section defines two facets, using a `terms` aggregations on the keyword fields to return facet buckets for the `color` and `size` fields. Notice that while you're searching on `color.analyzed`, you facet on the `color` keyword field to ensure exact value counts:

```json
POST /products/_search
{
  "query": {
    "multi_match": {
      "query": "T-shirt",
      "fields": ["name", "color.analyzed"],
      "operator": "and",
      "type": "best_fields"
    }
  },
  "aggs": {
    "color_facet": {
      "terms": {
        "field": "color"
      }
    },
    "size_facet": {
      "terms": {
        "field": "size"
      }
    }
  }
}
```
{% include copy-curl.html %}

### Multi match behavior

By default, the `multi_match` query uses the `or` operator and the `best_fields` type. That means documents are scored based on the field with the best match. If you want all terms to be present across any of the fields, use `operator: "and"`. To get a broader match, switch to `most_fields` or `cross_fields`.

To see how tokens are processed by an analyzer, try the `_analyze` API:

```json
POST /products/_analyze
{
  "text": ["Red T-shirt in Summer"],
  "analyzer": "standard_lowercase"
}
```

## Step 4: Filter by facet values

To narrow results (e.g., to T-shirts that are blue and size L), add `filter` clauses.

```json
POST /products/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "name": "T-shirt" } }
      ],
      "filter": [
        { "term": { "color": "blue" } },
        { "term": { "size": "L" } }
      ]
    }
  }
}
```

## Value and range facets

Facets don’t stop at just keywords. You can also apply **range facets** to numeric fields like price. For example, you might want to group products by price range. Here's how to define two price ranges: 0–20 (inclusive of 0 and exclusive of 20), and 20–40 (inclusive of 20 and exclusive of 40). date, or geo fields.

Here’s a simplified JSON version of the National Parks demo faceting on a numeric field (`visitors`) and a geo field (`location`).

### Range facet on visitors (numeric field)

```json
"facets": {
  "visitors": [
    {
      "type": "range",
      "ranges": [
        { "from": 1, "to": 150000, "name": "Not busy" },
        { "from": 150000, "to": 500000, "name": "Somewhat busy" },
        { "from": 500000, "name": "Very busy" }
      ]
    }
  ]
}
```

### Range facet on geolocation

```json
"facets": {
  "location": [
    {
      "type": "range",
      "center": "37.386483, -122.083842",
      "unit": "m",
      "ranges": [
        { "from": 0, "to": 100000, "name": "Close" },
        { "from": 100000, "to": 300000, "name": "A weekend trip" },
        { "from": 300000, "name": "Far from home" }
      ]
    }
  ]
}
```

## Merging search and facets

To return facet counts alongside search results, combine the two. This helps users see only relevant filter counts after searching.

```json
POST /products/_search
{
  "query": {
    "multi_match": {
      "query": "Sweater",
      "fields": ["name", "color.analyzed"],
      "operator": "and",
      "type": "best_fields"
    }
  },
  "aggs": {
    "color_facet": {
      "terms": {
        "field": "color"
      }
    },
    "size_facet": {
      "terms": {
        "field": "size"
      }
    },
    "price_ranges": {
      "range": {
        "field": "price",
        "ranges": [
          { "to": 20 },
          { "from": 20, "to": 40 },
          { "from": 40 }
        ]
      }
    }
  }
}
```

## Next steps

- For more information about OpenSearch aggregations, see [Aggregations]({{site.url}}{{site.baseurl}}/aggregations/).
