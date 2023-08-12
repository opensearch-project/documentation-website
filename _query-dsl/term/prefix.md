---
layout: default
title: Prefix
parent: Term-level queries
grand_parent: Query DSL
nav_order: 40
---

# Prefix query

Use the `prefix` query to search for terms that begin with a specific prefix.

```json
GET shakespeare/_search
{
  "query": {
    "prefix": {
      "speaker": "KING"
    }
  }
}
```
{% include copy-curl.html %}