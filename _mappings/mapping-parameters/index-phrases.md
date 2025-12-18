---
layout: default
title: Index phrases
parent: Mapping parameters
redirect_from:
  - /field-types/mapping-parameters/index-phrases/
nav_order: 160
has_children: false
has_toc: false
canonical_url: https://docs.opensearch.org/latest/mappings/mapping-parameters/index-phrases/
---

# Index phrases

The `index_phrases` mapping parameter determines whether a field's text is additionally processed to generate phrase tokens. When enabled, the system creates extra tokens representing sequences of exactly two consecutive words (_bigrams_). This can significantly improve the performance and accuracy of phrase queries. However, it also increases the index size and the time needed to index documents.

By default, `index_phrases` is set to `false` to maintain a leaner index and faster document ingestion.

## Enabling index phrases on a field

The following example creates an index named `blog` in which the `content` field is configured with `index_phrases`:

```json
PUT /blog
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "index_phrases": true
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document using the following request:

```json
PUT /blog/_doc/1
{
  "content": "The slow green turtle swims past the whale"
}
```
{% include copy-curl.html %}

Perform a `match_phrase` query using the following search request:

```json
POST /blog/_search
{
  "query": {
    "match_phrase": {
      "content": "slow green"
    }
  }
}
```
{% include copy-curl.html %}

The query returns the stored document:

```json
{
  "took": 25,
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
    "max_score": 0.5753642,
    "hits": [
      {
        "_index": "blog",
        "_id": "1",
        "_score": 0.5753642,
        "_source": {
          "content": "The slow green turtle swims past the whale"
        }
      }
    ]
  }
}
```

Although the same hit is returned when you don't provide the `index_phrases` mapping parameter, using this parameter ensures that the query performs as follows:

- Uses the `.index_phrases` field internally
- Matches pre-tokenized bigrams such as "slow green", "green turtle", or "turtle swims".
- Bypasses position lookups and is faster, especially at scale.