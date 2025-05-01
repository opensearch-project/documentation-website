---
layout: default
title: SSE Session
parent: Agent APIs
grand_parent: ML Commons APIs
nav_order: 50
---

# SSE Session
**Introduced 3.0**
{: .label .label-purple }

This is the standard sse sessoin creation API of MCP protocol, you can use this API to create a SSE session between client and MCP server in OpenSearch. Usually you don't need to explicitly interact with this API if you're using standard MCP client. You can checkout the example client here: https://github.com/zane-neo/opensearch-mcpserver-test-example

## Endpoints

```json
GET /_plugins/_ml/mcp/sse
```

#### Example request

```json
GET /_plugins/_ml/mcp/sse
```
{% include copy-curl.html %}

#### Example response
OpenSearch responses a SSE data stream to client:
```
event: endpoint
data: /sse/message?sessionId=e2d65bb9-e82e-473a-b050-b69dc67ca9dd
```