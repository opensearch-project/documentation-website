---
layout: default
title: Agentic Memory APIs
parent: ML Commons APIs
has_children: true
has_toc: false
nav_order: 40
redirect_from: 
  - /ml-commons-plugin/api/agentic-memory-apis/
---

# Agentic Memory APIs
**Introduced 3.2**
{: .label .label-purple }

Agentic Memory APIs provide persistent memory management for AI agents. This enables agents to learn, remember, and reason over structured information across conversations.

## Disabling Agentic Memory APIs

As Agentinc memory is GA in 3.3, this feature is enabled by default. To disable Agentic Memory APIs, update the following cluster setting:

```json
PUT /_cluster/settings
{
  "persistent": {
      "plugins.ml_commons.agentic_memory_enabled": false
  }
}
```
{% include copy-curl.html %}

OpenSearch supports the following memory container APIs:

- [Create memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-memory-container/)
- [Get memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/get-memory-container/)
- [Update memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/update-memory-container/)
- [Delete memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/delete-memory-container/)
- [Search memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/search-memory-container/)

OpenSearch supports the following memory APIs:

## Memory APIs (Unified)

- [Add memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/add-memory/)
- [Get memory by type and ID]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/get-memory-by-type/)
- [Update memory by type and ID]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/update-memory-by-type/)
- [Delete memory by type and ID]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/delete-memory-by-type/)
- [Search memories by type]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/search-memories-by-type/)