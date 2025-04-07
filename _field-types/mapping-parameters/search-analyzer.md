---
layout: default
title: Search analyzer
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 160
has_children: false
has_toc: false
---

# Search analyzer

The `search_analyzer` mapping parameter specifies the analyzer to be used at **search time** for a text field. This allows the analyzer used for indexing (`analyzer`) to differ from the one used for searching (`search_analyzer`), offering greater control over how search terms are interpreted and matched.

By default, the same analyzer is used for both indexing and searching. However, using a custom `search_analyzer` can be helpful in cases where you want to apply looser or stricter matching rules during search, such as using [`stemming`]({{site.url}}{{site.baseurl}}/analyzers/stemming/) or removing stopwords only at search time.

## Setting a search analyzer

The following example creates an index named `articles` with a field `title` that uses [`n-gram tokenizer`]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/ngram/) inside custom analyzer for indexing and the [`standard analyzer`]({{site.url}}{{site.baseurl}}/analyzers/supported-analyzers/standard/) for search:

```json
PUT /articles
{
  "settings": {
    "analysis": {
      "analyzer": {
        "edge_ngram_analyzer": {
          "tokenizer": "edge_ngram_tokenizer",
          "filter": ["lowercase"]
        }
      },
      "tokenizer": {
        "edge_ngram_tokenizer": {
          "type": "edge_ngram",
          "min_gram": 2,
          "max_gram": 10,
          "token_chars": ["letter", "digit"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "edge_ngram_analyzer",
        "search_analyzer": "standard"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Indexing a document

Use the following command to index a document with a full phrase in the title field. The edge n-gram analyzer will store terms like "se", "sea", "sear", "searc", "search".

```json
PUT /articles/_doc/1
{
  "title": "Search Analyzer in Action"
}
```
{% include copy-curl.html %}

## Querying with the search analyzer

Use the following command to query the title field. The [`standard analyzer`]({{site.url}}{{site.baseurl}}/analyzers/supported-analyzers/standard/) will be used at search time. This ensures that full terms like "search" or "analyzer" can match documents that were indexed using `n-grams`:

```json
POST /articles/_search
{
  "query": {
    "match": {
      "title": "search"
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
        "_index": "articles",
        "_id": "1",
        "_score": 0.2876821,
        "_source": {
          "title": "Search Analyzer in Action"
        }
      }
    ]
  }
}
```

This flexibility allows for better control over how content is indexed compared to how queries are interpreted, improving both precision and recall.