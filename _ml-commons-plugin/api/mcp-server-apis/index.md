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
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) is a protocol that defines how an agent can discover and execute tools. The MCP server allows external agents to connect to and use [tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/) available in OpenSearch. For a list of supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/).

ML Commons supports the following MCP APIs:

- [Register MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/register-mcp-tools/)
- [Remove MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/remove-mcp-tools/)
- [MCP SSE session]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/sse-session/)
- [MCP SSE message]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/sse-message/)