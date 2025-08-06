---
layout: default
title: Index options
parent: Mapping parameters

nav_order: 70
has_children: false
has_toc: false
---

# Index options

The `index_options` mapping parameter controls the level of detail stored in the inverted index for text fields. This setting directly influences both the index size and the capabilities available for scoring, phrase matching, and highlighting.

The `index_options` parameter has the following valid values.

| Value     | Stores                          | Description |
|------------|----------------------------------|-------------|
| `docs`     | Document IDs only               | Indexes only the existence of a term in a set of documents. Does not store frequency or position. Minimizes index size; suitable for simple existence checks. |
| `freqs`    | Document IDs + term frequency   | Adds term frequency information. Useful for improved relevance scoring but does not support phrase or proximity queries. |
| `positions`| Document IDs + term frequency + term positions | Includes term order and location in the document. Required for phrase queries and proximity searches. |
| `offsets`  | Document IDs + term frequency + term positions + offsets | Most detailed. Adds character offsets for matched terms. Useful for highlighting but increases storage size. |

By default, text fields are indexed with the `positions` option, balancing functionality and index size.

## Example: Setting index_options on a field

Create an index named `products` with a `description` field that uses the `positions` setting for `index_options`:

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

Index a document with content in the `description` field:

```json
PUT /products/_doc/1
{
  "description": "This is a sample product description with several terms."
}
```
{% include copy-curl.html %}

Run a phrase query against the `description` field:

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

The phrase query successfully matches the document, demonstrating how the `positions` setting in `index_options` enables accurate phrase matching within the `description` field:

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
