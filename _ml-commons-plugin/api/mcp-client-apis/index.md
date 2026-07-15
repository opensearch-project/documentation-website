---
layout: default
title: MCP client APIs
parent: ML Commons APIs
has_children: true
has_toc: false
nav_order: 41
redirect_from:
  - /ml-commons-plugin/api/mcp-client-apis/
---

# MCP client APIs
**Introduced 3.8**
{: .label .label-purple }

When OpenSearch connects to an external [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server through an MCP connector, it acts as an MCP client. These APIs let you discover and inspect tools exposed by external MCP servers before configuring agents.

This differs from [MCP server APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/), where OpenSearch exposes its own tools to external MCP clients. For conceptual information about using external MCP servers with agents, see [Connecting to an external MCP server]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/mcp/mcp-connector/).

ML Commons supports the following MCP client APIs:

- [List connector MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-client-apis/list-connector-mcp-tools/)
