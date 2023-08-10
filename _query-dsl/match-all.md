---
layout: default
title: Match all queries
nav_order: 65
---

# Match all queries

The `match_all` query returns all documents. This query can be useful in testing large document sets if you need to return the entire set.

```json
GET _search
{
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

The `match_all` query has a `match_none` counterpart, which is rarely useful:

```json
GET _search
{
  "query": {
    "match_none": {}
  }
}
```
{% include copy-curl.html %}