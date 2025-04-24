---
layout: default
title: Search analyzers
nav_order: 30
parent: Analyzers
canonical_url: https://docs.opensearch.org/docs/latest/analyzers/search-analyzers/
---

# Search analyzers

Search analyzers are specified at query time and are used to analyze the query string when you run a full-text query on a [text]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/text/) field.

## Determining which search analyzer to use

To determine which analyzer to use for a query string at query time, OpenSearch examines the following parameters in order:

1. The `analyzer` parameter of the query
1. The `search_analyzer` mapping parameter of the field
1. The `analysis.analyzer.default_search` index setting
1. The `analyzer` mapping parameter of the field
1. The `standard` analyzer (default)

In most cases, specifying a search analyzer that is different from the index analyzer is not necessary and could negatively impact search result relevance or lead to unexpected search results.
{: .warning}

## Specifying a search analyzer at query time

You can override the default analyzer behavior by explicitly setting the analyzer in the query. The following query uses the `english` analyzer to stem the input terms:

```json
GET /shakespeare/_search
{
  "query": {
    "match": {
      "text_entry": {
        "query": "speak the truth",
        "analyzer": "english"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Specifying a search analyzer in the mappings

When defining mappings, you can provide both the `analyzer` (used at index time) and `search_analyzer` (used at query time) for any [`text`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/text/) field.

### Example: Different analyzers for indexing and search

The following configuration allows different tokenization strategies for indexing and querying:

```json
PUT /testindex
{
  "mappings": {
    "properties": {
      "text_entry": {
        "type": "text",
        "analyzer": "simple",
        "search_analyzer": "whitespace"
      }
    }
  }
}
```
{% include copy-curl.html %}

### Example: Using the edge n-gram analyzer for indexing and the standard analyzer for search

The following configuration enables [autocomplete]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/autocomplete/)-like behavior, where you can type the beginning of a word and still receive relevant matches:

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

The `edge_ngram_analyzer` is applied at index time, breaking input strings into partial prefixes (n-grams), which allows the index to store fragments like "se", "sea", "sear", and so on. 
Use the following request to index a document:

```json
PUT /articles/_doc/1
{
  "title": "Search Analyzer in Action"
}
```
{% include copy-curl.html %}

Use the following request to search for the partial word `sear` in the `title` field:

```json
POST /articles/_search
{
  "query": {
    "match": {
      "title": "sear"
    }
  }
}
```
{% include copy-curl.html %}

The response demonstrates that the query containing "sear" matches the document "Search Analyzer in Action" because the n-gram tokens generated at index time include that prefix. This mirrors the [autocomplete functionality]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/autocomplete/), in which typing a prefix can retrieve full matches:

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

## Setting a default search analyzer for an index

Specify `analysis.analyzer.default_search` to define a search analyzer for all fields unless overridden:

```json
PUT /testindex
{
  "settings": {
    "analysis": {
      "analyzer": {
        "default": {
          "type": "simple"
        },
        "default_search": {
          "type": "whitespace"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

This configuration ensures consistent behavior across multiple fields, especially when using custom analyzers.

For more information about supported analyzers, see [Analyzers]({{site.url}}{{site.baseurl}}/analyzers/supported-analyzers/index/).
