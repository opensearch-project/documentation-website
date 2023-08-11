---
layout: default
title: Multi-match
parent: Full-text queries
grand_parent: Query DSL
nav_order: 50
---

# Multi-match queries

A multi-match operation functions similarly to the [match]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match/) operation. You can use a `multi_match` query to search multiple fields. 

The `^` lets you "boost" certain fields. Boosts are multipliers that weigh matches in one field more heavily than matches in other fields. In the following example, a match for "wind" in the title field influences `_score` four times as much as a match in the plot field. The result is that films like *The Wind Rises* and *Gone with the Wind* are near the top of the search results, and films like *Twister*, which presumably have "wind" in their plot summaries, are near the bottom.

```json
GET _search
{
  "query": {
    "multi_match": {
      "query": "wind",
      "fields": ["title^4", "plot"]
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
    "multi_match": {
      "query": "wind",
      "fields": ["title^4", "description"],
      "type": "most_fields",
      "operator": "and",
      "minimum_should_match": 3,
      "tie_breaker": 0.0,
      "analyzer": "standard",
      "boost": 1,
      "fuzziness": "AUTO",
      "fuzzy_transpositions": true,
      "lenient": false,
      "prefix_length": 0,
      "max_expansions": 50,
      "auto_generate_synonyms_phrase_query": true,
      "zero_terms_query": "none"
    }
  }
}
```