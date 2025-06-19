---
layout: default
title: MCP SSE session
parent: MCP server APIs
grand_parent: ML Commons APIs
nav_order: 50
---

# MCP SSE session
**Introduced 3.0**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

The SSE Session API creates a Server-Sent Events (SSE) session between a client and the Model Context Protocol (MCP) server in OpenSearch. The session establishes a persistent connection that allows the server to push updates to the client.

Most users won't need to interact with this API directly when using a standard MCP client library, which handles session management automatically. 

{% comment %} 
For an example client implementation, see the [OpenSearch MCP client reference implementation](https://github.com/zane-neo/opensearch-mcpserver-test-example).
{% endcomment %}

## URL construction methods

The SSE Session API supports two different methods of URL construction to accommodate various client implementations.

### Default URL construction

When `append_to_base_url` is set to `false` (default), the API returns a relative path that clients must append to their base URL.

The Java MCP client accepts a baseURI (for example, `http://localhost:9200`) when creating the HTTP SSE connection. The default SSE URI is `/sse`, so the full SSE URL becomes `baseUri + /sse` and the message endpoint is constructed as `baseUri + sse.data`.

### Complete path URL construction

When `append_to_base_url` is set to `true`, the API returns a complete path that includes the plugin prefix.

The Python MCP client accepts an endpoint as the SSE endpoint (for example, `http://localhost:8000/_plugins/_ml/mcp/sse`) and concatenates it with `sse.data`. Setting `append_to_base_url=true` ensures that the correct message endpoint is constructed as `/_plugins/_ml/mcp/sse/message`.

## Endpoints

```json
GET /_plugins/_ml/mcp/sse
```

## Path parameters

| Parameter | Type | Required/Optional | Description |
|:----------|:-----|:------------------|:------------|
| `append_to_base_url` | Boolean | Optional | Controls how the SSE message endpoint URL is constructed. Default is `false`. See [URL construction methods](#url-construction-methods). |

## Example request: Default URL construction

```json
GET /_plugins/_ml/mcp/sse
```
{% include copy-curl.html %}

## Example response: Default URL construction

OpenSearch sends an SSE data stream to the client:

```yaml
event: endpoint
data: /sse/message?sessionId=e2d65bb9-e82e-473a-b050-b69dc67ca9dd
```

## Example request: Complete path URL construction

```json
GET /_plugins/_ml/mcp/sse?append_to_base_url=true
```
{% include copy-curl.html %}

## Example response: Complete path URL construction

OpenSearch sends an SSE data stream to the client:

```yaml
event: endpoint
data: /_plugins/_ml/mcp/sse/message?sessionId=e2d65bb9-e82e-473a-b050-b69dc67ca9dd
```