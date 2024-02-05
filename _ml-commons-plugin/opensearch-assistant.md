---
layout: default
title: OpenSearch Assistant Toolkit
has_children: false
has_toc: false
nav_order: 28
---

# OpenSearch Assistant toolkit
**Introduced 2.12**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](<TODO: insert link>).    
{: .warning}

The OpenSearch Assistant toolkit helps you create AI-powered assistants for OpenSearch Dashboards. The toolkit includes the following parts:

- [**Agents and tools**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/index/): _Agents_ interface with a large language model (LLM) and execute high-level tasks, such as summarization or generating PPL from natural language. The agent's high-level tasks consist of low-level tasks called _tools_, which can be reused by multiple agents.
- [**Workflow automation**]({{site.url}}{{site.baseurl}}/automating-workflows/index/): Uses templates to set up infrastructure for artificial intelligence and machine learning (AI/ML) applications. For example, you can automate configuring agents to be used for chat or generating PPL queries from natural language.
- **OpenSearch Assistant**:  The UI for the AI-powered assistant. The assistant's workflow is configured with various agents and tools.
 
## Enabling OpenSearch Assistant

To enable OpenSearch Assistant, perform the following steps:

- Enable the agent framework and retrieval-augmented generation, by configuring the following settings:
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