---
layout: default
title: AI agent integrations
nav_order: 1
has_children: false
nav_exclude: true
permalink: /ai-agent-integrations/
redirect_from:
  - /ai-agent-integrations/index/
---

# AI agent integrations

External AI agents and coding assistants can connect to OpenSearch in several ways. This section covers the open-source projects that live outside the cluster and plug OpenSearch into the broader AI-agent ecosystem:

- **[OpenSearch MCP Server]({{site.url}}{{site.baseurl}}/ai-agent-integrations/mcp-server/)** — A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server that exposes OpenSearch to MCP-compatible clients such as Claude Desktop, Cursor, and Kiro. The AI client makes natural-language requests; the server translates them into OpenSearch REST calls.
- **[Agent skills]({{site.url}}{{site.baseurl}}/ai-agent-integrations/agent-skills/)** — Installable skill bundles that teach AI coding assistants how to build search apps, analyze logs and traces, and deploy to AWS. Skills run inside the assistant and follow the [Agent Skills specification](https://agentskills.io/specification); no server is required.

## Where to look for other agent capabilities

OpenSearch also has agent capabilities configured *inside* the cluster through the ML Commons plugin. Those features live under [Machine learning > Agents and tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/):

- **Agents** (flow, conversational, plan-execute-reflect) registered through the ML Commons Agent APIs.
- **Tools** such as `VectorDBTool`, `ListIndexTool`, and `PPLTool` that OpenSearch agents can use.
- **[Using MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/mcp/)** — The in-cluster MCP connector that lets an OpenSearch agent call tools hosted on an *external* MCP server.

If you're trying to decide where to look:

| You want to... | Go to |
|-|-|
| Let an external AI assistant query OpenSearch | [OpenSearch MCP Server]({{site.url}}{{site.baseurl}}/ai-agent-integrations/mcp-server/) |
| Teach a coding assistant how to work with OpenSearch | [Agent skills]({{site.url}}{{site.baseurl}}/ai-agent-integrations/agent-skills/) |
| Run an agent *inside* OpenSearch that calls external tools | [Using MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/mcp/) |
| Register and run agents inside the cluster | [Agents and tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/) |
