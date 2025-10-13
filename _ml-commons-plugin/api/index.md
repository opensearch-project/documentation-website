---
layout: default
title: ML Commons APIs
has_children: false
nav_order: 130
has_children: true
has_toc: false
redirect_from:
  - /ml-commons-plugin/api/
---

# ML APIs 

OpenSearch supports the following machine learning (ML) APIs:

- [Model APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/index/)
- [Model group APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-group-apis/index/)
- [Connector APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/connector-apis/index/)
- [Agent APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/index/)
- [Memory APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/index/)
- [Agentic Memory APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/)
- [Controller APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/controller-apis/index/)
- [Execute Algorithm API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/execute-algorithm/)
- [Tasks APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/index/)
- [Profile API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/profile/)
- [Stats API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/stats/)
- [MCP Server APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/)

## Memory APIs comparison

OpenSearch provides two different memory systems:

- **[Memory APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/index/)** -- Simple conversation history storage for [conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/). Stores question/answer pairs chronologically without processing or learning.

- **[Agentic Memory APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/)** -- Intelligent memory system for AI agents. Uses large language models (LLMs) to extract knowledge, learn user preferences, and maintain context across sessions. For conceptual information, see [Agentic memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agentic-memory/).