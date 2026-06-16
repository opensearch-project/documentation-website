---
layout: default
title: AI agent integrations
nav_order: 1
nav_exclude: true
permalink: /ai-agent-integrations/
redirect_from:
  - /ai-agent-integrations/index/
---

# AI agent integrations

OpenSearch supports AI agents in two ways:

- **External agents connecting to OpenSearch** (this section) -- AI tools run outside of your OpenSearch cluster and use OpenSearch as a data source. Examples include Claude Desktop with the MCP Server or Cursor with agent skills. Install these tools on your machine and configure your client.
- **Internal agents running in OpenSearch** -- OpenSearch agents run inside the OpenSearch cluster and can call both internal tools and external MCP servers. Register these agents through ML Commons Agent APIs and configure cluster settings. For more information, see [Agents and tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/).

The following diagram illustrates how external and internal agents integrate with OpenSearch.

![Diagram showing how external and internal agents integrate with OpenSearch]({{site.url}}{{site.baseurl}}/images/ai-agent-integrations/ai-integrations.png)

## External agent integrations

External AI agents and coding assistants can connect to OpenSearch by using the following open-source projects that run outside the cluster:

- [OpenSearch MCP Server]({{site.url}}{{site.baseurl}}/ai-agent-integrations/mcp-server/) -- A [Model Context Protocol (MCP) server](https://modelcontextprotocol.io/introduction) that exposes OpenSearch to MCP-compatible clients such as Claude Desktop, Cursor, and Kiro. The AI client makes natural-language requests; the server translates them into OpenSearch REST calls.
- [Agent skills]({{site.url}}{{site.baseurl}}/ai-agent-integrations/agent-skills/) -- Installable skill bundles that teach AI coding assistants how to build search applications, analyze logs and traces, and deploy OpenSearch to AWS. Skills run inside the assistant and follow the [Agent Skills specification](https://agentskills.io/specification); no server is required.

## Related features

OpenSearch also provides the following agent capabilities configured *inside* the cluster:

- [Agents]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/) (flow, conversational, and plan-execute-reflect) registered through the ML Commons Agent APIs.
- [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/) such as `VectorDBTool`, `ListIndexTool`, and `PPLTool` that OpenSearch agents can use.
- The [in-cluster MCP connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/mcp/) that lets an OpenSearch agent call tools hosted on an *external* MCP server.

The following table describes when to use each feature.

| Use case | Feature |
| :--- | :--- |
| Let an external AI assistant query OpenSearch | [OpenSearch MCP Server]({{site.url}}{{site.baseurl}}/ai-agent-integrations/mcp-server/) |
| Teach a coding assistant how to work with OpenSearch | [Agent skills]({{site.url}}{{site.baseurl}}/ai-agent-integrations/agent-skills/) |
| Run an agent that calls external tools *inside* OpenSearch  | [Using MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/mcp/) |
| Register and run agents inside the cluster | [Agents and tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/) |
