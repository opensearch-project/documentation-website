---
layout: default
title: Model context protocol (MCP)
has_children: true
has_toc: false
nav_order: 28
---

# Model context protocol (MCP)
**Introduced 3.0**
{: .label .label-purple }

The Model context protocol (MCP) is an open protocol standard that provides a standardized way for AI models to connect to external data sources and tools. OpenSearch ML Commons integrates with MCP to enable agents to use external tools and data sources through the MCP servers.

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion in the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

## Key features

* Connect to external MCP servers
* Use tools provided by MCP servers
* Filter tools based on application needs
* Secure authentication and authorization
* Standardized tool interface

## Documentation

* [Connect to external MCP server (experimental)]({{site.url}}{{site.baseurl}}/ml-commons-plugin/mcp/mcp-connector/) - Learn how to connect to external MCP servers and use their tools with OpenSearch agents

## References

* [MCP protocol documentation](https://modelcontextprotocol.io/introduction)
* [MCP java SDK](https://github.com/modelcontextprotocol/java-sdk) 