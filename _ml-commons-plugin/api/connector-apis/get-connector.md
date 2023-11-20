---
layout: default
title: Get connector
parent: Connector APIs
grand_parent: ML Commons API
nav_order: 20
---

# Get a connector

Use the `_search` endpoint to search for a connector.

To retrieve information about a connector, you can:

- [Get a connector by ID](#get-a-connector-by-id)
- [Search for a connector](#search-for-a-connector)

# Get a connector by ID

This API retrieves a connector by its ID.

## Path and HTTP methods

```json
GET /_plugins/_ml/connectors/<connector_id>
```

#### Example request

```json
GET /_plugins/_ml/connectors/N8AE1osB0jLkkocYjz7D
```
{% include copy-curl.html %}

## Search for a connector

This API searches for matching connectors using a query.

## Path and HTTP methods

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

