---
layout: default
title: Using the OpenSearch MCP Server
parent: OpenSearch MCP Server
nav_order: 10
---

# Using the OpenSearch MCP Server

This guide shows you how to install the [OpenSearch MCP Server](https://github.com/opensearch-project/opensearch-mcp-server-py), connect it to an AI client or agent framework, and make your first tool call to an OpenSearch cluster.

## Prerequisites

Before using the OpenSearch MCP Server, ensure that you have the following components:

- A running OpenSearch cluster reachable from the machine running the server.
- Credentials for that cluster (basic authentication or mutual TLS (mTLS) certificates for self-managed clusters).
- Python 3.11 or later.
- One of the following tools:
  - [`uv`](https://docs.astral.sh/uv/getting-started/installation/) (recommended) -- Runs the server using `uvx` without requiring a local installation.
  - `pip` -- Installs the package into a Python environment.

## Step 1: Configure the server

Choose one of the following installation options:

### Option 1: Run using uvx (recommended)

Install `uv`, which provides the `uvx` command to run the server without installing the package:

```bash
pip install uv
```
{% include copy.html %}

With `uvx`, you can run the server directly without installing it into your Python environment. All configuration examples in this guide use `uvx`.

### Option 2: Install using pip

Install the `opensearch-mcp-server-py` package directly into your Python environment:

```bash
pip install opensearch-mcp-server-py
```
{% include copy.html %}

If you use this option, replace `"command": "uvx"` with `"command": "python"` and `"args": ["opensearch-mcp-server-py"]` with `"args": ["-m", "mcp_server_opensearch"]` in the configuration examples that follow.

## Step 2: Connect the server to a coding assistant

Coding assistants such as Claude Desktop, Cursor, and Kiro read an `mcp.json` config file to discover MCP servers. The server is launched automatically as a child process when the assistant starts.

### Claude Desktop

To connect to Claude Desktop, open **Settings > Developer > Edit Config**. The configuration file is typically located at `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS. Add the following entry:
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
Save the configuration file and restart Claude Desktop. After restart, the OpenSearch tools appear in the **Tools** panel.

### Cursor

To connect to Cursor, open **Cursor Settings > MCP** and add a new server. Alternatively, edit the configuration file directly at `~/.cursor/mcp.json`:
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

To connect to Kiro, edit the configuration file at `.kiro/settings/mcp.json` in your workspace or `~/.kiro/settings/mcp.json` for a global configuration and add the following entry:

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

The preceding examples use default credentials for local development. Never use default credentials in production.
{: .warning}

## Step 3: Test the connection

With the client connected, ask a natural-language question. For example:

> *What indexes are in my cluster, and which one has the most documents?*

The AI selects the `ListIndexTool`, the server calls `_cat/indices`, and the result is returned to the model. For followup questions such as *"Search the `logs` index for errors in the last hour"*, the model selects the `SearchIndexTool` and builds the query DSL query automatically.

## Agent framework integrations

To build pipelines, chatbots, or automated workflows, you can connect the MCP server to an agent framework. The following examples use `stdio` transport, which allows the framework to launch the MCP server as a subprocess automatically.

### Strands Agents

[Strands Agents](https://strandsagents.com/) is an open-source Python SDK for building AI agents. It connects to MCP servers using the `MCPClient` class. With stdio transport, the framework launches the MCP server as a subprocess.

To connect to Strands Agents, follow these steps:

1. Install the required packages:
    ```bash
    pip install strands-agents strands-agents-tools
    ```
    {% include copy.html %}
1. Use the `MCPClient` class to connect to the OpenSearch MCP Server:
    ```python
    from mcp import StdioServerParameters
    from strands import Agent
    from strands.tools.mcp import MCPClient

    # The framework launches the MCP server as a subprocess using stdio.
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

[LangGraph](https://langchain-ai.github.io/langgraph/) is a framework for building stateful, multi-step agent workflows. Use `langchain-mcp-adapters` to connect MCP tools to LangGraph. With `stdio` transport, the framework manages the server process for you.

To connect to LangGraph, follow these steps:

1. Install the required packages:
    ```bash
    pip install langgraph langchain-mcp-adapters langchain-openai
    ```
    {% include copy.html %}
1. Use `langchain-mcp-adapters` to connect MCP tools to LangGraph:
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

To connect to LangChain for a single-agent setup without the graph abstraction, use the same packages from the LangGraph section and create a tool-calling agent:

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

To connect the MCP server to multiple clusters, create a `config.yml` file in a location of your choice:

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

Start the server in multi mode, specifying the full path to your configuration file:

```bash
python -m mcp_server_opensearch --mode multi --config /path/to/config.yml --transport stream
```
{% include copy.html %}

In multi-cluster mode, every tool call must include an `opensearch_cluster_name` parameter matching a key in the configuration file. When using a coding assistant, include the available cluster names in your system prompt.

## Authentication options

The server attempts authentication methods in the following order:

1. **No authentication** -- `OPENSEARCH_NO_AUTH=true` for open clusters.
2. **Header-based authentication** -- `OPENSEARCH_HEADER_AUTH=true`. The server reads credentials from request headers for each call, allowing different credentials for each session when using streaming transport.
3. **Basic authentication** -- `OPENSEARCH_USERNAME` and `OPENSEARCH_PASSWORD`.
4. **Mutual TLS** -- `OPENSEARCH_CA_CERT_PATH`, `OPENSEARCH_CLIENT_CERT_PATH`, and `OPENSEARCH_CLIENT_KEY_PATH`. Can be used with or without basic authentication.

For information about IAM and AWS credential options, see the [opensearch-mcp-server-py repository](https://github.com/opensearch-project/opensearch-mcp-server-py/blob/main/USER_GUIDE.md#authentication).

## Transports: Stdio and streaming

The server supports the following transport options.

| Transport | When to use | How to start |
|-----------|-------------|--------------|
| `stdio` (default) | Coding assistants (Claude Desktop, Cursor, Kiro). The client launches the server as a child process. | Configured in `mcp.json`. The server starts automatically when the client starts. |
| `stream` (streamable-http) | Agent frameworks (Strands, LangGraph, LangChain) and remote/shared deployments. | `python -m mcp_server_opensearch --transport stream` |

The streaming transport binds to `0.0.0.0:9900` by default. To use a different host or port, specify `--host` and `--port`.

## Common issues

The following list describes common connection and configuration issues:

- **No tools appear in the client**: Check the client's MCP logs to verify that the server launched successfully. Verify that the OpenSearch cluster is reachable by running `curl http://localhost:9200`.
- **Framework cannot connect to the streaming server**: Confirm that the server is up by running `curl http://localhost:9900/mcp`. Verify that the URL in your framework configuration matches the server URL exactly, including the `/mcp` path.
- **The AI model selects the wrong cluster in multi-cluster mode**: In your system prompt, provide a list of available cluster names and their purposes.

## Next steps

- For information about Kubernetes deployment, structured logging, tool filtering, and tool customization, see the [opensearch-mcp-server-py repository](https://github.com/opensearch-project/opensearch-mcp-server-py/blob/main/USER_GUIDE.md).
- To integrate MCP tools into an OpenSearch agent (instead of exposing OpenSearch to an external agent), see [Using MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/mcp/).
- For structured workflows that guide AI assistants through OpenSearch tasks, see [Agent skills]({{site.url}}{{site.baseurl}}/ai-agent-integrations/agent-skills/).
