---
layout: default
title: Search for a connector
parent: Connector APIs
grand_parent: ML Commons API
nav_order: 20
---

# Search for a connector

Use the `_search` endpoint to search for a connector.

## Path and HTTP method

```json
POST /_plugins/_ml/connectors/_search
GET /_plugins/_ml/connectors/_search
```

#### Example request

```json
POST /_plugins/_ml/connectors/_search
{
  "query": {
    "match_all": {}
  },
  "size": 1000
}
```
{% include copy-curl.html %}

