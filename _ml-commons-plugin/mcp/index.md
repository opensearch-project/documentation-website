---
layout: default
title: MCP servers and clients
nav_order: 25
has_children: true
has_toc: false
redirect_from:
  - /ml-commons-plugin/mcp/
---

# MCP servers and clients

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) is an open standard that defines how AI applications discover and call tools. OpenSearch supports MCP using the following components.

| Component | Use case | Where it runs |
| :--- | :--- | :--- |
| [MCP connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/mcp/) | Let OpenSearch agents call tools hosted on external MCP servers. OpenSearch acts as an MCP client. | In your cluster |
| [In-cluster MCP server]({{site.url}}{{site.baseurl}}/ml-commons-plugin/mcp/in-cluster-mcp-server/) | Let external MCP clients call tools registered in your cluster. OpenSearch acts as an MCP server. | In your cluster |
| [Standalone MCP server]({{site.url}}{{site.baseurl}}/ai-agent-integrations/mcp-server/) | Let external AI assistants query OpenSearch using its REST APIs. | Outside your cluster |

The standalone MCP server is the open-source [OpenSearch MCP Server](https://github.com/opensearch-project/opensearch-mcp-server-py) project.

## Choosing an MCP server

To let external AI applications access OpenSearch, choose an MCP server based on your requirements.

| Requirement | In-cluster MCP server | Standalone MCP server |
| :--- | :--- | :--- |
| Setup | Enable the `plugins.ml_commons.mcp_server_enabled` setting. No installation is required. | Install the server and run it as a separate process. |
| Exposed tools | Tools that you register in the cluster | Tools provided by the server, which call OpenSearch REST APIs |
| Transport | Streamable HTTP | Standard input/output (`stdio`), Streamable HTTP, and legacy Server-Sent Events (SSE) |
| Clusters | The cluster that runs the server | One or more clusters, including Amazon OpenSearch Service domains and Amazon OpenSearch Serverless collections |
