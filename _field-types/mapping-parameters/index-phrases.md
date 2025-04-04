---
layout: default
title: Index phrases
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 80
has_children: false
has_toc: false
---

# Index phrases

The `index_phrases` mapping parameter determines whether a field’s text is additionally processed to generate phrase tokens. When enabled, the system creates extra tokens that represent consecutive word sequences. This can significantly improve the performance and accuracy of phrase queries. However, it also increases the index size and the time needed to index documents.

By default, `index_phrases` is set to `false`, to maintain a leaner index and faster document ingestion.

## Enabling index phrases on a field

The following example creates an index named `blog` where the `content` field is configured with `index_phrases`:

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


Index a document using the following command:

```json
PUT /blog/_doc/1
{
  "content": "The quick brown fox jumps over the lazy dog."
}
```
{% include copy-curl.html %}

Perform a `match_phrase` query using the following search request:

```json
POST /blog/_search
{
  "query": {
    "match_phrase": {
      "content": "quick brown fox"
    }
  }
}
```
{% include copy-curl.html %}

Expected result:

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
          "content": "The quick brown fox jumps over the lazy dog."
        }
      }
    ]
  }
}
```
