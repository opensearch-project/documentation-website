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

By default, `store` is set to `false`, meaning field values are not stored individually and are only available as part of the `_source` document. If `store` is set to `true`, you can disable the `_source` to save disk space and still retrieve specific fields.

## Example: Enabling store on a field

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

### Indexing a document

```json
PUT /products/_doc/1
{
  "model": "WM-1001",
  "name": "Wireless Mouse"
}
```
{% include copy-curl.html %}

### Retrieving only the stored field

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

This returns the `model` field stored separately, even though `_source` is still available.

---

## Example: Storing fields with `_source` disabled

If you want to save disk space and don't need the full original document later (e.g., for reindexing or updates), you can disable `_source` and store only necessary fields:

```json
PUT /products_no_source
{
  "mappings": {
    "_source": {
      "enabled": false
    },
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

### Indexing a document

```json
PUT /products_no_source/_doc/1
{
  "model": "KB-2002",
  "name": "Mechanical Keyboard"
}
```
{% include copy-curl.html %}

### Retrieving the stored field

```json
POST /products_no_source/_search
{
  "query": {
    "match": {
      "name": "Keyboard"
    }
  },
  "stored_fields": ["model"]
}
```
{% include copy-curl.html %}

This shows the `model` field retrieved from stored fields without accessing `_source`.

### Attempting to retrieve the `_source`

```json
GET /products_no_source/_doc/1
```

Since `_source` is disabled, the response demonstrates that the full document is no longer available and only stored fields can be retrieved:

```json
{
  "_index": "products_no_source",
  "_id": "1",
  "found": true,
  "_source": null
}
```
