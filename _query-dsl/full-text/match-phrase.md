---
layout: default
title: Match phrase
parent: Full-text queries
grand_parent: Query DSL
nav_order: 30
---

# Match phrase queries

Use the `match_phrase` query to match documents that contain an exact phrase in a specified order. You can add flexibility to phrase matching by providing the `slop` parameter.

Creates a [phrase query](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/PhraseQuery.html) that matches a sequence of terms.

```json
GET _search
{
  "query": {
    "match_phrase": {
      "title": "the wind rises"
    }
  }
}
```
{% include copy-curl.html %}

The query accepts the following options. For descriptions of each, see [Advanced filter options](#advanced-filter-options).

```json
GET _search
{
  "query": {
    "match_phrase": {
      "title": {
        "query": "wind rises the",
        "slop": 3,
        "analyzer": "standard",
        "zero_terms_query": "none"
      }
    }
  }
}
```