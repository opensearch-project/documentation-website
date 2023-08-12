---
layout: default
title: IDs
parent: Term-level queries
grand_parent: Query DSL
nav_order: 30
---

# IDs query

Use the `ids` query to search for one or more document ID values.

```json
GET shakespeare/_search
{
  "query": {
    "ids": {
      "values": [
        34229,
        91296
      ]
    }
  }
}
```
{% include copy-curl.html %}