---
layout: default
title: IDs
parent: Term-level queries
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/query-dsl/term/ids/
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
`boost` | Floating-point | A floating-point value that specifies the weight of this field toward the relevance score. Values above 1.0 increase the field’s relevance. Values between 0.0 and 1.0 decrease the field’s relevance. Default is 1.0.
