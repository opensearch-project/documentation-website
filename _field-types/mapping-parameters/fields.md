---
layout: default
title: Fields
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 100
has_children: false
has_toc: false
---

# Fields

The `fields` mapping parameter enables you to index the same field in multiple ways by defining additional sub-fields. With multi-fields, the primary field value is stored using its main mapping, while one or more sub-fields can be configured with alternate mappings, for example different data types or analyzers which support varied search and aggregation requirements.

Multi-fields are especially useful when you need to perform full-text searches on one representation of the data and exact-match operations (like sorting or aggregations) on another. Additionally, you can index the same field with different analyzers. For example, one sub-field might use the default analyzer for general text searches, while another sub-field uses a custom analyzer for generating `n-grams` to support autocomplete or fuzzy matching.

## Configuring multi-fields

In the following example an index named `articles` is created with a `title` field that is analyzed as full text. A sub-field named `raw` is defined under `fields` to store the same value as a `keyword` for exact-match queries:

```json
PUT /articles
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "fields": {
          "raw": {
            "type": "keyword"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Using different analyzers

In the following example the same `title` field is indexed using two different analyzers. The main field uses the default analyzer for full-text search, while the `ngrams` sub-field uses a custom `n-gram` analyzer to support features like autocomplete:

```json
PUT /articles
{
  "settings": {
    "analysis": {
      "analyzer": {
        "ngram_analyzer": {
          "tokenizer": "ngram_tokenizer",
          "filter": [
            "lowercase"
          ]
        }
      },
      "tokenizer": {
        "ngram_tokenizer": {
          "type": "ngram",
          "min_gram": 3,
          "max_gram": 4,
          "token_chars": [
            "letter",
            "digit"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "fields": {
          "raw": {
            "type": "keyword"
          },
          "ngrams": {
            "type": "text",
            "analyzer": "ngram_analyzer"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Indexing a document
After the index is created, you can index documents. The `title` field will be processed as defined by its mapping, and its sub-fields will provide alternate representations of the same value:

```json
PUT /articles/_doc/1
{
  "title": "Understanding Multi-Fields in Search"
}
```
{% include copy-curl.html %}

## Querying multi-fields

You can target the additional sub-fields in queries to suit different requirements. For example, to perform an aggregation on the exact value of the title, query the `title.raw` sub-field using the following command:

```json
POST /articles/_search
{
  "size": 0,
  "aggs": {
    "titles": {
      "terms": {
        "field": "title.raw"
      }
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
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "titles": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "Understanding Multi-Fields in Search",
          "doc_count": 1
        }
      ]
    }
  }
}
```

Alternatively, to utilize the autocomplete functionality, you can run a `match` query on the `title.ngrams` sub-field:

```json
POST /articles/_search
{
  "query": {
    "match": {
      "title.ngrams": "Und"
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
          "title": "Understanding Multi-Fields in Search"
        }
      }
    ]
  }
}
```