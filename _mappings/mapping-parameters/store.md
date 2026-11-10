---
layout: default
title: Store
parent: Mapping parameters
redirect_from:
  - /field-types/mapping-parameters/store/
nav_order: 260
has_children: false
has_toc: false
---

# Store mapping parameter

The `store` mapping parameter determines whether the value of a field should be stored separately from the `_source` and made directly retrievable using the `stored_fields` option in a search request.

By default, `store` is set to `false`, meaning that field values are not stored individually and are only available as part of the document `_source`. If `store` is set to `true`, you can disable the `_source` to save disk space and still [retrieve specific fields]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/).

In most cases, you do not need to store fields. To return only some fields of a document, use [source filtering]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#using-source-filtering), which extracts the requested fields from `_source`. Storing a field is useful in the following cases:

- Documents contain a very large field, such as the full text of an article, and searches return only a few small fields, such as the title and publication date. Reading stored fields avoids loading and parsing the large `_source` for every hit.
- The `_source` field is disabled, and you need to retrieve some field values.
- A field does not appear in `_source`, such as a field populated by [`copy_to`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/copy-to/).

OpenSearch returns stored field values in the `fields` object of each hit. Values are always returned as arrays, even if the original document contains a single value, because stored fields do not record whether the original value was a single value or an array. To get values in their original form, retrieve them from `_source`.

You cannot change the `store` setting of an existing field.

## Example: Enabling store on a field

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
PUT /products/_doc/1?refresh=true
{
  "model": "WM-1001",
  "name": "Wireless Mouse"
}
```
{% include copy-curl.html %}

Retrieve only the stored field:

```json
GET /products/_search
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

The response contains the `model` value in the `fields` object. When you specify `stored_fields`, OpenSearch does not return `_source` unless you also set `"_source": true` in the request. Fields that are not stored, such as `name`, are not returned if you request them in `stored_fields`:

```json
{
  "took": 6,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.13076457,
    "hits": [
      {
        "_index": "products",
        "_id": "1",
        "_score": 0.13076457,
        "fields": {
          "model": [
            "WM-1001"
          ]
        }
      }
    ]
  }
}
```

## Example: Storing fields in an index without source

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
PUT /products_no_source/_doc/1?refresh=true
{
  "model": "KB-2002",
  "name": "Mechanical Keyboard"
}
```
{% include copy-curl.html %}

Retrieve the stored field:

```json
GET /products_no_source/_search
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

The response contains the stored `model` value even though the index does not store `_source`:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.13076457,
    "hits": [
      {
        "_index": "products_no_source",
        "_id": "1",
        "_score": 0.13076457,
        "fields": {
          "model": [
            "KB-2002"
          ]
        }
      }
    ]
  }
}
```

Retrieve the document using the Get Document API:

```json
GET /products_no_source/_doc/1
```
{% include copy-curl.html %}

The response does not contain `_source` because `_source` is disabled for the index:

```json
{
  "_index": "products_no_source",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true
}
```

## Example: Storing a copied field

Fields populated by `copy_to` are indexed but are not added to `_source`. To retrieve their values, store them. The following request creates an index in which the `first_name` and `last_name` fields are copied to a stored `full_name` field:

```json
PUT /store-copy-to
{
  "mappings": {
    "properties": {
      "first_name": {
        "type": "text",
        "copy_to": "full_name"
      },
      "last_name": {
        "type": "text",
        "copy_to": "full_name"
      },
      "full_name": {
        "type": "text",
        "store": true
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document into the index:

```json
PUT /store-copy-to/_doc/1?refresh=true
{
  "first_name": "Ana",
  "last_name": "Rivera"
}
```
{% include copy-curl.html %}

Retrieve the stored `full_name` field:

```json
GET /store-copy-to/_search
{
  "stored_fields": ["full_name"]
}
```
{% include copy-curl.html %}

The `full_name` field contains both copied values:

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
        "_index": "store-copy-to",
        "_id": "1",
        "_score": 1,
        "fields": {
          "full_name": [
            "Ana",
            "Rivera"
          ]
        }
      }
    ]
  }
}
```
