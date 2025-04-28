---
layout: default
title: Model Context Protocol (MCP)
has_children: true
has_toc: false
nav_order: 28
---

# Model Context Protocol (MCP)
**Introduced 3.0**
{: .label .label-purple }

The Model Context Protocol (MCP) is an open protocol standard that provides a standardized way for AI models to connect to external data sources and tools. OpenSearch ML Commons integrates with MCP to enable agents to use external tools and data sources through the MCP servers.

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion in the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

## Key Features

* Connect to external MCP servers
* Use tools provided by MCP servers
* Filter tools based on application needs
* Secure authentication and authorization
* Standardized tool interface

## Documentation

* [MCP Connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/mcp/mcp-connector/) - Learn how to connect to external MCP servers and use their tools with OpenSearch agents

## References

* [MCP Protocol Documentation](https://modelcontextprotocol.io/introduction)
* [MCP Java SDK](https://github.com/modelcontextprotocol/java-sdk) 