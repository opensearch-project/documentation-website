---
layout: default
title: OpenSearch MCP Server
nav_order: 10
has_children: true
has_toc: false
redirect_from:
  - /ai-agent-integrations/mcp-server/
  - /ml-commons-plugin/agents-tools/mcp-server/
  - /ml-commons-plugin/agents-tools/mcp-server/index/
---

# OpenSearch MCP Server

The [OpenSearch MCP Server](https://github.com/opensearch-project/opensearch-mcp-server-py) is an open-source [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server that exposes OpenSearch to AI assistants like Claude Desktop, Cursor, Amazon Q Developer CLI, and any MCP-compatible client. Once connected, an AI assistant can search indexes, read mappings, inspect cluster health, and run other operations by calling OpenSearch APIs through MCP tools instead of generating raw REST calls.

OpenSearch also has an in-cluster MCP connector that lets an OpenSearch agent call tools on an external MCP server — that's a separate feature of the ML Commons plugin. See [Using MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/mcp/).
{: .note}

## When to use it

Use the OpenSearch MCP Server when you want to:

- Let AI assistants query and explore your OpenSearch clusters in natural language.
- Build internal AI tools (chatbots, observability copilots, data assistants) without hand-writing an OpenSearch client layer.
- Connect to multiple clusters (for example, `dev`, `staging`, `production`) from a single assistant session.
- Plug OpenSearch into agent frameworks such as LangChain or LangGraph using a standard protocol.

## Key features

- **MCP-standard interface.** Works out of the box with any client that supports MCP, including Claude Desktop, Cursor, Kiro, and Amazon Q Developer CLI.
- **Built-in tools.** Ships with tools for common operations such as listing indexes, retrieving mappings, running search queries, checking cluster health, and counting documents. Additional tool categories (search relevance, skills-based analysis) can be enabled as needed.
- **Multiple transports.** Supports standard input/output (`stdio`) for local desktop clients and a streaming transport (Server-Sent Events and HTTP streaming) for remote deployments.
- **Flexible authentication.** Basic auth, AWS IAM roles, AWS profile credentials, header-based auth, mutual TLS (mTLS), and anonymous access are all supported.
- **Single and multi-cluster modes.** Connect to one cluster using environment variables, or define many clusters in a YAML config and let the AI pick the right one per request.
- **Amazon OpenSearch Service and Serverless.** Works with both self-managed OpenSearch and AWS-managed offerings, including OpenSearch Serverless collections.

## How it fits together

```
┌──────────────────────┐   MCP      ┌──────────────────────┐   REST     ┌──────────────────┐
│ AI client            │ ◄─────────►│ OpenSearch MCP       │ ◄─────────►│ OpenSearch       │
│ (Claude, Cursor, Q,  │  (stdio /  │ Server               │  (HTTPS +  │ cluster(s)       │
│  Kiro, LangChain...) │   stream)  │ (Python)             │   auth)    │                  │
└──────────────────────┘            └──────────────────────┘            └──────────────────┘
```

The AI client speaks MCP. The server translates MCP tool calls into OpenSearch REST API calls and returns structured results back to the model.

## Built-in tools at a glance

Core tools are enabled by default. Additional categories can be toggled on through environment variables or the multi-cluster config file.

| Category | Default | Example tools |
|----------|---------|---------------|
| Core | Enabled | `ListIndexTool`, `SearchIndexTool`, `IndexMappingTool`, `ClusterHealthTool`, `CountTool`, `ExplainTool`, `MsearchTool`, `GetShardsTool`, `GenericOpenSearchApiTool` |
| Cluster and indexes | Disabled | `GetClusterStateTool`, `CatNodesTool`, `GetNodesTool`, `GetIndexInfoTool`, `GetIndexStatsTool`, `GetSegmentsTool`, `GetAllocationTool`, `GetLongRunningTasksTool`, `GetNodesHotThreadsTool`, `GetQueryInsightsTool` |
| `search_relevance` | Disabled | `CreateSearchConfigurationTool`, `CreateQuerySetTool`, `CreateJudgmentListTool`, `CreateExperimentTool`, and related `Get`/`Delete`/`Search` variants |
| `skills` | Disabled | `DataDistributionTool`, `LogPatternAnalysisTool` |

For the full list and per-tool parameters, see the [opensearch-mcp-server-py README](https://github.com/opensearch-project/opensearch-mcp-server-py#available-tools).

## Get started

To install the server and connect it to your AI client, see [Getting started with the OpenSearch MCP Server]({{site.url}}{{site.baseurl}}/ai-agent-integrations/mcp-server/getting-started/).

## Next steps

- [Getting started with the OpenSearch MCP Server]({{site.url}}{{site.baseurl}}/ai-agent-integrations/mcp-server/getting-started/)
- [opensearch-mcp-server-py on GitHub](https://github.com/opensearch-project/opensearch-mcp-server-py)
- [Full user guide in the source repo](https://github.com/opensearch-project/opensearch-mcp-server-py/blob/main/USER_GUIDE.md)
- [Model Context Protocol specification](https://modelcontextprotocol.io/introduction)
