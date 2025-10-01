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

For more information and other ways to enable experimental features, see [Experimental feature flags]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).

OpenSearch supports the following memory container APIs:

- [Create memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-memory-container/)
- [Get memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/get-memory-container/)
- [Update memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/update-memory-container/)
- [Delete memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/delete-memory-container/)
- [Search memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/search-memory-container/)

OpenSearch supports the following memory APIs:

## Working memory APIs

- [Add working memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/add-memory/)
- [Get working memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/get-memory/)
- [Search working memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/search-memory/)
- [Delete working memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/delete-memory/)

## Long-term memory APIs

- [Search long-term memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/search-long-term-memory/)
- [Update long-term memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/update-long-term-memory/)
- [Delete long-term memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/delete-long-term-memory/)

## Memory history APIs

- [Search memory history]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/search-memory-history/)
- [Delete memory history]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/delete-memory-history/)

## General memory APIs

- [Get memory by type and ID]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/get-memory-by-type/)
- [Update memory by type and ID]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/update-memory-by-type/)
- [Delete memory by type and ID]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/delete-memory-by-type/)
- [Search memories by type]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/search-memories-by-type/)