---
layout: default
title: Index_options
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 70
has_children: false
has_toc: false
---

# index_options

The `index_options` mapping parameter controls the level of detail stored in the inverted index for text fields. This setting directly influences both the index size and the capabilities available for scoring, phrase matching, and highlighting.

Depending on your requirements, you can choose from the following options:

| Option     | Stores                          | Description |
|------------|----------------------------------|-------------|
| `docs`     | Document IDs only               | Indexes only the existence of a term in documents. Does not store frequency or position. Minimizes index size; suitable for simple existence checks. |
| `freqs`    | Document IDs + Term Frequency   | Adds term frequency information. Useful for improved relevance scoring, but does not support phrase or proximity queries. |
| `positions`| Document IDs + Term Frequency + Term Positions | Includes term order and location in the document. Required for phrase queries and proximity searches. |
| `offsets`  | Document IDs + Term Frequency + Term Positions + Offsets | Most detailed. Adds character offsets for matched terms. Useful for highlighting but increases storage size. |


By default, text fields are indexed with the `positions` option, balancing functionality and index size.

## Example: Setting index_options on a field

The following example demonstrates how to create an index named `products` with a `description` field that uses the `positions` setting for `index_options`:

```json
PUT /products
{
  "mappings": {
    "properties": {
      "description": {
        "type": "text",
        "index_options": "positions"
      }
    }
  }
}
```
{% include copy-curl.html %}

You can index a document with content in the description field using the following command:

```json
PUT /products/_doc/1
{
  "description": "This is a sample product description with several terms."
}
```
{% include copy-curl.html %}

You can now run a phrase query against the `description` field sing the following command:

```json
POST /products/_search
{
  "query": {
    "match_phrase": {
      "description": "product description"
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
    "max_score": 0.5753642,
    "hits": [
      {
        "_index": "products",
        "_id": "1",
        "_score": 0.5753642,
        "_source": {
          "description": "This is a sample product description with several terms."
        }
      }
    ]
  }
}
```
