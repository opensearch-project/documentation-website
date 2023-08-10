---
layout: default
title: Match phrase prefix
parent: Full-text queries
grand_parent: Query DSL
nav_order: 40
---

# Match phrase prefix queries

Use the `match_phrase_prefix` query to specify a phrase to match in order. The documents that contain the phrase you specify will be returned. The last partial term in the phrase is interpreted as a prefix, so any documents that contain phrases that begin with the phrase and prefix of the last term will be returned.

Similar to [match phrase](#match-phrase), but creates a [prefix query](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/PrefixQuery.html) out of the last term in the query string.

```json
GET _search
{
  "query": {
    "match_phrase_prefix": {
      "title": "the wind ri"
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
    "match_phrase_prefix": {
      "title": {
        "query": "the wind ri",
        "analyzer": "standard",
        "max_expansions": 50,
        "slop": 3
      }
    }
  }
}
```
