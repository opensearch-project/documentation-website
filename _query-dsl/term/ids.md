---
layout: default
title: IDs
parent: Term-level queries
grand_parent: Query DSL
nav_order: 30
---

# IDs query

Use the `ids` query to search for documents with one or more specific document ID values in the `_id` field. For example, the following query requests documents with the IDs `34229` and `91296`:

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

## Parameters

The query accepts the following parameter.

Parameter | Data type | Description
:--- | :--- | :---
`values` | Array of strings | The document IDs to search for. Required.
