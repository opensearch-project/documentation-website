---
layout: default
title: Terms
parent: Term-level queries
grand_parent: Query DSL
nav_order: 80
---

# Terms query

Use the `terms` query to search for multiple terms in the same field.

```json
GET shakespeare/_search
{
  "query": {
    "terms": {
      "line_id": [
        "61809",
        "61810"
      ]
    }
  }
}
```
{% include copy-curl.html %}

You get back documents that match any of the terms.