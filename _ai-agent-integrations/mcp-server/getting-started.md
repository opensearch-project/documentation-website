---
layout: default
title: Getting started with the OpenSearch MCP Server
parent: OpenSearch MCP Server
nav_order: 10
redirect_from:
  - /ml-commons-plugin/agents-tools/mcp-server/getting-started/
---

# Getting started with the OpenSearch MCP Server

This guide walks you through installing the [OpenSearch MCP Server](https://github.com/opensearch-project/opensearch-mcp-server-py), connecting it to an AI client or agent framework, and making your first tool call against an OpenSearch cluster.

## Prerequisites

- A running OpenSearch cluster reachable from the machine running the server.
- Credentials for that cluster (basic auth or mTLS certificates for self-managed clusters).
- Python 3.11 or later, plus one of:
  - [`uv`](https://docs.astral.sh/uv/getting-started/installation/) (recommended) — lets you run the server with `uvx` without a local install, or
  - `pip` if you prefer to install the package into a Python environment.

## Step 1: Install the server

The fastest path is to let `uvx` fetch and run the server on demand. Install `uv` first:

```bash
pip install uv
```
{% include copy.html %}

Alternatively, install from [PyPI](https://pypi.org/project/opensearch-mcp-server-py/):

```bash
pip install opensearch-mcp-server-py
```
{% include copy.html %}

## Step 2: Connect a coding assistant

Coding assistants like Claude Desktop, Cursor, and Kiro read an `mcp.json` config file to discover MCP servers. The server is launched automatically as a child process when the assistant starts — no separate server process is needed.

### Claude Desktop

Open **Settings > Developer > Edit Config** and add the following entry. The config file is typically at `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS:

```json
{
  "mcpServers": {
    "opensearch": {
      "command": "uvx",
      "args": ["opensearch-mcp-server-py"],
      "env": {
        "OPENSEARCH_URL": "http://localhost:9200",
        "OPENSEARCH_USERNAME": "admin",
        "OPENSEARCH_PASSWORD": "admin",
        "OPENSEARCH_SSL_VERIFY": "false"
      }
    }
  }
}
```
{% include copy.html %}

Restart Claude Desktop after saving. You should see the OpenSearch tools listed in the tools panel.

### Cursor

Open **Cursor Settings > MCP** and add a new server, or edit `~/.cursor/mcp.json` directly:

```json
{
  "mcpServers": {
    "opensearch": {
      "command": "uvx",
      "args": ["opensearch-mcp-server-py"],
      "env": {
        "OPENSEARCH_URL": "http://localhost:9200",
        "OPENSEARCH_USERNAME": "admin",
        "OPENSEARCH_PASSWORD": "admin",
        "OPENSEARCH_SSL_VERIFY": "false"
      }
    }
  }
}
```
{% include copy.html %}

### Kiro

Edit `.kiro/settings/mcp.json` in your workspace (or `~/.kiro/settings/mcp.json` for a global config):

```json
{
  "mcpServers": {
    "opensearch": {
      "command": "uvx",
      "args": ["opensearch-mcp-server-py"],
      "env": {
        "OPENSEARCH_URL": "http://localhost:9200",
        "OPENSEARCH_USERNAME": "admin",
        "OPENSEARCH_PASSWORD": "admin",
        "OPENSEARCH_SSL_VERIFY": "false"
      }
    }
  }
}
```
{% include copy.html %}

### No-auth clusters

For a local development cluster started without security (for example, `docker run -p 9200:9200 opensearchproject/opensearch:latest -e "discovery.type=single-node" -e "DISABLE_SECURITY_PLUGIN=true"`), use `OPENSEARCH_NO_AUTH` instead of credentials:

```json
{
  "mcpServers": {
    "opensearch": {
      "command": "uvx",
      "args": ["opensearch-mcp-server-py"],
      "env": {
        "OPENSEARCH_URL": "http://localhost:9200",
        "OPENSEARCH_NO_AUTH": "true"
      }
    }
  }
}
```
{% include copy.html %}

The examples above use default credentials for local development. Never use default credentials in production.
{: .warning}

## Step 3: Try a query

With the client connected, ask a natural-language question. For example:

> *What indexes are in my cluster, and which one has the most documents?*

The AI selects `ListIndexTool`, the server calls `_cat/indices`, and the result is returned to the model. For follow-ups like *"Search the `logs` index for errors in the last hour"*, the model picks `SearchIndexTool` and builds the query DSL automatically.

## Agent framework integrations

For programmatic use — building pipelines, chatbots, or automated workflows — you can connect the MCP server to an agent framework. The examples below use **stdio transport**, which means the framework launches the MCP server as a subprocess automatically. No separate server process needs to be started or managed.

### Strands Agents

[Strands Agents](https://strandsagents.com/) is an open-source Python SDK for building AI agents. It connects to MCP servers using the `MCPClient` class. Using stdio transport means the framework launches the MCP server as a subprocess — no separate server process to start or manage.

Install the required packages:

```bash
pip install strands-agents strands-agents-tools
```
{% include copy.html %}

```python
from mcp import StdioServerParameters
from strands import Agent
from strands.tools.mcp import MCPClient

# The framework launches the MCP server as a subprocess via stdio.
# No separate server process needed.
mcp_client = MCPClient(lambda: StdioServerParameters(
    command="uvx",
    args=["opensearch-mcp-server-py"],
    env={
        "OPENSEARCH_URL": "http://localhost:9200",
        "OPENSEARCH_USERNAME": "admin",
        "OPENSEARCH_PASSWORD": "admin",
        "OPENSEARCH_SSL_VERIFY": "false",
    }
))

with mcp_client:
    # Discover all tools exposed by the MCP server
    tools = mcp_client.list_tools_sync()

    # Create an agent with those tools.
    # By default, Strands uses Amazon Bedrock. To use a different model,
    # pass a model= argument. See https://strandsagents.com/docs for options.
    agent = Agent(tools=tools)

    # Natural-language queries — the agent picks the right tool automatically
    print(agent("List all indexes in the cluster and show their document counts."))
    print(agent("Search the 'products' index for items where category is 'electronics'."))
    print(agent("What is the health status of the cluster?"))
```
{% include copy.html %}

### LangGraph

[LangGraph](https://langchain-ai.github.io/langgraph/) is a framework for building stateful, multi-step agent workflows. Use `langchain-mcp-adapters` to bridge MCP tools into LangGraph. With stdio transport, the framework manages the server process for you.

Install the required packages:

```bash
pip install langgraph langchain-mcp-adapters langchain-openai
```
{% include copy.html %}

```python
import asyncio
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent

async def main():
    async with MultiServerMCPClient({
        "opensearch": {
            "transport": "stdio",
            "command": "uvx",
            "args": ["opensearch-mcp-server-py"],
            "env": {
                "OPENSEARCH_URL": "http://localhost:9200",
                "OPENSEARCH_USERNAME": "admin",
                "OPENSEARCH_PASSWORD": "admin",
                "OPENSEARCH_SSL_VERIFY": "false",
            },
        }
    }) as mcp_client:
        tools = mcp_client.get_tools()

        # Create a ReAct agent with the OpenSearch tools.
        # Replace ChatOpenAI with any LangChain-compatible LLM.
        llm = ChatOpenAI(model="gpt-4o")
        agent = create_react_agent(llm, tools)

        # Single query
        result = await agent.ainvoke({
            "messages": [{"role": "user", "content": "List all indexes and tell me which one is largest."}]
        })
        print(result["messages"][-1].content)

        # Multi-step reasoning
        result = await agent.ainvoke({
            "messages": [{"role": "user", "content": (
                "Find all indexes that contain 'log' in their name, "
                "then search the largest one for ERROR level entries from the last 24 hours."
            )}]
        })
        print(result["messages"][-1].content)

asyncio.run(main())
```
{% include copy.html %}

### LangChain (without LangGraph)

If you prefer a simpler single-agent setup without the graph abstraction:

```python
import asyncio
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate

async def main():
    async with MultiServerMCPClient({
        "opensearch": {
            "transport": "stdio",
            "command": "uvx",
            "args": ["opensearch-mcp-server-py"],
            "env": {
                "OPENSEARCH_URL": "http://localhost:9200",
                "OPENSEARCH_USERNAME": "admin",
                "OPENSEARCH_PASSWORD": "admin",
                "OPENSEARCH_SSL_VERIFY": "false",
            },
        }
    }) as mcp_client:
        tools = mcp_client.get_tools()

        llm = ChatOpenAI(model="gpt-4o")
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful assistant with access to OpenSearch tools."),
            ("human", "{input}"),
            ("placeholder", "{agent_scratchpad}"),
        ])
        agent = create_tool_calling_agent(llm, tools, prompt)
        agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

        await agent_executor.ainvoke({"input": "How many documents are in the 'orders' index?"})

asyncio.run(main())
```
{% include copy.html %}

## Multi-cluster configuration

To expose multiple clusters, create a `config.yml` file and start the server in multi mode:

```yaml
version: "1.0"
description: "OpenSearch cluster configurations"

clusters:
  local-dev:
    opensearch_url: "http://localhost:9200"
    opensearch_username: "admin"
    opensearch_password: "admin"

  staging:
    opensearch_url: "https://staging.example.com:9200"
    opensearch_username: "admin"
    opensearch_password: "staging_password"
    opensearch_ca_cert_path: "/path/to/ca.crt"
```
{% include copy.html %}

Start the server pointing at the config file:

```bash
python -m mcp_server_opensearch --mode multi --config config.yml --transport stream
```
{% include copy.html %}

In multi mode, every tool call must include an `opensearch_cluster_name` parameter matching a key in the config file. When using a coding assistant, include the available cluster names in your system prompt so the model knows which to pick.

## Authentication options

The server checks authentication methods in this order:

1. **No auth** — `OPENSEARCH_NO_AUTH=true` for open clusters.
2. **Header-based auth** — `OPENSEARCH_HEADER_AUTH=true`. Credentials are read from request headers per call, useful for per-session credentials over the streaming transport.
3. **Basic auth** — `OPENSEARCH_USERNAME` and `OPENSEARCH_PASSWORD`.
4. **Mutual TLS** — `OPENSEARCH_CA_CERT_PATH`, `OPENSEARCH_CLIENT_CERT_PATH`, and `OPENSEARCH_CLIENT_KEY_PATH`. Can be layered on top of basic auth or no-auth.

For the full authentication reference including IAM and AWS credential options, see the [User Guide](https://github.com/opensearch-project/opensearch-mcp-server-py/blob/main/USER_GUIDE.md#authentication).

## Transports: stdio vs. streaming

| Transport | When to use | How to start |
|-----------|-------------|--------------|
| `stdio` (default) | Coding assistants (Claude Desktop, Cursor, Kiro). The client launches the server as a child process. | Configured via `mcp.json` — no manual start needed. |
| `stream` (streamable-http) | Agent frameworks (Strands, LangGraph, LangChain) and remote/shared deployments. | `python -m mcp_server_opensearch --transport stream` |

The streaming transport binds to `0.0.0.0:9900` by default. Override with `--host` and `--port`.

## Troubleshooting

- **Client shows no tools after connecting.** Check the client's MCP logs to confirm the server launched. Verify `OPENSEARCH_URL` is reachable with a plain `curl http://localhost:9200`.
- **`Connection refused` on localhost.** Always include the port explicitly: `http://localhost:9200`. The server does not default to port 9200 when the port is omitted from the URL.
- **Framework can't connect to the streaming server.** Confirm the server is running (`curl http://localhost:9900/mcp`) and that the URL in your framework config matches exactly, including the `/mcp` path for Streamable HTTP.
- **The model picks the wrong cluster in multi mode.** Add a system prompt listing the available cluster names and their purposes.

## Next steps

- Review the [full user guide](https://github.com/opensearch-project/opensearch-mcp-server-py/blob/main/USER_GUIDE.md) for Kubernetes deployment, structured logging, tool filtering, and tool customization.
- To integrate MCP tools *into* an OpenSearch agent (instead of exposing OpenSearch to an external agent), see [Using MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/mcp/).
- To give coding assistants opinionated workflows for OpenSearch tasks, see [Agent skills]({{site.url}}{{site.baseurl}}/ai-agent-integrations/agent-skills/).
