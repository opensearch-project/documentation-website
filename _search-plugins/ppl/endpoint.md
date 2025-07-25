---
layout: default
title: Endpoint
parent: Piped processing language
nav_order: 1
canonical_url: https://docs.opensearch.org/latest/search-plugins/sql/sql-ppl-api/
---

# Endpoint
Introduced 1.0
{: .label .label-purple }

To send a query request to PPL plugin, use the HTTP POST request.
We recommend a POST request because it doesn't have any length limit and it allows you to pass other parameters to the plugin for other functionality.

Use the `_explain` endpoint for query translation and troubleshooting.

## Request Format

To use the PPL plugin with your own applications, send requests to `_plugins/_ppl`, with your query in the request body:

```json
curl -H 'Content-Type: application/json' -X POST localhost:9200/_plugins/_ppl \
... -d '{"query" : "source=accounts | fields firstname, lastname"}'
```
