---
layout: default
title: Properties
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 150
has_children: false
has_toc: false
---

# Properties

The `properties` mapping parameter is used to define the structure and data types of fields within an object or the root of a document. It acts as the core of any mapping definition, allowing you to explicitly specify field names, types (such as `text`, `keyword`, `date`, or `float`), and additional settings or mapping parameters for each field.

By using `properties`, you gain full control over how your data is indexed and stored, enabling precise search behavior, aggregation support, and data validation.

## Defining fields with properties

The following request creates an index named `products` with a structured mapping using the `properties` parameter. It includes a nested object field called `dimensions` with subfields:

```json
PUT /products
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text"
      },
      "sku": {
        "type": "keyword"
      },
      "price": {
        "type": "float"
      },
      "available": {
        "type": "boolean"
      },
      "created_at": {
        "type": "date",
        "format": "yyyy-MM-dd"
      },
      "dimensions": {
        "type": "object",
        "properties": {
          "width": { "type": "float" },
          "height": { "type": "float" },
          "depth": { "type": "float" }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Indexing a document

Use the following command to index a document with [nested fields]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/nested/):

```json
PUT /products/_doc/1
{
  "name": "Wireless Mouse",
  "sku": "WM-1001",
  "price": 24.99,
  "available": true,
  "created_at": "2024-12-01",
  "dimensions": {
    "width": 6.5,
    "height": 3.2,
    "depth": 1.5
  }
}
```
{% include copy-curl.html %}

## Querying and aggregating using dot notation

You can query or aggregate on object subfields using dot notation. Use the following command to execute a query that:

- Filters documents on the `dimensions.width` field, returning documents in which `width` is between `5` and `10`.
- Creates a [histogram aggregation]({{site.url}}{{site.baseurl}}/aggregations/bucket/histogram/) on the `dimensions.depth` field, creating buckets for products using `depth` intervals of `0.5`.

```json
POST /products/_search
{
  "query": {
    "range": {
      "dimensions.width": {
        "gte": 5,
        "lte": 10
      }
    }
  },
  "aggs": {
    "Depth Distribution": {
      "histogram": {
        "field": "dimensions.depth",
        "interval": 0.5
      }
    }
  }
}
```
{% include copy-curl.html %}

The following response shows a matching document in which the `dimensions.width` field falls within the specified range. It also includes a histogram aggregation result for `dimensions.depth`:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "products",
        "_id": "1",
        "_score": 1,
        "_source": {
          "name": "Wireless Mouse",
          "sku": "WM-1001",
          "price": 24.99,
          "available": true,
          "created_at": "2024-12-01",
          "dimensions": {
            "width": 6.5,
            "height": 3.2,
            "depth": 1.5
          }
        }
      }
    ]
  },
  "aggregations": {
    "Depth Distribution": {
      "buckets": [
        {
          "key": 1.5,
          "doc_count": 1
        }
      ]
    }
  }
}
```
