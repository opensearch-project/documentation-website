---
layout: default
title: Index
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 60
has_children: false
has_toc: false
---

# Index

The `index` mapping parameter controls whether a field is searchable by including it in the inverted index. When set to `true`, the field is indexed and available for queries. When set to `false`, the field is stored in the document but not indexed, making it non-searchable. Disabling indexing for a field can reduce index size and improve indexing performance when you do not need to search that field. For example, you can disable indexing on large text fields or metadata that is only used for display.

By default, all field types are indexed.

## Enabling indexing on a field

The following request creates an index named `products` with a `description` field that is indexed (the default behavior):

```json
PUT /products
{
  "mappings": {
    "properties": {
      "description": {
        "type": "text",
        "index": true
      }
    }
  }
}
```
{% include copy-curl.html %}

You can index a document using the following command:

```json
PUT /products/_doc/1
{
  "description": "This product has a searchable description."
}
```
{% include copy-curl.html %}

Execute the following command to query the description field:

```json
POST /products/_search
{
  "query": {
    "match": {
      "description": "searchable"
    }
  }
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
        "_source": {
          "description": "This product has a searchable description."
        }
      }
    ]
  }
}
```

## Disabling indexing on a field

Execute the following command to create an index named `products-no-index` with a `description` field that is not indexed:

```json
PUT /products-no-index
{
  "mappings": {
    "properties": {
      "description": {
        "type": "text",
        "index": false
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document using the following command:

```json
PUT /products-no-index/_doc/1
{
  "description": "This product has a non-searchable description."
}
```
{% include copy-curl.html %}

Execute the following command to query `products-no-index` using the `description` field:

```json
POST /products-no-index/_search
{
  "query": {
    "match": {
      "description": "non-searchable"
    }
  }
}
```
{% include copy-curl.html %}

Expected result:

```json
{
  "error": {
    "root_cause": [
      {
        "type": "query_shard_exception",
        "reason": "failed to create query: Cannot search on field [description] since it is not indexed.",
        "index": "products-no-index",
        "index_uuid": "yX2F4En1RqOBbf3YWihGCQ"
      }
    ],
    "type": "search_phase_execution_exception",
    "reason": "all shards failed",
    "phase": "query",
    "grouped": true,
    "failed_shards": [
      {
        "shard": 0,
        "index": "products-no-index",
        "node": "0tmy2tf7TKW8qCmya9sG2g",
        "reason": {
          "type": "query_shard_exception",
          "reason": "failed to create query: Cannot search on field [description] since it is not indexed.",
          "index": "products-no-index",
          "index_uuid": "yX2F4En1RqOBbf3YWihGCQ",
          "caused_by": {
            "type": "illegal_argument_exception",
            "reason": "Cannot search on field [description] since it is not indexed."
          }
        }
      }
    ]
  },
  "status": 400
}
```
