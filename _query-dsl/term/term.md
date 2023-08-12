---
layout: default
title: Term
parent: Term-level queries
grand_parent: Query DSL
nav_order: 70
---

# Term query

Use the `term` query to search for an exact term in a field.

```json
GET shakespeare/_search
{
  "query": {
    "term": {
      "line_id": {
        "value": "61809"
      }
    }
  }
}
```
{% include copy-curl.html %}