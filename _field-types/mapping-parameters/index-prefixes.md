---
layout: default
title: Index prefixes
parent: Mapping parameters

nav_order: 90
has_children: false
has_toc: false
canonical_url: https://docs.opensearch.org/latest/field-types/mapping-parameters/index-prefixes/
---

# Index prefixes

The `index_prefixes` mapping parameter instructs the engine to generate additional index entries for the beginning segments of terms in a text field. When enabled, it builds a prefix index based on configurable minimum and maximum character lengths. This can significantly improve the performance of [prefix queries]({{site.url}}{{site.baseurl}}/query-dsl/term/prefix/), such as [autocomplete]({{site.url}}{{site.baseurl}}/opensearch/search/autocomplete/) or [search as you type]({{site.url}}{{site.baseurl}}/opensearch/search/autocomplete/#search-as-you-type), by allowing these queries to quickly match the pre-indexed term prefixes.

By default, prefix indexing is not performed, maintaining minimal index size and fast indexing operations. However, if your application benefits from rapid prefix matching, enabling this parameter can provide a marked improvement in query efficiency.

## Index prefixes configuration

You can pass the following configuration parameters to the `index_prefixes` mapping parameter:

- `min_chars`: The minimum length of the prefix that needs to be indexed. Minimum is `0`. Default is `2`.
- `max_chars`: The maximum length of the prefix that needs to be indexed. Maximum is `20`. Default is `5`.

## Enabling index prefixes on a field

The following request creates an index named `products` with the `name` field configured to build a prefix index with a length of between `2` and `10` characters:

```json
PUT /products
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text",
        "index_prefixes": {
          "min_chars": 2,
          "max_chars": 10
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document using the following request:

```json
PUT /products/_doc/1
{
  "name": "Ultra HD Television"
}
```
{% include copy-curl.html %}

The following search request shows a prefix query that searches for documents in which the `name` field starts with `ul`:

```json
POST /products/_search
{
  "query": {
    "prefix": {
      "name": "ul"
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching document:

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
          "name": "Ultra HD Television"
        }
      }
    ]
  }
}
```

## Using default parameters with index prefixes

The following request creates an index named `products_default` using `index_prefixes` with the default parameters:

```json
PUT /products_default
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text",
        "index_prefixes": {}
      }
    }
  }
}
```
{% include copy-curl.html %}
