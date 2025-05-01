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

### Path parameters
`append_to_base_url`: different MCP client has different implementation, e.g. Java MCP client accepts a baseUri when creating the http sse, and the default sse uri is `/sse`, so the full sse url is `baseUri + /sse`, and the message endpoint is: `baseUri + sse.data`. But python client accepts an endpoint as sse endpoint, e.g. `http://localhost:8000/_plugins/_ml/mcp/sse` and concatenate the baseUrl with the `sse.data`, e.g. `http://localhost:8000/sse/message` which is not correct, so python client can pass this parameter with `true` value to fetch a correct uri, e.g. `/_plugins/_ml/mcp/sse/message` to construct the correct message endpoint. The default value is false.

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

#### Example request

```json
GET /_plugins/_ml/mcp/sse?append_to_base_url=true
```
{% include copy-curl.html %}

#### Example response
OpenSearch responses a SSE data stream to client:
```
event: endpoint
data: /_plugins/_ml/mcp/sse/message?sessionId=e2d65bb9-e82e-473a-b050-b69dc67ca9dd
```