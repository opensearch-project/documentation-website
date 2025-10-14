---
layout: default
title: Similarity
parent: Mapping parameters

nav_order: 170
has_children: false
has_toc: false
canonical_url: https://docs.opensearch.org/latest/field-types/mapping-parameters/similarity/
---

# Similarity

The `similarity` mapping parameter lets you customize how relevance scores are calculated for a text field during search. It defines the scoring algorithm used to rank matching documents, which directly impacts how results are ordered in search responses.

## Supported similarity types

- `BM25` (default): Uses a modern, probabilistic ranking model that balances term frequency, document length, and inverse document frequency.
- `boolean`: Returns constant scores (`1` or `0`), so should be used if you care only about matching, not relevance.

## Setting a custom similarity on a field

The following request creates an index named `products` with a `title` field that uses the `boolean` similarity, which assigns all matches the same score:

```json
PUT /products
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "similarity": "boolean"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Indexing a document

Use the following command to index a sample document:

```json
PUT /products/_doc/1
{
  "title": "Compact Wireless Mouse"
}
```
{% include copy-curl.html %}

## Querying and inspecting scoring impact

Use the following command to search by the `title` field:

```json
POST /products/_search
{
  "query": {
    "match": {
      "title": "wireless mouse"
    }
  }
}
```
{% include copy-curl.html %}

You can examine the score returned in the `_score` field of the response:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 2,
    "hits": [
      {
        "_index": "products",
        "_id": "1",
        "_score": 2,
        "_source": {
          "title": "Compact Wireless Mouse"
        }
      }
    ]
  }
}
```
