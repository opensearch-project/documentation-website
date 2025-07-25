---
layout: default
title: Protocol
parent: Piped processing language
nav_order: 2
canonical_url: https://docs.opensearch.org/latest/search-plugins/sql/response-formats/
---

# Protocol

The PPL plugin provides responses in JDBC format. The JDBC format is widely used because it provides schema information and more functionality such as pagination. Besides JDBC driver, various clients can benefit from the detailed and well formatted response.

## Response Format

The body of HTTP POST request can take a few more additional fields with the PPL query:

```json
curl -H 'Content-Type: application/json' -X POST localhost:9200/_plugins/_ppl \
... -d '{"query" : "source=accounts | fields firstname, lastname"}'
```

The following example shows a normal response where the schema includes a field name and its type and datarows includes the result set:

```json
{
  "schema": [
    {
      "name": "firstname",
      "type": "string"
    },
    {
      "name": "lastname",
      "type": "string"
    }
  ],
  "datarows": [
    [
      "Amber",
      "Duke"
    ],
    [
      "Hattie",
      "Bond"
    ],
    [
      "Nanette",
      "Bates"
    ],
    [
      "Dale",
      "Adams"
    ]
  ],
  "total": 4,
  "size": 4
}
```

If any error occurred, error message and the cause will be returned instead:

```json
curl -H 'Content-Type: application/json' -X POST localhost:9200/_plugins/_ppl \
... -d '{"query" : "source=unknown | fields firstname, lastname"}'
{
  "error": {
    "reason": "Error occurred in OpenSearch engine: no such index [unknown]",
    "details": "org.opensearch.index.IndexNotFoundException: no such index [unknown]\nFor more details, please send request for Json format to see the raw response from opensearch engine.",
    "type": "IndexNotFoundException"
  },
  "status": 404
}
```
