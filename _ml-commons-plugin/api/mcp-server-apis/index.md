---
layout: default
title: MCP Server APIs
parent: ML Commons APIs
has_children: true
has_toc: false
nav_order: 27
redirect_from: /ml-commons-plugin/api/mcp-server-apis/
---

# MCP Server APIs
**Introduced 3.0**
{: .label .label-purple }

[MCP](https://modelcontextprotocol.io/introduction) is an protocol that defines how agent can discover tools and execute tools, in OpenSearch 3.0, we introduces the MCP server feature that supports external agents to connect to leverage the tools in OpenSearch. For more information aount tools, see [tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).

ML Commons supports the following MCP APIs:

- [Register MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/register-mcp-tools/)
- [Remove MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/remove-mcp-tools/)
- [MCP SSE session]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/sse-session/)
- [MCP SSE message]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/sse-message/)