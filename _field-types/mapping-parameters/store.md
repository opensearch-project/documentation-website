---
layout: default
title: Store
parent: Mapping parameters

nav_order: 180
has_children: false
has_toc: false
---

# Store

The `store` mapping parameter determines whether the value of a field should be stored separately from the `_source` and made directly retrievable using the `stored_fields` option in a search request.

By default, `store` is set to `false`, meaning that field values are not stored individually and are only available as part of the document `_source`. If `store` is set to `true`, you can disable the `_source` to save disk space and still [retrieve specific fields]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/).

## Example: Enabling `store` on a field

The following request creates an index named `products` in which the `model` field is stored separately from the `_source`:

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

Ingest a document into the index:

```json
PUT /products/_doc/1
{
  "model": "WM-1001",
  "name": "Wireless Mouse"
}
```
{% include copy-curl.html %}

Retrieve only the stored field:

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

This query returns the `model` field stored separately even though the `_source` is still available.

---

## Example: Storing fields with `_source` disabled

If you want to save disk space and don't need to access the full original document later (for example, for reindexing or updates), you can disable `_source` and store only necessary fields:

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

Ingest a document into the index:

```json
PUT /products_no_source/_doc/1
{
  "model": "KB-2002",
  "name": "Mechanical Keyboard"
}
```
{% include copy-curl.html %}

Retrieve the stored field:

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

This query returns the `model` field retrieved from `stored_fields` without accessing the `_source`.

If you attempt to retrieve the `_source` as follows:

```json
GET /products_no_source/_doc/1
```

Then the `_source` in the response will be `null`. This demonstrates that the full document is no longer available and that only stored fields can be retrieved because `_source` is disabled:

```json
{
  "_index": "products_no_source",
  "_id": "1",
  "found": true,
  "_source": null
}
```
