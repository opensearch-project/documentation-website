---
layout: default
title: Wildcard
parent: Term-level queries
grand_parent: Query DSL
nav_order: 100
---

# Wildcard query

Use wildcard queries to search for terms that match a wildcard pattern.

Feature | Behavior
:--- | :---
`*` | Specifies all valid values.
`?` | Specifies a single valid value.

To search for terms that start with `H` and end with `Y`:

```json
GET shakespeare/_search
{
  "query": {
    "wildcard": {
      "speaker": {
        "value": "H*Y"
      }
    }
  }
}
```
{% include copy-curl.html %}

If we change `*` to `?`, we get no matches, because `?` refers to a single character.

Wildcard queries tend to be slow because they need to iterate over a lot of terms. Avoid placing wildcard characters at the beginning of a query because it could be a very expensive operation in terms of both resources and time.