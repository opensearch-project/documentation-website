---
layout: default
title: MCP server APIs
parent: ML Commons APIs
has_children: true
has_toc: false
nav_order: 40
redirect_from: 
  - /ml-commons-plugin/api/mcp-server-apis/
---

# MCP server APIs
**Introduced 3.0**


[Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) defines how an agent can discover and execute tools. The MCP server in OpenSearch allows agents to connect and use available [tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/).

The MCP server in MLCommons uses the Streamable HTTP transport protocol to communicate with the clients.. For details about the transport, see the [official MCP documentation](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports)
{: .note }

ML Commons supports the following MCP APIs:

- [Register MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/register-mcp-tools/)
- [Update MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/update-mcp-tools/)
- [List MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/list-mcp-tools/)
- [Remove MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/remove-mcp-tools/)
- [MCP Streamable HTTP Server]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/mcp-server/)