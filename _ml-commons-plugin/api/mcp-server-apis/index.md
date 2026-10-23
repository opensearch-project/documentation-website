---
layout: default
title: MCP server APIs
parent: ML APIs
has_children: true
has_toc: false
nav_order: 40
redirect_from: 
  - /ml-commons-plugin/api/mcp-server-apis/
  - /ml-commons-plugin/api/mcp-server-apis/sse-message/
  - /ml-commons-plugin/api/mcp-server-apis/sse-session/
---

# MCP server APIs
**Introduced 3.0**
{: .label .label-purple }

Use these APIs to manage the in-cluster [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server, which lets external MCP clients discover and call [tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/) registered in your cluster.

The in-cluster MCP server uses the Streamable HTTP transport protocol to communicate with the clients. For details about the transport, see the [official MCP documentation](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports).
{: .note }

For instructions on setting up the MCP server and connecting a client, see [Using the in-cluster MCP server]({{site.url}}{{site.baseurl}}/ml-commons-plugin/mcp/in-cluster-mcp-server/).

The in-cluster MCP server supports the following APIs:

- [Register MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/register-mcp-tools/)
- [Update MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/update-mcp-tools/)
- [List MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/list-mcp-tools/)
- [Remove MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/remove-mcp-tools/)
- [MCP Streamable HTTP Server]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/mcp-server/)

## Removed APIs

The following experimental APIs were removed in OpenSearch 3.3 in favor of the Streamable HTTP transport:

- MCP SSE Message API
- MCP SSE Session API