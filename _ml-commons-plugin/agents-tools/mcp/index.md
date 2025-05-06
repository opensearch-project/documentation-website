---
layout: default
title: Using MCP tools
parent: Agents and tools
has_children: true
nav_order: 30
redirect_from:
  - /ml-commons-plugin/agents-tools/mcp/
---

# Using MCP tools
**Introduced 3.0**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) is an open protocol standard that provides a standardized way for AI models to connect to external data sources and tools. OpenSearch integrates with MCP, enabling agents to use external tools and data sources through MCP servers.

Connecting to external MCP servers expands agent capabilities to include the following functionality:

- Using the tools provided by MCP servers
- Filtering available tools based on your application needs
- Implementing secure authentication and authorization for tool access
- Interacting with various tools through a consistent, standardized interface

To start using MCP, see [Connecting to an external MCP server]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/mcp/mcp-connector/). 