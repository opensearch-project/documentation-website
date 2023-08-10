---
layout: default
title: Match Boolean prefix
parent: Full-text queries
grand_parent: Query DSL
nav_order: 20
---

# Match Boolean prefix queries

The `match_bool_prefix` query analyzes the provided search string and creates a `bool` query from the string's terms. It uses every term except the last term as a whole word for matching. The last term is used as a prefix. The `match_bool_prefix` query returns documents that contain either the whole-word terms or terms that start with the prefix term, in any order.

```json
GET _search
{
  "query": {
    "match_bool_prefix": {
      "title": "rises wi"
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
    "match_bool_prefix": {
      "title": {
        "query": "rises wi",
        "fuzziness": "AUTO",
        "fuzzy_transpositions": true,
        "max_expansions": 50,
        "prefix_length": 0,
        "operator":  "or",
        "minimum_should_match": 2,
        "analyzer": "standard"
      }
    }
  }
}
```

For more reference information about prefix queries, see the [Lucene documentation](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/PrefixQuery.html).