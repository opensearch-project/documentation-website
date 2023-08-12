---
layout: default
title: Regexp
parent: Term-level queries
grand_parent: Query DSL
nav_order: 60
---

# Regexp query

Use the `regexp` query to search for terms that match a regular expression.

This regular expression matches any single uppercase or lowercase letter:

```json
GET shakespeare/_search
{
  "query": {
    "regexp": {
      "play_name": "[a-zA-Z]amlet"
    }
  }
}
```
{% include copy-curl.html %}

A few important notes:

- Regular expressions are applied to the terms in the field (i.e. tokens), not the entire field.
- Regular expressions use the Lucene syntax, which differs from more standardized implementations. Test thoroughly to ensure that you receive the results you expect. To learn more, see [the Lucene documentation](https://lucene.apache.org/core/8_9_0/core/index.html).
- `regexp` queries can be expensive operations and require the `search.allow_expensive_queries` setting to be set to `true`. Before making frequent `regexp` queries, test their impact on cluster performance and examine alternative queries for achieving similar results.
