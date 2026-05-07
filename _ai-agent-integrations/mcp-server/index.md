---
layout: default
title: OpenSearch MCP Server
nav_order: 10
has_children: true
has_toc: false
redirect_from:
  - /ai-agent-integrations/mcp-server/
---

# OpenSearch MCP Server

The [OpenSearch MCP Server](https://github.com/opensearch-project/opensearch-mcp-server-py) is an open-source [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server that exposes OpenSearch to AI assistants such as Claude Desktop, Cursor, Kiro, or any other MCP-compatible client. Once connected, an AI assistant can search indexes, read mappings, inspect cluster health, and run other operations by calling OpenSearch APIs using MCP tools instead of generating raw REST requests.

OpenSearch also provides an in-cluster MCP connector that lets an OpenSearch agent call tools hosted on an external MCP server. For more information, see [Using MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/mcp/).
{: .note}

Use the OpenSearch MCP Server when you want to:

- Let AI assistants query and explore your OpenSearch clusters in natural language.
- Build internal AI tools (chatbots, observability copilots, or data assistants) without implementing an OpenSearch client layer.
- Connect to multiple clusters (for example, `dev`, `staging`, or `production`) from a single assistant session.
- Integrate OpenSearch with agent frameworks such as LangChain or LangGraph using a standard protocol.

The OpenSearch MCP Server provides the following capabilities:

- MCP interface: Supports any MCP-compatible client, including Claude Desktop, Cursor, and Kiro.
- Tools: Includes tools for listing indexes, retrieving mappings, running search queries, checking cluster health, and counting documents. Additional tool categories (search relevance and skills-based analysis) can be enabled as needed.
- Transport options: Supports standard input/output (`stdio`) for local desktop clients and streaming transport (Server-Sent Events and HTTP streaming) for remote deployments.
- Authentication: Supports basic authentication, AWS IAM roles, AWS profile credentials, header-based authentication, mutual TLS (mTLS), and anonymous access.
- Cluster configuration: Supports single-cluster mode using environment variables or multi-cluster mode using a YAML configuration file.
- Service compatibility: Works with self-managed OpenSearch, Amazon OpenSearch Service, and Amazon OpenSearch Serverless collections.

The server receives MCP tool calls from the AI client, translates them into OpenSearch REST API calls, and returns structured results, as shown in the following diagram.

![Diagram showing the flow from AI client to OpenSearch MCP Server to OpenSearch cluster]({{site.url}}{{site.baseurl}}/images/ai-agent-integrations/mcp-server.png)

## Built-in tools

Core tools are enabled by default. You can enable additional tool categories using environment variables or the multi-cluster configuration file. The following table lists the tool categories.

| Category | Default | Example tools |
|----------|---------|---------------|
| Core | Enabled | `ListIndexTool`, `SearchIndexTool`, `IndexMappingTool`, `ClusterHealthTool`, `CountTool`, `ExplainTool`, `MsearchTool`, `GetShardsTool`, `GenericOpenSearchApiTool` |
| Cluster and indexes | Disabled | `GetClusterStateTool`, `CatNodesTool`, `GetNodesTool`, `GetIndexInfoTool`, `GetIndexStatsTool`, `GetSegmentsTool`, `GetAllocationTool`, `GetLongRunningTasksTool`, `GetNodesHotThreadsTool`, `GetQueryInsightsTool` |
| `search_relevance` | Disabled | `CreateSearchConfigurationTool`, `CreateQuerySetTool`, `CreateJudgmentListTool`, `CreateExperimentTool`, and related `Get`/`Delete`/`Search` variants |
| `skills` | Disabled | `DataDistributionTool`, `LogPatternAnalysisTool` |

For the full list and per-tool parameters, see the [opensearch-mcp-server-py README](https://github.com/opensearch-project/opensearch-mcp-server-py#available-tools).

## Next steps

- To install the server and connect it to your AI client, see [Using the OpenSearch MCP Server]({{site.url}}{{site.baseurl}}/ai-agent-integrations/mcp-server/using/).

## Related documentation

- [opensearch-mcp-server-py](https://github.com/opensearch-project/opensearch-mcp-server-py) -- Source repository on GitHub.
- [Model Context Protocol specification](https://modelcontextprotocol.io/introduction) -- MCP protocol specification.
