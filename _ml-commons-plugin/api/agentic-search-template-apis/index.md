---
layout: default
title: Agentic search template APIs
parent: ML APIs
has_children: true
has_toc: false
nav_order: 80
redirect_from:
  - /ml-commons-plugin/api/agentic-search-template-apis/
---

# Agentic search template APIs
**Introduced 3.10**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/opensearch-agent-server/issues/150).
{: .warning}

Agentic search template APIs register stored search templates so that agentic search can have a large language model (LLM) fill their parameters instead of writing the full query. For an overview and a complete example, see [Filling search templates]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agentic-search-templates/index/).

OpenSearch supports the following agentic search template APIs:

- [Register agentic search template]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/register-agentic-search-template/)
- [Get agentic search template]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/get-agentic-search-template/)
- [List agentic search templates]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/list-agentic-search-templates/)
- [Update agentic search template]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/update-agentic-search-template/)
- [Delete agentic search template]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/delete-agentic-search-template/)

Agentic search templates are not supported when multi-tenancy is enabled.
{: .note}

## Enabling agentic search template APIs

To enable the agentic search template APIs and the `SearchTemplateFillTool`, update the following cluster setting:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.ml_commons.agentic_search_template_enabled": true
  }
}
```
{% include copy-curl.html %}

For more information about enabling experimental features, see [Experimental feature flags]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).
