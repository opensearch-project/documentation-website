---
layout: default
title: OpenSearch Assistant Toolkit
has_children: false
has_toc: false
nav_order: 28
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/opensearch-assistant/
---

# OpenSearch Assistant Toolkit
**Introduced 2.12**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [OpenSearch forum thread](https://forum.opensearch.org/t/feedback-opensearch-assistant/16741).    
{: .warning}

The OpenSearch Assistant Toolkit helps you create AI-powered assistants for OpenSearch Dashboards. The toolkit includes the following elements:

- [**Agents and tools**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/index/): _Agents_ interface with a large language model (LLM) and execute high-level tasks, such as summarization or generating Piped Processing Language (PPL) queries from natural language. The agent's high-level tasks consist of low-level tasks called _tools_, which can be reused by multiple agents.
- [**Configuration automation**]({{site.url}}{{site.baseurl}}/automating-configurations/index/): Uses templates to set up infrastructure for artificial intelligence and machine learning (AI/ML) applications. For example, you can automate configuring agents to be used for chat or generating PPL queries from natural language.
- [**OpenSearch Assistant for OpenSearch Dashboards**]({{site.url}}{{site.baseurl}}/dashboards/dashboards-assistant/index/): This is the OpenSearch Dashboards UI for the AI-powered assistant. The assistant's workflow is configured with various agents and tools.
 
## Enabling OpenSearch Assistant

To enable OpenSearch Assistant, perform the following steps:

- Enable the agent framework and retrieval-augmented generation (RAG) by configuring the following settings:
    ```yaml
    plugins.ml_commons.agent_framework_enabled: true
    plugins.ml_commons.rag_pipeline_feature_enabled: true
    ```
    {% include copy.html %}
- Enable the assistant by configuring the following settings:
    ```yaml
    assistant.chat.enabled: true
    observability.query_assist.enabled: true
    ```
    {% include copy.html %}

For more information about ways to enable experimental features, see [Experimental feature flags]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).

## Next steps

- For more information about the OpenSearch Assistant UI, see [OpenSearch Assistant for OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboards-assistant/index/)