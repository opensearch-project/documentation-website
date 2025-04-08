---
layout: default
title: Store
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 180
has_children: false
has_toc: false
---

# Store

The `store` mapping parameter determines whether the value of a field should be stored separately from the `_source` and made directly retrievable using the `stored_fields` option in a search request.

By default, `store` is set to `false`, therefore field values are not stored individually, they are only available as part of the `_source` document. If `store` is set to `true`, you can exclude the `_source` to save disk space but still fetch certain fields.

## Enabling store on a field

The following request creates an index named `products` where the `model` field is stored separately from the `_source`:

```json
PUT /products
{
  "mappings": {
    "properties": {
      "model": {
        "type": "keyword",
        "store": true
      },
      "name": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Indexing a document

Use the following request to index a sample document:

```json
PUT /products/_doc/1
{
  "model": "WM-1001",
  "name": "Wireless Mouse"
}
```
{% include copy-curl.html %}

## Retrieving only the stored field

To retrieve only the stored `model` field and not the full `_source`, use following command with the `stored_fields` parameter in a search request:

```json
POST /products/_search
{
  "query": {
    "match": {
      "name": "Mouse"
    }
  },
  "stored_fields": ["model"]
}
```
{% include copy-curl.html %}

Expected result:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.2876821,
    "hits": [
      {
        "_index": "products",
        "_id": "1",
        "_score": 0.2876821,
        "fields": {
          "type": [
            "WM-1001"
          ]
        }
      }
    ]
  }
}
```