---
layout: default
title: Normalizer
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 110
has_children: false
has_toc: false
---

# Normalizer

The `normalizer` mapping parameter defines a custom normalization process for keyword fields. Unlike [analyzers]({{site.url}}{{site.baseurl}}/analyzers/supported-analyzers/index/) for text fields, which generate multiple tokens, [normalizers]({{site.url}}{{site.baseurl}}/analyzers/normalizers/) transform the entire field value into a single token using a set of token filters. When you define a normalizer, the keyword field is processed by the specified filters before it is stored while keeping the `_source` of the document unchanged.


## Defining a normalizer

The following request creates an index named `products` with a custom normalizer called `my_normalizer`. The normalizer is applied to the `code` field, which uses the `trim` and `lowercase` filters:

```json
PUT /products
{
  "settings": {
    "analysis": {
      "normalizer": {
        "my_normalizer": {
          "type": "custom",
          "filter": ["trim", "lowercase"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "code": {
        "type": "keyword",
        "normalizer": "my_normalizer"
      }
    }
  }
}
```
{% include copy-curl.html %}

When you ingest a document into the index, the `code` field is normalized by trimming any extra spaces and converting the text to lowercase:

```json
PUT /products/_doc/1
{
  "code": "  ABC-123 EXTRA  "
}
```
{% include copy-curl.html %}

Search for the indexed document using lowercase and trimmed text in the query:

```json
POST /products/_search
{
  "query": {
    "term": {
      "code": "abc-123 extra"
    }
  }
}
```
{% include copy-curl.html %}

Because the `code` field is normalized, the `term` query successfully matches the stored document:

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
          "code": "  ABC-123 EXTRA  "
        }
      }
    ]
  }
}
```
