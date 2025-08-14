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

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

Agentic Memory APIs provide operations provide persistent memory management for AI agents. This enables agents to learn, remember, and reason over structured information across conversations.

## Enabling Agentic Memory APIs

To enable Agentic Memory APIs, update the following cluster setting:

```json
PUT /_cluster/settings
{
  "persistent": {
      "plugins.ml_commons.agentic_memory_enabled": true
  }
}
```
{% include copy-curl.html %}

For more information and other ways to enable experimental features, see [Experimental feature flags]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).

OpenSearch supports the following memory container APIs:

- [Create memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-memory-container/)
- [Get memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/get-memory-container/)
- [Delete memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/delete-memory-container/)

OpenSearch supports the following memory APIs:

- [Add memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/add-memory/)
- [Get memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/get-memory/)
- [Search memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/search-memory/)
- [Update memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/update-memory/)
- [Delete memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/delete-memory/)