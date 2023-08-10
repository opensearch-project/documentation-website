---
layout: default
title: Match
parent: Full-text queries
grand_parent: Query DSL
nav_order: 10
---

# Match queries

Use the `match` query for full-text search of a specific document field. The `match` query analyzes the provided search string and returns documents that match any of the string's terms.

You can use Boolean query operators to combine searches.

The following example shows a basic `match` search for the `title` field set to the value `wind`:

```json
GET _search
{
  "query": {
    "match": {
      "title": "wind"
    }
  }
}
```
{% include copy-curl.html %}

For an example that uses [curl](https://curl.haxx.se/), try:

The query accepts the following options. For descriptions of each, see [Advanced filter options](#advanced-filter-options).

```json
GET _search
{
  "query": {
    "match": {
      "title": {
        "query": "wind",
        "fuzziness": "AUTO",
        "fuzzy_transpositions": true,
        "operator":  "or",
        "minimum_should_match": 1,
        "analyzer": "standard",
        "zero_terms_query": "none",
        "lenient": false,
        "prefix_length": 0,
        "max_expansions": 50,
        "boost": 1
      }
    }
  }
}
```