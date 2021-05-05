---
layout: default
title: Endpoint
parent: Piped processing language
nav_order: 1
---

# Endpoint

To send a query request to PPL plugin, use the HTTP POST request.
We recommend a POST request because it doesn't have any length limit and it allows you to pass other parameters to the plugin for other functionality.

Use the explain endpoint for query translation and troubleshooting.

## Request Format

To use the PPL plugin with your own applications, send requests to `_opensearch/_ppl`, with your query in the request body:

```json
curl -H 'Content-Type: application/json' -X POST localhost:9200/_opensearch/_ppl \
... -d '{"query" : "source=accounts | fields firstname, lastname"}'
```
