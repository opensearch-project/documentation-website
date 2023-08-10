---
layout: default
title: Simple query string
parent: Full-text queries
grand_parent: Query DSL
nav_order: 70
---

# Simple query string queries

Use the `simple_query_string` type to specify directly in the query string multiple arguments delineated by regular expressions. Searches with this type will discard any invalid portions of the string.

```json
GET _search
{
  "query": {
    "simple_query_string": {
      "query": "\"rises wind the\"~4 | *ising~2",
      "fields": ["title"]
    }
  }
}
```

Special character | Behavior
:--- | :---
`+` | Acts as the `and` operator.
`|` | Acts as the `or` operator.
`*` | Acts as a wildcard.
`""` | Wraps several terms into a phrase.
`()` | Wraps a clause for precedence.
`~n` | When used after a term (for example, `wnid~3`), sets `fuzziness`. When used after a phrase, sets `slop`. [Advanced filter options](#advanced-filter-options).
`-` | Negates the term.

The query accepts the following options. For descriptions of each, see [Advanced filter options](#advanced-filter-options).

```json
GET _search
{
  "query": {
    "simple_query_string": {
      "query": "\"rises wind the\"~4 | *ising~2",
      "fields": ["title"],
      "flags": "ALL",
      "fuzzy_transpositions": true,
      "fuzzy_max_expansions": 50,
      "fuzzy_prefix_length": 0,
      "minimum_should_match": 1,
      "default_operator": "or",
      "analyzer": "standard",
      "lenient": false,
      "quote_field_suffix": "",
      "analyze_wildcard": false,
      "auto_generate_synonyms_phrase_query": true
    }
  }
}
```
