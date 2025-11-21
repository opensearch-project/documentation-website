---
layout: default
title: Agentic memory APIs
parent: ML Commons APIs
has_children: true
has_toc: false
nav_order: 40
redirect_from: 
  - /ml-commons-plugin/api/agentic-memory-apis/
---

# Agentic memory APIs
**Introduced 3.3**
{: .label .label-purple }

Agentic memory APIs provide persistent memory management for AI agents. For an overview of concepts, use cases, and getting started information, see [Agentic memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agentic-memory/).

## Disabling agentic memory APIs

Agentic memory APIs are enabled by default. To disable agentic memory APIs, update the following cluster setting:

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

- [Add memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/add-memory/)
- [Create session]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-session/)
- [Get memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/get-memory/)
- [Update memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/update-memory/)
- [Delete memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/delete-memory/)
- [Search memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/search-memory/)